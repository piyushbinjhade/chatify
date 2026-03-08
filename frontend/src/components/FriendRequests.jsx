import { useEffect } from "react";
import { useFriendStore } from "../store/useFriendStore";
import { Loader2 } from "lucide-react";

function FriendRequests() {
  const {
    pendingRequests,
    getPendingRequests,
    acceptRequest,
    rejectRequest,
    isLoadingRequests,
  } = useFriendStore();

  useEffect(() => {
    getPendingRequests();
  }, []);

  return (
    <div>
      <h3 className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-4 px-2">
        Requests
      </h3>

      {isLoadingRequests && (
        <div className="flex justify-center py-6">
          <Loader2 className="animate-spin text-slate-400" size={20} />
        </div>
      )}

      {!isLoadingRequests && (!Array.isArray(pendingRequests) || pendingRequests.length === 0) && (
        <p className="text-slate-500 text-sm text-center py-6">
          No pending requests
        </p>
      )}

      <div className="space-y-3">
        {(Array.isArray(pendingRequests) ? pendingRequests : []).map((req) => (
          <div
            key={req._id}
            className="flex items-center justify-between px-3 py-3 rounded-xl bg-slate-800/60 hover:bg-slate-800 transition-all duration-200"
          >
            <div className="flex items-center gap-3 overflow-hidden">
              <img
                src={req.sender.profilePic || "/avatar.png"}
                alt="avatar"
                className="w-10 h-10 rounded-full object-cover"
              />
              <div className="flex flex-col overflow-hidden">
                <span className="text-slate-200 text-sm font-medium truncate">
                  {req.sender.fullName}
                </span>
                <span className="text-slate-500 text-xs truncate">
                  @{req.sender.username}
                </span>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => acceptRequest(req._id)}
                className="px-3 py-1.5 text-xs font-medium rounded-lg bg-emerald-700 hover:bg-emerald-800 transition"
              >
                Accept
              </button>
              <button
                onClick={() => rejectRequest(req._id)}
                className="px-3 py-1.5 text-xs font-medium rounded-lg bg-slate-700 hover:bg-slate-600 transition"
              >
                Reject
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default FriendRequests;