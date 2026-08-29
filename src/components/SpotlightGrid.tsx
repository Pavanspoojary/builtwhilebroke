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
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
      style={
        {
          '--mouse-x': '50vw',
          '--mouse-y': '30vh',
        } as React.CSSProperties
      }
    >
      {/* 1. Cyber Matrix Dot Grid Pattern with radial mask */}
      <div
        className="absolute inset-0 bg-[radial-gradient(rgba(0,0,0,0.045)_1.2px,transparent_1.2px)] [background-size:28px_28px] opacity-75"
        style={{
          maskImage: 'radial-gradient(ellipse at center, black 50%, transparent 85%)',
          WebkitMaskImage: 'radial-gradient(ellipse at center, black 50%, transparent 85%)',
        }}
      />

      {/* 2. Interactive Cursor Spotlight Aura */}
      <div
        className="absolute h-[650px] w-[650px] -translate-x-1/2 -translate-y-1/2 rounded-full transition-opacity duration-300 pointer-events-none"
        style={{
          left: 'var(--mouse-x)',
          top: 'var(--mouse-y)',
          background: 'radial-gradient(circle, rgba(0, 0, 0, 0.02) 0%, rgba(0, 0, 0, 0.005) 45%, transparent 70%)',
          filter: 'blur(50px)',
        }}
      />

      {/* 3. Soft Luxury Falloff */}
      <div className="absolute inset-0 bg-radial-gradient from-transparent via-[#fafafa]/30 to-[#fafafa] pointer-events-none" />
    </div>
  );
};
