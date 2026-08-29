"use client";

import React, { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, useGSAP);
}

const cardData = [
  {
    step: "01",
    title: "Instant Declarative Setup",
    description: "Equip your workspace with world-class design systems, typography standards, and animation runtimes with zero boilerplate.",
    bg: "from-zinc-900 to-zinc-950",
  },
  {
    step: "02",
    title: "60 FPS GPU-Accelerated Pipelines",
    description: "Every transform, spring oscillation, and scroll trigger is pinned to composited render layers for silky smooth frame delivery.",
    bg: "from-violet-950/40 to-zinc-950",
  },
  {
    step: "03",
    title: "Adaptive Responsive Blueprints",
    description: "From mobile foldout sheets to 4K ultra-wide bento dashboards, layouts seamlessly adapt with fluid typography and container queries.",
    bg: "from-indigo-950/40 to-zinc-950",
  },
];

export function PinnedStackingCards() {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const cards = gsap.utils.toArray<HTMLElement>(".stack-card");

      cards.forEach((card, index) => {
        if (index === cards.length - 1) return; // Keep top final card at full scale

        gsap.to(card, {
          scale: 0.92,
          opacity: 0.3,
          y: -20,
          ease: "none",
          scrollTrigger: {
            trigger: card,
            start: "top top+=100px",
            end: "bottom top",
            scrub: true,
            pin: true,
            pinSpacing: false,
          },
        });
      });
    },
    { scope: containerRef }
  );

  return (
    <div ref={containerRef} className="py-24 max-w-4xl mx-auto px-4 space-y-16">
      <div className="text-center mb-16">
        <h2 className="text-3xl sm:text-5xl font-bold text-white tracking-tight">How It Works</h2>
        <p className="text-zinc-400 mt-3 text-sm">Scroll down to observe stacking layered physics.</p>
      </div>

      {cardData.map((card, idx) => (
        <div
          key={idx}
          className={`stack-card h-[400px] w-full rounded-3xl border border-white/10 bg-gradient-to-b ${card.bg} p-10 flex flex-col justify-between shadow-2xl backdrop-blur-xl`}
        >
          <div className="flex items-center justify-between">
            <span className="font-mono text-sm px-3 py-1 rounded-full bg-white/10 text-white">{card.step}</span>
            <span className="text-xs text-zinc-500 uppercase tracking-wider">Architecture</span>
          </div>

          <div>
            <h3 className="text-3xl font-bold text-white mb-3">{card.title}</h3>
            <p className="text-zinc-400 text-base max-w-lg leading-relaxed">{card.description}</p>
          </div>

          <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-violet-500 to-indigo-500 w-1/3" />
          </div>
        </div>
      ))}
    </div>
  );
}
