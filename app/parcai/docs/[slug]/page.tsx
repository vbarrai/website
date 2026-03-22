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
        body: `parcai résout ce problème en créant un sandbox léger autour de l'agent AI. L'agent travaille sur une copie isolée du projet — jamais sur l'original :

1. Copie copy-on-write — Sur macOS, parcai crée un clone APFS (cp -c) du répertoire projet : copie instantanée à coût zéro. Sur Linux, un overlayfs monte le projet en lecture seule avec une couche d'écriture tmpfs.

2. Primitives OS natives — parcai utilise sandbox-exec sur macOS et unshare (namespaces) sur Linux. Pas de VM, pas de Docker, pas de couche de virtualisation. L'overhead est quasi nul.

3. Secrets inaccessibles — Les répertoires sensibles (~/.ssh, ~/.aws, ~/.gnupg, ~/.kube, ~/.docker, etc.) sont explicitement bloqués. Sur Linux, le filesystem hôte est complètement détaché via pivot_root.

4. Réseau contrôlé — Le réseau reste activé par défaut (nécessaire pour les APIs AI), mais peut être désactivé avec --no-network pour un confinement total.`,
      },
      {
        heading: "Workflow sécurisé",
        body: `parcai suit un workflow en trois phases :

1. Clonage — parcai crée une copie copy-on-write du répertoire projet (clone APFS sur macOS, overlayfs sur Linux) et lance un shell confiné dans cette copie.

2. Résumé — À la sortie du sandbox, parcai compare la copie avec l'original via rsync --dry-run et affiche un résumé des modifications (fichiers ajoutés, modifiés, supprimés).

3. Confirmation — Vous choisissez d'appliquer ou non les changements au projet réel. Avec --apply, les changements sont appliqués automatiquement. Avec --discard, ils sont rejetés sans confirmation.`,
      },
      {
        heading: "Différence avec Docker / VM",
        body: `Contrairement à Docker ou aux machines virtuelles, parcai :

• Ne nécessite aucune installation supplémentaire (pas de daemon, pas d'image)
• Démarre instantanément (pas de boot, pas de pull d'image)
• N'a pas d'overhead de performance mesurable
• Utilise directement les primitives de sécurité du noyau OS
• Partage le même environnement (même shell, mêmes outils installés)
• Protège l'original — même un rm -rf . ne détruit que la copie

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
        heading: "Installation via Homebrew",
        body: "Installez parcai via Homebrew :",
        code: `brew install vbarrai/tap/parcai`,
      },
      {
        heading: "Installation manuelle depuis GitHub",
        body: "Vous pouvez aussi cloner le dépôt et utiliser le script directement :",
        code: `git clone https://github.com/vbarrai/parcai.git
cd parcai
sudo cp parcai /usr/local/bin/`,
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
        body: `Placez-vous dans le répertoire de votre projet et lancez parcai. Un shell sandboxé s'ouvre avec le prompt [parcai] pour indiquer que vous êtes dans le sandbox :`,
        code: `cd my-project
parcai`,
      },
      {
        heading: "Workflow typique",
        body: `Le workflow typique avec parcai :

1. Naviguez dans votre projet
2. Lancez parcai — un clone copy-on-write est créé et un shell confiné s'ouvre
3. Utilisez votre agent AI normalement — il travaille sur la copie, pas l'original
4. Quittez le shell (exit ou Ctrl+D)
5. parcai affiche le diff des modifications (ajouts, modifications, suppressions)
6. Confirmez ou rejetez les changements

Vos secrets et fichiers personnels sont invisibles. Si l'agent exécute rm -rf ., seule la copie est détruite.`,
      },
      {
        heading: "Appliquer ou rejeter les changements",
        body: `Par défaut, parcai affiche le résumé des changements et demande confirmation. Deux flags permettent de sauter cette étape :`,
        code: `# Appliquer automatiquement les changements
parcai --apply

# Rejeter automatiquement les changements
parcai --discard`,
      },
      {
        heading: "Désactiver le réseau",
        body: `Pour un confinement total, désactivez l'accès réseau avec --no-network. Sur Linux, cela crée un namespace réseau isolé (seul loopback). Sur macOS, le profil sandbox bloque tout accès réseau :`,
        code: `parcai --no-network`,
      },
      {
        heading: "Autoriser des chemins supplémentaires",
        body: `Si l'agent a besoin de lire des fichiers en dehors du projet, utilisez --allow (lecture seule). Pour un accès en lecture/écriture, utilisez --rw :`,
        code: `# Lecture seule sur un répertoire partagé
parcai --allow /path/to/shared/data

# Lecture/écriture sur un répertoire
parcai --rw /tmp/workspace

# Combinable et répétable
parcai --allow /data --rw /tmp/cache`,
      },
      {
        heading: "Mode preview",
        body: "Le flag --dry-run affiche le profil de sandbox généré et le chemin du clone sans lancer le shell. Utile pour débugger la configuration :",
        code: `parcai --dry-run`,
      },
      {
        heading: "Détecter le sandbox depuis un script",
        body: `Dans le sandbox, parcai définit des variables d'environnement que vos scripts peuvent utiliser :`,
        code: `# Vérifier si on est dans un sandbox parcai
if [ "$PARCAI" = "1" ]; then
  echo "Sandboxed via $PARCAI_BACKEND"
  echo "Projet original : $PARCAI_HOST_CWD"
fi`,
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

• --allow <chemin> — Autorise l'accès en lecture seule à un chemin (répétable)
• --rw <chemin> — Autorise l'accès en lecture/écriture à un chemin (répétable)
• --no-network — Désactive l'accès réseau dans le sandbox
• --apply — Applique automatiquement les changements à la sortie
• --discard — Rejette automatiquement les changements à la sortie
• --dry-run — Affiche le profil de sandbox et le chemin du clone sans lancer le shell
• --verbose — Affiche les détails de configuration (clone, profil, réseau)
• --version — Affiche la version de parcai
• --help — Affiche l'aide

Note : --apply et --discard sont mutuellement exclusifs.`,
      },
      {
        heading: "Réseau",
        body: `Par défaut, le réseau est activé dans le sandbox. C'est nécessaire pour que les agents AI puissent communiquer avec leurs APIs (Anthropic, OpenAI, etc.).

Pour que DNS et TLS fonctionnent dans le sandbox, parcai autorise la lecture de :
• /etc/resolv.conf, /etc/nsswitch.conf, /etc/hosts (résolution DNS)
• /etc/ssl/certs/, /etc/pki/tls/certs/ (certificats TLS)
• /usr/share/ca-certificates/, /usr/lib/ssl/ (autorités de certification)

Avec --no-network, sur Linux un namespace réseau isolé est créé (seul loopback disponible). Sur macOS, le profil sandbox passe de (allow network*) à (deny network*).`,
        code: `parcai --no-network`,
      },
      {
        heading: "Chemins autorisés",
        body: `Par défaut, parcai donne accès au clone du projet (lecture/écriture) et aux chemins système nécessaires au fonctionnement du shell (lecture seule) :

• /usr/bin, /bin, /usr/sbin, /sbin — Binaires système
• /opt/homebrew/bin, /usr/local/bin — Binaires Homebrew et locaux (macOS)
• /usr, /lib, /etc — Bibliothèques et configuration système (lecture seule)

Utilisez --allow pour ajouter des chemins en lecture seule, et --rw pour des chemins en lecture/écriture :`,
        code: `# Lecture seule sur un dataset
parcai --allow /data/shared

# Lecture/écriture sur un cache
parcai --rw /tmp/workspace

# Combinable
parcai --allow /data --rw /tmp/cache`,
      },
      {
        heading: "Secrets protégés",
        body: `Les répertoires suivants sont explicitement bloqués dans le sandbox. Cette protection est codée en dur et ne peut pas être désactivée :

• ~/.ssh — Clés SSH
• ~/.aws — Credentials AWS
• ~/.gnupg — Clés GPG
• ~/.config/gcloud — Credentials Google Cloud
• ~/.kube — Configuration Kubernetes
• ~/.docker — Credentials Docker
• ~/.env — Variables d'environnement
• ~/.netrc — Credentials réseau
• ~/.npmrc — Credentials npm

Sur macOS, tout le répertoire /Users est bloqué par défaut, puis seul le clone du projet est autorisé en écriture. Sur Linux, le filesystem hôte est complètement détaché via pivot_root — seuls les bind-mounts explicites sont accessibles.`,
      },
      {
        heading: "Variables d'environnement dans le sandbox",
        body: `parcai définit plusieurs variables d'environnement à l'intérieur du sandbox :

• PARCAI=1 — Indique que le shell tourne dans un sandbox parcai
• PARCAI_BACKEND=sandbox-exec ou unshare — Backend d'isolation utilisé
• PARCAI_HOST_CWD=<chemin> — Chemin original du projet sur l'hôte
• HOME=<home> — Préservé pour l'accès aux outils CLI
• ZDOTDIR=<clone> — Pointe vers le clone pour les fichiers de config shell
• PS1=[parcai] %1~ %# — Prompt modifié pour indiquer le sandbox
• PATH=/usr/bin:/bin:/usr/sbin:/sbin:/usr/local/bin — Restreint aux binaires système`,
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
        body: `parcai est un script shell (Bash) autonome qui utilise uniquement les primitives natives de l'OS :

• Bash — Script principal (parcai)
• sandbox-exec — Isolation sur macOS (profil .sb template)
• unshare + overlayfs + pivot_root — Isolation sur Linux
• rsync — Détection et application des changements
• cp -c (APFS clone) — Copie copy-on-write sur macOS`,
      },
      {
        heading: "Isolation sur Linux",
        body: `Sur Linux, parcai utilise unshare avec quatre namespaces :

1. Mount namespace (--mount) — Le système de fichiers est remonté avec overlayfs. Le projet original est la couche inférieure (lecture seule), une couche tmpfs absorbe toutes les écritures. pivot_root détache ensuite complètement le filesystem hôte — il devient inaccessible.

2. PID namespace (--pid --fork) — Les processus dans le sandbox ne voient pas les processus de l'hôte. Le sandbox a son propre PID 1.

3. User namespace (--map-root-user) — Le processus est mappé comme root dans le namespace sans avoir de privilèges réels. Aucun accès root sur l'hôte.

4. Network namespace (--net, optionnel) — Avec --no-network, un namespace réseau isolé est créé. Seul loopback est disponible.

Les fichiers DNS/TLS (/etc/resolv.conf, /etc/ssl/certs/) sont bind-mountés en lecture seule pour que le réseau fonctionne.`,
        code: `# Flags unshare utilisés
UNSHARE_FLAGS="--mount --pid --fork --map-root-user"
# Ajout conditionnel si --no-network
UNSHARE_FLAGS+=" --net"`,
      },
      {
        heading: "Isolation sur macOS",
        body: `Sur macOS, parcai utilise deux mécanismes complémentaires :

1. Clone APFS (cp -c -R) — Le répertoire projet est cloné via copy-on-write au niveau du filesystem. La copie est instantanée et ne consomme aucun espace disque tant que les fichiers ne sont pas modifiés. Si l'agent exécute rm -rf ., seul le clone est détruit.

2. sandbox-exec avec profil .sb — Un profil de sandbox est généré dynamiquement à partir d'un template (profiles/macos.sb.tpl). Le profil définit :
• Politique par défaut permissive, puis deny explicite sur les chemins dangereux
• Tout /Users bloqué, seul le clone est whitelisté en écriture
• Secrets explicitement bloqués (~/.ssh, ~/.aws, ~/.gnupg, ~/.kube, ~/.docker, etc.)
• Exécution restreinte aux binaires système (/usr/bin, /bin, /opt/homebrew/bin)
• Visibilité des processus bloquée (deny process-info*) — ps aux ne montre rien de l'hôte
• Signaux restreints à ses propres processus (allow signal (target self))
• Politique réseau substituée dynamiquement (allow/deny network*)`,
        code: `# Extrait du profil sandbox macOS
(deny file-read* file-write* (subpath "/Users"))
(allow file-read* file-write* (subpath "{{CLONE}}"))
(deny file-read* (subpath "{{HOME}}/.ssh"))
(deny file-read* (subpath "{{HOME}}/.aws"))
(deny file-read* (subpath "{{HOME}}/.gnupg"))
(deny process-info*)
(allow process-info* (target self))
{{NETWORK_POLICY}}`,
      },
      {
        heading: "Gestion des changements",
        body: `Les modifications sont détectées et appliquées via rsync :

1. L'agent travaille sur le clone (macOS) ou l'overlay tmpfs (Linux) — jamais sur l'original.

2. À la sortie du shell, rsync --dry-run compare le clone/overlay avec le projet original et produit un résumé avec le statut de chaque fichier :
• A (added) — Fichier créé
• M (modified) — Fichier modifié
• D (deleted) — Fichier supprimé

3. Certains fichiers sont exclus du diff : .zshenv, .zshrc, .zsh_history, .claude/, .cache/, .config/, .local/, Library/.

4. Selon le mode choisi (--apply, --discard, ou confirmation interactive), les changements sont appliqués via rsync ou la copie est simplement supprimée.

5. Le cleanup supprime le profil de sandbox temporaire et le répertoire du clone.`,
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
        body: "parcai est un script Bash autonome. Clonez le repository pour contribuer :",
        code: `git clone https://github.com/vbarrai/parcai
cd parcai`,
      },
      {
        heading: "Structure du projet",
        body: `Le projet est minimaliste :

• parcai — Script principal (Bash)
• profiles/macos.sb.tpl — Template du profil sandbox macOS
• SPEC.md — Spécification technique complète

Le script parcai est le seul fichier exécutable. Le template .sb.tpl est injecté avec les variables ({{CLONE}}, {{HOME}}, {{NETWORK_POLICY}}) au runtime.`,
      },
      {
        heading: "Tester l'isolation",
        body: `Pour vérifier que chaque couche de sécurité fonctionne, lancez parcai dans un répertoire de test et exécutez ces commandes dans le sandbox :`,
        code: `# Créer un répertoire de test
mkdir /tmp/test-sandbox && cd /tmp/test-sandbox
parcai

# Dans le sandbox — ces commandes doivent échouer :
cat ~/.ssh/id_rsa           # fichier introuvable
ls ~/                       # accès refusé
cat /etc/shadow             # accès refusé
rm -rf /                    # sans effet sur l'hôte
ps aux                      # processus hôte invisibles
kill -9 1                   # refusé

# Ces commandes doivent fonctionner :
touch test.txt              # écriture dans le projet OK
curl https://api.anthropic.com  # réseau OK (sauf --no-network)`,
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
