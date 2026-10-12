"use client";

import { useParams } from "next/navigation";
import DOMPurify from "dompurify";
import { Building2, MapPin, Users } from "lucide-react";
import CompanyLogo from "@/components/CompanyLogo";
import { useVacancy } from "@/hooks/useVacancies";
import { EMPLOYMENT_LABEL, EXPERIENCE_LABEL, formatRupiah } from "@/lib/format";

export default function VacancyDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { data: v, isLoading, isError } = useVacancy(id);

  if (isLoading) {
    return (
      <div className="mx-auto mt-8 h-40 max-w-3xl animate-pulse rounded-md bg-slate-100" />
    );
  }
  if (isError || !v) {
    return (
      <p className="py-20 text-center text-sm text-slate-500">
        Lowongan tidak ditemukan.
      </p>
    );
  }

  return (
    <>
      <header className="border-b border-slate-200">
        <div className="mx-auto flex max-w-3xl items-center gap-4 px-6 py-6">
          <CompanyLogo company={v.company} className="h-14 w-14" />
          <div>
            <h1 data-testid="vacancy-title" className="text-lg font-semibold">
              {v.title}
            </h1>
            <p className="text-xs text-slate-500">
              Sektor Bisnis: {v.company?.business_sector ?? "-"}
            </p>
            <div className="mt-1 flex flex-wrap gap-x-3 gap-y-1 text-[11px] text-slate-600">
              <a
                href={v.company?.website ?? "#"}
                className="flex items-center gap-1 text-blue-600 underline"
              >
                <Building2 size={12} />
                {v.company?.name}
              </a>
              <span className="flex items-center gap-1">
                <MapPin size={12} />
                {v.location}
                {v.is_remote && " (Remote)"}
              </span>
              {v.company?.size && (
                <span className="flex items-center gap-1">
                  <Users size={12} />
                  {v.company.size}
                </span>
              )}
            </div>
          </div>
        </div>
      </header>

      <article className="mx-auto max-w-2xl px-6 py-6">
        <span className="inline-block rounded-full border border-blue-300 bg-blue-50 px-3 py-0.5 text-[11px] font-medium text-blue-600">
          {EMPLOYMENT_LABEL[v.employment_type]}
        </span>

        <div
          data-testid="vacancy-description"
          className="mt-4 text-sm leading-relaxed [&_a]:underline [&_h2]:mb-2 [&_h2]:mt-6 [&_h2]:font-semibold [&_h3]:mb-2 [&_h3]:mt-6 [&_h3]:text-base [&_h3]:font-semibold [&_ol]:list-decimal [&_ol]:pl-5 [&_p]:mb-2 [&_ul]:list-disc [&_ul]:pl-5"
          dangerouslySetInnerHTML={{
            __html: DOMPurify.sanitize(v.description),
          }}
        />

        <section className="mt-8">
          <h2 className="mb-3 text-sm font-semibold">Informasi Tambahan</h2>

          <dl className="grid grid-cols-2 gap-4 text-xs">
            <div>
              <dt className="font-semibold">Pengalaman bekerja</dt>
              <dd className="mt-1 text-slate-600">
                {EXPERIENCE_LABEL[v.min_experience]}
              </dd>
            </div>
            <div>
              <dt className="font-semibold">Kandidat yang dibutuhkan</dt>
              <dd className="mt-1 text-slate-600">
                {v.candidates_needed} kandidat
              </dd>
            </div>
            {v.show_salary && v.salary_min !== null && (
              <div>
                <dt className="font-semibold">Gaji per bulan</dt>
                <dd className="mt-1 text-slate-600">
                  {formatRupiah(v.salary_min)}
                  {v.salary_max ? ` - ${formatRupiah(v.salary_max)}` : ""}
                </dd>
              </div>
            )}
          </dl>
        </section>
      </article>
    </>
  );
}
