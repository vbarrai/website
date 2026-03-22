export interface DocSection {
  slug: string;
  title: string;
  content: string;
}

export interface ProjectDocs {
  sections: DocSection[];
}

const maconfaiDocs: ProjectDocs = {
  sections: [
    {
      slug: "introduction",
      title: "Introduction",
      content: `# Introduction

**maconfai** est un gestionnaire de skills universel pour les agents de code AI. Il permet d'installer, mettre à jour et désinstaller des skills depuis des repositories GitHub ou des répertoires locaux.

## Pourquoi maconfai ?

Les agents AI comme Claude Code, Cursor ou Codex utilisent des **skills** — des fichiers de configuration qui enrichissent leurs capacités. Gérer ces skills manuellement devient vite fastidieux :

- Copier des fichiers entre projets
- Maintenir la cohérence entre agents
- Mettre à jour quand la source évolue

maconfai résout ces problèmes avec une **interface CLI simple** qui automatise tout le cycle de vie des skills.

## Agents supportés

| Agent | Répertoire de skills |
|---|---|
| Claude Code | \`.claude/skills/\` |
| Cursor | \`.cursor/skills/\` |
| Codex | \`.codex/skills/\` |
| Gemini CLI | \`.gemini/skills/\` |
| Amp Code | \`.amp/skills/\` |

## En bref

- **Taille** : 91.4 kB min+gzip
- **Couverture de tests** : 73%
- **Licence** : MIT
- **Auteur** : Vincent Barrault`,
    },
    {
      slug: "concept",
      title: "Concept",
      content: `# Concept

## Comment ça marche

maconfai fonctionne en trois étapes simples :

### 1. Découverte

maconfai scanne le repository source à la recherche de fichiers \`SKILL.md\` situés dans un répertoire \`skills/\`. Chaque fichier SKILL.md identifie une skill installable.

\`\`\`
mon-repo/
├── skills/
│   ├── refactoring/
│   │   └── SKILL.md
│   ├── testing/
│   │   └── SKILL.md
│   └── documentation/
│       └── SKILL.md
\`\`\`

### 2. Sélection

Une interface interactive vous permet de choisir les skills à installer et les agents cibles. maconfai détecte automatiquement les agents installés sur votre machine.

### 3. Installation

Les skills sont copiées dans un répertoire canonique \`.agents/skills/<nom>/\`, puis des **symlinks** sont créés vers le répertoire de chaque agent sélectionné.

\`\`\`
.agents/skills/refactoring/    ← source unique
.claude/skills/refactoring/    ← symlink
.cursor/skills/refactoring/    ← symlink
\`\`\`

## Autres fonctionnalités

### Serveurs MCP

maconfai peut installer des serveurs MCP définis dans \`mcps/<nom>/mcp.json\` ou dans un fichier \`mcp.json\` racine. Les configurations sont mergées dans les fichiers de config de chaque agent.

### Hooks

Les hooks définis dans \`hooks/<nom>/hooks.json\` ou dans un fichier \`hooks.json\` racine sont mergés dans les fichiers de configuration de chaque agent (supporté pour Claude Code et Cursor).

### Fichier de verrouillage

Un fichier \`.agents/lock.json\` enregistre les sources et versions installées, permettant les mises à jour incrémentales avec \`maconfai check\`.`,
    },
    {
      slug: "installation",
      title: "Installation",
      content: `# Installation

## Installation rapide (npx)

La méthode la plus simple — aucune installation permanente :

\`\`\`bash
npx maconfai install owner/repo
\`\`\`

## Installation globale

Pour un accès permanent à la commande :

\`\`\`bash
npm install -g maconfai
\`\`\`

## Prérequis

- **Node.js** >= 18
- **npm** ou **pnpm**

## Vérification

Après installation globale, vérifiez que maconfai est accessible :

\`\`\`bash
maconfai --help
\`\`\``,
    },
    {
      slug: "utilisation",
      title: "Utilisation",
      content: `# Utilisation

## Installer des skills depuis GitHub

\`\`\`bash
# Installation standard avec sélection interactive
maconfai install owner/repo

# Installer sans prompts (accepter tout)
maconfai install owner/repo -y

# Spécifier une branche
maconfai install owner/repo#develop

# Depuis une URL GitHub complète avec branche et sous-chemin
maconfai install https://github.com/owner/repo/tree/main/path/to/skills
\`\`\`

## Installer depuis un répertoire local

\`\`\`bash
maconfai install ./chemin/local
\`\`\`

## Désinstaller des skills

\`\`\`bash
# Mode interactif de désinstallation
maconfai install
\`\`\`

Sans argument, maconfai entre en mode désinstallation interactif.

## Vérifier les mises à jour

\`\`\`bash
maconfai check
\`\`\`

Compare les versions installées avec les sources et propose les mises à jour disponibles.

## Options CLI

| Option | Description |
|---|---|
| \`-y\`, \`--yes\` | Accepter tout sans prompt |
| \`--skills=a,b\` | Sélectionner des skills spécifiques |
| \`--agents=claude-code,cursor\` | Cibler des agents spécifiques |
| \`--mcps=mcp1,mcp2\` | Sélectionner des serveurs MCP |
| \`--hooks=hook1,hook2\` | Sélectionner des hooks |`,
    },
    {
      slug: "structure-provider",
      title: "Structure Provider",
      content: `# Structure d'un repository provider

Un repository provider est un repo GitHub qui contient des skills, hooks et/ou serveurs MCP installables par maconfai.

## Exemples de structures

### Repository avec skills uniquement

\`\`\`
skills/
├── ma-skill-1/
│   ├── SKILL.md
│   └── ... fichiers de la skill
└── ma-skill-2/
    ├── SKILL.md
    └── ... fichiers de la skill
\`\`\`

### Repository avec MCP uniquement

\`\`\`
mcps/
└── mon-serveur/
    └── mcp.json
\`\`\`

Ou directement à la racine :

\`\`\`
mcp.json
\`\`\`

### Repository avec hooks uniquement

\`\`\`
hooks/
└── mon-hook/
    └── hooks.json
\`\`\`

### Repository combiné complet

\`\`\`
skills/
├── skill-a/
│   └── SKILL.md
└── skill-b/
    └── SKILL.md
mcps/
└── serveur-mcp/
    └── mcp.json
hooks/
└── mon-hook/
    └── hooks.json
\`\`\`

## Le fichier SKILL.md

Chaque skill est identifiée par un fichier \`SKILL.md\` à sa racine. Ce fichier contient la documentation et les instructions de la skill au format Markdown.

## Variables d'environnement

maconfai gère automatiquement la traduction des variables d'environnement entre agents :

| Syntaxe | Agent |
|---|---|
| \`\${GITHUB_TOKEN}\` | Claude Code |
| \`\${env:GITHUB_TOKEN}\` | Cursor |`,
    },
    {
      slug: "agents",
      title: "Agents supportés",
      content: `# Agents supportés

maconfai supporte 5 agents de code AI avec différents niveaux de fonctionnalités.

## Matrice de compatibilité

| Fonctionnalité | Claude Code | Cursor | Codex | Gemini CLI | Amp Code |
|---|---|---|---|---|---|
| Skills | ✅ | ✅ | ✅ | ✅ | ✅ |
| Hooks | ✅ | ✅ | ❌ | ❌ | ❌ |
| MCP | 🔜 | 🔜 | 🔜 | 🔜 | 🔜 |
| Context | 🔜 | 🔜 | 🔜 | 🔜 | 🔜 |

## Répertoires par agent

### Claude Code
- Skills : \`.claude/skills/\`
- Configuration : \`.claude/settings.json\`

### Cursor
- Skills : \`.cursor/skills/\`
- Configuration : \`.cursor/settings.json\`

### Codex
- Skills : \`.codex/skills/\`

### Gemini CLI
- Skills : \`.gemini/skills/\`

### Amp Code
- Skills : \`.amp/skills/\`

## Détection automatique

Lors de l'installation, maconfai détecte automatiquement quels agents sont présents sur la machine et propose uniquement ceux qui sont installés. Vous pouvez forcer la sélection avec l'option \`--agents\` :

\`\`\`bash
maconfai install owner/repo --agents=claude-code,cursor
\`\`\``,
    },
  ],
};

