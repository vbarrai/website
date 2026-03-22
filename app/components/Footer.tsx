export default function Footer() {
  return (
    <footer className="border-t border-white/5 py-16 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-16">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="relative w-7 h-7">
                <div className="absolute inset-0 rounded-md bg-gradient-to-br from-indigo-500 to-cyan-400 opacity-80" />
                <div className="absolute inset-[2px] rounded-[4px] bg-black flex items-center justify-center">
                  <span className="text-xs font-bold glow-text">V</span>
                </div>
              </div>
              <span className="font-semibold text-zinc-300">vbarrai</span>
            </div>
            <p className="text-sm text-zinc-600 leading-relaxed">
              Open source AI tools for the next generation of developers.
            </p>
          </div>

          {/* Links */}
          {[
            {
              title: "Projects",
              links: ["ai-pipeline", "vector-forge", "prompt-studio", "edge-inference"],
            },
            {
              title: "Community",
              links: ["GitHub", "Discord", "Twitter / X", "Blog"],
            },
            {
              title: "Resources",
              links: ["Documentation", "Tutorials", "API Reference", "Changelog"],
            },
          ].map((group) => (
            <div key={group.title}>
              <h4 className="text-sm font-semibold text-zinc-300 mb-4">
                {group.title}
              </h4>
              <ul className="space-y-2">
                {group.links.map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="text-sm text-zinc-600 hover:text-zinc-300 transition-colors"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom */}
        <div className="pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-zinc-700">
            &copy; 2026 vbarrai. All rights reserved.
          </p>
          <p className="text-xs text-zinc-700">
            Built with open source &hearts;
          </p>
        </div>
      </div>
    </footer>
  );
}
