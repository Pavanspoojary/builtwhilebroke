import React, { useRef } from 'react';
import {
  ArrowUpRight,
  Star,
  WifiOff,
  Radio,
  Clock,
  Database,
  Search,
  BookOpen,
  GitBranch,
  FileText,
  Send,
  Lock,
  Bot,
  Sparkles,
  Wrench,
  Image as ImageIcon,
  PenTool,
  Share2,
  Layers,
  Zap,
} from 'lucide-react';
import { GithubIcon } from './Icons';
import { ToolItem } from '../types/tool';
import { sound } from '../lib/soundFx';

interface ToolCardProps {
  tool: ToolItem;
  usageCount?: number;
  onLaunch: (tool: ToolItem) => void;
  onViewAudit: (tool: ToolItem) => void;
}

const renderToolIcon = (iconName: string, className: string = 'h-5 w-5') => {
  switch (iconName) {
    case 'Radio':
      return <Radio className={className} />;
    case 'Clock':
      return <Clock className={className} />;
    case 'Database':
      return <Database className={className} />;
    case 'Search':
      return <Search className={className} />;
    case 'BookOpen':
      return <BookOpen className={className} />;
    case 'GitBranch':
      return <GitBranch className={className} />;
    case 'FileText':
      return <FileText className={className} />;
    case 'Send':
      return <Send className={className} />;
    case 'Lock':
      return <Lock className={className} />;
    case 'Bot':
      return <Bot className={className} />;
    case 'Sparkles':
    case 'Sparkle':
      return <Sparkles className={className} />;
    case 'Wrench':
      return <Wrench className={className} />;
    case 'Image':
      return <ImageIcon className={className} />;
    case 'PenTool':
      return <PenTool className={className} />;
    case 'Share2':
      return <Share2 className={className} />;
    case 'Layers':
      return <Layers className={className} />;
    default:
      return <Wrench className={className} />;
  }
};

