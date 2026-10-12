export default function Hero({ eyebrow, title, subtitle }: { eyebrow?: string; title: string; subtitle?: string }) {
  return (
    <section className="bg-[#1c1c1e] text-white">
      <div className="mx-auto max-w-3xl px-6 py-12">
        {eyebrow && <p className="mb-2 text-sm font-medium text-blue-500">{eyebrow}</p>}
        <h1 className="max-w-md text-3xl font-semibold leading-tight">{title}</h1>
        {subtitle && <p className="mt-3 max-w-sm text-xs leading-relaxed text-slate-300">{subtitle}</p>}
      </div>
    </section>
  );
}