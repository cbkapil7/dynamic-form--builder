import { useMutation } from "@tanstack/react-query";
import { api } from "../services/api";

export const useLogin = () => {
  return useMutation({
    mutationFn: (data) => api.post("/auth/login", data)
    // Token is stored as httpOnly cookie by backend, no need to store in localStorage
  });
};

export const useRegister = () => {
  return useMutation({
    mutationFn: (data) => api.post("/auth/register", data)
  });
};