export const ToolCard: React.FC<ToolCardProps> = ({
  tool,
  usageCount = 0,
  onLaunch,
  onViewAudit,
}) => {
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    cardRef.current.style.setProperty('--card-mouse-x', `${e.clientX - rect.left}px`);
    cardRef.current.style.setProperty('--card-mouse-y', `${e.clientY - rect.top}px`);
  };

  const isPermitted = tool.commercialStatus === 'Permitted';

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onClick={() => {
        sound.launch();
        onLaunch(tool);
      }}
      className="group relative flex flex-col justify-between rounded-2xl p-5 bg-white border border-zinc-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.02),0_4px_16px_rgba(0,0,0,0.02)] hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.07),0_0_20px_rgba(0,0,0,0.02)] hover:border-zinc-300/90 hover:-translate-y-1 transition-all duration-300 ease-out cursor-pointer overflow-hidden"
    >
      {/* 1. Cursor-Following Specular Spotlight Glow */}
      <div
        className="pointer-events-none absolute -inset-px rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{
          background:
            'radial-gradient(320px circle at var(--card-mouse-x, 50%) var(--card-mouse-y, 50%), rgba(24, 24, 27, 0.035), transparent 70%)',
        }}
      />

      {/* 2. Top Specular Glass Refraction Rim */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-zinc-900/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      {/* Main Content */}
      <div className="relative z-10">
        {/* Header: Icon, Tool Title & Ratings */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-3 min-w-0">
            {/* Visual Icon Box */}
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-zinc-100/90 border border-zinc-200/80 text-zinc-900 shadow-2xs transition-all duration-300 group-hover:scale-105 group-hover:bg-zinc-950 group-hover:text-white group-hover:border-zinc-950 group-hover:shadow-md">
              {renderToolIcon(tool.icon, 'h-5 w-5 transition-transform duration-300 group-hover:scale-105')}
            </div>

            <div className="min-w-0">
              <h3 className="font-sans text-sm font-bold text-zinc-950 tracking-tight transition-colors truncate">
                {tool.name}
              </h3>
              <p className="text-[11px] text-zinc-400 font-mono font-medium truncate">
                by @{tool.author}
              </p>
            </div>
          </div>

          {/* Badges: Usage Count & Star Rating */}
          <div className="flex shrink-0 items-center gap-1.5">
            {usageCount > 0 && (
              <div
                className="flex items-center gap-1 rounded-full bg-zinc-100/90 border border-zinc-200/80 px-2 py-0.5 text-[10px] font-mono font-bold text-zinc-800 shadow-2xs"
                title={`Used ${usageCount} time${usageCount > 1 ? 's' : ''}`}
              >
                <Zap className="h-2.5 w-2.5 fill-zinc-800 text-zinc-800" />
                <span>{usageCount}</span>
              </div>
            )}
            <div className="flex shrink-0 items-center gap-1 rounded-full bg-amber-50/80 border border-amber-200/70 px-2.5 py-0.5 text-[11px] font-mono font-bold text-amber-800 shadow-2xs">
              <Star className="h-3 w-3 fill-amber-400 text-amber-500" />
              <span>{tool.stars}</span>
            </div>
          </div>
        </div>

        {/* Description */}
        <p className="mt-3.5 text-xs leading-relaxed text-zinc-600 line-clamp-2 min-h-[2.5rem] font-normal">
          {tool.description}
        </p>

        {/* Tech Stack Pills */}
        <div className="mt-3.5 flex flex-wrap items-center gap-1.5">
          {tool.techStack.slice(0, 3).map((tech) => (
            <span
              key={tech}
              className="rounded-lg bg-zinc-50/90 border border-zinc-200/70 px-2 py-0.5 text-[10px] font-mono font-medium text-zinc-600 transition-colors group-hover:border-zinc-300"
            >
              {tech}
            </span>
          ))}
          {tool.techStack.length > 3 && (
            <span className="text-[10px] font-mono text-zinc-400 font-medium">
              +{tool.techStack.length - 3}
            </span>
          )}
        </div>
      </div>

      {/* Footer: License, Offline Badge, GitHub & Open Launch Action */}
      <div className="relative z-10 mt-5 pt-3.5 border-t border-zinc-100/90 flex items-center justify-between">
        <button
          onClick={(e) => {
            e.stopPropagation();
            sound.click();
            onViewAudit(tool);
          }}
          className="flex items-center gap-1.5 rounded-lg bg-zinc-50/90 border border-zinc-200/80 px-2 py-1 text-[10px] font-mono font-bold text-zinc-700 hover:bg-zinc-100 hover:text-zinc-950 transition-all shadow-2xs active:scale-95"
          title="View commercial license audit"
        >
          <span
            className={`h-1.5 w-1.5 rounded-full ${
              isPermitted ? 'bg-emerald-500 ring-2 ring-emerald-500/20' : 'bg-cyan-500 ring-2 ring-cyan-500/20'
            }`}
          />
          <span>{tool.license}</span>
        </button>

        <div className="flex items-center gap-2">
          {tool.offlineCapable && (
            <span
              title="100% Offline Capable"
              className="flex items-center gap-1 rounded-md bg-emerald-50/80 border border-emerald-200/60 px-1.5 py-0.5 text-[10px] font-mono font-semibold text-emerald-700"
            >
              <WifiOff className="h-3 w-3" />
              <span className="hidden sm:inline">Offline</span>
            </span>
          )}

          <a
            href={tool.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => {
              e.stopPropagation();
              sound.click();
            }}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100/80 transition-all"
            title="GitHub Repository"
          >
            <GithubIcon className="h-3.5 w-3.5" />
          </a>

          <div className="flex items-center gap-1 rounded-xl bg-zinc-100/90 px-2.5 py-1 text-[11px] font-bold text-zinc-900 border border-zinc-200/80 group-hover:bg-zinc-950 group-hover:text-white group-hover:border-zinc-950 shadow-2xs transition-all duration-200">
            <span>Open</span>
            <ArrowUpRight className="h-3 w-3 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </div>
        </div>
      </div>
    </div>
  );
};
