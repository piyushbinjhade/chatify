import { useEffect } from "react";
import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";

function RecentChats() {
  const { chats, getRecentChats, selectedUser, setSelectedUser } = useChatStore();
  const { onlineUsers } = useAuthStore();

  useEffect(() => {
    getRecentChats();
  }, []);

  if (!chats.length) return null;

  return (
    <div>
      <h3 className="text-xs font-semibold text-slate-500 uppercase mb-3 px-2">
        Recent Chats
      </h3>

      <div className="space-y-1">
        {chats.map((chat) => {
          const user = chat._id;
          const isSelected = selectedUser?._id === user._id;
          const isOnline = onlineUsers.includes(user._id);

          return (
            <div
              key={user._id}
              onClick={() => setSelectedUser(user)}
              className={`flex items-center gap-3 px-3 py-2 rounded-xl cursor-pointer transition
                ${
                  isSelected
                    ? "bg-slate-800"
                    : "hover:bg-slate-800/60"
                }`}
            >
              <div className="relative">
                <img
                  src={user.profilePic || "/avatar.png"}
                  className="w-10 h-10 rounded-full object-cover"
                />
                {isOnline && (
                  <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border border-slate-900" />
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-center">
                  <p className="text-sm font-medium text-white truncate">
                    {user.fullName}
                  </p>

                  {chat.unreadCount > 0 && (
                    <span className="bg-cyan-600 text-white text-xs px-2 py-0.5 rounded-full">
                      {chat.unreadCount}
                    </span>
                  )}
                </div>

                <p className="text-xs text-slate-400 truncate">
                  {chat.lastMessage?.text || "Media message"}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default RecentChats;