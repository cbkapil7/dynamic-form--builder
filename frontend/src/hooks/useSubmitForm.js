import { useMutation } from "@tanstack/react-query";
import { api } from "../services/api";

export const useSubmitForm = () =>
  useMutation({
    mutationFn: async ({ formId, values }) => {
      const res = await api.post(`/forms/${formId}/submit`, values);
      return res.data;
    },
  });