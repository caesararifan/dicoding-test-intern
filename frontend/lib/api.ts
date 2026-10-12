import type { Paginated, Vacancy, VacancyInput } from "./types";

const BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000/api";

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
    public errors?: Record<string, string[]>,
  ) {
    super(message);
  }
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    ...init,
    headers: {
      Accept: "application/json",
      ...(init?.body ? { "Content-Type": "application/json" } : {}),
    },
  });
  if (res.status === 204) return undefined as T;
  const body = await res.json().catch(() => null);
  if (!res.ok)
    throw new ApiError(
      res.status,
      body?.message ?? "Terjadi kesalahan",
      body?.errors,
    );
  return body as T;
}

export const api = {
  listVacancies: (search = "", page = 1) => {
    const q = new URLSearchParams({ page: String(page) });
    if (search) q.set("search", search);

    return request<Paginated<Vacancy>>(`/vacancies?${q}`);
  },
  getVacancy: (id: string | number) =>
    request<{ data: Vacancy }>(`/vacancies/${id}`).then((r) => r.data),
  createVacancy: (payload: VacancyInput) =>
    request<{ data: Vacancy }>("/vacancies", {
      method: "POST",
      body: JSON.stringify(payload),
    }).then((r) => r.data),
  updateVacancy: (id: string | number, payload: Partial<VacancyInput>) =>
    request<{ data: Vacancy }>(`/vacancies/${id}`, {
      method: "PATCH",
      body: JSON.stringify(payload),
    }).then((r) => r.data),
  deleteVacancy: (id: number) =>
    request<void>(`/vacancies/${id}`, { method: "DELETE" }),
};
