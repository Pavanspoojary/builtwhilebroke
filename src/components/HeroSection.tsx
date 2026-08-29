import React from 'react';
import { Search, X } from 'lucide-react';
import { sound } from '../lib/soundFx';
import { BuyMeACoffeeButton } from './BuyMeACoffeeButton';

interface HeroSectionProps {
  searchQuery: string;
  onSearchChange: (val: string) => void;
  selectedTag: string | null;
  onSelectTag: (tag: string | null) => void;
  filteredCount: number;
  totalCount: number;
}

const POPULAR_TAGS = [
  'Converters',
  'Code Snippets',
  'Diagrams',
  'OSINT',
  'Cryptography',
  'Media',
  'SQL Engine',
];

export const HeroSection: React.FC<HeroSectionProps> = ({
  searchQuery,
  onSearchChange,
  selectedTag,
  onSelectTag,
  filteredCount,
  totalCount,
}) => {
  return (
    <section className="relative pt-12 pb-12 sm:pt-20 sm:pb-16">
      <div className="mx-auto max-w-4xl px-4 text-center sm:px-6">
        {/* Top Badges: Live Status & Supporter Pill */}
        <div className="mb-6 flex flex-wrap items-center justify-center gap-2.5">
          {/* Live Zero-Telemetry Status */}
          <div className="inline-flex items-center gap-2 rounded-full border border-zinc-200/90 bg-white/90 px-3.5 py-1.5 text-xs font-semibold text-zinc-700 shadow-2xs backdrop-blur-md">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
            </span>
            <span className="font-mono text-[11px] text-zinc-800">100% In-Browser</span>
            <span className="text-zinc-300">•</span>
            <span className="text-[11px] text-zinc-500 font-mono">Zero Cloud Tracking</span>
          </div>

          <BuyMeACoffeeButton variant="hero" />
        </div>

        {/* Editorial Headline: Bold Sans + Organic Cursive Script */}
        <h1 className="font-sans font-extrabold text-5xl sm:text-7xl lg:text-8xl tracking-tight text-zinc-950 flex flex-wrap items-baseline justify-center gap-x-3.5 gap-y-1">
          <span className="tracking-tight">BuiltWhile</span>
          <span className="font-script font-normal text-zinc-500 text-6xl sm:text-8xl lg:text-9xl tracking-tight -rotate-1 select-none inline-block drop-shadow-xs">
            broke.
          </span>
        </h1>

        {/* Subtitle with High Contrast & Spacing */}
        <p className="mx-auto mt-6 max-w-2xl text-sm sm:text-base leading-relaxed text-zinc-600 font-light">
          A curated ecosystem of 34+ essential developer utilities, diagram engines, and sandboxes. 100% in-browser computation with zero cloud tracking.
        </p>

        {/* Minimalist Glass Search Bar */}
        <div className="mx-auto mt-8 max-w-xl">
          <div className="relative flex items-center group">
            <Search className="absolute left-4 h-4 w-4 text-zinc-400 transition-colors group-focus-within:text-zinc-950 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search tools by name, language, format (e.g. WASM, SQL, Regex)..."
              className="w-full rounded-2xl border border-zinc-200/90 bg-white/95 py-3.5 pl-11 pr-12 text-xs sm:text-sm text-zinc-900 placeholder-zinc-400 backdrop-blur-xl shadow-[0_2px_12px_rgba(0,0,0,0.03),0_16px_36px_rgba(0,0,0,0.04)] transition-all focus:border-zinc-950 focus:bg-white focus:outline-none focus:ring-4 focus:ring-zinc-950/5"
            />
            {searchQuery ? (
              <button
                onClick={() => {
                  sound.pop();
                  onSearchChange('');
                }}
                className="absolute right-3.5 rounded-lg p-1 text-zinc-400 hover:text-zinc-700 transition-colors"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            ) : (
              <kbd className="hidden sm:inline absolute right-3.5 rounded-md border border-zinc-200/80 bg-zinc-100/90 px-1.5 py-0.5 text-[10px] font-mono text-zinc-500 font-medium">
                ⌘K
              </kbd>
            )}
          </div>

          {/* Minimal Tag Filters */}
          <div className="mt-4 flex flex-wrap items-center justify-center gap-1.5">
            {POPULAR_TAGS.map((tag) => {
              const isSelected = selectedTag === tag;
              return (
                <button
                  key={tag}
                  onClick={() => {
                    sound.toggle();
                    onSelectTag(isSelected ? null : tag);
                  }}
                  className={`rounded-lg px-2.5 py-1 text-[11px] font-semibold transition-all duration-200 ${
                    isSelected
                      ? 'bg-zinc-900 text-white shadow-sm'
                      : 'text-zinc-600 hover:text-zinc-950 hover:bg-zinc-100/90'
                  }`}
                >
                  #{tag}
                </button>
              );
            })}
          </div>

          {(searchQuery || selectedTag) && (
            <div className="mt-3 text-[11px] font-mono text-zinc-500 animate-in fade-in">
              Showing <span className="text-zinc-900 font-semibold">{filteredCount}</span> of {totalCount} workbenches
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
