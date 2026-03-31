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
        body: `parcai résout ce problème en créant un sandbox léger autour de l'agent AI sur macOS. L'agent travaille sur une copie isolée du projet — jamais sur l'original :

1. Clone APFS copy-on-write — parcai crée un clone APFS (cp -c) du répertoire projet : copie instantanée à coût zéro. Toutes les modifications de l'agent sont écrites dans le clone, l'original reste intact.

2. sandbox-exec natif macOS — parcai utilise sandbox-exec avec un profil généré dynamiquement. Pas de VM, pas de Docker, pas de couche de virtualisation. L'overhead est quasi nul.

3. Secret masking via proxy MITM — Un proxy MITM local intercepte les requêtes réseau. Les vrais tokens et credentials sont remplacés par des faux dans le sandbox ; le proxy les échange contre les vrais au moment de l'appel API.

4. Réseau contrôlé avec filtrage par domaine — Le réseau reste activé par défaut avec support d'allowlist et blocklist par domaine. Il peut être désactivé complètement avec --no-network.`,
      },
      {
        heading: "Workflow sécurisé",
        body: `parcai suit un workflow en trois phases :

1. Clonage — parcai crée un clone APFS copy-on-write du répertoire projet et lance un shell confiné dans cette copie.

2. Résumé — À la sortie du sandbox, parcai compare la copie avec l'original via rsync --dry-run et affiche un résumé des modifications (fichiers ajoutés, modifiés, supprimés).

3. Confirmation — Vous choisissez d'appliquer ou non les changements au projet réel. Avec --apply, les changements sont appliqués automatiquement. Avec --discard, ils sont rejetés sans confirmation.`,
      },
      {
        heading: "Différence avec Docker / VM",
        body: `Contrairement à Docker ou aux machines virtuelles, parcai :

• Ne nécessite aucune installation supplémentaire (pas de daemon, pas d'image)
• Démarre instantanément (pas de boot, pas de pull d'image)
• N'a pas d'overhead de performance mesurable
• Utilise directement les primitives de sécurité natives de macOS
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
        body: `parcai fonctionne exclusivement sur macOS. Vous avez besoin de :

• macOS 10.13+ (High Sierra ou supérieur) avec un volume APFS
• sandbox-exec (inclus nativement dans macOS)
• Un agent AI installé (Claude Code, Cursor, Codex, etc.)`,
      },
      {
        heading: "Installation via Homebrew (recommandée)",
        body: "La méthode la plus simple pour installer et mettre à jour parcai :",
        code: `brew install vbarrai/tap/parcai`,
      },
      {
        heading: "Installation via script",
        body: "Alternativement, un script d'installation est disponible :",
        code: `curl -sSL https://raw.githubusercontent.com/vbarrai/parcai/main/install.sh | bash`,
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
        body: `parcai utilise sandbox-exec qui est inclus nativement dans macOS. Aucune permission supplémentaire n'est requise et aucun accès root n'est nécessaire pour le fonctionnement du sandbox.`,
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
        body: `Pour un confinement total, désactivez l'accès réseau avec --no-network. Le profil sandbox passe de (allow network*) à (deny network*) :`,
        code: `parcai --no-network`,
      },
      {
        heading: "Masquage des secrets",
        body: `parcai peut masquer automatiquement vos secrets (tokens API, credentials) dans le sandbox via un proxy MITM local. Les vrais tokens sont remplacés par des faux à l'intérieur du sandbox ; le proxy intercepte les requêtes sortantes et échange les faux tokens contre les vrais avant de contacter l'API :`,
        code: `# Activer le masquage des secrets
parcai --secrets`,
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
• --secrets — Active le masquage des secrets via proxy MITM local
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

parcai supporte le filtrage par domaine via allowlist et blocklist. Configurez les domaines autorisés ou bloqués dans le fichier .parcai.json du projet.

Avec --no-network, le profil sandbox passe de (allow network*) à (deny network*), bloquant tout accès réseau.`,
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

Tout le répertoire /Users est bloqué par défaut, puis seul le clone du projet est autorisé en écriture. Avec --secrets, un proxy MITM local remplace en plus les vrais tokens par des faux dans le sandbox.`,
      },
      {
        heading: "Variables d'environnement dans le sandbox",
        body: `parcai définit plusieurs variables d'environnement à l'intérieur du sandbox :

• PARCAI=1 — Indique que le shell tourne dans un sandbox parcai
• PARCAI_BACKEND=sandbox-exec — Backend d'isolation utilisé
• PARCAI_HOST_CWD=<chemin> — Chemin original du projet sur l'hôte
• HOME=<home> — Préservé pour l'accès aux outils CLI
• ZDOTDIR=<clone> — Pointe vers le clone pour les fichiers de config shell
• PS1=[parcai] %1~ %# — Prompt modifié pour indiquer le sandbox
• PATH=/usr/bin:/bin:/usr/sbin:/sbin:/usr/local/bin — Restreint aux binaires système`,
      },
      {
        heading: "Filtrage réseau par domaine",
        body: `parcai permet de contrôler finement les domaines accessibles depuis le sandbox via une allowlist (seuls ces domaines sont autorisés) ou une blocklist (ces domaines sont bloqués). La configuration se fait dans le fichier .parcai.json à la racine du projet :`,
        code: `{
  "network": {
    "allowlist": ["api.anthropic.com", "api.openai.com"],
    "blocklist": ["evil.example.com"]
  }
}`,
      },
      {
        heading: ".parcai.json",
        body: `Le fichier .parcai.json à la racine du projet permet de définir une configuration par projet. Il est lu automatiquement au lancement de parcai. Options disponibles :

• network.allowlist — Liste de domaines autorisés (si défini, seuls ces domaines sont accessibles)
• network.blocklist — Liste de domaines bloqués
• secrets — Activer le masquage des secrets par défaut (booléen)
• allow — Liste de chemins supplémentaires en lecture seule
• rw — Liste de chemins supplémentaires en lecture/écriture`,
        code: `{
  "secrets": true,
  "allow": ["/data/shared"],
  "rw": ["/tmp/workspace"],
  "network": {
    "allowlist": ["api.anthropic.com"]
  }
}`,
      },
      {
        heading: "Persistance de session",
        body: `parcai persiste l'état des sessions entre les exécutions. Les données de session sont stockées dans ~/.parcai/sessions/<hash>/, où <hash> est un identifiant unique dérivé du chemin du projet.

Cela permet de reprendre là où vous en étiez sans reconfigurer le sandbox à chaque lancement. Les fichiers temporaires, l'historique du shell et l'état du clone sont préservés entre les sessions.`,
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
• mitmproxy — Proxy MITM local pour le masquage des secrets
• rsync — Détection et application des changements
• cp -c (APFS clone) — Copie copy-on-write sur macOS`,
      },
      {
        heading: "Isolation sur macOS",
        body: `parcai utilise trois mécanismes complémentaires sur macOS :

1. Clone APFS (cp -c -R) — Le répertoire projet est cloné via copy-on-write au niveau du filesystem. La copie est instantanée et ne consomme aucun espace disque tant que les fichiers ne sont pas modifiés. Si l'agent exécute rm -rf ., seul le clone est détruit.

2. sandbox-exec avec profil .sb — Un profil de sandbox est généré dynamiquement à partir d'un template (profiles/macos.sb.tpl). Le profil définit :
• Politique par défaut permissive, puis deny explicite sur les chemins dangereux
• Tout /Users bloqué, seul le clone est whitelisté en écriture
• Secrets explicitement bloqués (~/.ssh, ~/.aws, ~/.gnupg, ~/.kube, ~/.docker, etc.)
• Exécution restreinte aux binaires système (/usr/bin, /bin, /opt/homebrew/bin)
• Visibilité des processus bloquée (deny process-info*) — ps aux ne montre rien de l'hôte
• Signaux restreints à ses propres processus (allow signal (target self))
• Politique réseau substituée dynamiquement (allow/deny network*)

3. Proxy MITM pour secret masking — Avec --secrets, un proxy mitmproxy local est lancé. Les vrais credentials (tokens API, clés) sont remplacés par des faux dans l'environnement du sandbox. Le proxy intercepte les requêtes sortantes et échange les faux tokens contre les vrais avant de contacter le service distant. Cela empêche l'agent d'exfiltrer des credentials réels.`,
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

1. L'agent travaille sur le clone APFS — jamais sur l'original.

2. À la sortie du shell, rsync --dry-run compare le clone avec le projet original et produit un résumé avec le statut de chaque fichier :
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
