"use client";

import React, { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, useGSAP);
}

interface ProjectCard {
  id: string;
  title: string;
  tagline: string;
  category: string;
}

const defaultProjects: ProjectCard[] = [
  { id: "01", title: "Apex Engine", tagline: "Real-time telemetry and state distribution", category: "Core Infrastructure" },
  { id: "02", title: "Vortex UI", tagline: "Gesture-driven interface design system", category: "Design Systems" },
  { id: "03", title: "HyperScale", tagline: "Autonomous edge worker fleet scheduler", category: "Cloud Platform" },
  { id: "04", title: "Solstice", tagline: "Next-generation spatial canvas & audio rendering", category: "Creative Tools" },
];

export function HorizontalScrollSection({ projects = defaultProjects }: { projects?: ProjectCard[] }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const track = trackRef.current;
      if (!track) return;

      const totalScroll = track.scrollWidth - window.innerWidth;

      gsap.to(track, {
        x: -totalScroll,
        ease: "none",
        scrollTrigger: {
          trigger: containerRef.current,
          pin: true,
          scrub: 1,
          start: "top top",
          end: () => `+=${totalScroll}`,
          invalidateOnRefresh: true,
        },
      });
    },
    { scope: containerRef }
  );

  return (
    <section ref={containerRef} className="relative h-screen w-full overflow-hidden bg-zinc-950">
      <div className="absolute top-8 left-8 z-10">
        <span className="text-xs font-mono text-violet-400 tracking-wider uppercase">Case Studies</span>
        <h2 className="text-2xl font-bold text-white tracking-tight mt-1">Featured Architecture</h2>
      </div>

      <div ref={trackRef} className="flex h-full w-fit items-center pl-8 pr-32">
        {projects.map((project) => (
          <div
            key={project.id}
            className="w-[420px] md:w-[500px] h-[460px] mx-6 rounded-3xl border border-white/10 bg-zinc-900/70 p-8 backdrop-blur-xl flex flex-col justify-between flex-shrink-0 group hover:border-white/20 transition-all duration-300 shadow-2xl"
          >
            <div className="flex items-center justify-between">
              <span className="font-mono text-sm text-zinc-500">{project.id}</span>
              <span className="text-xs px-3 py-1 rounded-full bg-white/5 border border-white/10 text-zinc-300">
                {project.category}
              </span>
            </div>

            <div>
              <h3 className="text-3xl font-bold text-white group-hover:text-violet-300 transition-colors">
                {project.title}
              </h3>
              <p className="text-zinc-400 text-sm mt-3 leading-relaxed">{project.tagline}</p>
            </div>

            <div className="pt-4 border-t border-white/5 flex items-center justify-between text-xs text-zinc-400">
              <span>Explore Case Study</span>
              <span className="text-white group-hover:translate-x-1 transition-transform">→</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
