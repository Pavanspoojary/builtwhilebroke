import React from 'react';
import {
  LayoutGrid,
  Code2,
  Network,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import { Category, CategoryId } from '../types/tool';
import { sound } from '../lib/soundFx';

interface CategoryNavProps {
  categories: Category[];
  activeCategory: CategoryId;
  onSelectCategory: (id: CategoryId) => void;
  categoryCounts: Record<CategoryId, number>;
}

const getCategoryIcon = (iconName: string, className: string) => {
  switch (iconName) {
    case 'Code2':
      return <Code2 className={className} />;
    case 'Network':
      return <Network className={className} />;
    case 'ShieldCheck':
      return <ShieldCheck className={className} />;
    case 'Sparkles':
      return <Sparkles className={className} />;
    default:
      return <LayoutGrid className={className} />;
  }
};

export const CategoryNav: React.FC<CategoryNavProps> = ({
  categories,
  activeCategory,
  onSelectCategory,
  categoryCounts,
}) => {
  return (
    <div className="w-full py-2">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex justify-center">
        <div className="no-scrollbar flex items-center gap-1 overflow-x-auto rounded-2xl border border-zinc-200/90 bg-white/95 p-1.5 backdrop-blur-2xl shadow-[0_1px_4px_rgba(0,0,0,0.03)]">
          {categories.map((cat) => {
            const isActive = activeCategory === cat.id;
            const count = categoryCounts[cat.id] ?? 0;

            return (
              <button
                key={cat.id}
                onClick={() => {
                  sound.toggle();
                  onSelectCategory(cat.id);
                }}
                className={`flex shrink-0 items-center gap-2 rounded-xl px-3.5 py-1.5 text-xs font-semibold transition-all duration-200 ${
                  isActive
                    ? 'bg-zinc-950 text-white shadow-sm'
                    : 'text-zinc-600 hover:text-zinc-950 hover:bg-zinc-100/80'
                }`}
              >
                {getCategoryIcon(cat.icon, `h-3.5 w-3.5 ${isActive ? 'text-white' : 'text-zinc-500'}`)}
                <span>{cat.name}</span>
                <span
                  className={`rounded-md px-1.5 py-0.2 text-[10px] font-mono font-medium ${
                    isActive
                      ? 'bg-zinc-800 text-zinc-300'
                      : 'bg-zinc-100 text-zinc-500'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
