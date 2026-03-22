const projects = [
  {
    name: "ai-pipeline",
    description: "End-to-end ML pipeline framework with auto-scaling, model versioning, and A/B testing built in.",
    tags: ["Python", "Kubernetes", "MLOps"],
    stars: "2.4k",
    color: "border-indigo-500/20 hover:border-indigo-500/40",
    accentBg: "bg-indigo-500/10",
    accentText: "text-indigo-400",
  },
  {
    name: "vector-forge",
    description: "High-performance vector database client with smart indexing and real-time similarity search.",
    tags: ["Rust", "WASM", "Search"],
    stars: "1.8k",
    color: "border-cyan-500/20 hover:border-cyan-500/40",
    accentBg: "bg-cyan-500/10",
    accentText: "text-cyan-400",
  },
  {
    name: "prompt-studio",
    description: "Visual prompt engineering toolkit with version control, evaluation, and collaborative editing.",
    tags: ["TypeScript", "React", "LLM"],
    stars: "3.1k",
    color: "border-violet-500/20 hover:border-violet-500/40",
    accentBg: "bg-violet-500/10",
    accentText: "text-violet-400",
  },
  {
    name: "edge-inference",
    description: "Run large language models on edge devices with quantization and adaptive batching.",
    tags: ["C++", "ONNX", "Edge"],
    stars: "956",
    color: "border-emerald-500/20 hover:border-emerald-500/40",
    accentBg: "bg-emerald-500/10",
    accentText: "text-emerald-400",
  },
  {
    name: "data-weaver",
    description: "Automated data preprocessing and augmentation pipeline for training datasets.",
    tags: ["Python", "Data", "ETL"],
    stars: "1.2k",
    color: "border-orange-500/20 hover:border-orange-500/40",
    accentBg: "bg-orange-500/10",
    accentText: "text-orange-400",
  },
  {
    name: "model-guard",
    description: "Safety and alignment toolkit for LLM deployments with real-time content filtering.",
    tags: ["Python", "Safety", "API"],
    stars: "2.7k",
    color: "border-rose-500/20 hover:border-rose-500/40",
    accentBg: "bg-rose-500/10",
    accentText: "text-rose-400",
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
            <span className="glow-text-subtle">Our </span>
            <span className="glow-text">projects</span>
          </h2>
          <p className="text-zinc-500 max-w-2xl mx-auto text-lg">
            From inference to deployment, our ecosystem covers the full AI lifecycle.
          </p>
        </div>

        {/* Project grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <a
              key={project.name}
              href={`https://github.com/vbarrai/${project.name}`}
              target="_blank"
              rel="noopener noreferrer"
              className={`glass-card rounded-2xl p-6 border ${project.color} group cursor-pointer`}
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

                {/* Stars */}
                <div className="flex items-center gap-1 text-xs text-zinc-500">
                  <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                  {project.stars}
                </div>
              </div>

              <p className="text-sm text-zinc-500 leading-relaxed mb-5">
                {project.description}
              </p>

              {/* Tags */}
              <div className="flex flex-wrap gap-2">
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
