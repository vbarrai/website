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

murmurai intègre également un dictionnaire de ~100 termes de jargon technique, appliqué en post-traitement pour corriger les termes anglais francisés par Whisper (ex. "commiter" → "commit").`,
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
        heading: "Correction du jargon technique",
        body: `Quand on dicte du français parsemé de termes techniques anglais, Whisper a tendance à les franciser : "commit" devient "commiter", "push" devient "pousher", "debug" devient "débugger".

murmurai corrige ces termes en post-traitement. Après la passe de transcription française, le texte est comparé à un dictionnaire d'environ 100 termes techniques, chacun associé aux variantes francisées que Whisper peut produire. La correspondance est insensible à la casse et purement locale — une recherche par expression régulière, sans appel réseau ni LLM.

Seules les variantes franglaises sont listées. Les vrais mots français ("pousser", "fusionner", …) en sont volontairement absents : quand le terme anglais est effectivement prononcé en anglais, Whisper le transcrit déjà correctement, et réécrire de vrais mots français corromprait des phrases ordinaires.

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
        body: `Au premier lancement, macOS vous demandera deux permissions :

1. Accessibilité — Nécessaire pour détecter le raccourci clavier global (Option droite) et pour coller le texte à la position du curseur. Accordez cette permission dans Réglages Système > Confidentialité et sécurité > Accessibilité.

2. Microphone — Nécessaire pour capturer l'audio. La permission est demandée automatiquement.

Ces permissions sont demandées automatiquement lors du premier lancement. L'application s'active immédiatement après autorisation, sans redémarrage.

Les versions antérieures exigeaient une troisième permission, Automation (System Events), parce que le collage passait par osascript. Le collage émet désormais un Cmd+V synthétique via CGEvent, déjà couvert par l'Accessibilité — cette demande a donc disparu. Si elle apparaît encore dans les Réglages Système, vous pouvez la révoquer.`,
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

