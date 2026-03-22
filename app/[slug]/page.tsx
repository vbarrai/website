import { notFound } from "next/navigation";
import Link from "next/link";

const projects: Record<
  string,
  {
    name: string;
    tagline: string;
    description: string;
    features: string[];
    install: string;
    usage: string;
    repo: string;
    color: string;
    accentBg: string;
    accentText: string;
    accentBorder: string;
    gradientFrom: string;
    gradientTo: string;
  }
> = {
  maconfai: {
    name: "maconfai",
    tagline: "Gestionnaire de skills minimal pour Claude Code, Cursor et Codex",
    description:
      "maconfai permet d'installer, mettre à jour et désinstaller des skills d'agents AI depuis des repositories GitHub ou des répertoires locaux. Il découvre les skills via des fichiers SKILL.md et les stocke de manière centralisée avec des symlinks par agent.",
    features: [
      "Installation de skills depuis GitHub ou un répertoire local",
      "Interface de sélection interactive des skills à installer",
      "Support multi-agents : Claude Code, Cursor, Codex",
      "Support de branches et sous-chemins GitHub",
    ],
    install: "npx maconfai install owner/repo",
    usage: `# Installer des skills depuis GitHub
maconfai install owner/repo

# Installer sans prompts interactifs
maconfai install owner/repo -y

# Spécifier une branche
maconfai install owner/repo#develop

# Vérifier les mises à jour
maconfai check`,
    repo: "https://github.com/vbarrai/maconfai",
    color: "border-indigo-500/30",
    accentBg: "bg-indigo-500/10",
    accentText: "text-indigo-400",
    accentBorder: "border-indigo-500/20",
    gradientFrom: "from-indigo-500",
    gradientTo: "to-violet-500",
  },
  parcai: {
    name: "parcai",
    tagline: "Isolation shell légère pour agents AI",
    description:
      "parcai confine un agent AI au répertoire du projet courant. Le système de fichiers est restreint, les secrets sont inaccessibles. Utilise les primitives natives de l'OS (namespaces Linux, sandbox-exec macOS) — pas de VM ni Docker, overhead quasi nul, démarrage instantané.",
    features: [
      "Confinement au répertoire projet sans VM ni Docker",
      "Protection contre l'accès aux secrets et fichiers hors projet",
      "Réseau activé par défaut (APIs AI), désactivable avec --no-network",
      "Résumé des changements et confirmation avant application",
    ],
    install: "cd my-project && parcai",
    usage: `# Entrer dans le sandbox
parcai

# Désactiver le réseau
parcai --no-network

# Autoriser des chemins supplémentaires
parcai --allow /path/to/dir

# Appliquer les changements automatiquement à la sortie
parcai --apply`,
    repo: "https://github.com/vbarrai/parcai",
    color: "border-cyan-500/30",
    accentBg: "bg-cyan-500/10",
    accentText: "text-cyan-400",
    accentBorder: "border-cyan-500/20",
    gradientFrom: "from-cyan-500",
    gradientTo: "to-blue-500",
  },
  murmurai: {
    name: "murmurai",
    tagline: "Transcription vocale push-to-talk pour macOS",
    description:
      "murmurai utilise faster-whisper pour transcrire votre voix localement sur macOS. Maintenez une touche (Option droite par défaut), parlez, relâchez — le texte est transcrit hors-ligne et collé automatiquement à la position du curseur. Aucune clé API requise.",
    features: [
      "Transcription hors-ligne via faster-whisper, sans clé API",
      "Transcription en streaming pendant que vous parlez",
      "Collage automatique du texte à la position du curseur",
      "Modèles Whisper configurables (tiny à large-v3)",
    ],
    install: "git clone https://github.com/vbarrai/murmurai && cd murmurai && pip install -e .",
    usage: `# Activer l'environnement et lancer
source .venv/bin/activate
murmurai

# Maintenir Option droite pour enregistrer et transcrire

# Installer en tant qu'application standalone
pip install -e ".[build]"
make install`,
    repo: "https://github.com/vbarrai/murmurai",
    color: "border-violet-500/30",
    accentBg: "bg-violet-500/10",
    accentText: "text-violet-400",
    accentBorder: "border-violet-500/20",
    gradientFrom: "from-violet-500",
    gradientTo: "to-purple-500",
  },
};

