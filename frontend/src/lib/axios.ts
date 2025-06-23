import axios from "axios";
import { envs } from "./envs";
export const axiosInstance = axios.create({
  baseURL: envs.API_BASE_URL,
  withCredentials: true,
});
