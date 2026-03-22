"use client";

import { useEffect, useState } from "react";
import NeuralBackground from "./NeuralBackground";

const TYPING_PHRASES = [
  "Accelerating AI for everyone.",
  "Open source by design.",
  "Building the future of intelligence.",
  "From models to production.",
];

export default function HeroSection() {
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [displayText, setDisplayText] = useState("");

  useEffect(() => {
    const currentPhrase = TYPING_PHRASES[phraseIndex];
    let timeout: ReturnType<typeof setTimeout>;

    if (!isDeleting && charIndex <= currentPhrase.length) {
      timeout = setTimeout(() => {
        setDisplayText(currentPhrase.slice(0, charIndex));
        setCharIndex((prev) => prev + 1);
      }, 50);
    } else if (!isDeleting && charIndex > currentPhrase.length) {
      timeout = setTimeout(() => setIsDeleting(true), 2000);
    } else if (isDeleting && charIndex > 0) {
      timeout = setTimeout(() => {
        setCharIndex((prev) => prev - 1);
        setDisplayText(currentPhrase.slice(0, charIndex - 1));
      }, 30);
    } else if (isDeleting && charIndex === 0) {
      setIsDeleting(false);
      setPhraseIndex((prev) => (prev + 1) % TYPING_PHRASES.length);
    }

    return () => clearTimeout(timeout);
  }, [charIndex, isDeleting, phraseIndex]);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background layers */}
      <div className="absolute inset-0 grid-pattern" />
      <div className="gradient-blob gradient-blob-1" />
      <div className="gradient-blob gradient-blob-2" />
      <div className="gradient-blob gradient-blob-3" />
      <NeuralBackground />

      {/* Floating particles */}
      {Array.from({ length: 20 }).map((_, i) => (
        <div
          key={i}
          className="particle"
          style={{
            left: `${Math.random() * 100}%`,
            animationDuration: `${8 + Math.random() * 12}s`,
            animationDelay: `${Math.random() * 10}s`,
          }}
        />
      ))}

      {/* Content */}
      <div className="relative z-10 text-center px-6 max-w-5xl mx-auto">
        {/* Badge */}
        <div className="fade-up inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm mb-8 text-sm text-zinc-400">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
          </span>
          Open Source AI Tooling
        </div>

        {/* Main heading */}
        <h1 className="fade-up fade-up-delay-1 text-4xl sm:text-7xl lg:text-8xl font-bold tracking-tight leading-[1.05] mb-6">
          <span className="glow-text-subtle">We build</span>
          <br />
          <span className="glow-text">AI tools</span>
          <br />
          <span className="glow-text-subtle">that matter.</span>
        </h1>

        {/* Typing subtitle */}
        <div className="fade-up fade-up-delay-2 h-8 mb-10">
          <p className="text-lg sm:text-xl text-zinc-500 font-mono">
            <span className="text-zinc-300">&gt;</span>{" "}
            <span className="typing-cursor">{displayText}</span>
          </p>
        </div>

        {/* CTA Buttons */}
        <div className="fade-up fade-up-delay-3 flex flex-col sm:flex-row gap-4 justify-center items-center">
          <a
            href="https://github.com/vbarrai"
            target="_blank"
            rel="noopener noreferrer"
            className="shimmer-btn px-8 py-3.5 rounded-full text-white font-semibold text-base shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 transition-shadow"
          >
            <span className="flex items-center gap-2">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
              </svg>
              Explore on GitHub
            </span>
          </a>
          <a
            href="#projects"
            className="group px-8 py-3.5 rounded-full border border-white/10 text-zinc-300 font-semibold text-base hover:bg-white/5 hover:border-white/20 transition-all"
          >
            <span className="flex items-center gap-2">
              Discover Projects
              <svg
                className="w-4 h-4 transition-transform group-hover:translate-y-0.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </span>
          </a>
        </div>

        {/* Terminal preview */}
        <div className="fade-up fade-up-delay-5 mt-16 max-w-2xl mx-auto">
          <div className="code-block p-1 scan-effect relative overflow-hidden">
            <div className="flex items-center gap-2 px-4 py-3 border-b border-white/5">
              <div className="w-3 h-3 rounded-full bg-red-500/60" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
              <div className="w-3 h-3 rounded-full bg-green-500/60" />
              <span className="ml-2 text-xs text-zinc-600 font-mono">terminal</span>
            </div>
            <div className="p-5 text-left text-sm leading-relaxed overflow-x-auto">
              <p className="text-zinc-500">
                <span className="text-emerald-400">$</span> npx maconfai install vbarrai/skills
              </p>
              <p className="text-zinc-600 mt-1">
                <span className="text-cyan-400">→</span> Fetching skills from GitHub...
              </p>
              <p className="text-zinc-600">
                <span className="text-cyan-400">→</span> Found 3 skills to install
              </p>
              <p className="text-zinc-600">
                <span className="text-cyan-400">→</span> Installing to .agents/skills/
              </p>
              <p className="text-emerald-400/80 mt-1">
                ✓ Skills installed. Ready to use.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 fade-up fade-up-delay-6">
        <div className="w-6 h-10 rounded-full border-2 border-white/20 flex justify-center pt-2">
          <div className="w-1 h-2 rounded-full bg-white/40 animate-bounce" />
        </div>
      </div>
    </section>
  );
}
