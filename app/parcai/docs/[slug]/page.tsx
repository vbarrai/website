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
    description:
      "Comprendre le fonctionnement de parcai et sa philosophie.",
    content: [
      {
        heading: "Le problème",
        body: `Les agents AI comme Claude Code exécutent des commandes shell dans votre terminal avec les mêmes permissions que vous. Ils peuvent lire vos clés SSH, vos tokens, vos fichiers de configuration, et accéder à l'intégralité de votre système de fichiers.

Même avec des garde-fous dans le prompt, un agent peut accidentellement (ou via une injection de prompt) accéder à des fichiers sensibles en dehors du projet.`,
      },
      {
        heading: "La solution parcai",
        body: `parcai résout ce problème en créant un sandbox léger autour de l'agent AI. L'agent est confiné au répertoire du projet courant :

1. Système de fichiers restreint — L'agent ne peut accéder qu'au répertoire du projet et aux chemins système nécessaires (binaires, bibliothèques). Vos secrets (~/.ssh, ~/.aws, ~/.config) sont invisibles.

2. Primitives OS natives — parcai utilise les namespaces Linux ou sandbox-exec sur macOS. Pas de VM, pas de Docker, pas de couche de virtualisation. L'overhead est quasi nul.

3. Réseau contrôlé — Le réseau reste activé par défaut (nécessaire pour les APIs AI), mais peut être désactivé avec --no-network pour un confinement total.`,
      },
      {
        heading: "Workflow sécurisé",
        body: `parcai suit un workflow en trois phases :

1. Confinement — L'agent s'exécute dans le sandbox. Il peut lire et modifier les fichiers du projet, exécuter des commandes, mais ne peut pas sortir du répertoire.

2. Résumé — À la sortie du sandbox, parcai affiche un résumé des modifications effectuées par l'agent (fichiers créés, modifiés, supprimés).

3. Confirmation — Vous choisissez d'appliquer ou non les changements au projet réel. Avec --apply, les changements sont appliqués automatiquement.`,
      },
      {
        heading: "Différence avec Docker / VM",
        body: `Contrairement à Docker ou aux machines virtuelles, parcai :

• Ne nécessite aucune installation supplémentaire (pas de daemon, pas d'image)
• Démarre instantanément (pas de boot, pas de pull d'image)
• N'a pas d'overhead de performance mesurable
• Utilise directement les primitives de sécurité du noyau OS
• Partage le même environnement (même shell, mêmes outils installés)

C'est l'approche la plus légère possible pour isoler un processus tout en conservant un environnement de développement identique.`,
      },
    ],
    prev: { slug: "", label: "Introduction" },
    next: { slug: "installation", label: "Installation" },
  },

  installation: {
    title: "Installation",
    description: "Guide d'installation de parcai.",
    content: [
      {
        heading: "Prérequis",
        body: `parcai fonctionne sur Linux et macOS. Vous avez besoin de :

• Linux avec support des namespaces utilisateur (kernel 3.8+, la plupart des distributions modernes)
• Ou macOS avec sandbox-exec (inclus nativement)
• Un agent AI installé (Claude Code, Cursor, Codex, etc.)`,
      },
      {
        heading: "Installation via npm",
        body: "Installez parcai globalement via npm :",
        code: `npm i -g parcai`,
      },
      {
        heading: "Utilisation directe avec npx",
        body: "Vous pouvez aussi utiliser parcai directement via npx sans installation globale :",
        code: `npx parcai`,
      },
      {
        heading: "Vérifier l'installation",
        body: "Après l'installation, vérifiez que parcai est accessible :",
        code: `parcai --version`,
      },
      {
        heading: "Permissions",
        body: `Sur Linux, parcai utilise les namespaces utilisateur (user namespaces) qui ne nécessitent pas de privilèges root. La plupart des distributions modernes les activent par défaut.

Sur macOS, parcai utilise sandbox-exec qui est inclus nativement dans le système. Aucune permission supplémentaire n'est requise.`,
      },
    ],
    prev: { slug: "concept", label: "Concept" },
    next: { slug: "utilisation", label: "Utilisation" },
  },

  utilisation: {
    title: "Utilisation",
    description: "Guide pratique du workflow de sandbox.",
    content: [
      {
        heading: "Lancer un sandbox",
        body: "Placez-vous dans le répertoire de votre projet et lancez parcai :",
        code: `cd my-project
parcai`,
      },
      {
        heading: "Workflow typique",
        body: `Le workflow typique avec parcai :

1. Naviguez dans votre projet
2. Lancez parcai pour entrer dans le sandbox
3. Utilisez votre agent AI normalement — il est confiné au répertoire
4. À la sortie, parcai affiche un résumé des modifications
5. Confirmez ou rejetez les changements

L'agent ne peut accéder qu'au répertoire du projet et aux binaires système nécessaires. Vos secrets et fichiers personnels sont invisibles.`,
      },
      {
        heading: "Appliquer les changements automatiquement",
        body: "Utilisez le flag --apply pour appliquer automatiquement les changements à la sortie du sandbox, sans confirmation interactive :",
        code: `parcai --apply`,
      },
      {
        heading: "Désactiver le réseau",
        body: "Pour un confinement total, désactivez l'accès réseau avec --no-network. L'agent ne pourra plus appeler les APIs externes :",
        code: `parcai --no-network`,
      },
      {
        heading: "Autoriser des chemins supplémentaires",
        body: "Si l'agent a besoin d'accéder à des fichiers en dehors du projet (par exemple un répertoire de données partagé), utilisez --allow :",
        code: `parcai --allow /path/to/shared/data
parcai --allow /tmp/workspace --allow /data`,
      },
      {
        heading: "Combiner les options",
        body: "Les options sont combinables :",
        code: `# Sandbox sans réseau avec chemin additionnel
parcai --no-network --allow /data

# Sandbox avec application automatique
parcai --apply --allow /tmp/cache`,
      },
    ],
    prev: { slug: "installation", label: "Installation" },
    next: { slug: "configuration", label: "Configuration" },
  },

  configuration: {
    title: "Configuration",
    description: "Options et configuration avancée de parcai.",
    content: [
      {
        heading: "Options en ligne de commande",
        body: `parcai se configure entièrement via des flags en ligne de commande :

• --no-network — Désactive l'accès réseau dans le sandbox
• --allow <chemin> — Autorise l'accès à un chemin supplémentaire (répétable)
• --apply — Applique automatiquement les changements à la sortie
• --version — Affiche la version de parcai
• --help — Affiche l'aide`,
      },
      {
        heading: "Réseau",
        body: `Par défaut, le réseau est activé dans le sandbox. C'est nécessaire pour que les agents AI puissent communiquer avec leurs APIs (Anthropic, OpenAI, etc.).

Si vous souhaitez un confinement total (par exemple pour des tests hors-ligne ou des analyses de sécurité), désactivez le réseau :`,
        code: `parcai --no-network`,
      },
      {
        heading: "Chemins autorisés",
        body: `Par défaut, parcai donne accès uniquement au répertoire courant et aux chemins système nécessaires au fonctionnement du shell (binaires, bibliothèques partagées).

Les chemins système autorisés incluent :
• /usr, /bin, /lib, /etc (lecture seule)
• Le répertoire du projet (lecture/écriture)

Utilisez --allow pour ajouter des chemins supplémentaires en lecture/écriture :`,
        code: `# Autoriser un répertoire de données
parcai --allow /data/shared

# Autoriser plusieurs chemins
parcai --allow /data --allow /tmp/workspace`,
      },
      {
        heading: "Secrets protégés",
        body: `Les répertoires suivants sont automatiquement masqués dans le sandbox :

• ~/.ssh — Clés SSH
• ~/.aws — Credentials AWS
• ~/.config — Fichiers de configuration
• ~/.gnupg — Clés GPG
• ~/.netrc — Credentials réseau
• Tout fichier .env en dehors du projet

Cette protection est active par défaut et ne peut pas être désactivée, garantissant que l'agent n'a jamais accès à vos secrets.`,
      },
    ],
    prev: { slug: "utilisation", label: "Utilisation" },
    next: { slug: "architecture", label: "Architecture" },
  },

  architecture: {
    title: "Architecture",
    description: "Structure interne et primitives OS utilisées.",
    content: [
      {
        heading: "Stack technique",
        body: `parcai est construit avec :

• TypeScript — Langage principal
• Node.js 18+ — Runtime
• Namespaces Linux — Isolation sur Linux (mount, PID, network)
• sandbox-exec macOS — Isolation sur macOS
• pnpm — Gestionnaire de paquets`,
      },
      {
        heading: "Isolation sur Linux",
        body: `Sur Linux, parcai utilise les namespaces utilisateur (user namespaces) pour créer un environnement isolé :

1. Mount namespace — Le système de fichiers est remonté en lecture seule, sauf le répertoire du projet qui est monté en lecture/écriture via un overlay.

2. PID namespace — Les processus dans le sandbox ne voient pas les processus de l'hôte.

3. Network namespace — Quand --no-network est utilisé, un namespace réseau isolé est créé sans interface réseau.

Les namespaces utilisateur ne nécessitent pas de privilèges root, ce qui rend parcai utilisable par n'importe quel utilisateur.`,
      },
      {
        heading: "Isolation sur macOS",
        body: `Sur macOS, parcai utilise sandbox-exec avec un profil de sandbox personnalisé (.sb) qui :

• Autorise la lecture des chemins système nécessaires
• Autorise la lecture/écriture uniquement dans le répertoire du projet
• Bloque l'accès aux répertoires sensibles (~/.ssh, ~/.aws, etc.)
• Contrôle l'accès réseau selon la configuration

sandbox-exec est le même mécanisme utilisé par macOS pour isoler les applications du Mac App Store.`,
      },
      {
        heading: "Gestion des changements",
        body: `Les modifications effectuées dans le sandbox sont trackées via un mécanisme d'overlay :

1. Avant le lancement, parcai prend un snapshot de l'état du répertoire projet.

2. Pendant l'exécution, l'agent travaille sur une copie (overlay sur Linux, copie temporaire sur macOS).

3. À la sortie, parcai calcule le diff entre l'état initial et l'état modifié.

4. Le résumé des changements est affiché et l'utilisateur confirme l'application.`,
      },
    ],
    prev: { slug: "configuration", label: "Configuration" },
    next: { slug: "contribuer", label: "Contribuer" },
  },

  contribuer: {
    title: "Contribuer",
    description: "Comment contribuer au développement de parcai.",
    content: [
      {
        heading: "Mise en place de l'environnement",
        body: "Clonez le repository et installez les dépendances :",
        code: `git clone https://github.com/vbarrai/parcai
cd parcai
pnpm install`,
      },
      {
        heading: "Commandes de développement",
        body: "Le projet utilise pnpm comme gestionnaire de paquets :",
        code: `# Lancer en mode développement
pnpm run dev

# Lancer les tests
pnpm test

# Vérification TypeScript
pnpm typecheck

# Linter
pnpm lint`,
      },
      {
        heading: "Tester l'isolation",
        body: `Pour tester l'isolation, lancez parcai dans un répertoire de test et vérifiez que :

• Les fichiers en dehors du répertoire sont inaccessibles
• Les secrets (~/.ssh, ~/.aws) sont masqués
• Le réseau fonctionne (ou est bloqué avec --no-network)
• Les changements sont correctement trackés et affichés`,
        code: `# Créer un répertoire de test
mkdir /tmp/test-sandbox && cd /tmp/test-sandbox

# Lancer parcai
parcai

# Dans le sandbox, vérifier l'isolation
ls ~/.ssh        # devrait échouer
cat ~/.aws/credentials  # devrait échouer`,
      },
      {
        heading: "Liens utiles",
        body: `• Repository GitHub : github.com/vbarrai/parcai
• Issues : github.com/vbarrai/parcai/issues
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
  if (!doc) return { title: "Page introuvable — parcai docs" };
  return {
    title: `${doc.title} — parcai docs`,
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
              <div className="glass-card rounded-xl border border-cyan-500/20 p-5">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-3 h-3 rounded-full bg-red-500/60" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
                  <div className="w-3 h-3 rounded-full bg-green-500/60" />
                </div>
                <pre className="font-mono text-sm text-cyan-400 overflow-x-auto whitespace-pre">
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
                ? `/parcai/docs/${doc.prev.slug}`
                : "/parcai/docs"
            }
            className="flex items-center gap-2 text-sm text-zinc-400 hover:text-cyan-400 transition-colors group"
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
            href={`/parcai/docs/${doc.next.slug}`}
            className="flex items-center gap-2 text-sm text-zinc-400 hover:text-cyan-400 transition-colors group"
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
