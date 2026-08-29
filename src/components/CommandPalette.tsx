import React, { useState, useEffect, useRef } from 'react';
import {
  Search,
  Maximize2,
  Shield,
  Trash2,
  ArrowRight,
  Command,
  X,
} from 'lucide-react';
import { ToolItem, CategoryId } from '../types/tool';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  tools: ToolItem[];
  onSelectTool: (tool: ToolItem) => void;
  onSelectCategory: (id: CategoryId) => void;
  onOpenLicenseAudit: () => void;
  onOpenPrivacy: () => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  onClose,
  tools,
  onSelectTool,
  onOpenLicenseAudit,
  onOpenPrivacy,
}) => {
  const [query, setQuery] = useState<string>('');
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setSelectedIndex(0);
      setQuery('');
    }
  }, [isOpen]);

  const filteredTools = tools.filter(
    (t) =>
      t.name.toLowerCase().includes(query.toLowerCase()) ||
      t.tagline.toLowerCase().includes(query.toLowerCase()) ||
      t.tags.some((tag) => tag.toLowerCase().includes(query.toLowerCase())) ||
      t.author.toLowerCase().includes(query.toLowerCase())
  );

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((prev) =>
          prev < filteredTools.length - 1 ? prev + 1 : 0
        );
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((prev) =>
          prev > 0 ? prev - 1 : filteredTools.length - 1
        );
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (filteredTools[selectedIndex]) {
          onSelectTool(filteredTools[selectedIndex]);
          onClose();
        }
      } else if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, filteredTools, selectedIndex, onSelectTool, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/40 p-4 pt-20 backdrop-blur-xl animate-in fade-in duration-200">
      <div className="flex w-full max-w-2xl flex-col rounded-3xl bg-white shadow-2xl overflow-hidden border border-zinc-200/90">
        {/* Search Input Bar */}
        <div className="relative flex items-center border-b border-zinc-200 px-4 py-3.5 bg-white">
          <Search className="h-4.5 w-4.5 text-zinc-400 pointer-events-none" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            placeholder="Type a tool name, category, or command..."
            className="w-full bg-transparent pl-3 pr-8 text-sm text-zinc-900 placeholder-zinc-400 focus:outline-none"
          />
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-700 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Results List */}
        <div className="max-h-96 overflow-y-auto p-2 divide-y divide-zinc-100 bg-white">
          {/* Quick Actions if query is empty */}
          {query.trim() === '' && (
            <div className="pb-2 space-y-1">
              <div className="px-3 py-1.5 text-[10px] font-mono uppercase tracking-wider text-zinc-400 font-bold">
                System Commands
              </div>
              <button
                onClick={() => {
                  onClose();
                  onOpenLicenseAudit();
                }}
                className="flex w-full items-center justify-between rounded-xl px-3 py-2 text-xs text-zinc-700 hover:bg-zinc-50 hover:text-zinc-950 transition"
              >
                <div className="flex items-center gap-2.5">
                  <Shield className="h-4 w-4 text-orange-600" />
                  <span className="font-semibold">Open Commercial License Audit Table</span>
                </div>
                <ArrowRight className="h-3.5 w-3.5 text-zinc-400" />
              </button>

              <button
                onClick={() => {
                  onClose();
                  onOpenPrivacy();
                }}
                className="flex w-full items-center justify-between rounded-xl px-3 py-2 text-xs text-zinc-700 hover:bg-zinc-50 hover:text-zinc-950 transition"
              >
                <div className="flex items-center gap-2.5">
                  <Trash2 className="h-4 w-4 text-rose-500" />
                  <span className="font-semibold">Open Privacy & Data Purge Center</span>
                </div>
                <ArrowRight className="h-3.5 w-3.5 text-zinc-400" />
              </button>
            </div>
          )}

          {/* Filtered Tools */}
          <div className="pt-1">
            <div className="px-3 py-1.5 text-[10px] font-mono uppercase tracking-wider text-zinc-400 font-bold">
              Open-Source Tools ({filteredTools.length})
            </div>
            {filteredTools.length > 0 ? (
              filteredTools.map((tool, idx) => {
                const isSelected = idx === selectedIndex;
                return (
                  <button
                    key={tool.id}
                    onClick={() => {
                      onSelectTool(tool);
                      onClose();
                    }}
                    onMouseEnter={() => setSelectedIndex(idx)}
                    className={`flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left text-xs transition ${
                      isSelected
                        ? 'bg-orange-50 text-orange-950 border border-orange-200/80 shadow-sm font-semibold'
                        : 'text-zinc-700 hover:bg-zinc-50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="flex h-7 w-7 items-center justify-center rounded-lg border border-zinc-200 bg-zinc-50 font-mono text-[10px] font-extrabold shadow-sm"
                        style={{ color: tool.primaryColor || '#ea580c' }}
                      >
                        {tool.name.slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <div className="font-bold text-zinc-900 flex items-center gap-2">
                          {tool.name}
                          <span className="rounded bg-zinc-100 px-1.5 py-0.2 text-[9px] font-mono text-zinc-600 border border-zinc-200">
                            {tool.license}
                          </span>
                        </div>
                        <p className="text-[11px] text-zinc-500 truncate max-w-md font-normal">
                          {tool.tagline}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-zinc-400">
                      <span className="text-[10px] font-mono font-medium">{tool.stars}</span>
                      <Maximize2 className="h-3.5 w-3.5 text-zinc-400" />
                    </div>
                  </button>
                );
              })
            ) : (
              <div className="p-6 text-center text-xs text-zinc-400 font-mono">
                No open-source tools matching "{query}".
              </div>
            )}
          </div>
        </div>

        {/* Command Palette Keyboard Hints */}
        <div className="flex items-center justify-between border-t border-zinc-100 bg-zinc-50/80 px-4 py-2.5 text-[11px] text-zinc-500 font-mono">
          <div className="flex items-center gap-3">
            <span>↑↓ Navigate</span>
            <span>↵ Select</span>
            <span>Esc Close</span>
          </div>
          <div className="flex items-center gap-1 font-semibold text-zinc-700">
            <Command className="h-3 w-3" />
            <span>BuiltWhileBroke</span>
          </div>
        </div>
      </div>
    </div>
  );
};
