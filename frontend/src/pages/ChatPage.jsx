import { useEffect } from "react";
import UserSearch from "../components/UserSearch";
import { useChatStore } from "../store/useChatStore";
import ProfileHeader from "../components/ProfileHeader";
import ChatContainer from "../components/ChatContainer";
import NoConversationPlaceholder from "../components/NoConversationPlaceholder";
import FriendRequests from "../components/FriendRequests";
import FriendsList from "../components/FriendsList";
import { useFriendStore } from "../store/useFriendStore";
import { useAuthStore } from "../store/useAuthStore";
import RecentChats from "../components/RecentChats";

function ChatPage() {
  const { selectedUser, setupGlobalMessageListener } = useChatStore();
  const { getFriends } = useFriendStore();
  const { socket } = useAuthStore();

  useEffect(() => {
    getFriends();
  }, []);

  // Set up global message listener as soon as socket is ready
  useEffect(() => {
    if (socket?.connected) {
      setupGlobalMessageListener();
    }
  }, [socket?.connected, setupGlobalMessageListener]);

  return (
    <div className="h-screen w-full bg-slate-950 flex items-center justify-center p-2 md:p-4">
      <div className="w-full max-w-7xl h-[95vh] flex flex-col md:flex-row rounded-2xl overflow-hidden border border-slate-800 shadow-2xl">
        {/* LEFT SIDEBAR */}
        <div className="hidden md:flex md:w-80 bg-slate-900 flex-col border-r border-slate-800">
          {/* Profile */}
          <div className="px-6 py-5 border-b border-slate-800">
            <ProfileHeader />
          </div>

          {/* Search */}
          <div className="px-6 py-4 border-b border-slate-800">
            <UserSearch />
          </div>

          {/* Scrollable Section */}
          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-8">

            <RecentChats />

            <FriendRequests />

            <FriendsList />

          </div>
        </div>

        {/* RIGHT CHAT AREA */}
        <div className="flex-1 bg-slate-950 flex flex-col w-full">
          {selectedUser ? (
            <ChatContainer />
          ) : (
            <>
              {/* DESKTOP: Show placeholder */}
              <div className="hidden md:flex flex-1 items-center justify-center">
                <NoConversationPlaceholder />
              </div>
              
              {/* MOBILE: Show sidebar content */}
              <div className="flex-1 flex flex-col md:hidden items-center justify-center">
                <div className="w-full h-full flex flex-col bg-slate-900">
                  <div className="px-4 py-4 border-b border-slate-800">
                    <ProfileHeader />
                  </div>

                  <div className="px-4 py-3 border-b border-slate-800">
                    <UserSearch />
                  </div>

                  <div className="flex-1 overflow-y-auto px-3 py-3 space-y-6">
                    <RecentChats />
                    <FriendRequests />
                    <FriendsList />
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default ChatPage;
