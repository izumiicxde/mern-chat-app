export type AuthUser = {
  __v: string;
  _id: string;
  email: string;
  fullName: string;
  profilePic: string;
  createdAt: string;
  updatedAt: string;
};
export type SignupFormData = {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
};
export type LoginFormData = {
  email: string;
  password: string;
};

export type MessageData = {
  text: string;
  image: ArrayBuffer | string | null;
};
export type Message = {
  _id: string;
  senderId: string;
  receiverId: string;
  text: string;
  image?: string;
  createdAt: string;
  updatedAt: string;
};
