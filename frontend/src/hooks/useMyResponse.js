

import { useQuery } from "@tanstack/react-query";
import { api } from "../services/api";

export const useMyResponse = (formId) =>
  useQuery({
    queryKey: ["my-response", formId],
    queryFn: async () =>
      (await api.get(`/forms/${formId}/responses`)).data,
    enabled: !!formId,
  });