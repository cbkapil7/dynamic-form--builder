// hooks/useForms.js
import { useQuery } from "@tanstack/react-query";
import { api } from "../services/api";

export const useForms = (page, limit) =>
  useQuery({
    queryKey: ["forms", page, limit],

    queryFn: async () => {
      const res = await api.get(`/forms?page=${page}&limit=${limit}`);
      return res.data;
    },

    keepPreviousData: true,
  });