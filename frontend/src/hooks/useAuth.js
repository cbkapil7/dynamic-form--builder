import { useMutation } from "@tanstack/react-query";
import { api } from "../services/api";

export const useLogin = () => {
  return useMutation({
    mutationFn: (data) => api.post("/auth/login", data),
    onSuccess: (res) => {
      localStorage.setItem("token", res.data.token);
    }
  });
};

export const useRegister = () => {
  return useMutation({
    mutationFn: (data) => api.post("/auth/register", data)
  });
};