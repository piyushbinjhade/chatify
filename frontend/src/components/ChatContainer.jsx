import { useEffect, useRef, useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { useChatStore } from "../store/useChatStore";
import ChatHeader from "./ChatHeader";
import NoChatHistoryPlaceholder from "./NoChatHistoryPlaceholder";
import MessageInput from "./MessageInput";
import MessagesLoadingSkeleton from "./MessagesLoadingSkeleton";

function ChatContainer() {
  const {
    selectedUser,
    getMessagesByUserId,
    messages,
    isMessagesLoading,
    markAsSeen,
  } = useChatStore();

  const { authUser, socket } = useAuthStore();
  const messageEndRef = useRef(null);
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    if (!selectedUser?._id) return;

    getMessagesByUserId(selectedUser._id);
    markAsSeen(selectedUser._id);
    // Global listener is set up in ChatPage, no need to subscribe per-chat

    socket?.on("typing", ({ senderId }) => {
      if (String(senderId) === String(selectedUser._id)) {
        setIsTyping(true);
      }
    });

    socket?.on("stopTyping", ({ senderId }) => {
      if (String(senderId) === String(selectedUser._id)) {
        setIsTyping(false);
      }
    });

    return () => {
      socket?.off("typing");
      socket?.off("stopTyping");
    };
  }, [selectedUser?._id]);

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  return (
    <div className="flex flex-col h-full">

      <ChatHeader />

      <div
        className="flex-1 overflow-y-auto px-4 md:px-6 py-4 md:py-6 space-y-4 bg-slate-950 min-h-0"
        onClick={() => {
          const ta = document.querySelector("textarea");
          if (ta) ta.focus();
        }}
      >

        {authUser && messages.length > 0 && !isMessagesLoading ? (
          <>
            {messages.map((msg) => {
              const isMe = String(msg.senderId) === String(authUser._id);

              return (
                <div
                  key={msg._id}
                  className={`flex ${isMe ? "justify-end" : "justify-start"} animate-fadeIn`}
                >
                  <div
                    className={`relative max-w-[70%] px-4 py-3 rounded-2xl text-sm transition select-none
                      ${
                        isMe
                          ? "bg-cyan-900 text-white rounded-br-md"
                          : "bg-slate-800 text-slate-200 rounded-bl-md"
                      }`}
                  >
                    {(msg.image || msg.fileUrl) && (
                      <img
                        src={msg.image || msg.fileUrl}
                        alt="Shared"
                        className="rounded-xl mb-2 max-h-60 object-cover"
                      />
                    )}

                    {msg.text && (
                      <p className="leading-relaxed wrap-break-word">
                        {msg.text}
                      </p>
                    )}

                    {/* timestamp + read receipts*/}
                    <div
                      className={`mt-2 text-[10px] flex items-center gap-1 ${
                        isMe
                          ? "text-white/70 justify-end"
                          : "text-slate-400 justify-start"
                      }`}
                    >
                      <span>
                        {new Date(msg.createdAt).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>

                      {isMe && (
                        <span className={msg.seenAt ? "text-cyan-300" : ""}>
                          {msg.seenAt ? "✓✓" : msg.deliveredAt ? "✓✓" : "✓"}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-slate-800 text-slate-300 px-4 py-3 rounded-2xl rounded-bl-md">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.3s]" />
                    <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.15s]" />
                    <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" />
                  </div>
                </div>
              </div>
            )}
          </>
        ) : isMessagesLoading ? (
          <MessagesLoadingSkeleton />
        ) : (
          <NoChatHistoryPlaceholder name={selectedUser.fullName} />
        )}

        <div ref={messageEndRef} />
      </div>

      <div className="border-t border-slate-800 bg-slate-900">
        <MessageInput />
      </div>
    </div>
  );
}

export default ChatContainer;