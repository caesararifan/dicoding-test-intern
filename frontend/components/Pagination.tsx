type Props = { page: number; lastPage: number; onChange: (page: number) => void };

export default function Pagination({ page, lastPage, onChange }: Props) {
  if (lastPage <= 1) return null;
  const btn = 'rounded-md border border-slate-200 px-3 py-1.5 disabled:opacity-40';
  return (
    <nav aria-label="Pagination" className="mt-6 flex items-center justify-center gap-3 text-xs">
      <button className={btn} disabled={page <= 1} onClick={() => onChange(page - 1)}>
        Sebelumnya
      </button>
      <span>
        Halaman {page} dari {lastPage}
      </span>
      <button className={btn} disabled={page >= lastPage} onClick={() => onChange(page + 1)}>
        Berikutnya
      </button>
    </nav>
  );
}