const parcaiDocs: ProjectDocs = {
  sections: [
    {
      slug: "introduction",
      title: "Introduction",
      content: `# Introduction

**parcai** est un outil d'isolation shell léger conçu pour confiner les agents AI au répertoire du projet courant. Il empêche l'accès aux fichiers système, aux secrets et aux autres projets.

## Pourquoi parcai ?

Les agents AI ont besoin d'accéder au système de fichiers pour travailler efficacement, mais cet accès présente des risques :

- Lecture de clés SSH, credentials AWS, tokens API
- Accès aux fichiers d'autres projets
- Modification de la configuration système
- Destruction de fichiers hors du projet

parcai résout ce problème en créant un **environnement shell isolé** où l'agent ne voit que le répertoire du projet courant.

## Principes de design

- **Overhead quasi nul** — utilise uniquement les primitives natives de l'OS
- **Démarrage instantané** — objectif < 50ms jusqu'au shell interactif
- **Sans root** — dégrade gracieusement si les privilèges ne sont pas disponibles
- **Code minimal** — un seul script shell
- **Isolation stricte** — aucun accès en dehors de \`$PWD\``,
    },
    {
      slug: "concept",
      title: "Concept",
      content: `# Concept

## Fonctionnement

parcai lance un shell interactif où le processus est confiné au répertoire de travail courant. Le reste du système de fichiers est invisible, les secrets sont inaccessibles, et les commandes système destructrices échouent.

## Modèle de menace

### Protections assurées

parcai protège contre :

- 🔒 **Lecture de secrets** — clés SSH, credentials AWS, tokens, etc.
- 🔒 **Accès aux autres projets** — isolation complète du répertoire courant
- 🔒 **Destruction de fichiers** — impossible de modifier quoi que ce soit hors du projet
- 🔒 **Espionnage système** — pas de visibilité sur l'état du système ni les processus
- 🔒 **Kill de processus externes** — impossible de terminer des processus hors du sandbox
- 🔒 **Modification de config système** — aucun accès en écriture au système
- 🔒 **Exfiltration réseau** — les fichiers locaux ne peuvent pas être envoyés via le réseau
- 🔒 **Daemons persistants** — impossible de lancer des processus qui survivent au sandbox

### Hors périmètre

- Exploits kernel ou zero-days du sandbox
- Attaquants déterminés avec connaissance du mécanisme de sandbox
- Attaques réseau (utiliser \`--no-network\` si nécessaire)`,
    },
    {
      slug: "installation",
      title: "Installation",
      content: `# Installation

## Prérequis

- **macOS** ou **Linux**
- Un shell compatible (bash, zsh)

## Installation

parcai est un script shell autonome. Clonez le repository et utilisez-le directement :

\`\`\`bash
git clone https://github.com/vbarrai/parcai.git
cd parcai
\`\`\`

## Utilisation rapide

Depuis votre répertoire de projet :

\`\`\`bash
cd mon-projet
parcai
\`\`\`

Le script crée automatiquement un environnement isolé confiné au répertoire courant.`,
    },
    {
      slug: "utilisation",
      title: "Utilisation",
      content: `# Utilisation

## Commandes de base

\`\`\`bash
# Entrer dans le sandbox (répertoire courant)
parcai

# Désactiver le réseau
parcai --no-network

# Autoriser des chemins supplémentaires
parcai --allow /chemin/vers/repertoire

# Appliquer les changements automatiquement à la sortie
parcai --apply
\`\`\`

## Options CLI

| Option | Description |
|---|---|
| *(aucune)* | Lance le sandbox dans le répertoire courant |
| \`--no-network\` | Désactive tout accès réseau |
| \`--allow <chemin>\` | Autorise l'accès à un répertoire supplémentaire |
| \`--apply\` | Applique les changements automatiquement à la sortie |

## Workflow type

1. Naviguer vers le répertoire de votre projet
2. Lancer \`parcai\` pour entrer dans le sandbox
3. Travailler normalement — le shell est restreint au projet
4. À la sortie, parcai affiche un résumé des changements
5. Confirmer ou annuler l'application des modifications`,
    },
    {
      slug: "architecture",
      title: "Architecture",
      content: `# Architecture

parcai utilise les primitives natives de chaque OS pour créer une isolation sans overhead.

## macOS — sandbox-exec + APFS cloning

Sur macOS, parcai utilise \`sandbox-exec\` combiné au clonage APFS :

1. **Clonage instantané** — APFS crée une copie copy-on-write du répertoire projet en quelques millisecondes
2. **Sandbox-exec** — le shell est confiné à ce clone via les profils sandbox macOS
3. **Isolation** — l'agent travaille sur le clone, l'original reste intact
4. **Application** — à la sortie, les diffs sont présentés pour validation

### Avantages
- Clonage quasi-instantané grâce à APFS (copy-on-write)
- Aucune copie physique de fichiers
- Isolation native via le kernel macOS

## Linux — Namespaces + overlayfs

Sur Linux, parcai combine les namespaces kernel avec overlayfs :

1. **Namespaces** — création de namespaces isolés (filesystem, PID, optionnellement réseau)
2. **Overlayfs** — le répertoire projet est monté en overlay avec une couche supérieure tmpfs
3. **pivot_root** — le filesystem racine est remplacé par l'overlay
4. **Isolation** — les écritures sont absorbées par la couche tmpfs

### Avantages
- Isolation complète du filesystem, PID et réseau
- Zero overhead en lecture (accès direct aux fichiers originaux)
- Les écritures n'affectent jamais le filesystem réel

## Réseau

Le réseau est **activé par défaut** car les agents AI ont besoin d'accéder aux APIs (Claude, OpenAI, etc.). L'option \`--no-network\` permet de couper totalement le réseau :

- **Linux** : désactive le namespace réseau (seul loopback reste)
- **macOS** : bloque les connexions sortantes via le profil sandbox`,
    },
    {
      slug: "securite",
      title: "Sécurité",
      content: `# Sécurité

## Profils de sandbox

parcai utilise des profils de sandbox prédéfinis situés dans le répertoire \`profiles/\` du repository.

## Technologies utilisées

| OS | Technologie | Overhead |
|---|---|---|
| macOS | sandbox-exec + APFS | ~0ms |
| Linux | namespaces + overlayfs | ~0ms |

## Comparaison avec d'autres approches

| Approche | Démarrage | Overhead | Isolation |
|---|---|---|---|
| **parcai** | < 50ms | Quasi nul | Forte |
| Docker | ~1-3s | Modéré | Forte |
| VM | ~10-30s | Élevé | Très forte |
| chroot | < 50ms | Quasi nul | Faible |

## Bonnes pratiques

1. **Toujours utiliser \`--no-network\`** si l'agent n'a pas besoin d'accès réseau
2. **Vérifier le résumé des changements** avant d'appliquer avec \`--apply\`
3. **Ne pas stocker de secrets** dans le répertoire du projet
4. **Utiliser des variables d'environnement** pour les tokens et clés API`,
    },
  ],
};

