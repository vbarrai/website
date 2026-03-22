import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Introduction — parcai docs",
  description:
    "parcai — isolation shell légère pour agents AI, sans VM ni Docker.",
};

const quickLinks = [
  {
    title: "Concept",
    description: "Comprendre le fonctionnement de parcai",
    href: "/parcai/docs/concept",
  },
  {
    title: "Installation",
    description: "Installer parcai sur votre machine",
    href: "/parcai/docs/installation",
  },
  {
    title: "Utilisation",
    description: "Premiers pas et workflow de sandbox",
    href: "/parcai/docs/utilisation",
  },
  {
    title: "Configuration",
    description: "Options réseau, chemins et application",
    href: "/parcai/docs/configuration",
  },
  {
    title: "Architecture",
    description: "Structure interne et primitives OS",
    href: "/parcai/docs/architecture",
  },
  {
    title: "Contribuer",
    description: "Participer au développement de parcai",
    href: "/parcai/docs/contribuer",
  },
];

export default function DocsIntroPage() {
  return (
    <article>
      {/* Header */}
      <div className="mb-12">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/10 flex items-center justify-center">
            <span className="text-lg font-bold text-cyan-400">P</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
            parcai
          </h1>
        </div>
        <p className="text-lg text-cyan-400 font-medium mb-4">
          Isolation shell légère pour agents AI
        </p>
        <p className="text-zinc-400 leading-relaxed max-w-2xl">
          parcai confine un agent AI au répertoire du projet courant. Le système
          de fichiers est restreint, les secrets sont inaccessibles. Il utilise
          les primitives natives de l&apos;OS (namespaces Linux, sandbox-exec
          macOS) — pas de VM ni Docker, overhead quasi nul, démarrage instantané.
        </p>
      </div>

      {/* Quick start */}
      <section className="mb-12">
        <h2 className="text-xl font-bold mb-4">Démarrage rapide</h2>
        <div className="glass-card rounded-xl border border-cyan-500/20 p-5">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-3 h-3 rounded-full bg-red-500/60" />
            <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
            <div className="w-3 h-3 rounded-full bg-green-500/60" />
            <span className="ml-2 text-xs text-zinc-600 font-mono">
              terminal
            </span>
          </div>
          <pre className="font-mono text-sm overflow-x-auto text-cyan-400">
            <span className="text-zinc-500">$ </span>cd my-project{"\n"}
            <span className="text-zinc-500">$ </span>parcai
          </pre>
        </div>
        <p className="text-sm text-zinc-500 mt-3">
          Un clone copy-on-write du projet est créé instantanément.
          L&apos;agent travaille sur la copie, jamais sur l&apos;original.
        </p>
      </section>

      {/* Highlights */}
      <section className="mb-12">
        <h2 className="text-xl font-bold mb-4">Points clés</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            {
              icon: "🔒",
              title: "Isolation native",
              desc: "Clone APFS + sandbox-exec sur macOS, overlayfs + unshare sur Linux.",
            },
            {
              icon: "⚡",
              title: "Overhead quasi nul",
              desc: "Démarrage instantané, pas de couche de virtualisation.",
            },
            {
              icon: "🌐",
              title: "Réseau contrôlé",
              desc: "Réseau activé par défaut pour les APIs AI, désactivable avec --no-network.",
            },
            {
              icon: "✅",
              title: "Confirmation avant application",
              desc: "Résumé des changements et confirmation avant de les appliquer au projet.",
            },
          ].map((item) => (
            <div
              key={item.title}
              className="glass-card rounded-xl border border-white/5 p-5"
            >
              <div className="text-2xl mb-2">{item.icon}</div>
              <h3 className="font-semibold text-zinc-200 mb-1">{item.title}</h3>
              <p className="text-sm text-zinc-500">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Quick links */}
      <section>
        <h2 className="text-xl font-bold mb-4">Explorer la documentation</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {quickLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="glass-card rounded-xl border border-white/5 p-5 group hover:border-cyan-500/20"
            >
              <h3 className="font-semibold text-zinc-200 group-hover:text-cyan-400 transition-colors mb-1">
                {link.title}
              </h3>
              <p className="text-sm text-zinc-500">{link.description}</p>
              <span className="inline-flex items-center gap-1 mt-3 text-xs text-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity">
                Lire
                <svg
                  className="w-3 h-3"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </span>
            </Link>
          ))}
        </div>
      </section>
    </article>
  );
}
