import { useState } from "react";
import { useFriendStore } from "../store/useFriendStore";
import { Search, Loader2 } from "lucide-react";

function UserSearch() {
  const [query, setQuery] = useState("");
  const { searchUsers, searchResults, sendFriendRequest, isSearching } =
    useFriendStore();

  const handleSearch = (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    searchUsers(query.trim());
  };

  return (
    <div>
      {/* Search Input */}
      <form onSubmit={handleSearch} className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4" />

        <input
          type="text"
          placeholder="Search by username"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full pl-9 pr-10 py-2.5 rounded-xl bg-slate-800/70 
                     text-slate-200 placeholder:text-slate-500
                     focus:outline-none focus:ring-1 focus:ring-slate-600
                     transition"
        />

        {isSearching && (
          <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 animate-spin text-slate-400 w-4 h-4" />
        )}
      </form>

      {/* Search Results */}
      {query && (
        <div className="space-y-2">
          {(!Array.isArray(searchResults) || searchResults.length === 0) && !isSearching && (
            <p className="text-slate-500 text-sm text-center py-4">
              No users found
            </p>
          )}

          {(Array.isArray(searchResults) ? searchResults : []).map((user) => (
            <div
              key={user._id}
              className="flex items-center justify-between px-3 py-3 rounded-xl bg-slate-800/60 hover:bg-slate-800 transition-all duration-200"
            >
              <div className="flex items-center gap-3 overflow-hidden">
                <img
                  src={user.profilePic || "/avatar.png"}
                  alt="avatar"
                  className="w-10 h-10 rounded-full object-cover"
                />

                <div className="flex flex-col overflow-hidden">
                  <span className="text-slate-200 text-sm font-medium truncate">
                    {user.fullName}
                  </span>
                  <span className="text-slate-500 text-xs truncate">
                    @{user.username}
                  </span>
                </div>
              </div>

              <button
                onClick={() => sendFriendRequest(user._id)}
                className="px-3 py-1.5 text-xs font-medium rounded-lg 
                           bg-emerald-600/80 hover:bg-emerald-600
                           transition"
              >
                Add
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default UserSearch;