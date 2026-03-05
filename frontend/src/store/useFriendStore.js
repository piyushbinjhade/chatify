import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";
import { useChatStore } from "./useChatStore";


export const useFriendStore = create((set, get) => ({
  searchResults: [],
  pendingRequests: [],
  friends: [],
  isSearching: false,
  isLoadingRequests: false,
  isLoadingFriends: false,

  // SEARCH USERS
  searchUsers: async (username) => {
    if (!username) return;

    set({ isSearching: true });

    try {
      const res = await axiosInstance.get(
        `/friends/search?username=${username}`,
      );

      set({ searchResults: res.data });
    } catch (error) {
      toast.error("Failed to search users");
    } finally {
      set({ isSearching: false });
    }
  },

  // SEND FRIEND REQUEST
  sendFriendRequest: async (userId) => {
    try {
      await axiosInstance.post(`/friends/request/${userId}`);
      toast.success("Friend request sent");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to send request");
    }
  },

  // GET PENDING REQUESTS
  getPendingRequests: async () => {
    set({ isLoadingRequests: true });

    try {
      const res = await axiosInstance.get("/friends/requests");
      set({ pendingRequests: res.data });
    } catch (error) {
      toast.error("Failed to load requests");
    } finally {
      set({ isLoadingRequests: false });
    }
  },

  // ACCEPT REQUEST
  acceptRequest: async (requestId) => {
    try {
      const res = await axiosInstance.put(`/friends/accept/${requestId}`);

      const chatStore = useChatStore.getState();
      chatStore.setSelectedUser(res.data.friend);

      // remove from local state
      set((state) => ({
        pendingRequests: state.pendingRequests.filter(
          (req) => req._id !== requestId,
        ),
      }));

      toast.success("Friend request accepted");
    } catch (error) {
      toast.error("Failed to accept request");
    }
  },

  // REJECT REQUEST
  rejectRequest: async (requestId) => {
    try {
      await axiosInstance.delete(`/friends/reject/${requestId}`);

      set((state) => ({
        pendingRequests: state.pendingRequests.filter(
          (req) => req._id !== requestId,
        ),
      }));

      toast.success("Friend request rejected");
    } catch (error) {
      toast.error("Failed to reject request");
    }
  },

  // GET FRIENDS
  getFriends: async () => {
    set({ isLoadingFriends: true });

    try {
      const res = await axiosInstance.get("/friends/list");
      set({ friends: res.data });
    } catch (error) {
      toast.error("Failed to load friends");
    } finally {
      set({ isLoadingFriends: false });
    }
  },
  
}));