const murmuraiDocs: ProjectDocs = {
  sections: [
    {
      slug: "introduction",
      title: "Introduction",
      content: `# Introduction

**murmurai** est un outil de transcription vocale push-to-talk pour macOS. Maintenez une touche, parlez, relâchez — votre voix est transcrite localement et le texte est collé automatiquement à la position du curseur.

## Pourquoi murmurai ?

Taper du texte est parfois moins efficace que de le dicter. murmurai permet de :

- **Dicter du texte** dans n'importe quelle application
- **Transcrire hors-ligne** sans envoyer d'audio à un serveur
- **Obtenir des résultats instantanés** grâce au streaming en temps réel
- **Garder le contrôle** avec un simple raccourci push-to-talk

## Comment ça marche

1. Maintenez la touche **Option droite** (par défaut)
2. Parlez naturellement
3. Relâchez la touche
4. Le texte transcrit est automatiquement collé à la position du curseur

## Caractéristiques

- **100% hors-ligne** — aucune clé API requise
- **Streaming** — transcription en temps réel pendant que vous parlez
- **Collage automatique** — le texte est inséré directement dans l'application active
- **Configurable** — choix du modèle Whisper (tiny à large-v3)
- **Léger** — tourne en arrière-plan dans la barre de menu macOS`,
    },
    {
      slug: "concept",
      title: "Concept",
      content: `# Concept

## Architecture

murmurai est une application macOS basée sur plusieurs composants :

### faster-whisper

Le moteur de transcription est [faster-whisper](https://github.com/SYSTRAN/faster-whisper), une implémentation optimisée du modèle Whisper d'OpenAI. Il offre une transcription rapide et précise sans nécessiter de GPU.

### Push-to-talk

Le système push-to-talk utilise \`pyobjc-framework-Quartz\` pour écouter les événements clavier globaux sur macOS. Quand la touche configurée est maintenue :

1. L'enregistrement audio démarre via \`sounddevice\`
2. L'audio est transcrit en streaming par faster-whisper
3. Au relâchement, la transcription finale est envoyée au presse-papier
4. Un événement Cmd+V est simulé via System Events pour coller le texte

### Application menu bar

murmurai utilise \`rumps\` pour s'intégrer dans la barre de menu macOS, offrant un accès rapide aux contrôles et à l'état de la transcription.

## Stack technique

| Composant | Bibliothèque |
|---|---|
| Transcription | faster-whisper >= 1.0.0 |
| Hotkey global | pyobjc-framework-Quartz >= 9.0 |
| Capture audio | sounddevice >= 0.4.6 |
| Fichiers audio | soundfile >= 0.12.1 |
| Calcul | numpy >= 1.24.0 |
| Menu bar | rumps >= 0.4.0 |
| Build | PyInstaller >= 6.0.0 (optionnel) |`,
    },
    {
      slug: "installation",
      title: "Installation",
      content: `# Installation

## Prérequis

- **macOS** (requis)
- **Python** >= 3.9
- ~500 Mo d'espace disque (pour le modèle \`small\`)

## Installation depuis les sources

\`\`\`bash
git clone https://github.com/vbarrai/murmurai.git
cd murmurai
python3 -m venv .venv
source .venv/bin/activate
pip install -e .
\`\`\`

Le modèle Whisper (~500 Mo pour \`small\`) se télécharge automatiquement au premier lancement.

## Permissions macOS

Vous devez autoriser murmurai dans **Réglages système > Confidentialité et sécurité** :

| Permission | Raison |
|---|---|
| **Accessibilité** | Écoute du raccourci clavier global |
| **Microphone** | Enregistrement audio |
| **Automation (System Events)** | Simulation de Cmd+V pour le collage |

## Lancement

\`\`\`bash
source .venv/bin/activate
murmurai
\`\`\`

murmurai apparaît dans la barre de menu macOS.`,
    },
    {
      slug: "utilisation",
      title: "Utilisation",
      content: `# Utilisation

## Raccourci par défaut

Maintenez la touche **Option droite** pour enregistrer. Relâchez pour transcrire et coller le texte.

## Workflow

1. Lancez \`murmurai\` — l'icône apparaît dans la barre de menu
2. Placez votre curseur dans un champ de texte
3. Maintenez **Option droite**
4. Parlez naturellement
5. Relâchez — le texte est transcrit et collé automatiquement

## Logs

Les logs sont disponibles dans :

\`\`\`
~/Library/Logs/murmurai/murmurai.log
\`\`\`

Utile pour diagnostiquer les problèmes de permissions ou de modèle.`,
    },
    {
      slug: "configuration",
      title: "Configuration",
      content: `# Configuration

## Modèles Whisper

Le modèle Whisper est configurable dans \`murmurai/transcriber.py\`. Voici les modèles disponibles :

| Modèle | Taille | Vitesse | Qualité |
|---|---|---|---|
| \`tiny\` | ~75 Mo | Très rapide | Basique |
| \`base\` | ~150 Mo | Rapide | Correcte |
| \`small\` | ~500 Mo | Modérée | Bonne |
| \`medium\` | ~1.5 Go | Lente | Très bonne |
| \`large-v3\` | ~3 Go | Très lente | Meilleure |

Le modèle par défaut est \`small\`, offrant un bon compromis entre vitesse et qualité.

## Choix du modèle

- **tiny/base** — pour les machines moins puissantes ou quand la vitesse prime
- **small** — recommandé pour la plupart des usages (défaut)
- **medium** — pour une meilleure précision, notamment en français
- **large-v3** — qualité maximale, nécessite plus de RAM et de CPU`,
    },
    {
      slug: "build",
      title: "Build standalone",
      content: `# Build standalone

murmurai peut être compilé en une application macOS standalone (\`.app\`) pour un usage sans terminal.

## Prérequis

Installez les dépendances de build :

\`\`\`bash
pip install -e ".[build]"
\`\`\`

## Compilation

\`\`\`bash
# Compiler uniquement
make build

# Compiler et installer dans /Applications
make install
\`\`\`

## Résultat

- \`make build\` produit \`dist/murmurai.app\`
- \`make install\` copie l'application dans \`/Applications/murmurai.app\`

## Fichier de spec

La configuration PyInstaller est définie dans \`murmurai.spec\` à la racine du repository. Ce fichier contrôle :

- Les fichiers inclus dans le bundle
- Les dépendances embarquées
- L'icône et les métadonnées de l'application`,
    },
  ],
};

