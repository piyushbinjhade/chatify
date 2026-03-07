import { useChatStore } from "../store/useChatStore";
import { useEffect } from "react";
import { X } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";

function ChatHeader() {
  const { selectedUser, setSelectedUser } = useChatStore();
  const { onlineUsers } = useAuthStore();

  const isOnline = selectedUser?._id
    ? onlineUsers.includes(String(selectedUser._id))
    : false;

  useEffect(() => {
    const handleEscKey = (event) => {
      if (event.key === "Escape") setSelectedUser(null);
    };

    window.addEventListener("keydown", handleEscKey);
    return () => window.removeEventListener("keydown", handleEscKey);
  }, [setSelectedUser]);

  if (!selectedUser) return null;

  return (
    <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900">

      {/* LEFT SIDE */}
      <div className="flex items-center gap-4">

        {/* Avatar */}
        <div className="relative">
          <img
            src={selectedUser.profilePic || "/avatar.png"}
            alt={selectedUser.fullName}
            className="w-11 h-11 rounded-full object-cover ring-1 ring-slate-700"
          />

          <span
            className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-slate-900 ${
              isOnline ? "bg-emerald-500" : "bg-slate-600"
            }`}
          />
        </div>

        {/* User Info */}
        <div className="flex flex-col">
          <span className="text-slate-200 text-sm font-semibold">
            {selectedUser.fullName}
          </span>

          <span className="text-slate-500 text-xs">
            {isOnline ? "Online" : "Offline"}
          </span>
        </div>
      </div>

      {/* CLOSE BUTTON */}
      <button
        onClick={() => {
          setSelectedUser(null);
        }}
        className="p-2 rounded-lg hover:bg-slate-800 transition"
      >
        <X className="w-4 h-4 text-slate-400 hover:text-slate-200 transition" />
      </button>
    </div>
  );
}

export default ChatHeader;