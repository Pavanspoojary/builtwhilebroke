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
        className={`flex h-8 w-8 items-center justify-center rounded-xl border border-zinc-200 bg-white text-zinc-700 hover:border-zinc-300 hover:bg-zinc-50 hover:text-zinc-950 shadow-2xs transition-all ${className}`}
      >
        <Coffee className="h-3.5 w-3.5" />
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
        className={`inline-flex items-center gap-2 rounded-full border border-zinc-200/90 bg-white/90 px-4 py-1.5 text-xs font-semibold text-zinc-800 shadow-sm backdrop-blur-md transition-all hover:border-zinc-300 hover:bg-white hover:text-zinc-950 hover:shadow ${className}`}
      >
        <Coffee className="h-3.5 w-3.5 text-zinc-900" />
        <span>Buy me a coffee</span>
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
        className={`flex items-center gap-1.5 text-zinc-600 hover:text-zinc-950 font-semibold transition-colors ${className}`}
      >
        <Coffee className="h-3.5 w-3.5 text-zinc-900" />
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
      className={`flex items-center gap-1.5 rounded-xl border border-zinc-200 bg-zinc-50/80 px-2.5 py-1.5 text-xs font-semibold text-zinc-800 transition-all hover:border-zinc-300 hover:bg-white hover:text-zinc-950 shadow-sm ${className}`}
    >
      <Coffee className="h-3.5 w-3.5 text-zinc-900" />
      <span className="hidden sm:inline">Buy me a coffee</span>
    </a>
  );
};
