"use client";

import { useRouter } from "next/navigation";
import Hero from "@/components/Hero";
import JobForm from "@/components/JobForm";
import { useCreateVacancy } from "@/hooks/useVacancies";
import type { VacancyInput } from "@/lib/types";

export default function CreateVacancyPage() {
  const router = useRouter();
  const create = useCreateVacancy();

  return (
    <>
      <Hero
        title="Buat lowongan pekerjaan"
        subtitle="Dicoding Jobs menghubungkan industri dengan talenta yang tepat. Mencari tim baru tidak harus melelahkan dan boros biaya."
      />
      <JobForm
        submitLabel="Buat lowongan"
        onSubmit={async (payload) => {
          await create.mutateAsync(payload as VacancyInput);
          router.push("/dashboard");
        }}
      />
    </>
  );
}
