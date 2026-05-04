import { useMutation } from "@tanstack/react-query";
import { api } from "../services/api";

export const useUpdateForm = () =>
  useMutation({
    mutationFn: async ({ id, ...data }) => {
      const res = await api.put(`/forms/${id}`, data);
      return res.data;
    },
  });