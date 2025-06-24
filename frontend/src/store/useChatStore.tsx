import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import { Axios, AxiosError } from "axios";
import toast from "react-hot-toast";
import type { AuthUser, Message, MessageData } from "../lib/types";

type ChatStore = {
  messages: Message[];
  users: AuthUser[];
  selectedUser: null | AuthUser;
  isUsersLoading: boolean;
  isMessagesLoading: boolean;
  isMessageSending: boolean;

  getUsers: () => void;
  getMessages: (userId: string) => void;

  setSelectedUser: (selectedUser: AuthUser | null) => void;
  sendMessage: (data: MessageData) => void;
};

export const useChatStore = create<ChatStore>((set, get) => ({
  messages: [],
  users: [],
  selectedUser: null,
  isUsersLoading: false,
  isMessagesLoading: false,
  isMessageSending: false,

  getUsers: async () => {
    set({ isUsersLoading: true });
    try {
      const res = await axiosInstance.get("/messages/users");
      set({ users: res.data });
    } catch (error) {
      toast.error(
        error instanceof AxiosError
          ? error.response?.data.message
          : "Internet Connection Error",
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
          : "Internet Connection Error",
      );
    } finally {
      set({ isMessagesLoading: false });
    }
  },

  setSelectedUser: async (selectedUser) => {
    set({ selectedUser });
  },
  sendMessage: async (message) => {
    const { selectedUser, messages } = get();
    set({ isMessageSending: true });
    try {
      const res = await axiosInstance.post(
        `/messages/send/${selectedUser?._id}`,
        message,
      );
      set({ messages: [...messages, res.data] });
    } catch (error) {
      toast.error(
        error instanceof AxiosError
          ? error.response?.data.message
          : "Failed to load the messages",
      );
    } finally {
      set({ isMessageSending: false });
    }
  },
}));