La transcription démarre au relâchement de la touche : l'audio est enregistré tant que vous maintenez, puis transcrit d'un bloc. Une icône configurable (🎙️ par défaut) peut être ajoutée devant le texte collé, pour que vos interlocuteurs — sur Slack par exemple — reconnaissent une transcription vocale.`,
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

• Enregistrement — Le HUD s'affiche quand vous maintenez la touche push-to-talk, avec un waveform en direct alimenté par le niveau du micro : vous voyez immédiatement si votre voix est bien captée.
• Transcription — Pendant le traitement de l'audio par Whisper, le HUD indique que la transcription est en cours et affiche le texte au fur et à mesure.
• Traitement Agent — En Mode Agent, le HUD affiche le texte sélectionné, votre instruction, puis la réponse Ollama streamée en direct.

Le HUD disparaît automatiquement une fois le traitement terminé. Un bouton ✕ dans son coin, ou la touche Échap, annule l'opération en cours.`,
      },
      {
        heading: "Options de la barre de menu",
        body: `L'icône murmurai dans la barre de menu donne accès à tous les réglages :

• Transcript key / Agent key — Touche déclenchant chaque mode
• Transcript icon — Icône ajoutée devant le texte collé, ou "Aucun"
• Model — Taille du modèle Whisper
• Microphone — Périphérique d'entrée, ou le défaut système
• Sound effects — Sons de feedback au début et à la fin d'une opération
• Mute while recording — Coupe les haut-parleurs pendant l'enregistrement
• Launch at login — Lance murmurai à l'ouverture de session
• Ollama — État de connexion, modèle Agent, rafraîchissement
• Edit Settings… — Ouvre config.json ; les modifications sont appliquées à chaud
• Open Logs… — Ouvre le fichier de log`,
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
        body: `murmurai se configure via le fichier ~/.config/murmurai/config.json. Les valeurs absentes retombent sur les défauts ; le fichier est matérialisé quand vous ouvrez "Edit Settings…" ou changez un réglage depuis la barre de menu.

Les modifications du fichier sont prises en compte à chaud : murmurai surveille config.json et réapplique vos changements dans les deux secondes suivant la sauvegarde, sans redémarrage. Les raccourcis, l'icône de transcript, le microphone, le modèle Ollama et les interrupteurs prennent effet immédiatement ; changer whisper_model recharge le modèle en arrière-plan. Une valeur invalide (raccourci inconnu, même touche pour les deux actions, modèle Whisper inconnu) est ignorée et l'ancien réglage conservé — un ⚠️ apparaît alors devant "Edit Settings…".`,
        code: `{
  "whisper_model": "small",
  "transcript_key": "Right Option",
  "agent_key": "Right Command",
  "agent_model": "gpt-oss:20b",
  "transcript_icon": "🎙️",
  "microphone": "",
  "sounds": true,
  "mute_while_recording": false,
  "launch_at_login": false,
  "jargon": {
    "kubectl": ["kubecétéèle"],
    "terraform": ["terraformer"]
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

2. Via le fichier de configuration — Modifiez la clé "whisper_model" dans ~/.config/murmurai/config.json.

Le modèle sera téléchargé automatiquement si nécessaire (la première fois uniquement).`,
        code: `# Dans ~/.config/murmurai/config.json
# Changer "small" par "tiny", "base", "medium" ou "large-v3"
"whisper_model": "small"`,
      },
      {
        heading: "Touche de raccourci",
        body: `Les raccourcis clavier se changent depuis la barre de menu (sous-menus "Transcript key" et "Agent key") ou directement dans ~/.config/murmurai/config.json :

• transcript_key — Touche pour le Mode Transcript (défaut : Right Option). Maintenez pour dicter, relâchez pour transcrire et coller.
• agent_key — Touche pour le Mode Agent (défaut : Right Command). Maintenez pour dicter une instruction, relâchez pour envoyer à Ollama.

Les valeurs acceptées sont des touches modificatrices : Right Option, Right Command, Right Control, Left Option, Left Command, Left Control, Right Shift, Caps Lock. Assigner la même touche aux deux modes est refusé.

Échap annule à tout moment l'enregistrement, la transcription ou la requête Agent en cours.`,
        code: `# Dans ~/.config/murmurai/config.json
"transcript_key": "Right Option",
"agent_key": "Right Command"`,
      },
      {
        heading: "Dictionnaire de jargon",
        body: `murmurai intègre un dictionnaire de ~100 termes de jargon technique pour corriger les termes anglais francisés par Whisper. Par exemple :

• "commiter" → "commit"
• "pousher" → "push"
• "débugger" → "debug"
• "deployer" → "deploy"

Chaque entrée associe un terme anglais (la forme correcte à conserver) à la liste des variantes françaises que Whisper peut produire. La correspondance est insensible à la casse, et la correction est purement locale — sans Ollama ni réseau.

Le dictionnaire intégré (murmurai/jargon.py) est mis à jour avec l'application. Vos ajouts dans config.json sont fusionnés par-dessus : les nouveaux termes sont ajoutés, les variantes d'un terme existant sont concaténées sans doublon, et aucun terme intégré n'est supprimé par votre config — les mises à jour peuvent donc enrichir le dictionnaire sans écraser vos entrées.`,
        code: `# Dans ~/.config/murmurai/config.json
"jargon": {
  "kubectl": ["kubecétéèle", "kubeucétéèle"],
  "terraform": ["terraformer"],
  "Datadog": ["datadogue"]
}`,
      },
      {
        heading: "Microphone, sons et démarrage",
        body: `Quatre réglages complètent la configuration, tous pilotables depuis la barre de menu :

• microphone — Nom du périphérique d'entrée ; "" suit le périphérique par défaut de macOS. Le périphérique est mémorisé par son nom et non par son index, car les index sont réattribués à chaque branchement. Un micro configuré mais débranché retombe sur le défaut système jusqu'à sa reconnexion, et le sous-menu se rafraîchit tout seul quand vous branchez un casque.

• sounds — Sons système courts au début et à la fin d'une opération (défaut : activé), pour utiliser le push-to-talk sans regarder l'écran.

• mute_while_recording — Coupe les haut-parleurs pendant l'enregistrement pour que la lecture en cours ne soit pas captée par le micro (défaut : désactivé). Des haut-parleurs que vous aviez déjà coupés vous-même restent coupés.

• launch_at_login — Lance murmurai à l'ouverture de session, via un LaunchAgent utilisateur (défaut : désactivé). Indisponible lorsque murmurai tourne depuis les sources : il n'y a alors pas de bundle .app à relancer.`,
        code: `# Dans ~/.config/murmurai/config.json
"microphone": "",
"sounds": true,
"mute_while_recording": false,
"launch_at_login": false`,
      },
      {
        heading: "Modèles Ollama",
        body: `Le Mode Agent nécessite Ollama installé localement (https://ollama.ai). Ollama n'est pas requis pour le Mode Transcript.

Le modèle Ollama utilisé par le Mode Agent est sélectionnable dynamiquement depuis la barre de menu de murmurai. murmurai détecte automatiquement les modèles disponibles dans votre installation Ollama.

Vous pouvez également définir le modèle dans le fichier de configuration via la clé "agent_model" :`,
        code: `# Dans ~/.config/murmurai/config.json
"agent_model": "gpt-oss:20b"`,
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
│                     # CGEventTap, barre de menu, orchestration
├── config.py         # Chargement / sauvegarde de config.json
├── recorder.py       # Capture audio via sounddevice
│                     # Buffer, niveau RMS pour le waveform
├── audio_devices.py  # Énumération des micros, résolution nom → index
├── transcriber.py    # Transcription via faster-whisper
├── jargon.py         # Dictionnaire de ~100 termes techniques
│                     # Correction des termes anglais francisés
├── paster.py         # Collage via NSPasteboard + CGEvent (Cmd+V)
│                     # Lecture de la sélection via l'API Accessibility
├── fusion.py         # Mode Agent — client Ollama
│                     # Streaming des réponses, annulation
├── hud.py            # HUD overlay — waveform, statut, annulation
├── sounds.py         # Sons système de feedback
├── system_audio.py   # Coupure des haut-parleurs pendant l'enregistrement
├── login_item.py     # Lancement au login (LaunchAgent)
└── (pyproject.toml)  # Métadonnées, dépendances, entry point`,
      },
      {
        heading: "Pipeline audio — Mode Transcript",
        body: `Le flux de données du Mode Transcript suit un pipeline linéaire :

1. recorder.py — Capture l'audio du microphone en temps réel via sounddevice. L'audio est bufferisé en segments.

2. transcriber.py — Reçoit les segments audio et les transcrit via faster-whisper en mode streaming. Les résultats partiels sont accumulés.

3. jargon.py — Corrige les termes anglais francisés via le dictionnaire de jargon.

4. paster.py — Écrit le texte dans NSPasteboard puis émet un Cmd+V synthétique via CGEvent pour le coller à la position du curseur, avant de restaurer le presse-papier précédent.

5. app.py — Orchestre tout le pipeline : détecte l'appui/relâchement de la touche, démarre/arrête l'enregistrement, lance la transcription et déclenche le collage.`,
      },
      {
        heading: "Pipeline audio — Mode Agent",
        body: `Le Mode Agent étend le pipeline avec une étape Ollama :

1. recorder.py — Capture l'audio de l'instruction vocale.

2. transcriber.py — Transcrit l'instruction vocale.

3. fusion.py — Reçoit le texte sélectionné (lu par paster.py via l'API Accessibility au moment où vous appuyez sur la touche), construit un prompt combinant l'instruction vocale et la sélection, et envoie le tout au modèle Ollama local. La réponse est streamée en temps réel.

4. paster.py — Remplace la sélection originale par la réponse d'Ollama.

5. hud.py — Affiche l'état du traitement (recording, transcribing, processing) tout au long du pipeline. L'utilisateur peut annuler à tout moment.`,
      },
      {
        heading: "Système de jargon",
        body: `Le module jargon.py corrige le jargon technique en post-traitement :

1. Le dictionnaire intégré est fusionné avec les entrées utilisateur de config.json, relu à chaque transcription — une modification du fichier prend donc effet immédiatement.
2. Chaque variante francisée est cherchée dans le texte par expression régulière, sans tenir compte de la casse.
3. Les correspondances sont remplacées par le terme anglais canonique (ex. "commiter" → "commit").
4. La structure de phrase française est préservée — seuls les termes techniques sont corrigés.

Le dictionnaire intégré couvre les termes courants du développement logiciel, DevOps, et de l'infrastructure. Il ne contient que des variantes franglaises : les vrais mots français en sont exclus, car les réécrire corromprait des phrases ordinaires.`,
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
• murmurai/paster.py — Collage via NSPasteboard + CGEvent, lecture de la sélection
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
