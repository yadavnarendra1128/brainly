import axios, { AxiosInstance } from "axios";

// Ensure the environment variable is typed correctly
const BASE_URL: string = import.meta.env.VITE_BACKEND_TARGET_URL;

// Create an Axios instance with type safety
const axiosInstance: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

export default axiosInstance;
