import React, { useState } from "react";
import { motion } from "framer-motion";

interface TabItem {
  id: string;
  label: string;
  count?: number;
}

const defaultTabs: TabItem[] = [
  { id: "all", label: "All Projects", count: 12 },
  { id: "active", label: "In Progress", count: 5 },
  { id: "completed", label: "Completed", count: 7 },
  { id: "archived", label: "Archived" },
];

export function AnimatedSegmentedTabs({
  tabs = defaultTabs,
  onSelect,
}: {
  tabs?: TabItem[];
  onSelect?: (id: string) => void;
}) {
  const [activeId, setActiveId] = useState(tabs[0]?.id || "");

  const handleSelect = (id: string) => {
    setActiveId(id);
    onSelect?.(id);
  };

  return (
    <div className="inline-flex items-center gap-1.5 p-1.5 rounded-2xl bg-zinc-900/80 border border-white/10 backdrop-blur-xl">
      {tabs.map((tab) => {
        const isActive = activeId === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => handleSelect(tab.id)}
            className={`relative px-4 py-2 rounded-xl text-xs font-medium transition-colors duration-200 outline-none focus-visible:ring-2 focus-visible:ring-violet-500 ${
              isActive ? "text-white" : "text-zinc-400 hover:text-zinc-200"
            }`}
          >
            {isActive && (
              <motion.div
                layoutId="active-pill-background"
                transition={{ type: "spring", stiffness: 450, damping: 35 }}
                className="absolute inset-0 rounded-xl bg-white/15 border border-white/20 shadow-md backdrop-blur-md"
              />
            )}
            <span className="relative z-10 flex items-center gap-1.5">
              {tab.label}
              {tab.count !== undefined && (
                <span
                  className={`px-1.5 py-0.5 rounded-md text-[10px] font-mono ${
                    isActive ? "bg-white/20 text-white" : "bg-white/5 text-zinc-500"
                  }`}
                >
                  {tab.count}
                </span>
              )}
            </span>
          </button>
        );
      })}
    </div>
  );
}
