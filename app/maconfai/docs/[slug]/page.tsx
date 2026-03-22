import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";

/* ── Documentation content ────────────────────────────────────────── */

interface DocSection {
  title: string;
  description: string;
  content: { heading: string; body: string; code?: string }[];
  prev?: { slug: string; label: string };
  next?: { slug: string; label: string };
}

const docs: Record<string, DocSection> = {
  concept: {
    title: "Concept",
    description: "Comprendre le fonctionnement de maconfai et sa philosophie.",
    content: [
      {
        heading: "Le problème",
        body: `Les agents AI comme Claude Code, Cursor et Codex utilisent des fichiers d'instructions (souvent appelés "skills") pour personnaliser leur comportement. Chaque agent stocke ces fichiers dans un répertoire différent :

• Claude Code → .claude/skills/
• Cursor → .cursor/skills/
• Codex → .codex/skills/

Maintenir manuellement des copies identiques de skills dans chacun de ces répertoires est fastidieux, source d'erreurs et difficile à mettre à jour.`,
      },
      {
        heading: "La solution maconfai",
        body: `maconfai résout ce problème en introduisant une source de vérité unique. Les skills sont stockés dans un répertoire canonique (.agents/skills/) et des symlinks sont créés vers les répertoires de chaque agent.

Cela signifie qu'un seul fichier physique alimente tous vos agents. Mettre à jour une skill met automatiquement à jour tous les agents qui l'utilisent.`,
      },
      {
        heading: "Le flux en 3 étapes",
        body: `maconfai fonctionne en trois phases distinctes :

1. Découverte — Le repository source est cloné (ou lu localement) et maconfai recherche tous les fichiers SKILL.md dans les répertoires skills/. Chaque fichier SKILL.md définit une skill avec ses métadonnées.

2. Sélection — Une interface interactive permet de choisir quelles skills installer et pour quels agents. Les skills déjà installées sont pré-cochées.

3. Installation — Les fichiers sont copiés vers .agents/skills/ et des symlinks sont créés dans les répertoires de chaque agent sélectionné.`,
      },
      {
        heading: "Le fichier SKILL.md",
        body: `Chaque skill est définie par un fichier SKILL.md placé dans un sous-répertoire de skills/. Ce fichier contient les instructions que l'agent AI suivra. maconfai utilise ce fichier comme point de découverte : tout répertoire contenant un SKILL.md est considéré comme une skill installable.`,
        code: `skills/
├── ma-skill-1/
│   └── SKILL.md
├── ma-skill-2/
│   ├── SKILL.md
│   └── data.json
└── ma-skill-3/
    └── SKILL.md`,
      },
      {
        heading: "Types de configuration",
        body: `Au-delà des skills (SKILL.md), maconfai gère également :

• Serveurs MCP — Définis dans des fichiers mcp.json, fusionnés dans la configuration spécifique de chaque agent.
• Hooks — Définis dans des fichiers hooks.json pour les gestionnaires d'événements spécifiques à chaque agent.

Ces trois types de configuration (skills, MCP, hooks) sont traités uniformément par le système d'installation.`,
      },
    ],
    prev: { slug: "", label: "Introduction" },
    next: { slug: "installation", label: "Installation" },
  },

  installation: {
    title: "Installation",
    description: "Comment installer et configurer maconfai.",
    content: [
      {
        heading: "Prérequis",
        body: `maconfai nécessite :
• Node.js 18 ou supérieur
• npm ou pnpm
• Un ou plusieurs agents AI installés (Claude Code, Cursor ou Codex)`,
      },
      {
        heading: "Utilisation directe avec npx",
        body: "La façon la plus simple d'utiliser maconfai est via npx. Aucune installation globale n'est nécessaire — la dernière version est téléchargée automatiquement à chaque exécution.",
        code: `npx maconfai install owner/repo`,
      },
      {
        heading: "Installation globale",
        body: "Pour un usage fréquent, vous pouvez installer maconfai globalement via npm. Cela rend la commande maconfai disponible partout dans votre terminal.",
        code: `npm i -g maconfai`,
      },
      {
        heading: "Vérifier l'installation",
        body: "Après l'installation globale, vérifiez que maconfai est accessible :",
        code: `maconfai --version`,
      },
      {
        heading: "Détection automatique des agents",
        body: `Lors de l'exécution, maconfai détecte automatiquement quels agents AI sont installés sur votre machine en vérifiant l'existence de leurs répertoires de configuration :

• Claude Code → vérifie .claude/
• Cursor → vérifie .cursor/
• Codex → vérifie .codex/
• Gemini CLI → vérifie .gemini/
• Amp Code → vérifie .amp/

Seuls les agents détectés sont proposés lors de la sélection interactive.`,
      },
    ],
    prev: { slug: "concept", label: "Concept" },
    next: { slug: "utilisation", label: "Utilisation" },
  },

  utilisation: {
    title: "Utilisation",
    description: "Guide pratique pour installer, mettre à jour et gérer vos skills.",
    content: [
      {
        heading: "Installer des skills depuis GitHub",
        body: "La commande principale permet d'installer des skills depuis un repository GitHub. maconfai clone le repository, découvre les skills et lance l'interface de sélection.",
        code: `maconfai install owner/repo`,
      },
      {
        heading: "Spécifier une branche",
        body: "Vous pouvez cibler une branche spécifique avec la syntaxe # :",
        code: `maconfai install owner/repo#develop
maconfai install owner/repo#feature/ma-branche`,
      },
      {
        heading: "Installer depuis un sous-chemin",
        body: "Pour les monorepos, vous pouvez spécifier un sous-chemin dans l'URL GitHub :",
        code: `maconfai install https://github.com/owner/repo/tree/main/packages/skills`,
      },
      {
        heading: "Installer depuis un répertoire local",
        body: "maconfai supporte également l'installation depuis un répertoire local. C'est utile pour développer et tester vos propres skills.",
        code: `maconfai install ./mon-repertoire-de-skills
maconfai install /chemin/absolu/vers/skills`,
      },
      {
        heading: "Mode non-interactif",
        body: "Le flag -y installe toutes les skills découvertes pour tous les agents détectés, sans demander confirmation. Idéal pour les scripts CI/CD.",
        code: `maconfai install owner/repo -y`,
      },
      {
        heading: "Désinstaller des skills",
        body: "Lancez maconfai install sans argument pour accéder au mode de gestion interactif. Vous pouvez alors désélectionner des skills pour les désinstaller.",
        code: `maconfai install`,
      },
      {
        heading: "Vérifier les mises à jour",
        body: "La commande check compare les skills installées avec les versions disponibles sur les repositories sources et propose la mise à jour si des changements sont détectés.",
        code: `maconfai check`,
      },
    ],
    prev: { slug: "installation", label: "Installation" },
    next: { slug: "commandes", label: "Commandes CLI" },
  },

  commandes: {
    title: "Commandes CLI",
    description: "Référence complète de toutes les commandes et options disponibles.",
    content: [
      {
        heading: "maconfai install <source>",
        body: `Installe des skills depuis une source GitHub ou locale.

Arguments :
• owner/repo — Repository GitHub (ex: vbarrai/skills)
• owner/repo#branche — Repository avec branche spécifique
• URL GitHub complète — Avec support des sous-chemins
• ./chemin/local — Répertoire local

Options :
• -y, --yes — Mode non-interactif, installe tout sans confirmation
• --branch=<branche> — Spécifie la branche à utiliser`,
        code: `# Exemples
maconfai install vbarrai/skills
maconfai install vbarrai/skills#develop
maconfai install vbarrai/skills -y
maconfai install ./local/path`,
      },
      {
        heading: "maconfai install (sans argument)",
        body: "Lance le mode de gestion interactif. Affiche toutes les skills installées et permet de les désinstaller en les désélectionnant.",
        code: `maconfai install`,
      },
      {
        heading: "maconfai check",
        body: "Vérifie si des mises à jour sont disponibles pour les skills installées. Compare les versions locales avec les sources d'origine et propose l'installation des changements.",
        code: `maconfai check`,
      },
      {
        heading: "maconfai --version",
        body: "Affiche la version actuelle de maconfai.",
        code: `maconfai --version`,
      },
      {
        heading: "maconfai --help",
        body: "Affiche l'aide et la liste des commandes disponibles.",
        code: `maconfai --help`,
      },
    ],
    prev: { slug: "utilisation", label: "Utilisation" },
    next: { slug: "agents", label: "Agents supportés" },
  },

  agents: {
    title: "Agents supportés",
    description:
      "Détail des agents AI compatibles et de leurs particularités.",
    content: [
      {
        heading: "Vue d'ensemble",
        body: `maconfai supporte actuellement cinq agents AI. Le niveau de support varie selon les capacités de chaque agent :

| Agent        | Skills | MCP Servers | Hooks |
|-------------|--------|-------------|-------|
| Claude Code | ✅     | ✅          | ✅    |
| Cursor      | ✅     | ✅          | ✅    |
| Codex       | ✅     | ❌          | ❌    |
| Gemini CLI  | ✅     | ❌          | ❌    |
| Amp Code    | ✅     | ❌          | ❌    |`,
      },
      {
        heading: "Claude Code",
        body: `Claude Code est l'agent le plus complet. maconfai gère pour lui :

• Skills — Fichiers SKILL.md installés dans .claude/skills/
• Serveurs MCP — Configuration fusionnée dans les settings de Claude Code
• Hooks — Gestionnaires d'événements via hooks.json

Le fichier d'instructions principal est .claude/CLAUDE.md.`,
        code: `.claude/
└── skills/
    ├── ma-skill/ → ../../.agents/skills/ma-skill/
    └── autre-skill/ → ../../.agents/skills/autre-skill/`,
      },
      {
        heading: "Cursor",
        body: `Cursor bénéficie du même niveau de support que Claude Code :

• Skills — Installées dans .cursor/skills/
• Serveurs MCP — Intégrés dans la configuration Cursor
• Hooks — Support des gestionnaires d'événements

Le fichier d'instructions est .cursor/rules/.cursorrules.`,
        code: `.cursor/
└── skills/
    ├── ma-skill/ → ../../.agents/skills/ma-skill/
    └── autre-skill/ → ../../.agents/skills/autre-skill/`,
      },
      {
        heading: "Codex",
        body: `Codex (OpenAI) supporte les skills mais pas les serveurs MCP ni les hooks :

• Skills — Installées dans .codex/skills/
• Le fichier d'instructions est AGENTS.md à la racine du projet.`,
        code: `.codex/
└── skills/
    ├── ma-skill/ → ../../.agents/skills/ma-skill/
    └── autre-skill/ → ../../.agents/skills/autre-skill/`,
      },
      {
        heading: "Gemini CLI",
        body: `Gemini CLI de Google supporte les skills via le répertoire .gemini/ :

• Skills — Installées dans .gemini/skills/
• Le fichier d'instructions est .gemini/GEMINI.md.
• Les conventions de nommage varient par rapport aux autres agents.`,
      },
      {
        heading: "Amp Code",
        body: `Amp Code supporte les skills de base :

• Skills — Installées dans .amp/skills/
• Support limité aux fichiers d'instructions.
• Configuration spécifique avec des formats propres à la plateforme.`,
      },
    ],
    prev: { slug: "commandes", label: "Commandes CLI" },
    next: { slug: "architecture", label: "Architecture" },
  },

  architecture: {
    title: "Architecture",
    description: "Structure interne du projet et organisation des fichiers.",
    content: [
      {
        heading: "Stack technique",
        body: `maconfai est construit avec :

• TypeScript — 98.8% du code source, modules ESM
• Node.js 18+ — Runtime minimum requis
• pnpm — Gestionnaire de paquets
• Vitest — Framework de tests (73% de couverture)
• oxlint — Linter
• Prettier — Formateur de code
• obuild — Outil de build`,
      },
      {
        heading: "Structure du projet",
        body: "Le projet suit une structure claire et modulaire :",
        code: `maconfai/
├── src/             # Code source TypeScript
├── tests/           # Tests unitaires et d'intégration
├── bin/
│   └── cli.mjs      # Point d'entrée CLI
├── docs/
│   └── agents-config/  # Documentation des configurations agents
├── examples/        # Exemples d'utilisation
├── __mocks__/       # Mocks pour les tests
├── .claude/skills/  # Skills du projet lui-même
├── build.config.mjs # Configuration de build
├── tsconfig.json    # Configuration TypeScript
├── vitest.config.ts # Configuration des tests
├── knip.json        # Détection de code inutilisé
└── package.json     # Métadonnées et scripts`,
      },
      {
        heading: "Stockage des skills",
        body: `L'architecture de stockage repose sur un répertoire canonique avec des symlinks :

1. Le répertoire .agents/skills/ contient les fichiers réels de chaque skill installée.
2. Chaque agent reçoit un symlink dans son répertoire skills/ pointant vers le fichier canonique.
3. Cela garantit qu'une seule copie existe et que tous les agents utilisent la même version.`,
        code: `projet/
├── .agents/
│   └── skills/
│       ├── skill-a/
│       │   └── SKILL.md        # ← fichier réel
│       └── skill-b/
│           └── SKILL.md        # ← fichier réel
├── .claude/skills/
│   ├── skill-a/ → ../../.agents/skills/skill-a/   # symlink
│   └── skill-b/ → ../../.agents/skills/skill-b/   # symlink
├── .cursor/skills/
│   ├── skill-a/ → ../../.agents/skills/skill-a/   # symlink
│   └── skill-b/ → ../../.agents/skills/skill-b/   # symlink
└── .codex/skills/
    └── skill-a/ → ../../.agents/skills/skill-a/    # symlink`,
      },
      {
        heading: "Approche de tests",
        body: `Les tests suivent des conventions strictes :

• Un test focalisé par fichier (30-100 lignes)
• Utilisation d'inline snapshots plutôt que d'assertions manuelles
• La suite de tests reflète la structure des fonctionnalités
• Chaque test reçoit un répertoire temporaire isolé
• Le CLI est exécuté comme sous-processus pour les tests d'intégration`,
      },
      {
        heading: "Build et distribution",
        body: `Le projet est distribué via npm :

• Taille du build : ~91.4 kB (minifié + gzip)
• Format : ESM (ECMAScript Modules)
• Point d'entrée : bin/cli.mjs
• Licence : MIT`,
      },
    ],
    prev: { slug: "agents", label: "Agents supportés" },
    next: { slug: "contribuer", label: "Contribuer" },
  },

  contribuer: {
    title: "Contribuer",
    description: "Comment contribuer au développement de maconfai.",
    content: [
      {
        heading: "Mise en place de l'environnement",
        body: "Pour contribuer à maconfai, commencez par cloner le repository et installer les dépendances :",
        code: `git clone https://github.com/vbarrai/maconfai
cd maconfai
pnpm install`,
      },
      {
        heading: "Commandes de développement",
        body: "Le projet utilise pnpm comme gestionnaire de paquets. Voici les commandes principales :",
        code: `# Lancer le CLI en mode développement
pnpm run dev

# Lancer les tests en mode watch
pnpm test

# Exécuter les tests une seule fois
npx vitest run

# Vérification TypeScript
pnpm typecheck

# Linter
pnpm lint

# Détection de code inutilisé
pnpm knip

# Formatage du code
pnpm format`,
      },
      {
        heading: "Conventions de code",
        body: `Le projet suit ces conventions :

• TypeScript strict avec modules ESM
• Formatage via Prettier (exécuté automatiquement)
• Linting via oxlint
• Tests avec Vitest — un test par fichier, inline snapshots privilégiés
• Couverture actuelle : 73%`,
      },
      {
        heading: "Créer une skill",
        body: `Pour créer une nouvelle skill distribuable via maconfai :

1. Créez un répertoire skills/ dans votre repository
2. Ajoutez un sous-répertoire par skill
3. Placez un fichier SKILL.md dans chaque sous-répertoire
4. Le fichier SKILL.md contient les instructions que l'agent suivra

Votre skill est alors installable par quiconque via :`,
        code: `# Structure d'un repository de skills
mon-repo/
└── skills/
    ├── skill-debug/
    │   └── SKILL.md
    ├── skill-review/
    │   ├── SKILL.md
    │   └── templates/
    └── skill-deploy/
        └── SKILL.md

# Installation par un utilisateur
npx maconfai install votre-user/mon-repo`,
      },
      {
        heading: "Liens utiles",
        body: `• Repository GitHub : github.com/vbarrai/maconfai
• npm : npmjs.com/package/maconfai
• Issues : github.com/vbarrai/maconfai/issues
• Licence : MIT`,
      },
    ],
    prev: { slug: "architecture", label: "Architecture" },
  },
};

