"use client";

import { useParams, useRouter } from "next/navigation";
import Hero from "@/components/Hero";
import JobForm from "@/components/JobForm";
import { useUpdateVacancy, useVacancy } from "@/hooks/useVacancies";

export default function EditVacancyPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { data: v, isLoading, isError } = useVacancy(id);
  const update = useUpdateVacancy(id);

  if (isLoading)
    return (
      <div className="mx-auto mt-8 h-40 max-w-md animate-pulse rounded-md bg-slate-100" />
    );
  if (isError || !v)
    return (
      <p className="py-20 text-center text-sm text-slate-500">
        Lowongan tidak ditemukan.
      </p>
    );

  return (
    <>
      <Hero title="Edit lowongan pekerjaan" />
      <JobForm
        isEdit
        submitLabel="Simpan perubahan"
        initial={{
          title: v.title,
          position: v.position,
          employment_type: v.employment_type,
          candidates_needed: String(v.candidates_needed),
          active_until: v.active_until,
          location: v.location,
          is_remote: v.is_remote,
          description: v.description,
          show_salary: v.show_salary,

          min_experience: v.min_experience,
        }}
        onSubmit={async (payload) => {
          await update.mutateAsync(payload);
          router.push("/dashboard");
        }}
      />
    </>
  );
}
