"use client";

import { useState } from "react";
import {
  questions,
  traitList,
  matchSimilar,
  matchComplementary,
  getTraitLevel,
  normalizeScore,
  TRAIT_KEYS,
  type TraitKey,
  type AgentProfile,
} from "./data";

type Phase = "intro" | "questions" | "results";

const INITIAL_SCORES: Record<TraitKey, number> = {
  autonomy: 0,
  structure: 0,
  exploration: 0,
  verbosity: 0,
  challenge: 0,
};

const SCALE_LABELS = [
  "Not at all",
  "",
  "Sometimes",
  "",
  "Totally me",
];

// ── Radar chart (SVG pentagon) ─────────────────────────────────────

function RadarChart({ scores }: { scores: Record<TraitKey, number> }) {
  const cx = 190;
  const cy = 170;
  const R = 110;
  const levels = [0.25, 0.5, 0.75, 1];

  const angles = TRAIT_KEYS.map(
    (_, i) => (i * 2 * Math.PI) / 5 - Math.PI / 2
  );

  function point(angle: number, r: number) {
    return { x: cx + r * Math.cos(angle), y: cy + r * Math.sin(angle) };
  }

  function polygon(radius: number) {
    return angles
      .map((a) => {
        const p = point(a, radius);
        return `${p.x},${p.y}`;
      })
      .join(" ");
  }

  const dataPoints = TRAIT_KEYS.map((key, i) => {
    const normalized = normalizeScore(scores[key]);
    const clamped = Math.max(0.08, normalized);
    return point(angles[i], clamped * R);
  });

  const dataPolygon = dataPoints.map((p) => `${p.x},${p.y}`).join(" ");

  const labels = TRAIT_KEYS.map((key, i) => {
    const trait = traitList.find((t) => t.key === key)!;
    const p = point(angles[i], R + 30);
    return { text: trait.name, x: p.x, y: p.y };
  });

  return (
    <svg viewBox="0 0 380 350" className="w-full max-w-[340px] mx-auto">
      {levels.map((l) => (
        <polygon
          key={l}
          points={polygon(R * l)}
          fill="none"
          stroke="rgba(255,255,255,0.08)"
          strokeWidth="1"
        />
      ))}
      {angles.map((a, i) => {
        const p = point(a, R);
        return (
          <line
            key={i}
            x1={cx}
            y1={cy}
            x2={p.x}
            y2={p.y}
            stroke="rgba(255,255,255,0.06)"
            strokeWidth="1"
          />
        );
      })}
      <polygon
        points={dataPolygon}
        fill="rgba(99,102,241,0.2)"
        stroke="rgba(99,102,241,0.8)"
        strokeWidth="2"
      />
      {dataPoints.map((p, i) => (
        <circle
          key={i}
          cx={p.x}
          cy={p.y}
          r="4"
          fill="#6366f1"
          stroke="#fff"
          strokeWidth="1.5"
        />
      ))}
      {labels.map((l, i) => (
        <text
          key={i}
          x={l.x}
          y={l.y}
          textAnchor="middle"
          dominantBaseline="middle"
          fill="#a1a1aa"
          fontSize="11"
          fontWeight="500"
        >
          {l.text}
        </text>
      ))}
    </svg>
  );
}

// ── Agent profile card ─────────────────────────────────────────────

