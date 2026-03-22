"use client";

import { useEffect, useRef, useState } from "react";

const stats = [
  { value: 3, suffix: "", label: "Open Source Projects" },
  { value: 49, suffix: "+", label: "Commits" },
  { value: 3, suffix: "", label: "Supported Agents" },
  { value: 1, suffix: "", label: "Release Published" },
];

function AnimatedCounter({ target, suffix }: { target: number; suffix: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          const duration = 2000;
          const steps = 60;
          const increment = target / steps;
          let current = 0;
          const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
              setCount(target);
              clearInterval(timer);
            } else {
              setCount(Number(current.toFixed(1)));
            }
          }, duration / steps);
        }
      },
      { threshold: 0.5 }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target]);

  return (
    <div ref={ref} className="text-3xl sm:text-5xl font-bold glow-text tabular-nums">
      {Number.isInteger(target) ? Math.floor(count) : count.toFixed(1)}
      {suffix}
    </div>
  );
}

export default function StatsSection() {
  return (
    <section className="relative py-24 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="glass-card rounded-3xl p-6 sm:p-16">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-10 text-center">
            {stats.map((stat) => (
              <div key={stat.label}>
                <AnimatedCounter target={stat.value} suffix={stat.suffix} />
                <p className="mt-2 text-sm text-zinc-500">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
