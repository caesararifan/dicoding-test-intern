"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search } from "lucide-react";
import JobCard from "./JobCard";
import Pagination from "./Pagination";
import { useVacancies } from "@/hooks/useVacancies";

function buildUrl(search: string, page: number) {
  const qs = new URLSearchParams();
  if (search) qs.set("search", search);
  if (page > 1) qs.set("page", String(page));
  const s = qs.toString();
  return s ? `/?${s}` : "/";
}

export default function JobList() {
  const router = useRouter();
  const params = useSearchParams();
  const search = params.get("search") ?? "";
  const page = Number(params.get("page") ?? 1) || 1;
  const [input, setInput] = useState(search);
  const { data, isLoading, isError, refetch } = useVacancies(search, page);

  // debounce: sinkronkan input ke URL
  useEffect(() => {
    if (input === search) return;
    const t = setTimeout(() => router.replace(buildUrl(input, 1)), 400);
    return () => clearTimeout(t);
  }, [input, search, router]);

  return (
    <section className="mx-auto max-w-2xl px-6 py-8">
      <div className="mb-4 flex items-center justify-between gap-4">
        <h2 className="text-lg font-semibold">
          {search ? "Hasil Pencarian" : "Daftar Pekerjaan Terbaru"}
        </h2>
        <div className="relative w-64">
          <Search
            size={14}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <input
            data-testid="search-input"
            type="search"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Pekerjaan apa yang sedang kamu cari?"
            aria-label="Cari lowongan"
            className="w-full rounded-md border border-slate-200 py-2 pl-9 pr-3 text-xs outline-none focus:border-slate-400"
          />
        </div>
      </div>

      {isLoading && (
        <div className="space-y-3" data-testid="loading">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="h-20 animate-pulse rounded-md bg-slate-100"
            />
          ))}
        </div>
      )}

      {isError && (
        <div className="rounded-md border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          Gagal memuat lowongan.{" "}
          <button className="underline" onClick={() => refetch()}>
            Coba lagi
          </button>
        </div>
      )}

      {data && data.data.length === 0 && (
        <p
          data-testid="empty-state"
          className="py-10 text-center text-sm text-slate-500"
        >
          {search
            ? `Tidak ada lowongan untuk "${search}".`
            : "Belum ada lowongan."}
        </p>
      )}

      {data && data.data.length > 0 && (
        <div className="space-y-3">
          {data.data.map((v) => (
            <JobCard key={v.id} vacancy={v} />
          ))}
        </div>
      )}

      {data && (
        <Pagination
          page={data.meta.current_page}
          lastPage={data.meta.last_page}
          onChange={(p) => router.push(buildUrl(search, p))}
        />
      )}
    </section>
  );
}
