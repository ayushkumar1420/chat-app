import { create  } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast"

const getErrorMessage = (error) => {
    if (error?.message === "Network Error") {
        return "Unable to connect to the server. Make sure the backend is running and try again.";
    }

    return error?.response?.data?.message || error?.message || "Something went wrong";
};

export const useAuthStore = create((set) => ({
    authUser: null,
    isSigningUp: false,
    isLoggingIn: false,
    isUpdatingProfile: false,

    isCheckingAuth: true,

    checkAuth: async () => {
        try {
            const res = await axiosInstance.get("/auth/check");

            set({ authUser: res.data });
        } catch (error) {
            console.log("Error in checkAuth:", error);
            set({ authUser: null });
        }finally {
            set({ isCheckingAuth: false });
        }
    },

    signup: async (data) => {
        console.log("Signup called", data);
        
        set({ isSigningUp: true });
        try {
            const res = await axiosInstance.post("/auth/signup", data);
            
            set({ authUser: res.data });
            toast.success("Account created successfully");
            return res.data;
        } catch (error) {
            console.error("Error in signup:", error);
            toast.error(getErrorMessage(error));
            return null;
        } finally {
            set({ isSigningUp: false });
        }
    },
}));
