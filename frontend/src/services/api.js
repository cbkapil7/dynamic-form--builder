import axios from "axios";
import toast from "react-hot-toast";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true 
});

api.interceptors.response.use(
  (res) => res,
  (error) => {
    const message =
      error?.response?.data?.message || "Something went wrong";

    toast.error(message);

    if (error.response?.status === 401) {
      window.location.replace("/login");
    }

    return Promise.reject(error);
  }
);