"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface CommandItem {
  id: string;
  title: string;
  category: string;
  icon?: string;
  action: () => void;
}

const defaultCommands: CommandItem[] = [
  { id: "1", title: "Create New Project", category: "Actions", icon: "✨", action: () => console.log("New Project") },
  { id: "2", title: "Explore Design System", category: "Navigation", icon: "🎨", action: () => console.log("Design System") },
  { id: "3", title: "Open Settings", category: "Navigation", icon: "⚙️", action: () => console.log("Settings") },
  { id: "4", title: "Trigger Deploy Fleet", category: "Actions", icon: "🚀", action: () => console.log("Deploy Fleet") },
];

export function AccessibleCommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  // Keyboard shortcut: Cmd+K / Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
      if (e.key === "Escape") {
        setOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const filtered = defaultCommands.filter((c) =>
    c.title.toLowerCase().includes(query.toLowerCase()) || c.category.toLowerCase().includes(query.toLowerCase())
  );

  const handleKeyDownList = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % Math.max(1, filtered.length));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + filtered.length) % Math.max(1, filtered.length));
    } else if (e.key === "Enter" && filtered[selectedIndex]) {
      e.preventDefault();
      filtered[selectedIndex].action();
      setOpen(false);
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-24 px-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
            className="fixed inset-0 bg-black/70 backdrop-blur-md"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            transition={{ type: "spring", damping: 28, stiffness: 350 }}
            className="relative w-full max-w-xl bg-zinc-900 border border-white/15 rounded-2xl shadow-2xl overflow-hidden z-10"
          >
            {/* Input Header */}
            <div className="flex items-center px-4 border-b border-white/10">
              <span className="text-zinc-500 mr-3">🔍</span>
              <input
                ref={inputRef}
                autoFocus
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setSelectedIndex(0);
                }}
                onKeyDown={handleKeyDownList}
                placeholder="Type a command or search..."
                className="w-full bg-transparent py-3.5 text-white placeholder-zinc-500 text-sm outline-none"
              />
              <span className="px-2 py-0.5 text-[10px] font-mono bg-white/10 text-zinc-400 rounded">ESC</span>
            </div>

            {/* List items */}
            <div className="max-h-72 overflow-y-auto p-2 space-y-1">
              {filtered.length === 0 ? (
                <div className="py-8 text-center text-xs text-zinc-500">No commands found.</div>
              ) : (
                filtered.map((item, index) => {
                  const isSelected = selectedIndex === index;
                  return (
                    <div
                      key={item.id}
                      onClick={() => {
                        item.action();
                        setOpen(false);
                      }}
                      onMouseEnter={() => setSelectedIndex(index)}
                      className={`flex items-center justify-between px-3 py-2.5 rounded-xl cursor-pointer text-xs transition-colors ${
                        isSelected ? "bg-white/10 text-white" : "text-zinc-400 hover:text-zinc-200"
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <span>{item.icon}</span>
                        <span className="font-medium">{item.title}</span>
                      </div>
                      <span className="text-[10px] font-mono text-zinc-500 uppercase">{item.category}</span>
                    </div>
                  );
                })
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