export const allDocs: Record<string, ProjectDocs> = {
  maconfai: maconfaiDocs,
  parcai: parcaiDocs,
  murmurai: murmuraiDocs,
};

export const projectMeta: Record<
  string,
  {
    name: string;
    accentText: string;
    accentBg: string;
    accentBorder: string;
    gradientFrom: string;
    gradientTo: string;
    repo: string;
  }
> = {
  maconfai: {
    name: "maconfai",
    accentText: "text-indigo-400",
    accentBg: "bg-indigo-500/10",
    accentBorder: "border-indigo-500/20",
    gradientFrom: "from-indigo-500",
    gradientTo: "to-violet-500",
    repo: "https://github.com/vbarrai/maconfai",
  },
  parcai: {
    name: "parcai",
    accentText: "text-cyan-400",
    accentBg: "bg-cyan-500/10",
    accentBorder: "border-cyan-500/20",
    gradientFrom: "from-cyan-500",
    gradientTo: "to-blue-500",
    repo: "https://github.com/vbarrai/parcai",
  },
  murmurai: {
    name: "murmurai",
    accentText: "text-violet-400",
    accentBg: "bg-violet-500/10",
    accentBorder: "border-violet-500/20",
    gradientFrom: "from-violet-500",
    gradientTo: "to-purple-500",
    repo: "https://github.com/vbarrai/murmurai",
  },
};
