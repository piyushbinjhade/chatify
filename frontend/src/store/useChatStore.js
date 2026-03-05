import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import { useAuthStore } from "./useAuthStore";

export const useChatStore = create((set, get) => ({

  // Chat List
  chats: [],

  // Current Chat
  selectedUser: null,
  messages: [],
  isMessagesLoading: false,

  // Sound
  isSoundEnabled: false,

  toggleSound: () => {
    const newValue = !get().isSoundEnabled;
    localStorage.setItem("isSoundEnabled", newValue);
    set({ isSoundEnabled: newValue });
  },

  //  LOAD RECENT CHATS
  getRecentChats: async () => {
    try {
      const res = await axiosInstance.get("/messages/chats");
      set({ chats: res.data });
    } catch (error) {
      toast.error("Failed to load chats");
    }
  },

  // SELECT CHAT
  setSelectedUser: (selectedUser) => {
    set({ selectedUser, messages: [] });

    if (selectedUser) {
      get().getMessagesByUserId(selectedUser._id);
      get().markAsSeen(selectedUser._id);
    }
  },

  // LOAD MESSAGES
  getMessagesByUserId: async (userId) => {
    set({ isMessagesLoading: true });
    try {
      const res = await axiosInstance.get(`/messages/${userId}`);
      set({ messages: res.data });
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to load messages");
    } finally {
      set({ isMessagesLoading: false });
    }
  },

  // SEND MESSAGE
  sendMessage: async (messageData) => {
    const { selectedUser } = get();
    const { authUser } = useAuthStore.getState();
    if (!selectedUser) return;

    const tempId = `temp-${Date.now()}`;

    const optimisticMessage = {
      _id: tempId,
      senderId: authUser._id,
      receiverId: selectedUser._id,
      text: messageData.text,
      image: messageData.image, // include preview for optimistic UI
      createdAt: new Date().toISOString(),
      isOptimistic: true,
    };

    set((state) => ({
      messages: [...state.messages, optimisticMessage],
    }));

    try {
      const res = await axiosInstance.post(
        `/messages/send/${selectedUser._id}`,
        messageData
      );

      // server returns message with fileUrl; normalize to 'image'
      const serverMsg = {
        ...res.data,
        image: res.data.fileUrl || res.data.image,
      };

      set((state) => ({
        messages: state.messages.map((msg) =>
          msg._id === tempId ? serverMsg : msg
        ),
      }));

      // Move chat to top
      get().moveChatToTop(serverMsg);

    } catch (error) {
      set((state) => ({
        messages: state.messages.filter((msg) => msg._id !== tempId),
      }));

      toast.error(error.response?.data?.message || "Failed to send message");
    }
  },

  // MOVE CHAT TO TOP
  moveChatToTop: (message) => {
    const { chats } = get();
    const partnerId =
      message.senderId === useAuthStore.getState().authUser._id
        ? message.receiverId
        : message.senderId;

    const existingChat = chats.find(
      (chat) => chat._id._id === partnerId
    );

    if (!existingChat) return;

    const updatedChat = {
      ...existingChat,
      lastMessage: message,
    };

    set({
      chats: [
        updatedChat,
        ...chats.filter((chat) => chat._id._id !== partnerId),
      ],
    });
  },

  // MARK AS SEEN
  markAsSeen: async (userId) => {
    try {
      await axiosInstance.put(`/messages/seen/${userId}`);
      
      // Update chats to reset unreadCount for this user
      set((state) => ({
        chats: state.chats.map((chat) =>
          chat._id._id === userId
            ? { ...chat, unreadCount: 0 }
            : chat
        ),
      }));
    } catch (error) {
      // Silently fail marking messages as seen
    }
  },

  // HELPER: Add message to current chat (called by global listener)
  addMessageToCurrentChat: (message) => {
    set((state) => ({
      messages: [...state.messages, message],
    }));
  },

  // HELPER: Update chat with new message (called by global listener)
  updateChatWithNewMessage: (newMessage, isOpenChat) => {
    set((state) => {
      const existingChat = state.chats.find(
        (chat) => chat._id._id === newMessage.senderId
      );

      if (!existingChat) return state;

      return {
        chats: [
          {
            ...existingChat,
            lastMessage: newMessage,
            unreadCount: isOpenChat
              ? 0
              : existingChat.unreadCount + 1,
          },
          ...state.chats.filter(
            (chat) => chat._id._id !== newMessage.senderId
          ),
        ],
      };
    });
  },

  // GLOBAL MESSAGE LISTENER - sets up real-time message updates
  setupGlobalMessageListener: () => {
    const socket = useAuthStore.getState().socket;
    if (!socket) {
      return;
    }

    // Remove any existing listeners to prevent duplicates
    socket.off("newMessage");

    socket.on("newMessage", (newMessage) => {
      const { selectedUser, isSoundEnabled } = get();

      const isOpenChat =
        selectedUser &&
        String(selectedUser._id) === String(newMessage.senderId);

      // normalize image field
      const normalized = {
        ...newMessage,
        image: newMessage.fileUrl || newMessage.image,
      };

      // If chat is open → append messages
      if (isOpenChat) {
        set((state) => ({
          messages: [...state.messages, normalized],
        }));
      }

      // Update recent chats with unread counter
      get().updateChatWithNewMessage(newMessage, isOpenChat);

      // Play notification sound
      if (!isOpenChat && isSoundEnabled) {
        const notificationSound = new Audio("/sounds/notification.mp3");
        notificationSound.currentTime = 0;
        notificationSound.play().catch(() => {});
      }
    });
  },

  // SOCKET SUBSCRIPTION (old per-chat - kept for compatibility but not used)
  subscribeToMessages: () => {
    // No longer used - global listener is set up in ChatPage
  },

  unsubscribeFromMessages: () => {
    // No longer used - global listener persists
  },

}));