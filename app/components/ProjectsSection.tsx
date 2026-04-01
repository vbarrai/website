const projects = [
  {
    name: "maconfai",
    description: "Gestionnaire de skills minimal pour Claude Code, Cursor et Codex. Installez, mettez à jour et désinstallez des skills depuis GitHub ou un répertoire local.",
    tags: ["Skills", "CLI", "AI Tools"],
    color: "border-indigo-500/20 hover:border-indigo-500/40",
    accentBg: "bg-indigo-500/10",
    accentText: "text-indigo-400",
  },
  {
    name: "parcai",
    description: "Isolation shell légère pour agents AI. Confine l'agent au répertoire du projet sans VM ni Docker, avec un overhead quasi nul.",
    tags: ["Security", "Sandbox", "Shell"],
    color: "border-cyan-500/20 hover:border-cyan-500/40",
    accentBg: "bg-cyan-500/10",
    accentText: "text-cyan-400",
  },
  {
    name: "murmurai",
    description: "Transcription vocale push-to-talk pour macOS. Maintenez une touche, parlez, relâchez — votre parole est transcrite localement et collée au curseur.",
    tags: ["Voice", "Whisper", "macOS"],
    color: "border-violet-500/20 hover:border-violet-500/40",
    accentBg: "bg-violet-500/10",
    accentText: "text-violet-400",
  },
];

export default function ProjectsSection() {
  return (
    <section id="projects" className="relative py-32 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-20">
          <p className="text-sm font-mono text-cyan-400 mb-4 tracking-widest uppercase">
            Open Source
          </p>
          <h2 className="text-4xl sm:text-5xl font-bold tracking-tight mb-6">
            <span className="glow-text-subtle">Nos </span>
            <span className="glow-text">projets</span>
          </h2>
          <p className="text-zinc-500 max-w-2xl mx-auto text-lg">
            Des outils open source pour configurer, sécuriser et interagir avec vos agents AI.
          </p>
        </div>

        {/* Project grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <a
              key={project.name}
              href={`/${project.name}`}
              className={`glass-card rounded-2xl p-6 border ${project.color} group cursor-pointer flex flex-col`}
            >
              {/* Header row */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-lg ${project.accentBg} flex items-center justify-center`}>
                    <svg className={`w-5 h-5 ${project.accentText}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12.75V12A2.25 2.25 0 014.5 9.75h15A2.25 2.25 0 0121.75 12v.75m-8.69-6.44l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25h-5.379a1.5 1.5 0 01-1.06-.44z" />
                    </svg>
                  </div>
                  <h3 className="font-semibold text-zinc-200 group-hover:text-white transition-colors">
                    {project.name}
                  </h3>
                </div>

                {/* GitHub icon */}
                <svg className="w-5 h-5 text-zinc-600 group-hover:text-zinc-400 transition-colors" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
              </div>

              <p className="text-sm text-zinc-500 leading-relaxed mb-5">
                {project.description}
              </p>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mt-auto">
                {project.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2.5 py-1 rounded-md bg-white/5 text-xs text-zinc-400 border border-white/5"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
