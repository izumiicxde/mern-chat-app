import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import type { SignupFormData, AuthUser, LoginFormData } from "../lib/types";
import toast from "react-hot-toast";
import { AxiosError } from "axios";
import type { Socket } from "socket.io-client";
import { io } from "socket.io-client";
import { envs } from "../lib/envs";

type AuthStore = {
  authUser: AuthUser | null;
  isSigningUp: boolean;
  isLoggingIn: boolean;
  isUpdatingProfile: boolean;
  isCheckingAuth: boolean;
  onlineUsers: any[];
  socket: null | Socket;

  checkAuth: () => void;
  updateProfile: ({
    profilePic,
  }: {
    profilePic: string | ArrayBuffer | null;
  }) => void;
  signup: (data: SignupFormData) => void;
  login: (data: LoginFormData) => void;
  logout: () => void;

  connectSocket: () => void;
  disconnectSocket: () => void;
};

export const useAuthStore = create<AuthStore>((set, get) => ({
  authUser: null,
  isSigningUp: false,
  isLoggingIn: false,
  isUpdatingProfile: false,
  isCheckingAuth: true,
  onlineUsers: [],
  socket: null,

  checkAuth: async () => {
    try {
      const res = await axiosInstance.get("/auth/check");
      set({ authUser: res.data });

      get().connectSocket();
    } catch (error) {
      void error;
      set({ authUser: null });
    } finally {
      set({ isCheckingAuth: false });
    }
  },
  signup: async (data: SignupFormData) => {
    set({ isSigningUp: true });
    try {
      const res = await axiosInstance.post("/auth/signup", data);

      set({ authUser: res.data });
      toast.success("Account created successfully");

      get().connectSocket();
    } catch (error) {
      toast.error(
        error instanceof AxiosError
          ? error.response?.data.message
          : "Failed signing up.",
      );
    } finally {
      set({ isSigningUp: false });
    }
  },
  login: async (data) => {
    set({ isSigningUp: true });
    try {
      const res = await axiosInstance.post("/auth/login", data);

      set({ authUser: res.data });
      toast.success("Login successfull");

      get().connectSocket();
    } catch (error) {
      toast.error(
        error instanceof AxiosError
          ? error.response?.data.message
          : "Failed logging in.",
      );
    } finally {
      set({ isSigningUp: false });
    }
  },
  updateProfile: async (data) => {
    set({ isUpdatingProfile: true });
    try {
      const res = await axiosInstance.put("/auth/update-profile", data);
      set({ authUser: res.data });
      toast.success("Profile updated successfully.");
    } catch (error) {
      toast.error(
        error instanceof AxiosError
          ? error.response?.data.message
          : "Failed to update profile picture.",
      );
    } finally {
      set({ isUpdatingProfile: false });
    }
  },
  logout: async () => {
    try {
      await axiosInstance.post("/auth/logout");
      set({ authUser: null });
      get().disconnectSocket();
      toast.success("logout successfull");
    } catch (error) {
      toast.error(
        error instanceof AxiosError
          ? error.response?.data.message
          : "Failed logging out.",
      );
    }
  },

  connectSocket: () => {
    const { authUser } = get();
    if (!authUser || get().socket?.connected) return;

    const socket = io(envs.API_URL, {
      query: {
        userId: authUser._id,
      },
    });
    socket.connect();
    set({ socket: socket });

    socket.on("getOnlineUsers", (userIds) => {
      set({ onlineUsers: userIds });
    });
  },
  disconnectSocket: () => {
    if (get().socket?.connected) get().socket?.disconnect();
  },
}));
