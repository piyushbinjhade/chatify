import {create} from 'zustand';

export const useAuthStore = create((set) => ({
    authUser: { name: "Piyush", _id: 123, age: 21 },
    isLoading: false,
    isLoggedIn: true,

    login: () => {
        console.log("We just logged in");
        set({ isLoggedIn: true ,isLoading:true });
    },
}));