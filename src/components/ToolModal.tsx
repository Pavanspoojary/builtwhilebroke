import React, { useState, useEffect } from 'react';
import {
  X,
  ExternalLink,
  RotateCcw,
  Maximize2,
  Shield,
  Layers,
  Sparkles,
} from 'lucide-react';
import { GithubIcon } from './Icons';
import { ToolItem } from '../types/tool';

interface ToolModalProps {
  tool: ToolItem | null;
  onClose: () => void;
  onViewAudit: (tool: ToolItem) => void;
}

export const ToolModal: React.FC<ToolModalProps> = ({
  tool,
  onClose,
  onViewAudit,
}) => {
  const [iframeKey, setIframeKey] = useState<number>(0);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [iframeError, setIframeError] = useState<boolean>(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!tool) return null;

  const handleReload = () => {
    setIframeKey((prev) => prev + 1);
    setIframeError(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-2 backdrop-blur-md sm:p-4 lg:p-6 animate-in fade-in duration-200">
      <div
        className={`flex w-full flex-col rounded-2xl border border-white/10 bg-[#0e0e12] shadow-2xl transition-all ${
          isFullscreen
            ? 'h-[98vh] max-w-[98vw]'
            : 'h-[92vh] max-w-7xl'
        }`}
      >
        {/* Modal Top Bar */}
        <div className="flex shrink-0 items-center justify-between border-b border-white/[0.08] bg-[#121216] px-4 py-3 sm:px-6">
          <div className="flex items-center gap-3">
            <div
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-zinc-800 text-sm font-bold font-mono"
              style={{ color: tool.primaryColor || '#8b5cf6' }}
            >
              {tool.name.slice(0, 2).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-bold text-white sm:text-base">
                  {tool.name}
                </h2>
                <span className="rounded bg-zinc-800 px-1.5 py-0.5 text-[10px] font-mono text-zinc-400">
                  {tool.license}
                </span>
                <span className="hidden rounded bg-indigo-500/10 px-1.5 py-0.5 text-[10px] font-medium text-indigo-300 sm:inline">
                  {tool.commercialStatus}
                </span>
              </div>
              <p className="text-[11px] text-zinc-400 truncate max-w-md">
                {tool.tagline}
              </p>
            </div>
          </div>

          {/* Action Tools */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            <button
              onClick={handleReload}
              className="rounded-lg border border-white/10 bg-zinc-800/80 p-1.5 text-zinc-400 hover:text-white"
              title="Reload Frame"
            >
              <RotateCcw className="h-4 w-4" />
            </button>

            <button
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="hidden rounded-lg border border-white/10 bg-zinc-800/80 p-1.5 text-zinc-400 hover:text-white sm:block"
              title={isFullscreen ? 'Exit Fullscreen' : 'Expand Fullscreen'}
            >
              <Maximize2 className="h-4 w-4" />
            </button>

            <a
              href={tool.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 rounded-lg border border-indigo-500/30 bg-indigo-500/10 px-2.5 py-1.5 text-xs font-medium text-indigo-300 hover:bg-indigo-500/20"
              title="Open Live Application in New Tab"
            >
              <ExternalLink className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Open Live</span>
            </a>

            <a
              href={tool.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 rounded-lg border border-white/10 bg-zinc-800/80 px-2.5 py-1.5 text-xs font-medium text-zinc-300 hover:text-white"
              title="View GitHub Repository"
            >
              <GithubIcon className="h-3.5 w-3.5 text-zinc-400" />
              <span className="hidden sm:inline">Source</span>
            </a>

            <button
              onClick={onClose}
              className="rounded-lg border border-white/10 bg-zinc-800/80 p-1.5 text-zinc-400 hover:bg-red-500/20 hover:text-red-300"
              title="Close Workbench (Esc)"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Workbench Body: IFrame or Rich Preview Workspace */}
        <div className="relative flex-1 bg-black overflow-hidden flex flex-col">
          {!iframeError ? (
            <iframe
              key={iframeKey}
              src={tool.embedUrl}
              title={tool.name}
              className="h-full w-full border-0 bg-[#09090b]"
              sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-downloads allow-modals"
              allow="accelerometer; autoplay; clipboard-write; clipboard-read; encrypted-media; gyroscope; picture-in-picture; web-share"
              onError={() => setIframeError(true)}
            />
          ) : (
            <div className="flex h-full w-full flex-col items-center justify-center p-8 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-indigo-500/20 bg-indigo-500/10 text-indigo-400 shadow-glow-sm">
                <Layers className="h-8 w-8" />
              </div>
              <h3 className="mt-4 text-xl font-bold text-white">
                {tool.name} Workbench
              </h3>
              <p className="mt-2 max-w-md text-xs text-zinc-400">
                This tool operates securely. Launch directly in an isolated browser window for optimal performance.
              </p>
              <div className="mt-6 flex gap-3">
                <a
                  href={tool.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-xs font-semibold text-white shadow-glow-sm hover:bg-indigo-500"
                >
                  <ExternalLink className="h-4 w-4" />
                  <span>Launch Live Instance</span>
                </a>
                <button
                  onClick={handleReload}
                  className="rounded-xl border border-white/10 bg-zinc-800 px-4 py-2.5 text-xs font-medium text-zinc-300 hover:bg-zinc-700"
                >
                  Retry Embedded Frame
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Workbench Bottom Info Bar */}
        <div className="flex shrink-0 flex-wrap items-center justify-between border-t border-white/[0.08] bg-[#121216] px-4 py-2.5 text-xs text-zinc-400">
          <div className="flex flex-wrap items-center gap-3">
            <span className="flex items-center gap-1 text-zinc-300">
              <Sparkles className="h-3 w-3 text-indigo-400" />
              <span>{tool.author}</span>
            </span>
            <span className="hidden sm:inline text-zinc-600">•</span>
            <span className="hidden sm:inline text-zinc-400">
              {tool.commercialNotes}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                onClose();
                onViewAudit(tool);
              }}
              className="flex items-center gap-1 text-indigo-400 hover:underline"
            >
              <Shield className="h-3 w-3" />
              <span>Audit Terms</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
