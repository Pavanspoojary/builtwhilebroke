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
    <section className="relative pt-12 pb-10 sm:pt-20 sm:pb-14">
      <div className="mx-auto max-w-4xl px-4 text-center sm:px-6">
        {/* Top Supporter Pill */}
        <div className="mb-6 flex justify-center">
          <BuyMeACoffeeButton variant="hero" />
        </div>

        {/* Editorial Headline: Bold Sans + Organic Cursive Script */}
        <h1 className="font-sans font-extrabold text-5xl sm:text-7xl lg:text-8xl tracking-tight text-zinc-950 flex flex-wrap items-baseline justify-center gap-x-3.5 gap-y-1">
          <span>BuiltWhile</span>
          <span className="font-script font-normal text-zinc-500 text-6xl sm:text-8xl lg:text-9xl tracking-tight -rotate-1 select-none inline-block">
            broke.
          </span>
        </h1>

        {/* Subtitle with High Contrast & Spacing */}
        <p className="mx-auto mt-6 max-w-2xl text-sm sm:text-base leading-relaxed text-zinc-600 font-light">
          A curated ecosystem of essential developer utilities, diagram engines, and sandboxes. 100% in-browser computation with zero cloud tracking.
        </p>

        {/* Minimalist Search Bar */}
        <div className="mx-auto mt-8 max-w-xl">
          <div className="relative flex items-center">
            <Search className="absolute left-4 h-4 w-4 text-zinc-400 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search tools by name, language, format (e.g. WASM, SQL, Regex)..."
              className="w-full rounded-2xl border border-zinc-200/90 bg-white/95 py-3.5 pl-11 pr-11 text-xs sm:text-sm text-zinc-900 placeholder-zinc-400 backdrop-blur-xl shadow-xl shadow-zinc-900/[0.03] transition-all focus:border-zinc-950 focus:bg-white focus:outline-none focus:ring-4 focus:ring-zinc-950/5"
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
              <kbd className="hidden sm:inline absolute right-3.5 rounded-md border border-zinc-200 bg-zinc-100 px-1.5 py-0.5 text-[10px] font-mono text-zinc-500 font-medium">
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
                  className={`rounded-lg px-2.5 py-1 text-[11px] font-semibold transition-all ${
                    isSelected
                      ? 'bg-zinc-900 text-white shadow-sm'
                      : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100/90'
                  }`}
                >
                  #{tag}
                </button>
              );
            })}
          </div>

          {(searchQuery || selectedTag) && (
            <div className="mt-3 text-[11px] font-mono text-zinc-500">
              Showing <span className="text-zinc-800 font-semibold">{filteredCount}</span> of {totalCount} workbenches
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
