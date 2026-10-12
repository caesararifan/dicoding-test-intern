"use client";

import { useState } from "react";
import Link from "next/link";
import { Briefcase, Clock, Pencil, Plus, Trash2, Upload } from "lucide-react";
import CompanyLogo from "@/components/CompanyLogo";
import Pagination from "@/components/Pagination";
import { useDeleteVacancy, useVacancies } from "@/hooks/useVacancies";
import { formatDate } from "@/lib/format";

export default function DashboardPage() {
  const [page, setPage] = useState(1);
  const { data, isLoading, isError } = useVacancies("", page);
  const del = useDeleteVacancy();

  return (
    <div className="mx-auto flex min-h-[60vh] max-w-5xl">
      <aside className="hidden w-56 shrink-0 border-r border-slate-200 pt-6 md:block">
        <p className="mb-4 px-4 text-lg text-slate-500">Jobs</p>
        <div className="flex items-center gap-2 bg-slate-100 px-4 py-2 text-xs">
          <Briefcase size={14} />
          Lowongan Saya
        </div>
      </aside>

      <section className="flex-1 px-6 py-6">
        <div className="mb-4 flex items-center justify-between">
          <h1 className="text-lg font-semibold">Lowongan Saya</h1>
          <Link
            href="/dashboard/create"
            className="flex items-center gap-1 rounded-md bg-[#2B3A4E] px-3 py-2 text-xs font-medium text-white"
          >
            <Plus size={12} />
            Buat lowongan
          </Link>
        </div>

        {isLoading && (
          <div className="h-24 animate-pulse rounded-md bg-slate-100" />
        )}
        {isError && (
          <p className="text-sm text-red-600">Gagal memuat lowongan.</p>
        )}
        {data?.data.length === 0 && (
          <p className="py-10 text-center text-sm text-slate-500">
            Belum ada lowongan.
          </p>
        )}

        <div className="space-y-3">
          {data?.data.map((v) => (
            <div
              key={v.id}
              data-testid="dashboard-item"
              className="flex gap-3 rounded-md border border-slate-200 p-3"
            >
              <CompanyLogo company={undefined} className="h-12 w-12" />
              <div>
                <Link
                  href={`/jobs/${v.id}`}
                  className="text-sm font-semibold hover:underline"
                >
                  {v.title}
                </Link>
                <div className="mt-1 flex flex-wrap gap-x-4 text-[11px] text-slate-600">
                  <span className="flex items-center gap-1">
                    <Upload size={11} />
                    Dibuat: {formatDate(v.created_at, "Asia/Jakarta")}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock size={11} />
                    Aktif hingga: {formatDate(v.active_until)}
                  </span>
                </div>
                <div className="mt-2 flex gap-2">
                  <Link
                    href={`/dashboard/${v.id}/edit`}
                    className="flex items-center gap-1 rounded bg-slate-100 px-3 py-1 text-[11px]"
                  >
                    <Pencil size={11} />
                    Edit
                  </Link>
                  <button
                    onClick={() =>
                      window.confirm("Hapus lowongan ini?") && del.mutate(v.id)
                    }
                    disabled={del.isPending}
                    className="flex items-center gap-1 rounded bg-red-100 px-3 py-1 text-[11px] text-red-600 disabled:opacity-60"
                  >
                    <Trash2 size={11} />
                    Hapus
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {data && (
          <Pagination
            page={data.meta.current_page}
            lastPage={data.meta.last_page}
            onChange={setPage}
          />
        )}
      </section>
    </div>
  );
}
