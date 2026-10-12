import type { Company } from '@/lib/types';

export default function CompanyLogo({ company, className = 'h-16 w-16' }: { company?: Company; className?: string }) {
  if (company?.logo_url) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={company.logo_url} alt={company.name} className={`${className} shrink-0 rounded object-cover`} />;
  }
  return (
    <div className={`${className} grid shrink-0 place-items-center rounded bg-[#2B3A4E] text-lg font-bold text-white`} aria-hidden>
      g
    </div>
  );
}