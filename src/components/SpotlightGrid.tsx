import React, { useEffect, useRef } from 'react';

export const SpotlightGrid: React.FC = () => {
  const spotlightRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (spotlightRef.current) {
        spotlightRef.current.style.setProperty('--mouse-x', `${e.clientX}px`);
        spotlightRef.current.style.setProperty('--mouse-y', `${e.clientY}px`);
      }
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div
      ref={spotlightRef}
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden select-none"
      style={
        {
          '--mouse-x': '50vw',
          '--mouse-y': '25vh',
        } as React.CSSProperties
      }
    >
      {/* 1. Precision Micro Matrix Dot Grid Pattern with radial mask */}
      <div
        className="absolute inset-0 bg-[radial-gradient(rgba(0,0,0,0.05)_1px,transparent_1px)] [background-size:24px_24px] opacity-70"
        style={{
          maskImage: 'radial-gradient(ellipse 90% 70% at 50% 30%, black 40%, transparent 95%)',
          WebkitMaskImage: 'radial-gradient(ellipse 90% 70% at 50% 30%, black 40%, transparent 95%)',
        }}
      />

      {/* 2. Soft Ambient Atmosphere Glow */}
      <div className="absolute top-[-10%] left-1/2 h-[500px] w-[850px] -translate-x-1/2 rounded-full bg-gradient-to-b from-zinc-200/40 via-zinc-100/20 to-transparent blur-[100px] pointer-events-none" />

      {/* 3. Interactive Cursor Spotlight Aura */}
      <div
        className="absolute h-[650px] w-[650px] -translate-x-1/2 -translate-y-1/2 rounded-full pointer-events-none transition-[left,top] duration-75 ease-out"
        style={{
          left: 'var(--mouse-x)',
          top: 'var(--mouse-y)',
          background: 'radial-gradient(circle, rgba(0, 0, 0, 0.035) 0%, rgba(0, 0, 0, 0.008) 50%, transparent 75%)',
          filter: 'blur(45px)',
        }}
      />

      {/* 4. Peripheral Vignette */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#fafafa] pointer-events-none" />
    </div>
  );
};
