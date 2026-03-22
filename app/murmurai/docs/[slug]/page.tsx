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
        body: `murmurai repose sur trois principes :

1. 100% hors-ligne — Tout le traitement se fait localement grâce à faster-whisper, une implémentation optimisée d'OpenAI Whisper. Aucune donnée audio ne quitte votre Mac.

2. Push-to-talk — Maintenez la touche Option droite (⌥), parlez, relâchez. Pas de commande vocale "start" / "stop", pas de bouton à cliquer.

3. Zéro friction — Le texte transcrit est automatiquement collé à la position du curseur via une simulation de Cmd+V. Pas de fenêtre intermédiaire, pas de copier-coller manuel.`,
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
        heading: "Prérequis",
        body: `murmurai fonctionne exclusivement sur macOS. Vous avez besoin de :

• macOS (version récente recommandée)
• Python 3.9 ou supérieur
• Un microphone (intégré ou externe)
• ~500 Mo d'espace disque pour le modèle Whisper "small"`,
      },
      {
        heading: "Cloner le repository",
        body: "Commencez par cloner le repository GitHub :",
        code: `git clone https://github.com/vbarrai/murmurai
cd murmurai`,
      },
      {
        heading: "Créer un environnement virtuel",
        body: "Créez et activez un environnement Python isolé :",
        code: `python3 -m venv .venv
source .venv/bin/activate`,
      },
      {
        heading: "Installer murmurai",
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
    description: "Guide pratique du workflow push-to-talk.",
    content: [
      {
        heading: "Lancer murmurai",
        body: "Activez votre environnement virtuel et lancez murmurai :",
        code: `source .venv/bin/activate
murmurai`,
      },
      {
        heading: "Workflow push-to-talk",
        body: `Le workflow est simple :

1. Placez votre curseur là où vous voulez insérer du texte (éditeur de code, navigateur, chat, email…)
2. Maintenez la touche Option droite (⌥) enfoncée
3. Parlez naturellement
4. Relâchez la touche Option droite
5. Le texte transcrit est automatiquement collé à la position du curseur

La transcription se fait en streaming — le texte est prêt quasi instantanément quand vous relâchez la touche.`,
      },
      {
        heading: "Cas d'usage",
        body: `murmurai est particulièrement utile pour :

• Rédiger des emails ou messages longs
• Écrire des commentaires de code ou de la documentation
• Prendre des notes rapidement
• Dicter du texte dans n'importe quelle application
• Répondre dans un chat ou un terminal

Le texte est collé dans n'importe quelle application qui accepte Cmd+V.`,
      },
      {
        heading: "Logs et diagnostic",
        body: "Les logs de l'application sont écrits dans un fichier dédié, utile pour le diagnostic :",
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
    description: "Configurer les modèles Whisper et les options de murmurai.",
    content: [
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

Le modèle par défaut est "small", qui offre le meilleur compromis entre vitesse et qualité pour un usage quotidien.`,
      },
      {
        heading: "Changer le modèle",
        body: `Pour changer le modèle Whisper utilisé, modifiez la configuration dans le fichier murmurai/transcriber.py. Recherchez la ligne de configuration du modèle et remplacez la valeur par la taille souhaitée.

Le modèle sera téléchargé automatiquement au prochain lancement si nécessaire.`,
        code: `# Dans murmurai/transcriber.py
# Changer "small" par "tiny", "base", "medium" ou "large-v3"
model_size = "small"`,
      },
      {
        heading: "Touche de raccourci",
        body: `Par défaut, murmurai utilise la touche Option droite (⌥ Right Option) comme touche push-to-talk. Cette touche a été choisie car :

• Elle est facilement accessible sans quitter la position de frappe
• Elle n'interfère pas avec les raccourcis clavier courants
• Elle est rarement utilisée seule dans les applications

La configuration de la touche se fait dans le code source (murmurai/app.py).`,
      },
      {
        heading: "Langue de transcription",
        body: `faster-whisper détecte automatiquement la langue parlée. Le modèle supporte plus de 90 langues, dont le français, l'anglais, l'espagnol, l'allemand, le chinois, le japonais, etc.

Aucune configuration de langue n'est nécessaire — parlez simplement dans la langue souhaitée et Whisper s'adapte automatiquement.`,
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
• PyInstaller — Packaging en app standalone`,
      },
      {
        heading: "Modules source",
        body: "Le code source est organisé en cinq modules dans le répertoire murmurai/ :",
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
└── (pyproject.toml)  # Métadonnées, dépendances, entry point`,
      },
      {
        heading: "Pipeline audio",
        body: `Le flux de données suit un pipeline linéaire :

1. recorder.py — Capture l'audio du microphone en temps réel via sounddevice. L'audio est bufferisé en segments.

2. transcriber.py — Reçoit les segments audio et les transcrit via faster-whisper en mode streaming. Les résultats partiels sont accumulés.

3. paster.py — Au relâchement de la touche, prend le texte transcrit final et simule un Cmd+V pour le coller à la position du curseur.

4. app.py — Orchestre tout le pipeline : détecte l'appui/relâchement de la touche, démarre/arrête l'enregistrement, lance la transcription et déclenche le collage.`,
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

Dépendance optionnelle :
• pyinstaller (>=6.0.0) — Pour la création d'apps standalone`,
      },
    ],
    prev: { slug: "configuration", label: "Configuration" },
    next: { slug: "distribution", label: "Distribution" },
  },

  distribution: {
    title: "Distribution",
    description: "Créer et distribuer murmurai en tant qu'application macOS standalone.",
    content: [
      {
        heading: "Installer les dépendances de build",
        body: "Avant de créer une app standalone, installez les dépendances de build (PyInstaller) :",
        code: `pip install -e ".[build]"`,
      },
      {
        heading: "Créer le bundle",
        body: "La commande make build génère un bundle .app dans le répertoire .build/ sans l'installer :",
        code: `make build`,
      },
      {
        heading: "Installer dans /Applications",
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

Mode développement — Exécution directe depuis le code source via python/pip. Idéal pour le développement et le test de modifications. Les changements de code sont immédiatement disponibles sans rebuild.

Mode standalone — Application .app dans /Applications/. Pas besoin de Python installé, pas d'environnement virtuel. Double-cliquer pour lancer. Idéal pour un usage quotidien.`,
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
