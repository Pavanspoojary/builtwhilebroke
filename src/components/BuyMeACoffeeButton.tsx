import React from 'react';
import { Coffee } from 'lucide-react';
import { sound } from '../lib/soundFx';

interface BuyMeACoffeeButtonProps {
  variant?: 'header' | 'hero' | 'footer' | 'compact';
  className?: string;
}

export const DODO_COFFEE_URL = 'https://checkout.dodopayments.com/buy/pdt_0NmTCMCR2IrO9NemNHM0u';

export const BuyMeACoffeeButton: React.FC<BuyMeACoffeeButtonProps> = ({
  variant = 'header',
  className = '',
}) => {
  const handleClick = () => {
    sound.pop();
  };

  if (variant === 'compact') {
    return (
      <a
        href={DODO_COFFEE_URL}
        target="_blank"
        rel="noopener noreferrer"
        onClick={handleClick}
        title="Buy me a coffee (Dodo Payments)"
        className={`group relative flex h-8 w-8 items-center justify-center rounded-xl border border-zinc-200/90 bg-white text-zinc-700 hover:border-zinc-300 hover:bg-zinc-50 hover:text-zinc-950 shadow-2xs transition-all active:scale-95 ${className}`}
      >
        <Coffee className="h-3.5 w-3.5 text-zinc-800 transition-transform duration-200 group-hover:scale-110 group-hover:rotate-6" />
      </a>
    );
  }

  if (variant === 'hero') {
    return (
      <a
        href={DODO_COFFEE_URL}
        target="_blank"
        rel="noopener noreferrer"
        onClick={handleClick}
        className={`group relative inline-flex items-center gap-2 rounded-full border border-zinc-200/90 bg-white/95 px-4 py-1.5 text-xs font-semibold text-zinc-800 shadow-[0_2px_8px_rgba(0,0,0,0.04)] backdrop-blur-xl transition-all duration-300 hover:border-zinc-300 hover:bg-white hover:text-zinc-950 hover:shadow-[0_4px_16px_rgba(0,0,0,0.06)] hover:-translate-y-0.5 active:scale-98 ${className}`}
      >
        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-amber-50 border border-amber-200/60 text-amber-700 transition-transform duration-300 group-hover:scale-110">
          <Coffee className="h-3 w-3" />
        </span>
        <span className="tracking-tight">Support BuiltWhileBroke</span>
        <span className="inline-block text-[10px] text-zinc-400 font-mono group-hover:translate-x-0.5 transition-transform">→</span>
      </a>
    );
  }

  if (variant === 'footer') {
    return (
      <a
        href={DODO_COFFEE_URL}
        target="_blank"
        rel="noopener noreferrer"
        onClick={handleClick}
        className={`group inline-flex items-center gap-1.5 text-zinc-600 hover:text-zinc-950 font-semibold transition-colors ${className}`}
      >
        <Coffee className="h-3.5 w-3.5 text-zinc-900 transition-transform duration-200 group-hover:scale-110" />
        <span>Buy me a coffee</span>
      </a>
    );
  }

  // Default: Header button
  return (
    <a
      href={DODO_COFFEE_URL}
      target="_blank"
      rel="noopener noreferrer"
      onClick={handleClick}
      title="Support BuiltWhileBroke via Dodo Payments"
      className={`group relative flex items-center gap-1.5 rounded-xl border border-zinc-200/90 bg-zinc-50/90 px-3 py-1.5 text-xs font-semibold text-zinc-800 transition-all duration-200 hover:border-zinc-300 hover:bg-white hover:text-zinc-950 hover:shadow-2xs active:scale-95 ${className}`}
    >
      <Coffee className="h-3.5 w-3.5 text-zinc-900 transition-transform duration-200 group-hover:scale-110 group-hover:rotate-6" />
      <span className="hidden sm:inline">Coffee</span>
    </a>
  );
};
