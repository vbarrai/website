import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Introduction — maconfai docs",
  description:
    "maconfai est un gestionnaire de skills minimal pour Claude Code, Cursor et Codex.",
};

const quickLinks = [
  {
    title: "Concept",
    description: "Comprendre le fonctionnement de maconfai",
    href: "/maconfai/docs/concept",
  },
  {
    title: "Installation",
    description: "Démarrer en une commande",
    href: "/maconfai/docs/installation",
  },
  {
    title: "Utilisation",
    description: "Installer, mettre à jour et gérer vos skills",
    href: "/maconfai/docs/utilisation",
  },
  {
    title: "Commandes CLI",
    description: "Référence complète des commandes",
    href: "/maconfai/docs/commandes",
  },
  {
    title: "Migration",
    description: "Migrer de Cursor vers Claude Code",
    href: "/maconfai/docs/migration",
  },
  {
    title: "Agents supportés",
    description: "Claude Code, Cursor, Codex et plus",
    href: "/maconfai/docs/agents",
  },
];

export default function DocsIntroPage() {
  return (
    <article>
      {/* Header */}
      <div className="mb-12">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center">
            <span className="text-lg font-bold text-indigo-400">M</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
            maconfai
          </h1>
        </div>
        <p className="text-lg text-indigo-400 font-medium mb-4">
          Gestionnaire de skills minimal pour Claude Code, Cursor et Codex
        </p>
        <p className="text-zinc-400 leading-relaxed max-w-2xl">
          maconfai est un outil en ligne de commande qui permet d&apos;installer,
          mettre à jour et désinstaller des skills d&apos;agents AI depuis des
          repositories GitHub ou des répertoires locaux. Il utilise une source de
          vérité unique et gère la distribution vers chaque agent via des
          symlinks.
        </p>
      </div>

      {/* Quick start */}
      <section className="mb-12">
        <h2 className="text-xl font-bold mb-4">Démarrage rapide</h2>
        <div className="glass-card rounded-xl border border-indigo-500/20 p-5">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-3 h-3 rounded-full bg-red-500/60" />
            <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
            <div className="w-3 h-3 rounded-full bg-green-500/60" />
            <span className="ml-2 text-xs text-zinc-600 font-mono">
              terminal
            </span>
          </div>
          <pre className="font-mono text-sm overflow-x-auto">
            <code>
              <span className="text-zinc-500 select-none">$ </span>
              <span className="text-indigo-400">
                npx maconfai install owner/repo
              </span>
            </code>
          </pre>
        </div>
        <p className="text-sm text-zinc-500 mt-3">
          Aucune installation globale requise. Cette commande télécharge le
          repository, détecte les skills disponibles et les installe
          interactivement pour vos agents AI.
        </p>
      </section>

      {/* Highlights */}
      <section className="mb-12">
        <h2 className="text-xl font-bold mb-4">Points clés</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            {
              icon: "⚡",
              title: "Zéro configuration",
              desc: "Fonctionne directement avec npx, sans installation préalable.",
            },
            {
              icon: "🔗",
              title: "Source unique",
              desc: "Stockage centralisé dans .agents/skills/ avec symlinks par agent.",
            },
            {
              icon: "🤖",
              title: "Multi-agents",
              desc: "Support natif de Claude Code, Cursor, Codex, Gemini CLI et Amp Code.",
            },
            {
              icon: "🔄",
              title: "Sans vendor lock-in",
              desc: "Changez d'agent librement — migrez skills, MCP et hooks en une commande.",
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
              className="glass-card rounded-xl border border-white/5 p-5 group hover:border-indigo-500/20"
            >
              <h3 className="font-semibold text-zinc-200 group-hover:text-indigo-400 transition-colors mb-1">
                {link.title}
              </h3>
              <p className="text-sm text-zinc-500">{link.description}</p>
              <span className="inline-flex items-center gap-1 mt-3 text-xs text-indigo-400 opacity-0 group-hover:opacity-100 transition-opacity">
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
