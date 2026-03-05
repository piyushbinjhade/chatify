import { useState, useRef, useEffect } from "react";
import { LogOutIcon, VolumeOffIcon, Volume2Icon } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import { useChatStore } from "../store/useChatStore";

function ProfileHeader() {
  const { logout, authUser, updateProfile } = useAuthStore();
  const { isSoundEnabled, toggleSound } = useChatStore();
  const [selectedImg, setSelectedImg] = useState(null);

  const fileInputRef = useRef(null);
  const soundRef = useRef(null);

  useEffect(() => {
    soundRef.current = new Audio("/sounds/mouse-click.mp3");
  }, []);

  const handleToggleSound = () => {
    if (soundRef.current) {
      soundRef.current.currentTime = 0;
      soundRef.current.play().catch(() => {});
    }
    toggleSound();
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onloadend = async () => {
      const base64Image = reader.result;
      setSelectedImg(base64Image);
      await updateProfile({ profilePic: base64Image });
    };
  };

  return (
    <div className="flex items-center justify-between">
      {/* LEFT SIDE */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => fileInputRef.current.click()}
          className="relative group"
        >
          <img
            src={selectedImg || authUser?.profilePic || "/avatar.png"}
            alt="avatar"
            className="w-14 h-14 rounded-full object-cover ring-1 ring-slate-700"
          />

          <div className="absolute inset-0 rounded-full bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition">
            <span className="text-[11px] text-white tracking-wide">
              Edit
            </span>
          </div>
        </button>

        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          onChange={handleImageUpload}
          className="hidden"
        />

        <div className="flex flex-col">
          <span className="text-slate-200 text-sm font-semibold">
            {authUser?.fullName}
          </span>
          <span className="text-slate-500 text-xs">
            @{authUser?.username}
          </span>
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => {
            handleToggleSound();
          }}
          className="p-2 rounded-lg hover:bg-slate-800 transition"
        >
          {isSoundEnabled ? (
            <Volume2Icon className="w-4 h-4 text-slate-400 hover:text-slate-200 transition" />
          ) : (
            <VolumeOffIcon className="w-4 h-4 text-slate-400 hover:text-slate-200 transition" />
          )}
        </button>

        <button
          type="button"
          onClick={logout}
          className="p-2 rounded-lg hover:bg-slate-800 transition cursor-pointer"
        >
          <LogOutIcon className="w-4 h-4 text-slate-400 hover:text-slate-200 transition" />
        </button>
      </div>
    </div>
  );
}

export default ProfileHeader;