export async function generateStaticParams() {
  return Object.keys(projects).map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = projects[slug];
  if (!project) return { title: "Projet introuvable" };
  return {
    title: `${project.name} — vbarrai`,
    description: project.tagline,
  };
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = projects[slug];

  if (!project) notFound();

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)] overflow-x-hidden">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-black/60 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative w-8 h-8">
              <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-indigo-500 to-cyan-400 opacity-80 group-hover:opacity-100 transition-opacity" />
              <div className="absolute inset-[2px] rounded-[6px] bg-black flex items-center justify-center">
                <span className="text-sm font-bold glow-text">V</span>
              </div>
            </div>
            <span className="font-semibold text-zinc-200 text-lg tracking-tight">
              vbarrai
            </span>
          </Link>
          <a
            href={project.repo}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm text-zinc-300 hover:bg-white/10 transition-all"
          >
            <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
            </svg>
            <span className="hidden sm:inline">Voir sur GitHub</span>
            <span className="sm:hidden">GitHub</span>
          </a>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative pt-32 pb-20 px-6">
        {/* Gradient blob */}
        <div
          className={`absolute top-20 left-1/2 -translate-x-1/2 w-full max-w-[600px] h-[300px] bg-gradient-to-r ${project.gradientFrom} ${project.gradientTo} opacity-10 blur-[120px] rounded-full pointer-events-none`}
        />

        <div className="max-w-4xl mx-auto relative">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-zinc-500 hover:text-zinc-300 transition-colors mb-8"
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
            Retour à l&apos;accueil
          </Link>

          <div className="flex items-center gap-4 mb-6">
            <div
              className={`w-14 h-14 rounded-xl ${project.accentBg} flex items-center justify-center`}
            >
              <span className={`text-2xl font-bold ${project.accentText}`}>
                {project.name[0].toUpperCase()}
              </span>
            </div>
            <div>
              <h1 className="text-3xl sm:text-5xl font-bold tracking-tight">
                {project.name}
              </h1>
              <p className={`text-lg ${project.accentText} mt-1`}>
                {project.tagline}
              </p>
            </div>
          </div>

          <p className="text-lg text-zinc-400 leading-relaxed max-w-3xl">
            {project.description}
          </p>
        </div>
      </section>

      {/* Installation */}
      <section className="px-6 pb-16">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold mb-6">Installation</h2>
          <div
            className={`glass-card rounded-xl border ${project.accentBorder} p-5`}
          >
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
                <span className="text-zinc-500">$ </span>
                <span className={project.accentText}>{project.install}</span>
              </code>
            </pre>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="px-6 pb-16">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold mb-6">Fonctionnalités</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {project.features.map((feature) => (
              <div
                key={feature}
                className={`glass-card rounded-xl border ${project.accentBorder} p-5 flex items-start gap-3`}
              >
                <svg
                  className={`w-5 h-5 mt-0.5 flex-shrink-0 ${project.accentText}`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <span className="text-sm text-zinc-300">{feature}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Usage */}
      <section className="px-6 pb-20">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold mb-6">Utilisation</h2>
          <div
            className={`glass-card rounded-xl border ${project.accentBorder} p-5`}
          >
            <div className="flex items-center gap-2 mb-3">
              <div className="w-3 h-3 rounded-full bg-red-500/60" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
              <div className="w-3 h-3 rounded-full bg-green-500/60" />
              <span className="ml-2 text-xs text-zinc-600 font-mono">
                terminal
              </span>
            </div>
            <pre className="font-mono text-sm text-zinc-300 whitespace-pre-wrap leading-relaxed overflow-x-auto break-words">
              {project.usage.split("\n").map((line, i) => (
                <span key={i} className="block">
                  {line.startsWith("#") ? (
                    <span className="text-zinc-600">{line}</span>
                  ) : line.trim() ? (
                    <>
                      <span className="text-zinc-500">$ </span>
                      <span className={project.accentText}>
                        {line.replace(/^maconfai|^parcai|^murmurai/, (m) => m)}
                      </span>
                    </>
                  ) : null}
                </span>
              ))}
            </pre>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 pb-32">
        <div className="max-w-4xl mx-auto text-center">
          <a
            href={project.repo}
            target="_blank"
            rel="noopener noreferrer"
            className={`inline-flex items-center gap-3 px-6 sm:px-8 py-4 rounded-full bg-gradient-to-r ${project.gradientFrom} ${project.gradientTo} text-white font-semibold text-base sm:text-lg hover:opacity-90 transition-opacity`}
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
            </svg>
            Découvrir sur GitHub
          </a>
        </div>
      </section>
    </div>
  );
}
