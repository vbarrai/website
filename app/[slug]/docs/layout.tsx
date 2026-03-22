"use client";

import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import { useState } from "react";
import { allDocs, projectMeta } from "./docs-data";

export default function DocsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const params = useParams();
  const pathname = usePathname();
  const slug = params.slug as string;
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  const docs = allDocs[slug];
  const meta = projectMeta[slug];

  if (!docs || !meta) return <>{children}</>;

  const currentSection =
    pathname.split("/").pop() === "docs"
      ? docs.sections[0]?.slug
      : pathname.split("/").pop();

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-black/60 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="relative w-8 h-8">
                <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-indigo-500 to-cyan-400 opacity-80 group-hover:opacity-100 transition-opacity" />
                <div className="absolute inset-[2px] rounded-[6px] bg-black flex items-center justify-center">
                  <span className="text-sm font-bold glow-text">V</span>
                </div>
              </div>
            </Link>
            <span className="text-zinc-600">/</span>
            <Link
              href={`/${slug}`}
              className={`font-semibold ${meta.accentText} hover:opacity-80 transition-opacity`}
            >
              {meta.name}
            </Link>
            <span className="text-zinc-600">/</span>
            <span className="text-zinc-400 text-sm">docs</span>
          </div>
          <a
            href={meta.repo}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm text-zinc-300 hover:bg-white/10 transition-all"
          >
            <svg
              className="w-4 h-4 flex-shrink-0"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
            </svg>
            <span className="hidden sm:inline">GitHub</span>
          </a>
        </div>
      </nav>

      <div className="pt-16 flex">
        {/* Desktop Sidebar */}
        <aside className="hidden lg:block w-64 shrink-0 border-r border-white/5 bg-black/20 fixed top-16 bottom-0 overflow-y-auto">
          <div className="p-6">
            <Link
              href={`/${slug}`}
              className="inline-flex items-center gap-2 text-sm text-zinc-500 hover:text-zinc-300 transition-colors mb-6"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              Retour au projet
            </Link>
            <h3
              className={`text-xs font-semibold uppercase tracking-wider ${meta.accentText} mb-4`}
            >
              Documentation
            </h3>
            <nav className="flex flex-col gap-1">
              {docs.sections.map((section) => (
                <Link
                  key={section.slug}
                  href={`/${slug}/docs/${section.slug}`}
                  className={`px-3 py-2 rounded-lg text-sm transition-all ${
                    currentSection === section.slug
                      ? `${meta.accentBg} ${meta.accentText} font-medium`
                      : "text-zinc-400 hover:text-zinc-200 hover:bg-white/5"
                  }`}
                >
                  {section.title}
                </Link>
              ))}
            </nav>
          </div>
        </aside>

        {/* Mobile dropdown */}
        <div className="lg:hidden fixed top-16 left-0 right-0 z-40 bg-black/80 backdrop-blur-xl border-b border-white/5">
          <button
            onClick={() => setMobileNavOpen(!mobileNavOpen)}
            className="w-full px-6 py-3 flex items-center justify-between text-sm"
          >
            <span className={meta.accentText}>
              {docs.sections.find((s) => s.slug === currentSection)?.title ??
                "Documentation"}
            </span>
            <svg
              className={`w-4 h-4 text-zinc-400 transition-transform ${mobileNavOpen ? "rotate-180" : ""}`}
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
          {mobileNavOpen && (
            <div className="px-6 pb-4 flex flex-col gap-1 border-t border-white/5">
              <Link
                href={`/${slug}`}
                onClick={() => setMobileNavOpen(false)}
                className="px-3 py-2 text-sm text-zinc-500 hover:text-zinc-300 transition-colors"
              >
                ← Retour au projet
              </Link>
              {docs.sections.map((section) => (
                <Link
                  key={section.slug}
                  href={`/${slug}/docs/${section.slug}`}
                  onClick={() => setMobileNavOpen(false)}
                  className={`px-3 py-2 rounded-lg text-sm transition-all ${
                    currentSection === section.slug
                      ? `${meta.accentBg} ${meta.accentText} font-medium`
                      : "text-zinc-400 hover:text-zinc-200 hover:bg-white/5"
                  }`}
                >
                  {section.title}
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Content */}
        <main className="flex-1 lg:ml-64 min-h-[calc(100vh-4rem)]">
          <div className="max-w-3xl mx-auto px-6 py-12 lg:py-16 mt-12 lg:mt-0">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
