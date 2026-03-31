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
      "Comprendre le fonctionnement de murmurai et sa philosophie.",
    content: [
      {
        heading: "Le problème",
        body: `La saisie de texte au clavier est parfois plus lente que la parole, surtout pour des phrases longues ou de la rédaction libre. Les solutions de dictée existantes sont soit basées sur le cloud (vie privée, latence, coût), soit complexes à configurer.

murmurai propose une alternative simple : un outil push-to-talk qui transcrit votre voix localement et colle le texte là où se trouve votre curseur.`,
      },
      {
        heading: "La solution murmurai",
        body: `murmurai repose sur quatre principes :

1. 100% hors-ligne — Tout le traitement se fait localement grâce à faster-whisper, une implémentation optimisée d'OpenAI Whisper. Aucune donnée audio ne quitte votre Mac.

2. Push-to-talk — Maintenez la touche Option droite (⌥), parlez, relâchez. Pas de commande vocale "start" / "stop", pas de bouton à cliquer.

3. Zéro friction — Le texte transcrit est automatiquement collé à la position du curseur via une simulation de Cmd+V. Pas de fenêtre intermédiaire, pas de copier-coller manuel.

4. Mode Agent — Un second raccourci envoie votre voix et le texte sélectionné à un modèle Ollama local. La réponse AI remplace directement la sélection. Ollama est optionnel et n'est requis que pour ce mode.

murmurai intègre également un système de fusion bilingue FR/EN avec un dictionnaire de ~100 termes de jargon technique, corrigeant automatiquement les termes mal reconnus (ex. "commettre" → "commit").`,
      },
      {
        heading: "Mode Agent",
        body: `Le Mode Agent est un second mode d'interaction qui transforme murmurai en assistant AI vocal :

1. Sélectionnez du texte dans n'importe quelle application
2. Maintenez la touche Agent (configurable)
3. Dictez votre instruction vocale (ex. "refactorise cette fonction", "traduis en anglais")
4. Relâchez la touche — murmurai envoie votre instruction + le texte sélectionné au modèle Ollama local
5. La réponse AI remplace directement la sélection

Le Mode Agent nécessite Ollama installé localement. Le modèle Ollama est sélectionnable dynamiquement depuis la barre de menu. Le streaming des réponses et l'annulation sont supportés.`,
      },
      {
        heading: "Fusion bilingue",
        body: `murmurai gère nativement la transcription bilingue français/anglais. Le système de fusion locale corrige automatiquement les termes techniques mal reconnus grâce à un dictionnaire de ~100 termes de jargon.

Par exemple, Whisper peut transcrire "commettre" au lieu de "commit", ou "pousser" au lieu de "push". Le dictionnaire de jargon détecte et corrige ces erreurs en post-traitement, préservant la structure de phrase française tout en maintenant les termes techniques anglais corrects.

Les utilisateurs peuvent ajouter leurs propres termes dans le fichier de configuration ~/.config/murmurai/config.json.`,
      },
      {
        heading: "Transcription en streaming",
        body: `murmurai ne transcrit pas seulement après l'enregistrement — il traite l'audio en temps réel pendant que vous parlez (streaming). Cela signifie que le résultat est disponible quasi instantanément au moment où vous relâchez la touche.

Le pipeline audio est optimisé pour minimiser la latence tout en maintenant une bonne qualité de transcription.`,
      },
      {
        heading: "Modèles Whisper",
        body: `murmurai utilise faster-whisper, une réimplémentation de Whisper en CTranslate2 qui offre des performances 4x supérieures à l'implémentation originale d'OpenAI.

Cinq tailles de modèle sont disponibles, du plus léger (tiny, ~75 Mo) au plus précis (large-v3, ~3 Go). Le modèle par défaut est "small" (~500 Mo), qui offre un bon équilibre entre vitesse et qualité.`,
      },
    ],
    prev: { slug: "", label: "Introduction" },
    next: { slug: "installation", label: "Installation" },
  },

  installation: {
    title: "Installation",
    description: "Guide d'installation de murmurai sur macOS.",
    content: [
      {
        heading: "Installation via Homebrew (recommandée)",
        body: "La méthode la plus simple pour installer et mettre à jour murmurai :",
        code: `brew install --cask vbarrai/tap/murmurai`,
      },
      {
        heading: "Installation via DMG",
        body: `Vous pouvez aussi télécharger le DMG depuis la page GitHub Releases :

1. Rendez-vous sur https://github.com/vbarrai/murmurai/releases
2. Téléchargez le fichier murmurai.dmg de la dernière version
3. Ouvrez le DMG et glissez murmurai dans /Applications
4. Lancez murmurai depuis /Applications

Le modèle Whisper (~500 Mo pour "small") se télécharge automatiquement au premier lancement.`,
      },
      {
        heading: "Prérequis",
        body: `murmurai fonctionne exclusivement sur macOS. Pour l'installation via DMG, vous avez uniquement besoin de :

• macOS (version récente recommandée)
• Un microphone (intégré ou externe)
• ~500 Mo d'espace disque pour le modèle Whisper "small"

Pour l'installation développeur, ajoutez :
• Python 3.9 ou supérieur`,
      },
      {
        heading: "Installation développeur — Cloner le repository",
        body: "Pour contribuer ou modifier le code source, commencez par cloner le repository GitHub :",
        code: `git clone https://github.com/vbarrai/murmurai
cd murmurai`,
      },
      {
        heading: "Installation développeur — Environnement virtuel",
        body: "Créez et activez un environnement Python isolé :",
        code: `python3 -m venv .venv
source .venv/bin/activate`,
      },
      {
        heading: "Installation développeur — pip install",
        body: "Installez murmurai en mode développement (editable) :",
        code: `pip install -e .`,
      },
      {
        heading: "Premier lancement",
        body: "Lancez murmurai — le modèle Whisper sera téléchargé automatiquement au premier lancement (~500 Mo pour le modèle \"small\") :",
        code: `murmurai`,
      },
      {
        heading: "Permissions macOS",
        body: `Au premier lancement, macOS vous demandera trois permissions :

1. Accessibilité — Nécessaire pour détecter le raccourci clavier global (Option droite). Accordez cette permission dans Préférences Système > Confidentialité > Accessibilité.

2. Microphone — Nécessaire pour capturer l'audio. La permission est demandée automatiquement.

3. Automation (System Events) — Nécessaire pour simuler le collage (Cmd+V) à la position du curseur.

Ces permissions sont demandées automatiquement lors du premier lancement. L'application s'active immédiatement après autorisation, sans redémarrage.`,
      },
    ],
    prev: { slug: "concept", label: "Concept" },
    next: { slug: "utilisation", label: "Utilisation" },
  },

  utilisation: {
    title: "Utilisation",
    description: "Guide pratique des modes Transcript et Agent.",
    content: [
      {
        heading: "Lancer murmurai",
        body: `Si vous avez installé via DMG, ouvrez simplement murmurai depuis /Applications ou Spotlight.

En mode développeur, activez votre environnement virtuel et lancez murmurai :`,
        code: `source .venv/bin/activate
murmurai`,
      },
      {
        heading: "Mode Transcript",
        body: `Le Mode Transcript est le mode principal de dictée push-to-talk :

1. Placez votre curseur là où vous voulez insérer du texte (éditeur de code, navigateur, chat, email…)
2. Maintenez la touche Option droite (⌥) enfoncée
3. Parlez naturellement
4. Relâchez la touche Option droite
5. Le texte transcrit est automatiquement collé à la position du curseur

La transcription se fait en streaming — le texte est prêt quasi instantanément quand vous relâchez la touche.`,
      },
      {
        heading: "Mode Agent",
        body: `Le Mode Agent permet d'envoyer une instruction vocale et du texte sélectionné à un modèle Ollama local :

1. Sélectionnez du texte dans n'importe quelle application
2. Maintenez la touche Agent (configurable dans ~/.config/murmurai/config.json)
3. Dictez votre instruction vocale (ex. "refactorise cette fonction", "traduis en anglais")
4. Relâchez la touche — murmurai envoie l'instruction + le texte sélectionné au modèle Ollama
5. La réponse AI remplace directement la sélection

Le Mode Agent nécessite Ollama installé localement. Le modèle Ollama est sélectionnable dynamiquement depuis la barre de menu. Vous pouvez annuler une requête en cours à tout moment.`,
      },
      {
        heading: "HUD overlay",
        body: `murmurai affiche un HUD overlay visuel indiquant l'état du traitement en cours :

• Enregistrement — Le HUD s'affiche quand vous maintenez la touche push-to-talk, confirmant que l'audio est capturé.
• Transcription — Pendant le traitement de l'audio par Whisper, le HUD indique que la transcription est en cours.
• Traitement Agent — En Mode Agent, le HUD affiche l'état de la requête Ollama (envoi, streaming de la réponse).

Le HUD disparaît automatiquement une fois le traitement terminé.`,
      },
      {
        heading: "Cas d'usage",
        body: `murmurai est particulièrement utile pour :

• Rédiger des emails ou messages longs
• Écrire des commentaires de code ou de la documentation
• Prendre des notes rapidement
• Dicter du texte dans n'importe quelle application
• Répondre dans un chat ou un terminal
• Refactoriser du code via le Mode Agent
• Traduire du texte sélectionné via instruction vocale

Le texte est collé dans n'importe quelle application qui accepte Cmd+V.`,
      },
      {
        heading: "Logs et diagnostic",
        body: "Les logs de l'application sont accessibles depuis le menu \"Open Logs\" ou directement dans le fichier dédié :",
        code: `# Emplacement des logs
~/Library/Logs/murmurai/murmurai.log

# Consulter les logs en temps réel
tail -f ~/Library/Logs/murmurai/murmurai.log`,
      },
    ],
    prev: { slug: "installation", label: "Installation" },
    next: { slug: "configuration", label: "Configuration" },
  },

  configuration: {
    title: "Configuration",
    description: "Configurer murmurai via le fichier de configuration, les modèles et les raccourcis.",
    content: [
      {
        heading: "Fichier de configuration",
        body: `murmurai se configure via le fichier ~/.config/murmurai/config.json. Ce fichier est créé automatiquement au premier lancement avec les valeurs par défaut. Vous pouvez le modifier pour personnaliser le comportement de murmurai.`,
        code: `{
  "model_size": "small",
  "language": "fr",
  "hotkey_transcript": "right_option",
  "hotkey_agent": "right_command",
  "ollama_model": "llama3",
  "jargon": {
    "commettre": "commit",
    "pousser": "push",
    "tirer": "pull",
    "fusionner": "merge"
  }
}`,
      },
      {
        heading: "Modèles Whisper disponibles",
        body: `murmurai supporte cinq tailles de modèle Whisper. Le choix du modèle affecte la vitesse de transcription et la qualité :

| Modèle   | Taille    | Vitesse     | Qualité     |
|----------|-----------|-------------|-------------|
| tiny     | ~75 Mo    | Très rapide | Basique     |
| base     | ~150 Mo   | Rapide      | Correcte    |
| small    | ~500 Mo   | Modérée     | Bonne       |
| medium   | ~1.5 Go   | Lente       | Très bonne  |
| large-v3 | ~3 Go     | Très lente  | Meilleure   |

Le modèle par défaut est "small", qui offre le meilleur compromis entre vitesse et qualité pour un usage quotidien. Le modèle est également sélectionnable directement depuis la barre de menu de murmurai.`,
      },
      {
        heading: "Changer le modèle",
        body: `Le modèle Whisper peut être changé de deux façons :

1. Depuis la barre de menu — Cliquez sur l'icône murmurai dans la barre de menu et sélectionnez la taille de modèle souhaitée. Le changement est immédiat.

2. Via le fichier de configuration — Modifiez la clé "model_size" dans ~/.config/murmurai/config.json.

Le modèle sera téléchargé automatiquement si nécessaire (la première fois uniquement).`,
        code: `# Dans ~/.config/murmurai/config.json
# Changer "small" par "tiny", "base", "medium" ou "large-v3"
"model_size": "small"`,
      },
      {
        heading: "Touche de raccourci",
        body: `Les raccourcis clavier sont configurables via le fichier ~/.config/murmurai/config.json :

• hotkey_transcript — Touche pour le Mode Transcript (défaut : Option droite). Maintenez pour dicter, relâchez pour transcrire et coller.
• hotkey_agent — Touche pour le Mode Agent (défaut : Command droite). Maintenez pour dicter une instruction, relâchez pour envoyer à Ollama.

Il n'est plus nécessaire de modifier le code source pour changer les raccourcis.`,
        code: `# Dans ~/.config/murmurai/config.json
"hotkey_transcript": "right_option",
"hotkey_agent": "right_command"`,
      },
      {
        heading: "Dictionnaire de jargon",
        body: `murmurai intègre un dictionnaire de ~100 termes de jargon technique pour corriger les erreurs courantes de transcription bilingue FR/EN. Par exemple :

• "commettre" → "commit"
• "pousser" → "push"
• "tirer" → "pull"
• "fusionner" → "merge"
• "déployer" → "deploy"

Les termes sont appliqués en post-traitement via une fusion locale (sans Ollama). Vous pouvez ajouter vos propres termes dans la section "jargon" du fichier de configuration :`,
        code: `# Dans ~/.config/murmurai/config.json
"jargon": {
  "commettre": "commit",
  "pousser": "push",
  "mon terme": "my_term"
}`,
      },
      {
        heading: "Langue de transcription",
        body: `La langue de transcription est configurable dans ~/.config/murmurai/config.json via la clé "language". murmurai supporte la transcription bilingue FR/EN nativement, avec fusion locale de jargon.

faster-whisper supporte plus de 90 langues. La détection automatique est également disponible si aucune langue n'est spécifiée.`,
      },
      {
        heading: "Modèles Ollama",
        body: `Le Mode Agent nécessite Ollama installé localement (https://ollama.ai). Ollama n'est pas requis pour le Mode Transcript.

Le modèle Ollama utilisé par le Mode Agent est sélectionnable dynamiquement depuis la barre de menu de murmurai. murmurai détecte automatiquement les modèles disponibles dans votre installation Ollama.

Vous pouvez également définir un modèle par défaut dans le fichier de configuration :`,
        code: `# Dans ~/.config/murmurai/config.json
"ollama_model": "llama3"`,
      },
    ],
    prev: { slug: "utilisation", label: "Utilisation" },
    next: { slug: "architecture", label: "Architecture" },
  },

  architecture: {
    title: "Architecture",
    description: "Structure interne du projet et modules Python.",
    content: [
      {
        heading: "Stack technique",
        body: `murmurai est construit avec :

• Python 3.9+ — Langage principal (99.2% du code)
• faster-whisper — Transcription vocale (CTranslate2)
• pyobjc-framework-Quartz — Détection de touches macOS
• sounddevice + soundfile — Capture et traitement audio
• numpy — Traitement numérique des signaux audio
• rumps — Menu bar macOS
• Ollama (optionnel) — Modèles AI locaux pour le Mode Agent
• PyInstaller — Packaging en app standalone`,
      },
      {
        heading: "Modules source",
        body: "Le code source est organisé en modules dans le répertoire murmurai/ :",
        code: `murmurai/
├── __init__.py       # Point d'entrée du package
├── app.py            # Application principale, boucle push-to-talk
│                     # Détection hotkey, orchestration des modules
├── recorder.py       # Capture audio via sounddevice
│                     # Gestion du microphone et du buffer
├── transcriber.py    # Transcription via faster-whisper
│                     # Configuration du modèle, streaming
├── paster.py         # Collage automatique via System Events
│                     # Simulation de Cmd+V à la position curseur
├── agent.py          # Mode Agent — communication avec Ollama
│                     # Streaming réponses, annulation
├── hud.py            # HUD overlay — affichage statut
│                     # (recording, transcribing, processing)
├── jargon.py         # Fusion bilingue FR/EN
│                     # Dictionnaire de ~100 termes techniques
└── (pyproject.toml)  # Métadonnées, dépendances, entry point`,
      },
      {
        heading: "Pipeline audio — Mode Transcript",
        body: `Le flux de données du Mode Transcript suit un pipeline linéaire :

1. recorder.py — Capture l'audio du microphone en temps réel via sounddevice. L'audio est bufferisé en segments.

2. transcriber.py — Reçoit les segments audio et les transcrit via faster-whisper en mode streaming. Les résultats partiels sont accumulés.

3. jargon.py — Applique la fusion bilingue FR/EN et corrige les termes techniques via le dictionnaire de jargon.

4. paster.py — Prend le texte transcrit final et simule un Cmd+V pour le coller à la position du curseur.

5. app.py — Orchestre tout le pipeline : détecte l'appui/relâchement de la touche, démarre/arrête l'enregistrement, lance la transcription et déclenche le collage.`,
      },
      {
        heading: "Pipeline audio — Mode Agent",
        body: `Le Mode Agent étend le pipeline avec une étape Ollama :

1. recorder.py — Capture l'audio de l'instruction vocale.

2. transcriber.py — Transcrit l'instruction vocale.

3. agent.py — Récupère le texte sélectionné dans l'application active, construit un prompt combinant l'instruction vocale et la sélection, envoie le tout au modèle Ollama local. La réponse est streamée en temps réel.

4. paster.py — Remplace la sélection originale par la réponse d'Ollama.

5. hud.py — Affiche l'état du traitement (recording, transcribing, processing) tout au long du pipeline. L'utilisateur peut annuler à tout moment.`,
      },
      {
        heading: "Système de jargon",
        body: `Le module jargon.py gère la fusion bilingue FR/EN en post-traitement :

1. Le texte transcrit par Whisper est analysé mot par mot.
2. Chaque mot est comparé au dictionnaire de ~100 termes techniques intégrés.
3. Les termes français correspondant à du jargon technique anglais sont remplacés (ex. "commettre" → "commit").
4. La structure de phrase française est préservée — seuls les termes techniques sont corrigés.

Le dictionnaire intégré couvre les termes courants du développement logiciel, DevOps, et de l'infrastructure. Les utilisateurs peuvent ajouter leurs propres termes via ~/.config/murmurai/config.json.`,
      },
      {
        heading: "Dépendances",
        body: `Les dépendances principales :

• pyobjc-framework-Quartz (>=9.0) — Accès bas niveau à macOS (événements clavier, écran)
• sounddevice (>=0.4.6) — Interface Python vers PortAudio pour la capture audio
• soundfile (>=0.12.1) — Lecture/écriture de fichiers audio
• numpy (>=1.24.0) — Tableaux numériques pour le traitement du signal
• faster-whisper (>=1.0.0) — Implémentation CTranslate2 de Whisper
• rumps (>=0.4.0) — Menu bar macOS natif

Dépendances optionnelles :
• ollama — Client Python pour communiquer avec Ollama (Mode Agent)
• pyinstaller (>=6.0.0) — Pour la création d'apps standalone`,
      },
    ],
    prev: { slug: "configuration", label: "Configuration" },
    next: { slug: "distribution", label: "Distribution" },
  },

  distribution: {
    title: "Distribution",
    description: "Installer et distribuer murmurai en tant qu'application macOS.",
    content: [
      {
        heading: "Installation via DMG",
        body: `La méthode recommandée pour installer murmurai est via le DMG disponible sur la page GitHub Releases :

1. Rendez-vous sur https://github.com/vbarrai/murmurai/releases
2. Téléchargez le fichier murmurai.dmg de la dernière version
3. Ouvrez le DMG et glissez murmurai dans /Applications
4. Lancez murmurai depuis /Applications ou Spotlight

Le modèle Whisper se télécharge automatiquement au premier lancement. Aucune installation de Python n'est requise.`,
      },
      {
        heading: "Build automatisé via GitHub Actions",
        body: `Le DMG est généré automatiquement via GitHub Actions. À chaque push d'un tag de version (ex. v0.2.0), le workflow CI :

1. Construit l'application via PyInstaller
2. Génère le DMG
3. Publie le DMG en tant qu'asset sur la page GitHub Releases

Cela garantit que chaque release dispose d'un DMG prêt à l'emploi.`,
      },
      {
        heading: "Build local — Dépendances",
        body: "Pour créer un build local, installez les dépendances de build (PyInstaller) :",
        code: `pip install -e ".[build]"`,
      },
      {
        heading: "Build local — Créer le bundle",
        body: "La commande make build génère un bundle .app dans le répertoire .build/ sans l'installer :",
        code: `make build`,
      },
      {
        heading: "Build local — Installer dans /Applications",
        body: "La commande make install crée le bundle et le copie automatiquement dans /Applications/ :",
        code: `make install`,
      },
      {
        heading: "Fonctionnement du build",
        body: `Le processus de build utilise PyInstaller avec le fichier de configuration murmurai.spec :

1. PyInstaller analyse les imports Python et collecte toutes les dépendances
2. Le modèle faster-whisper et les bibliothèques natives sont inclus
3. Un bundle macOS (.app) est généré, autonome et sans dépendance Python externe
4. L'app peut être distribuée et exécutée sur n'importe quel Mac compatible

Le fichier murmurai.spec contient la configuration PyInstaller — icônes, métadonnées, fichiers inclus, etc.`,
      },
      {
        heading: "Application standalone vs développement",
        body: `Il y a deux façons d'utiliser murmurai :

Mode DMG/standalone — Téléchargez le DMG depuis GitHub Releases ou créez-le localement. Application .app dans /Applications/. Pas besoin de Python installé, pas d'environnement virtuel. Double-cliquer pour lancer. Idéal pour un usage quotidien.

Mode développement — Exécution directe depuis le code source via python/pip. Idéal pour le développement et le test de modifications. Les changements de code sont immédiatement disponibles sans rebuild.`,
      },
    ],
    prev: { slug: "architecture", label: "Architecture" },
    next: { slug: "contribuer", label: "Contribuer" },
  },

  contribuer: {
    title: "Contribuer",
    description: "Comment contribuer au développement de murmurai.",
    content: [
      {
        heading: "Mise en place de l'environnement",
        body: "Clonez le repository et installez en mode développement :",
        code: `git clone https://github.com/vbarrai/murmurai
cd murmurai
python3 -m venv .venv
source .venv/bin/activate
pip install -e .`,
      },
      {
        heading: "Lancer en développement",
        body: "En mode développement, les modifications du code source sont immédiatement disponibles grâce à l'installation editable (pip install -e .) :",
        code: `# Lancer murmurai
murmurai

# Les modifications dans murmurai/*.py sont prises en
# compte immédiatement au prochain lancement`,
      },
      {
        heading: "Structure des fichiers à modifier",
        body: `Les fichiers principaux à connaître :

• murmurai/app.py — Logique principale, boucle push-to-talk, détection hotkey
• murmurai/recorder.py — Capture audio, gestion du microphone
• murmurai/transcriber.py — Transcription Whisper, configuration du modèle
• murmurai/paster.py — Collage automatique via System Events
• pyproject.toml — Dépendances et métadonnées du package
• murmurai.spec — Configuration PyInstaller pour le build standalone
• Makefile — Commandes de build et d'installation`,
      },
      {
        heading: "Tester les builds",
        body: "Vérifiez que l'application se compile correctement en standalone :",
        code: `# Installer les dépendances de build
pip install -e ".[build]"

# Créer le bundle (sans installer)
make build

# Ou créer et installer dans /Applications
make install`,
      },
      {
        heading: "Liens utiles",
        body: `• Repository GitHub : github.com/vbarrai/murmurai
• Issues : github.com/vbarrai/murmurai/issues
• faster-whisper : github.com/SYSTRAN/faster-whisper
• Licence : MIT`,
      },
    ],
    prev: { slug: "distribution", label: "Distribution" },
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
  if (!doc) return { title: "Page introuvable — murmurai docs" };
  return {
    title: `${doc.title} — murmurai docs`,
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
              <div className="glass-card rounded-xl border border-violet-500/20 p-5">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-3 h-3 rounded-full bg-red-500/60" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
                  <div className="w-3 h-3 rounded-full bg-green-500/60" />
                </div>
                <pre className="font-mono text-sm text-violet-400 overflow-x-auto whitespace-pre">
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
                ? `/murmurai/docs/${doc.prev.slug}`
                : "/murmurai/docs"
            }
            className="flex items-center gap-2 text-sm text-zinc-400 hover:text-violet-400 transition-colors group"
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
            href={`/murmurai/docs/${doc.next.slug}`}
            className="flex items-center gap-2 text-sm text-zinc-400 hover:text-violet-400 transition-colors group"
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
