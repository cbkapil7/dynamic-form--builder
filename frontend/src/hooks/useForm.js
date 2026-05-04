import { useQuery } from "@tanstack/react-query";
import { api } from "../services/api";

export const useForm = (id) =>
  useQuery({
    queryKey: ["form", id],
    queryFn: async () => (await api.get(`/forms/${id}`)).data,
    enabled: !!id
  });