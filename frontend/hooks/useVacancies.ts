"use client";

import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { VacancyInput } from "@/lib/types";

export const useVacancies = (search: string, page: number) =>
  useQuery({
    queryKey: ["vacancies", search, page],
    queryFn: () => api.listVacancies(search, page),
    placeholderData: keepPreviousData,
  });

export const useVacancy = (id: string) =>
  useQuery({ queryKey: ["vacancy", id], queryFn: () => api.getVacancy(id) });

export const useCreateVacancy = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (p: VacancyInput) => api.createVacancy(p),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["vacancies"] }),
  });
};

export const useUpdateVacancy = (id: string) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (p: Partial<VacancyInput>) => api.updateVacancy(id, p),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["vacancies"] });
      qc.invalidateQueries({ queryKey: ["vacancy", id] });
    },
  });
};

export const useDeleteVacancy = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => api.deleteVacancy(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["vacancies"] }),
  });
};
