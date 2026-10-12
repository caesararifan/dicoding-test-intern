import Link from "next/link";
import { Briefcase, Building2, MapPin } from "lucide-react";
import CompanyLogo from "./CompanyLogo";
import { EMPLOYMENT_LABEL, EXPERIENCE_LABEL, formatDate } from "@/lib/format";
import type { Vacancy } from "@/lib/types";

export default function JobCard({ vacancy }: { vacancy: Vacancy }) {
  return (
    <Link
      href={`/jobs/${vacancy.id}`}
      data-testid="job-card"
      className="flex gap-4 rounded-md border border-slate-200 p-3 transition hover:border-slate-400 hover:shadow-sm"
    >
      <CompanyLogo company={vacancy.company} className="h-60px w-60px" />
      <div className="min-w-0 flex-1">
        <h3 data-testid="job-title" className="text-sm font-semibold">
          {vacancy.title}
        </h3>
        <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-slate-600">
          <span className="flex items-center gap-1">
            <Building2 size={12} />
            {vacancy.company?.name}
          </span>
          <span>{EMPLOYMENT_LABEL[vacancy.employment_type]}</span>
          <span className="flex items-center gap-1">
            <MapPin size={12} />
            {vacancy.location}
          </span>
          <span className="flex items-center gap-1">
            <Briefcase size={12} />
            {EXPERIENCE_LABEL[vacancy.min_experience]}
          </span>
        </div>
      </div>
      <div className="hidden shrink-0 text-right text-[10px] text-slate-500 sm:block">
        <p>Dibuat pada {formatDate(vacancy.created_at, "Asia/Jakarta")}</p>
        <p className="mt-1">Lamar sebelum {formatDate(vacancy.active_until)}</p>
      </div>
    </Link>
  );
}
