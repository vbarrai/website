"use client";

import { usePathname, useRouter } from "next/navigation";

const products = [
  { slug: "maconfai", label: "maconfai", color: "indigo" },
  { slug: "parcai", label: "parcai", color: "cyan" },
  { slug: "murmurai", label: "murmurai", color: "violet" },
] as const;

const colorMap = {
  indigo: "text-indigo-400 border-indigo-500/40 bg-indigo-500/5 focus:border-indigo-500/60",
  cyan: "text-cyan-400 border-cyan-500/40 bg-cyan-500/5 focus:border-cyan-500/60",
  violet: "text-violet-400 border-violet-500/40 bg-violet-500/5 focus:border-violet-500/60",
} as const;

export default function DocsProductSelector() {
  const pathname = usePathname();
  const router = useRouter();

  const current = products.find((p) => pathname.startsWith(`/${p.slug}/docs`));
  const currentSlug = current?.slug ?? products[0].slug;
  const currentColor = current?.color ?? "indigo";

  function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const value = e.target.value;
    if (value !== currentSlug) {
      router.push(`/${value}/docs`);
    }
  }

  return (
    <div className="relative">
      <select
        value={currentSlug}
        onChange={handleChange}
        className={`w-full appearance-none rounded-lg border px-3 py-2 pr-8 text-sm font-medium outline-none transition-colors cursor-pointer ${colorMap[currentColor]} bg-[length:0] [&>option]:bg-zinc-900 [&>option]:text-zinc-200`}
      >
        {products.map((p) => (
          <option key={p.slug} value={p.slug}>
            {p.label}
          </option>
        ))}
      </select>
      <svg
        className={`pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 ${current ? `text-${currentColor}-400` : "text-zinc-400"}`}
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M8 9l4-4 4 4m0 6l-4 4-4-4"
        />
      </svg>
    </div>
  );
}
