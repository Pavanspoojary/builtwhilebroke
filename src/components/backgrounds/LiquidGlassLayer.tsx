import React from 'react';

interface LiquidGlassLayerProps {
  className?: string;
}

export const LiquidGlassLayer: React.FC<LiquidGlassLayerProps> = ({
  className = '',
}) => {
  return (
    <div
      className={`pointer-events-none absolute inset-0 z-0 overflow-hidden ${className}`}
      aria-hidden="true"
    >
      {/* 1. Heavy Frosted Liquid Optical Diffusion Sheet */}
      <div
        className="absolute inset-0 bg-white/40 backdrop-blur-[54px] backdrop-saturate-[180%]"
        style={{
          WebkitBackdropFilter: 'blur(54px) saturate(180%)',
        }}
      />

      {/* 2. Soft Ambient Tint */}
      <div className="absolute inset-0 bg-gradient-to-b from-white/80 via-[#fafafa]/50 to-white/90" />

      {/* 3. Liquid Specular Light Sheen */}
      <div className="absolute inset-0 bg-gradient-to-tr from-orange-500/[0.02] via-transparent to-transparent" />
      <div className="absolute -top-1/3 left-1/4 h-[180%] w-[120%] -rotate-12 bg-gradient-to-tr from-transparent via-amber-500/[0.02] to-transparent blur-3xl opacity-70" />

      {/* 4. Center Ambient Radiance Bulb */}
      <div className="absolute top-1/4 left-1/2 h-[450px] w-[700px] -translate-x-1/2 rounded-full bg-gradient-to-r from-orange-500/5 via-amber-500/5 to-rose-500/5 blur-[100px] opacity-70" />

      {/* 5. Fine Tactile Micro-Grain Filter */}
      <svg className="absolute inset-0 h-full w-full opacity-[0.03] mix-blend-overlay pointer-events-none">
        <filter id="liquid-glass-grain">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.75"
            numOctaves="3"
            stitchTiles="stitch"
          />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#liquid-glass-grain)" />
      </svg>
    </div>
  );
};

export default LiquidGlassLayer;