const validSlugs = Object.keys(docs);

export async function generateStaticParams() {
  return validSlugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const doc = docs[slug];
  if (!doc) return { title: "Page introuvable — maconfai docs" };
  return {
    title: `${doc.title} — maconfai docs`,
    description: doc.description,
  };
}

export default async function DocPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const doc = docs[slug];

  if (!doc) notFound();

  return (
    <article>
      {/* Page header */}
      <div className="mb-10">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-2">
          {doc.title}
        </h1>
        <p className="text-zinc-400">{doc.description}</p>
      </div>

      {/* Content sections */}
      <div className="space-y-10">
        {doc.content.map((section, i) => (
          <section key={i}>
            <h2 className="text-xl font-bold mb-3 text-zinc-200">
              {section.heading}
            </h2>
            <div className="text-zinc-400 leading-relaxed whitespace-pre-line mb-4">
              {section.body}
            </div>
            {section.code && (
              <div className="glass-card rounded-xl border border-indigo-500/20 p-5">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-3 h-3 rounded-full bg-red-500/60" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
                  <div className="w-3 h-3 rounded-full bg-green-500/60" />
                </div>
                <pre className="font-mono text-sm text-indigo-400 overflow-x-auto whitespace-pre">
                  {section.code}
                </pre>
              </div>
            )}
          </section>
        ))}
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between mt-16 pt-8 border-t border-white/5">
        {doc.prev ? (
          <Link
            href={
              doc.prev.slug
                ? `/maconfai/docs/${doc.prev.slug}`
                : "/maconfai/docs"
            }
            className="flex items-center gap-2 text-sm text-zinc-400 hover:text-indigo-400 transition-colors group"
          >
            <svg
              className="w-4 h-4 group-hover:-translate-x-1 transition-transform"
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
            {doc.prev.label}
          </Link>
        ) : (
          <div />
        )}
        {doc.next ? (
          <Link
            href={`/maconfai/docs/${doc.next.slug}`}
            className="flex items-center gap-2 text-sm text-zinc-400 hover:text-indigo-400 transition-colors group"
          >
            {doc.next.label}
            <svg
              className="w-4 h-4 group-hover:translate-x-1 transition-transform"
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
          </Link>
        ) : (
          <div />
        )}
      </div>
    </article>
  );
}
