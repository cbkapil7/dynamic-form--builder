import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../services/api";

export const useCreateForm = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (data) => api.post("/forms", data),

    onSuccess: () => {
      qc.invalidateQueries(["forms"]);
    }
  });
};