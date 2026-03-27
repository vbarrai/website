"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import DocsProductSelector from "../../components/DocsProductSelector";

const sections = [
  { slug: "", label: "Introduction" },
  { slug: "concept", label: "Concept" },
  { slug: "installation", label: "Installation" },
  { slug: "utilisation", label: "Utilisation" },
  { slug: "configuration", label: "Configuration" },
  { slug: "architecture", label: "Architecture" },
  { slug: "contribuer", label: "Contribuer" },
];

function NavLink({
  href,
  label,
  active,
  onClick,
}: {
  href: string;
  label: string;
  active: boolean;
  onClick?: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={`block px-4 py-2 rounded-lg text-sm transition-all ${
        active
          ? "bg-cyan-500/10 text-cyan-400 border-l-2 border-cyan-500"
          : "text-zinc-400 hover:text-zinc-200 hover:bg-white/5"
      }`}
    >
      {label}
    </Link>
  );
}

export default function DocsNav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const currentSlug = pathname.replace("/parcai/docs", "").replace(/^\//, "");
  const currentLabel =
    sections.find((s) => s.slug === currentSlug)?.label ?? "Introduction";

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden lg:block w-64 flex-shrink-0">
        <div className="sticky top-24">
          <div className="mb-4 px-4">
            <DocsProductSelector />
          </div>
          <h3 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-4 px-4">
            Documentation
          </h3>
          <nav className="flex flex-col gap-1">
            {sections.map((s) => (
              <NavLink
                key={s.slug}
                href={
                  s.slug ? `/parcai/docs/${s.slug}` : "/parcai/docs"
                }
                label={s.label}
                active={currentSlug === s.slug}
              />
            ))}
          </nav>
        </div>
      </aside>

      {/* Mobile dropdown */}
      <div className="lg:hidden mb-8">
        <div className="mb-3">
          <DocsProductSelector />
        </div>
        <button
          onClick={() => setOpen(!open)}
          className="w-full flex items-center justify-between px-4 py-3 rounded-xl glass-card border border-white/10 text-sm text-zinc-200"
        >
          <span className="flex items-center gap-2">
            <svg
              className="w-4 h-4 text-cyan-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
            {currentLabel}
          </span>
          <svg
            className={`w-4 h-4 text-zinc-400 transition-transform ${open ? "rotate-180" : ""}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </button>
        {open && (
          <nav className="mt-2 flex flex-col gap-1 glass-card rounded-xl border border-white/10 p-2">
            {sections.map((s) => (
              <NavLink
                key={s.slug}
                href={
                  s.slug ? `/parcai/docs/${s.slug}` : "/parcai/docs"
                }
                label={s.label}
                active={currentSlug === s.slug}
                onClick={() => setOpen(false)}
              />
            ))}
          </nav>
        )}
      </div>
    </>
  );
}
