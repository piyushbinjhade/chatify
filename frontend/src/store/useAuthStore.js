import {create} from 'zustand';
import toast from 'react-hot-toast';
import { axiosInstance } from '../lib/axios.js';
import { io } from 'socket.io-client';

const BASE_URL = import.meta.env.MODE === "development" ? "http://localhost:3000" : "/";

export const useAuthStore = create((set, get) => ({
    authUser: null,
    isCheckingAuth: true,
    isSigningUp: false,
    isLoggingIn: false,
    socket: null,
    onlineUsers: [],

    checkAuth: async () => {
        try {
            const res = await axiosInstance.get('/auth/check');
            set({ authUser: res.data });
            get().connectSocket();
        } catch (error) {
            if (error.response?.status === 401) {
                set({authUser: null});
            }else{
                console.log("Error in authCheck:", error);
            }
        }
        finally{
            set({ isCheckingAuth: false });
        }
    },

    signup: async(data) => {
        set({ isSigningUp: true });
        try {
            const res = await axiosInstance.post('/auth/signup', data);
            set({ authUser: res.data });

            toast.success("Account created successfully!");

            get().connectSocket();  
        } catch (error) {
            toast.error(error.response.data.message);
        } finally {
            set({ isSigningUp: false });
        }
    },

    login: async(data) => {
        set({ isLoggingIn: true });
        try {
            const res = await axiosInstance.post('/auth/login', data);
            set({ authUser: res.data });

            toast.success("Logged in successfully!");
            return true;

            get().connectSocket();
        } catch (error) {
            toast.error(error.response.data.message);
            return false;
        } finally {
            set({ isLoggingIn: false });
        }
    },

    logout: async() => {
        try {
            await axiosInstance.post('/auth/logout');
            set({ authUser: null });
            toast.success("Logged out successfully!");
            get().disconnectSocket();
        } catch (error) {
            toast.error("Failed to logout. Please try again.");
            console.log("Error in logout:", error);
        }
    },

    updateProfile: async (data) => {
    try {
      const res = await axiosInstance.put("/auth/update-profile", data);
      set({ authUser: res.data });
      toast.success("Profile updated successfully");
    } catch (error) {
      console.log("Error in update profile:", error);
      toast.error(error.response.data.message);
    }
    },

    connectSocket: () => {
        const { authUser } = get();
        const existing = get().socket;
        if(!authUser || existing?.connected || existing.active) return;

        const socket = io(BASE_URL, {
            withCredentials: true, // this ensures cookies are sent with the connection
        });

        socket.connect();

        set({ socket });

        // listen for online users event
        socket.on("getOnlineUsers", (userIds) => {
            set({ onlineUsers: userIds });
        });
    },

    disconnectSocket: () => {
       if( get().socket?.connected) get().socket.disconnect();
    },
    
}));