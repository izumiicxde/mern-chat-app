import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import { AxiosError } from "axios";
import toast from "react-hot-toast";
import type { AuthUser } from "../lib/types";

type ChatStore = {
  messages: never[];
  users: AuthUser[];
  selectedUser: null | AuthUser;
  isUsersLoading: boolean;
  isMessagesLoading: boolean;

  getUsers: () => void;
  getMessages: (userId: string) => void;
  setSelectedUser: (selectedUser: AuthUser) => void;
};

export const useChatStore = create<ChatStore>((set) => ({
  messages: [],
  users: [],
  selectedUser: null,
  isUsersLoading: false,
  isMessagesLoading: false,

  getUsers: async () => {
    set({ isUsersLoading: true });
    try {
      const res = await axiosInstance.get("/messages/users");
      set({ users: res.data });
    } catch (error) {
      toast.error(
        error instanceof AxiosError
          ? error.response?.data.message
          : "Internet Connection Error"
      );
    } finally {
      set({ isUsersLoading: false });
    }
  },
  getMessages: async (userId) => {
    set({ isMessagesLoading: true });
    try {
      const res = await axiosInstance.get(`/messages/${userId}`);
      set({ messages: res.data });
    } catch (error) {
      toast.error(
        error instanceof AxiosError
          ? error.response?.data.message
          : "Internet Connection Error"
      );
    } finally {
      set({ isMessagesLoading: false });
    }
  },
  setSelectedUser: async (selectedUser) => {
    set({ selectedUser });
  },
}));
