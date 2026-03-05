import { useEffect } from "react";
import { useFriendStore } from "../store/useFriendStore";
import { Loader2 } from "lucide-react";
import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";

function FriendsList() {
  const { friends, getFriends, isLoadingFriends } = useFriendStore();
  const { selectedUser, setSelectedUser } = useChatStore();
  const { onlineUsers } = useAuthStore();

  useEffect(() => {
    getFriends();
  }, []);

  return (
    <div>
      <h3 className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-4 px-2">
        Friends
      </h3>

      {isLoadingFriends && (
        <div className="flex justify-center py-6">
          <Loader2 className="animate-spin text-slate-400" size={20} />
        </div>
      )}

      {!isLoadingFriends && friends.length === 0 && (
        <p className="text-slate-500 text-sm text-center py-6">
          No friends yet
        </p>
      )}

      <div className="space-y-1">
        {friends.map((friend) => {
          const isActive = selectedUser?._id === friend._id;
          const isOnline = onlineUsers.includes(friend._id);

          return (
            <div
              key={friend._id}
              onClick={() => setSelectedUser(friend)}
              className={`flex items-center gap-3 px-3 py-2 rounded-xl cursor-pointer transition-all duration-200
                ${
                  isActive
                    ? "bg-slate-800"
                    : "hover:bg-slate-800/60"
                }`}
            >
              {/* Avatar */}
              <div className="relative">
                <img
                  src={friend.profilePic || "/avatar.png"}
                  className="w-10 h-10 rounded-full object-cover"
                  alt="avatar"
                />

                {isOnline && (
                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-slate-900"></span>
                )}
              </div>

              {/* Info */}
              <div className="flex flex-col overflow-hidden">
                <span className="text-slate-200 text-sm font-medium truncate">
                  {friend.fullName}
                </span>
                <span className="text-slate-500 text-xs truncate">
                  @{friend.username}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default FriendsList;