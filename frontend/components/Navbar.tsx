"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();
  const links = [
    {
      href: "/",
      label: "Lowongan Kerja",
      active: pathname === "/" || pathname.startsWith("/jobs"),
    },
    {
      href: "/dashboard",
      label: "Dashboard",
      active: pathname.startsWith("/dashboard"),
    },
  ];

  return (
    <nav className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex h-14 max-w-5xl items-center gap-8 px-6">
        <Link href="/" className="flex items-center gap-1 font-semibold">
          <span className="grid h-6 w-6 place-items-center rounded bg-slate-800 text-sm font-bold text-white">
            g
          </span>
          Jobs
        </Link>
        {links.map((l) => (
          <Link
            key={l.href}
            href={l.href}
            className={`flex h-full items-center border-b-2 text-xs ${
              l.active
                ? "border-slate-900 font-medium"
                : "border-transparent text-slate-600"
            }`}
          >
            {l.label}
          </Link>
        ))}
      </div>
    </nav>
  );
}
