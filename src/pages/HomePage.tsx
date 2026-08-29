import React, { useState, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { HeroSection } from '../components/HeroSection';
import { CategoryNav } from '../components/CategoryNav';
import { ToolCard } from '../components/ToolCard';
import { CATEGORIES, TOOLS } from '../data/toolsData';
import { CategoryId, ToolItem } from '../types/tool';
import {
  ArrowRight,
  SearchX,
} from 'lucide-react';
import { sound } from '../lib/soundFx';
import { useToolUsageCounts, incrementToolUsage, GLOBAL_TOOL_BASELINE_USES } from '../lib/toolUsage';
import { SeoHead } from '../components/SeoHead';
import { FeedbackWidget } from '../components/FeedbackWidget';

interface HomePageProps {
  onViewAudit: (tool: ToolItem) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onViewAudit }) => {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState<CategoryId>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const usageCounts = useToolUsageCounts();

  // Tool counts per category
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

  // Filter & Sort tools by usage count
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

  const activeCategoryObj = CATEGORIES.find((c) => c.id === activeCategory);

  const handleLaunch = (tool: ToolItem) => {
    incrementToolUsage(tool.id);
    navigate(`/tools/${tool.id}`);
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#fafafa]">
      <SeoHead pageType="home" />

      {/* Hero Section */}
      <HeroSection
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedTag={selectedTag}
        onSelectTag={setSelectedTag}
        filteredCount={filteredTools.length}
        totalCount={TOOLS.length}
      />

      {/* Category Navigation Bar */}
      <CategoryNav
        categories={CATEGORIES}
        activeCategory={activeCategory}
        onSelectCategory={(id) => {
          setActiveCategory(id);
          setSelectedTag(null);
        }}
        categoryCounts={categoryCounts}
      />

      {/* Main Content Area */}
      <main className="mx-auto flex-1 w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Minimal Section Header */}
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-600 font-mono">
              {activeCategoryObj && activeCategory !== 'all' ? activeCategoryObj.name : 'All Workbenches'}
            </h2>
            <span className="rounded-full bg-zinc-200/80 border border-zinc-300/60 px-2 py-0.5 text-[10px] font-mono font-bold text-zinc-700">
              {filteredTools.length}
            </span>
          </div>

          <Link
            to="/tools"
            onClick={() => sound.click()}
            className="flex items-center gap-1 text-xs font-semibold text-zinc-600 hover:text-zinc-950 transition-colors"
          >
            <span>Full Directory</span>
            <ArrowRight className="h-3.5 w-3.5 text-zinc-900" />
          </Link>
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
              Try a different keyword or reset filters.
            </p>
            <button
              onClick={() => {
                sound.pop();
                setSearchQuery('');
                setSelectedTag(null);
                setActiveCategory('all');
              }}
              className="mt-4 rounded-xl bg-zinc-900 px-4 py-2 text-xs font-semibold text-white hover:bg-zinc-800 transition-colors shadow-sm"
            >
              Reset Filters
            </button>
          </div>
        )}
      </main>

      {/* Floating Bottom-Right Community & Tool Request Widget (Home Page only) */}
      <FeedbackWidget />
    </div>
  );
};
