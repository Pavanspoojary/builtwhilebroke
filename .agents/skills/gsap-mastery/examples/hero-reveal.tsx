"use client";

import React, { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(useGSAP);
}

export function CinematicHero() {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const tl = gsap.timeline({
        defaults: { ease: "expo.out" },
      });

      tl.from(".hero-badge", {
        y: 20,
        opacity: 0,
        duration: 0.8,
      })
        .from(
          ".hero-title-line",
          {
            y: "115%",
            rotateX: -20,
            opacity: 0,
            duration: 1.2,
            stagger: 0.12,
          },
          "-=0.4"
        )
        .from(
          ".hero-desc",
          {
            y: 25,
            opacity: 0,
            filter: "blur(8px)",
            duration: 1,
          },
          "-=0.7"
        )
        .from(
          ".hero-cta-btn",
          {
            scale: 0.9,
            opacity: 0,
            duration: 0.8,
            stagger: 0.1,
          },
          "-=0.6"
        );
    },
    { scope: containerRef }
  );

  return (
    <div
      ref={containerRef}
      className="relative min-h-screen flex flex-col items-center justify-center text-center px-4 bg-zinc-950 overflow-hidden"
    >
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-violet-600/15 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-1/3 -right-32 w-96 h-96 bg-indigo-600/15 rounded-full blur-[120px] pointer-events-none" />

      {/* Badge */}
      <div className="hero-badge inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-zinc-900/80 border border-white/10 text-xs text-zinc-300 backdrop-blur-md mb-8">
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
        <span>Antigravity v2.0 Motion Architecture</span>
      </div>

      {/* Masked Title Lines */}
      <h1 className="text-5xl sm:text-7xl lg:text-8xl font-black text-white tracking-tight leading-[1.08] max-w-5xl">
        <div className="overflow-hidden py-1">
          <div className="hero-title-line inline-block">ENGINEERED FOR</div>
        </div>
        <div className="overflow-hidden py-1">
          <div className="hero-title-line inline-block text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-indigo-300 to-emerald-400">
            TOTAL PERFECTION
          </div>
        </div>
      </h1>

      {/* Description */}
      <p className="hero-desc mt-6 text-lg sm:text-xl text-zinc-400 max-w-2xl font-normal leading-relaxed">
        Ultra-fluid interactions, spring-based micro-interactions, and scroll choreographies designed for modern high-performance web products.
      </p>

      {/* CTA Buttons */}
      <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
        <button className="hero-cta-btn px-7 py-3.5 rounded-full bg-white text-zinc-950 font-semibold text-sm hover:bg-zinc-100 transition-all shadow-xl active:scale-95">
          Start Building Now
        </button>
        <button className="hero-cta-btn px-7 py-3.5 rounded-full bg-zinc-900/80 border border-white/10 text-white font-medium text-sm hover:bg-zinc-800 transition-all backdrop-blur-md">
          Explore Showcase
        </button>
      </div>
    </div>
  );
}
