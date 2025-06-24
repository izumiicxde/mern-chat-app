import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import { Axios, AxiosError } from "axios";
import toast from "react-hot-toast";
import type { AuthUser, Message, MessageData } from "../lib/types";
import { useAuthStore } from "./useAuthStore";

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

  subscribeToMessages: () => void;
  unSubscribeFromMessages: () => void;
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

  subscribeToMessages: () => {
    const { selectedUser } = get();
    if (!selectedUser) return;
    const socket = useAuthStore.getState().socket;

    socket?.on("newMessage", (newMessage: Message) => {
      // check if the message is sent from selected user
      if (newMessage.senderId !== selectedUser._id) return;

      set({
        messages: [...get().messages, newMessage],
      });
    });
  },
  unSubscribeFromMessages: () => {
    const socket = useAuthStore.getState().socket;
    socket?.off("newMessage");
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
