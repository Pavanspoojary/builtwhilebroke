import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { CategoryNav } from '../components/CategoryNav';
import { ToolCard } from '../components/ToolCard';
import { CATEGORIES, TOOLS } from '../data/toolsData';
import { CategoryId, ToolItem } from '../types/tool';
import {
  Search,
  X,
  SearchX,
} from 'lucide-react';
import { sound } from '../lib/soundFx';
import { useToolUsageCounts, incrementToolUsage, GLOBAL_TOOL_BASELINE_USES } from '../lib/toolUsage';
import { SeoHead } from '../components/SeoHead';

interface ToolsPageProps {
  onViewAudit: (tool: ToolItem) => void;
}

const TAG_LIST = [
  'Converters',
  'Code Snippets',
  'Diagrams',
  'OSINT',
  'Cryptography',
  'Media',
  'SQL Engine',
];

export const ToolsPage: React.FC<ToolsPageProps> = ({ onViewAudit }) => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const categoryParam = (searchParams.get('category') as CategoryId) || 'all';

  const [activeCategory, setActiveCategory] = useState<CategoryId>(categoryParam);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const usageCounts = useToolUsageCounts();

  useEffect(() => {
    if (categoryParam && CATEGORIES.some((c) => c.id === categoryParam)) {
      setActiveCategory(categoryParam);
    }
  }, [categoryParam]);

  const handleSelectCategory = (id: CategoryId) => {
    setActiveCategory(id);
    setSelectedTag(null);
    if (id === 'all') {
      searchParams.delete('category');
    } else {
      searchParams.set('category', id);
    }
    setSearchParams(searchParams);
  };

  const categoryCounts = useMemo(() => {
    const counts: Record<CategoryId, number> = {
      all: TOOLS.length,
      dev: 0,
      diagrams: 0,
      security: 0,
      media: 0,
    };
    TOOLS.forEach((t) => {
      if (counts[t.category] !== undefined) counts[t.category]++;
    });
    return counts;
  }, []);

  const filteredTools = useMemo(() => {
    return TOOLS.filter((tool) => {
      if (activeCategory !== 'all' && tool.category !== activeCategory) return false;
      if (selectedTag && !tool.tags.includes(selectedTag)) return false;
      if (searchQuery.trim() !== '') {
        const q = searchQuery.toLowerCase();
        const matchesName = tool.name.toLowerCase().includes(q);
        const matchesTagline = tool.tagline.toLowerCase().includes(q);
        const matchesDescription = tool.description.toLowerCase().includes(q);
        const matchesAuthor = tool.author.toLowerCase().includes(q);
        const matchesTech = tool.techStack.some((t) => t.toLowerCase().includes(q));
        const matchesTags = tool.tags.some((t) => t.toLowerCase().includes(q));
        if (!matchesName && !matchesTagline && !matchesDescription && !matchesAuthor && !matchesTech && !matchesTags) {
          return false;
        }
      }
      return true;
    }).sort((a, b) => {
      const countA = usageCounts[a.id] ?? GLOBAL_TOOL_BASELINE_USES[a.id] ?? 0;
      const countB = usageCounts[b.id] ?? GLOBAL_TOOL_BASELINE_USES[b.id] ?? 0;
      return countB - countA;
    });
  }, [activeCategory, searchQuery, selectedTag, usageCounts]);

  const handleLaunch = (tool: ToolItem) => {
    incrementToolUsage(tool.id);
    navigate(`/tools/${tool.id}`);
  };

  const activeCategoryObj = CATEGORIES.find((c) => c.id === activeCategory);

  return (
    <div className="flex flex-col min-h-screen bg-[#fafafa]">
      <SeoHead
        title={activeCategory !== 'all' ? `${activeCategoryObj?.name || 'Tools'} Directory` : 'Tools Directory'}
        description={`Explore ${TOOLS.length} curated open-source developer utilities, diagram engines, and client-side sandboxes running 100% in-browser.`}
        pageType="tools"
      />

      {/* Minimal Header */}
      <div className="border-b border-zinc-200/80 bg-white/60 py-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-extrabold text-zinc-950 tracking-tight">
                Tools Directory
              </h1>
              <p className="mt-1 text-xs text-zinc-500 font-normal">
                {TOOLS.length} curated open-source developer utilities running 100% inside your browser.
              </p>
            </div>

            {/* Quick Search */}
            <div className="w-full max-w-xs">
              <div className="relative flex items-center">
                <Search className="absolute left-3 h-3.5 w-3.5 text-zinc-400 pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Filter directory..."
                  className="w-full rounded-xl border border-zinc-200 bg-white py-2 pl-9 pr-8 text-xs text-zinc-900 placeholder-zinc-400 focus:border-zinc-950 focus:outline-none shadow-sm focus:ring-2 focus:ring-zinc-950/5"
                />
                {searchQuery && (
                  <button
                    onClick={() => {
                      sound.pop();
                      setSearchQuery('');
                    }}
                    className="absolute right-2.5 text-zinc-400 hover:text-zinc-700"
                  >
                    <X className="h-3 w-3" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Category Navigation Bar */}
      <CategoryNav
        categories={CATEGORIES}
        activeCategory={activeCategory}
        onSelectCategory={handleSelectCategory}
        categoryCounts={categoryCounts}
      />

      {/* Main Content Area */}
      <main className="mx-auto flex-1 w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        {/* Active Tag Filter Pills */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3 text-xs text-zinc-600">
          <span className="font-mono text-[11px] text-zinc-500 font-medium">
            {filteredTools.length} of {TOOLS.length} tools
          </span>

          <div className="flex flex-wrap items-center gap-1">
            {TAG_LIST.map((tag) => {
              const isSelected = selectedTag === tag;
              return (
                <button
                  key={tag}
                  onClick={() => {
                    sound.toggle();
                    setSelectedTag(isSelected ? null : tag);
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
        </div>

        {/* Tools Grid */}
        {filteredTools.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredTools.map((tool) => (
              <ToolCard
                key={tool.id}
                tool={tool}
                usageCount={usageCounts[tool.id] || 0}
                onLaunch={handleLaunch}
                onViewAudit={onViewAudit}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm">
            <SearchX className="h-8 w-8 text-zinc-400" />
            <h3 className="mt-3 text-sm font-bold text-zinc-900">No tools found</h3>
            <p className="mt-1 text-xs text-zinc-500">
              We couldn't find any tools matching your search criteria.
            </p>
            <button
              onClick={() => {
                sound.pop();
                setSearchQuery('');
                setSelectedTag(null);
                handleSelectCategory('all');
              }}
              className="mt-4 rounded-xl bg-zinc-900 px-4 py-2 text-xs font-semibold text-white hover:bg-zinc-800 transition-colors shadow-sm"
            >
              Reset Filters
            </button>
          </div>
        )}
      </main>
    </div>
  );
};
