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
