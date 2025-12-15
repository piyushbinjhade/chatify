import { useAuthStore } from "../store/useAuthStore";
function ChatPage() {
const {logout} = useAuthStore();
  return (
    <div className="z-10 p-6 bg-amber-500">
      ChatPage
      <button onClick={logout}>Logout</button>
    </div>
  )
}

export default ChatPage