function ProfileCard({
  profile,
  compatibility,
  label,
}: {
  profile: AgentProfile;
  compatibility: number;
  label: string;
}) {
  const [expanded, setExpanded] = useState(false);
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    await navigator.clipboard.writeText(profile.systemPrompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="glass-card rounded-2xl border border-white/10 p-6">
      {/* Label badge */}
      <div className="mb-4">
        <span className="text-[10px] uppercase tracking-widest text-indigo-400 font-semibold">
          {label}
        </span>
      </div>

      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <span className="text-3xl">{profile.emoji}</span>
          <div>
            <h3 className="text-lg font-bold text-zinc-100">{profile.name}</h3>
            <p className="text-sm text-zinc-500 italic">{profile.tagline}</p>
          </div>
        </div>
        <div className="text-right">
          <span className="text-2xl font-bold glow-text">
            {compatibility}%
          </span>
          <p className="text-xs text-zinc-500">match</p>
        </div>
      </div>

      <p className="text-sm text-zinc-400 leading-relaxed mb-4">
        {profile.description}
      </p>

      {/* Trait fit bars */}
      <div className="grid grid-cols-5 gap-2 mb-4">
        {TRAIT_KEYS.map((key) => {
          const normalized = normalizeScore(profile.idealTraits[key]);
          return (
            <div key={key} className="text-center">
              <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
                <div
                  className="h-full rounded-full bg-indigo-500/60"
                  style={{ width: `${normalized * 100}%` }}
                />
              </div>
              <span className="text-[10px] text-zinc-600 mt-1 block">
                {traitList.find((t) => t.key === key)!.name.slice(0, 3)}
              </span>
            </div>
          );
        })}
      </div>

      {/* System prompt toggle */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between px-4 py-2.5 rounded-xl bg-white/5 border border-white/5 text-sm text-zinc-400 hover:text-zinc-200 hover:bg-white/8 transition-all cursor-pointer"
      >
        <span>System prompt</span>
        <svg
          className={`w-4 h-4 transition-transform ${expanded ? "rotate-180" : ""}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {expanded && (
        <div className="mt-3 relative group/prompt">
          <pre className="text-xs text-zinc-400 bg-black/40 border border-white/5 rounded-xl p-4 whitespace-pre-wrap leading-relaxed max-h-80 overflow-y-auto font-mono">
            {profile.systemPrompt}
          </pre>
          <button
            onClick={handleCopy}
            className="absolute top-3 right-3 px-3 py-1.5 rounded-lg bg-black/80 backdrop-blur-sm border border-white/10 text-xs text-zinc-300 hover:bg-black/90 transition-all cursor-pointer opacity-0 group-hover/prompt:opacity-100"
          >
            {copied ? "Copied!" : "Copy"}
          </button>
        </div>
      )}
    </div>
  );
}

// ── Main Quiz component ────────────────────────────────────────────

export default function Quiz() {
  const [phase, setPhase] = useState<Phase>("intro");
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [scores, setScores] = useState<Record<TraitKey, number>>({
    ...INITIAL_SCORES,
  });
  const [selectedRating, setSelectedRating] = useState<number | null>(null);
  const [expandedProfile, setExpandedProfile] = useState<string | null>(null);

  function handleRate(rating: number) {
    const trait = questions[currentQuestion].trait;
    setSelectedRating(rating);

    setTimeout(() => {
      setScores((prev) => ({ ...prev, [trait]: prev[trait] + rating }));
      setSelectedRating(null);

      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion((prev) => prev + 1);
      } else {
        setPhase("results");
      }
    }, 250);
  }

  function handleRetake() {
    setPhase("intro");
    setCurrentQuestion(0);
    setScores({ ...INITIAL_SCORES });
    setSelectedRating(null);
  }

  // Compute matches only when in results phase
  const similarMatches = phase === "results" ? matchSimilar(scores) : [];
  const complementMatches =
    phase === "results" ? matchComplementary(scores) : [];

  // Ensure complement and similar picks are different profiles
  const similarPick = similarMatches[0];
  let complementPick = complementMatches[0];
  if (complementPick && similarPick && complementPick.profile.id === similarPick.profile.id) {
    complementPick = complementMatches[1];
  }

  // ── Intro ──────────────────────────────────────────────────────

  if (phase === "intro") {
    return (
      <div className="min-h-screen flex items-center justify-center px-6 relative overflow-hidden">
        <div className="gradient-blob gradient-blob-1" />
        <div className="gradient-blob gradient-blob-2" />

        <div className="relative text-center max-w-2xl mx-auto">
          <div className="mb-6 text-6xl">{"\u{1f916}"}</div>
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4">
            <span className="glow-text">Find Your AI Pair</span>
          </h1>
          <p className="text-lg text-zinc-400 leading-relaxed mb-3">
            10 quick self-assessments to discover your developer personality —
            then get matched with the AI agent style that{" "}
            <strong className="text-zinc-200">complements</strong> you and the
            one that <strong className="text-zinc-200">mirrors</strong> you.
          </p>
          <p className="text-sm text-zinc-600 mb-10">
            No sign-up. No data stored. Just you and 10 statements.
          </p>
          <button
            onClick={() => setPhase("questions")}
            className="shimmer-btn px-8 py-3.5 rounded-full text-white font-semibold text-lg cursor-pointer hover:opacity-90 transition-opacity"
          >
            Start the quiz
          </button>
        </div>
      </div>
    );
  }

  // ── Questions (Likert 1-5) ─────────────────────────────────────

  if (phase === "questions") {
    const q = questions[currentQuestion];
    const progress = ((currentQuestion + 1) / questions.length) * 100;

    return (
      <div className="min-h-screen flex flex-col px-6 pt-24 pb-12 relative">
        {/* Progress bar */}
        <div className="fixed top-0 left-0 right-0 z-50">
          <div className="h-1 bg-white/5">
            <div
              className="h-full bg-gradient-to-r from-indigo-500 to-cyan-400 transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <div className="max-w-2xl mx-auto w-full flex-1 flex flex-col justify-center">
          {/* Question counter */}
          <div className="mb-6">
            <span className="text-sm text-zinc-600">
              {currentQuestion + 1}{" "}
              <span className="text-zinc-700">/ {questions.length}</span>
            </span>
          </div>

          {/* Statement */}
          <h2 className="text-xl sm:text-2xl font-semibold text-zinc-100 mb-3 leading-snug">
            {q.text}
          </h2>

          {/* Concrete example */}
          <p className="text-sm text-zinc-500 mb-10 italic">{q.example}</p>

          {/* Likert scale */}
          <div className="flex flex-col items-center">
            <div className="flex items-center gap-3 sm:gap-5">
              {[1, 2, 3, 4, 5].map((value) => (
                <button
                  key={value}
                  onClick={() => handleRate(value)}
                  disabled={selectedRating !== null}
                  className={`w-12 h-12 sm:w-14 sm:h-14 rounded-full border-2 flex items-center justify-center text-lg font-semibold transition-all duration-200 cursor-pointer ${
                    selectedRating === value
                      ? "bg-indigo-500 border-indigo-400 text-white scale-110"
                      : "bg-white/[0.02] border-white/[0.1] text-zinc-500 hover:border-indigo-500/50 hover:text-zinc-200 hover:bg-white/[0.05]"
                  }`}
                >
                  {value}
                </button>
              ))}
            </div>
            {/* Scale labels */}
            <div className="flex justify-between w-full max-w-[310px] sm:max-w-[350px] mt-3">
              {SCALE_LABELS.map((label, i) => (
                <span key={i} className="text-xs text-zinc-600 w-16 text-center">
                  {label}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── Results ────────────────────────────────────────────────────

  return (
    <div className="min-h-screen px-6 pt-24 pb-20 relative overflow-hidden">
      <div className="gradient-blob gradient-blob-1" />
      <div className="gradient-blob gradient-blob-3" />

      <div className="max-w-3xl mx-auto relative">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-3">
            <span className="glow-text">Your Developer Profile</span>
          </h1>
          <p className="text-zinc-500">
            Here&apos;s how you work — and which AI agents fit your style.
          </p>
        </div>

        {/* Radar chart + trait breakdown */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          <div className="glass-card rounded-2xl border border-white/10 p-6 flex items-center justify-center">
            <RadarChart scores={scores} />
          </div>

          <div className="space-y-4">
            {traitList.map((trait) => {
              const score = scores[trait.key];
              const level = getTraitLevel(score);
              const normalized = normalizeScore(score);
              const description = trait.descriptions[level];

              return (
                <div
                  key={trait.key}
                  className="glass-card rounded-xl border border-white/10 p-4"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-semibold text-zinc-200">
                      {trait.name}
                    </span>
                    <div className="flex items-center gap-2 text-xs text-zinc-600">
                      <span>{trait.lowLabel}</span>
                      <span>{"\u{2192}"}</span>
                      <span>{trait.highLabel}</span>
                    </div>
                  </div>
                  <div className="h-2 rounded-full bg-white/5 overflow-hidden mb-2">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-cyan-400 transition-all duration-700 ease-out"
                      style={{
                        width: `${Math.max(8, normalized * 100)}%`,
                      }}
                    />
                  </div>
                  <p className="text-xs text-zinc-500 leading-relaxed">
                    {description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Top matches: complementary + similar */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-zinc-100 mb-2">
            Your Top Matches
          </h2>
          <p className="text-sm text-zinc-500 mb-6">
            One agent that <strong className="text-zinc-300">complements</strong>{" "}
            your weaknesses, one that{" "}
            <strong className="text-zinc-300">mirrors</strong> your strengths.
            Expand the system prompt and paste it into your AI tool.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {complementPick && (
              <ProfileCard
                profile={complementPick.profile}
                compatibility={complementPick.compatibility}
                label="Your complement — fills your gaps"
              />
            )}
            {similarPick && (
              <ProfileCard
                profile={similarPick.profile}
                compatibility={similarPick.compatibility}
                label="Your mirror — thinks like you"
              />
            )}
          </div>
        </div>

        {/* All other profiles */}
        <div className="mb-12">
          <h3 className="text-lg font-semibold text-zinc-300 mb-4">
            All profiles
          </h3>
          <div className="-mx-12 relative" style={{ mask: "linear-gradient(90deg, transparent, black 48px, black calc(100% - 48px), transparent)", WebkitMask: "linear-gradient(90deg, transparent, black 48px, black calc(100% - 48px), transparent)" }}>
          <div className="flex gap-3 overflow-x-auto py-2 px-12 scrollbar-hide">
            {similarMatches
              .filter(
                ({ profile }) =>
                  profile.id !== similarPick?.profile.id &&
                  profile.id !== complementPick?.profile.id
              )
              .map(({ profile, compatibility }) => (
                <button
                  key={profile.id}
                  onClick={() =>
                    setExpandedProfile(
                      expandedProfile === profile.id ? null : profile.id
                    )
                  }
                  className={`shrink-0 w-20 h-20 rounded-xl border backdrop-blur-sm p-2 flex flex-col items-center justify-center text-center cursor-pointer transition-colors overflow-hidden ${
                    expandedProfile === profile.id
                      ? "border-indigo-500/40 bg-white/[0.04]"
                      : "border-white/5 hover:border-white/15"
                  }`}
                >
                  <span className="text-2xl block mb-1">{profile.emoji}</span>
                  <span className="text-[10px] text-zinc-400 block leading-tight">
                    {profile.name.replace("The ", "")}
                  </span>
                  <span className="text-[10px] text-zinc-600 block mt-0.5">
                    {compatibility}%
                  </span>
                </button>
              ))}
          </div>
          </div>

          {/* Expanded profile detail */}
          {expandedProfile &&
            (() => {
              const match = similarMatches.find(
                ({ profile }) => profile.id === expandedProfile
              );
              if (!match) return null;
              return (
                <div className="mt-4">
                  <ProfileCard
                    profile={match.profile}
                    compatibility={match.compatibility}
                    label={`Similarity: ${match.compatibility}%`}
                  />
                </div>
              );
            })()}
        </div>

        {/* Retake */}
        <div className="text-center">
          <button
            onClick={handleRetake}
            className="px-6 py-3 rounded-full bg-white/5 border border-white/10 text-sm text-zinc-400 hover:bg-white/10 hover:text-zinc-200 transition-all cursor-pointer"
          >
            Retake the quiz
          </button>
        </div>
      </div>
    </div>
  );
}
