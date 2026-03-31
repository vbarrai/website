import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Introduction — murmurai docs",
  description:
    "murmurai — transcription vocale push-to-talk et assistant AI pour macOS.",
};

const quickLinks = [
  {
    title: "Concept",
    description: "Comprendre le fonctionnement de murmurai",
    href: "/murmurai/docs/concept",
  },
  {
    title: "Installation",
    description: "Installer murmurai sur macOS",
    href: "/murmurai/docs/installation",
  },
  {
    title: "Utilisation",
    description: "Premiers pas et workflow push-to-talk",
    href: "/murmurai/docs/utilisation",
  },
  {
    title: "Configuration",
    description: "Modèles Whisper, touches et options",
    href: "/murmurai/docs/configuration",
  },
  {
    title: "Architecture",
    description: "Structure interne et modules Python",
    href: "/murmurai/docs/architecture",
  },
  {
    title: "Distribution",
    description: "Créer une app macOS standalone",
    href: "/murmurai/docs/distribution",
  },
];

export default function DocsIntroPage() {
  return (
    <article>
      {/* Header */}
      <div className="mb-12">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-violet-500/10 flex items-center justify-center">
            <span className="text-lg font-bold text-violet-400">M</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
            murmurai
          </h1>
        </div>
        <p className="text-lg text-violet-400 font-medium mb-4">
          Transcription vocale push-to-talk et assistant AI pour macOS
        </p>
        <p className="text-zinc-400 leading-relaxed max-w-2xl">
          murmurai utilise faster-whisper pour transcrire votre voix localement
          sur macOS. Mode Transcript : maintenez une touche, parlez, relâchez
          — le texte est collé au curseur. Mode Agent : envoyez votre voix +
          texte sélectionné à un modèle Ollama local pour un traitement AI.
          Fusion bilingue FR/EN avec dictionnaire de jargon technique. 100%
          hors-ligne, aucune clé API requise.
        </p>
      </div>

      {/* Quick start */}
      <section className="mb-12">
        <h2 className="text-xl font-bold mb-4">Démarrage rapide</h2>
        <div className="glass-card rounded-xl border border-violet-500/20 p-5">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-3 h-3 rounded-full bg-red-500/60" />
            <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
            <div className="w-3 h-3 rounded-full bg-green-500/60" />
            <span className="ml-2 text-xs text-zinc-600 font-mono">
              terminal
            </span>
          </div>
          <pre className="font-mono text-sm overflow-x-auto text-violet-400">
            <span className="text-zinc-500">$ </span>brew install --cask vbarrai/tap/murmurai{"\n"}
            {"\n"}
            <span className="text-zinc-600"># Ou via DMG depuis GitHub Releases</span>{"\n"}
            <span className="text-zinc-500">$ </span>open https://github.com/vbarrai/murmurai/releases
          </pre>
        </div>
        <p className="text-sm text-zinc-500 mt-3">
          Le modèle Whisper (~500 Mo pour &quot;small&quot;) se télécharge automatiquement
          au premier lancement.
        </p>
      </section>

      {/* Highlights */}
      <section className="mb-12">
        <h2 className="text-xl font-bold mb-4">Points clés</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            {
              icon: "🎙️",
              title: "Push-to-talk",
              desc: "Maintenez Option droite, parlez, relâchez pour transcrire.",
            },
            {
              icon: "🤖",
              title: "Mode Agent",
              desc: "Envoyez voix + texte sélectionné à un modèle Ollama local.",
            },
            {
              icon: "🌐",
              title: "Bilingue FR/EN",
              desc: "Fusion locale avec dictionnaire de ~100 termes techniques.",
            },
            {
              icon: "📦",
              title: "Installation simple",
              desc: "Via Homebrew, DMG depuis GitHub Releases, ou pip install pour les devs.",
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
              className="glass-card rounded-xl border border-white/5 p-5 group hover:border-violet-500/20"
            >
              <h3 className="font-semibold text-zinc-200 group-hover:text-violet-400 transition-colors mb-1">
                {link.title}
              </h3>
              <p className="text-sm text-zinc-500">{link.description}</p>
              <span className="inline-flex items-center gap-1 mt-3 text-xs text-violet-400 opacity-0 group-hover:opacity-100 transition-opacity">
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
