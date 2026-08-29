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
  FileCheck,
  Shield,
  Globe,
  SlidersHorizontal,
  Maximize2,
  Box,
  Palette,
  Video,
  Code2,
  Cpu,
  Terminal,
  Activity,
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
    case 'FileCheck':
      return <FileCheck className={className} />;
    case 'Shield':
      return <Shield className={className} />;
    case 'Globe':
      return <Globe className={className} />;
    case 'SlidersHorizontal':
      return <SlidersHorizontal className={className} />;
    case 'Maximize2':
      return <Maximize2 className={className} />;
    case 'Box':
      return <Box className={className} />;
    case 'Palette':
      return <Palette className={className} />;
    case 'Video':
      return <Video className={className} />;
    case 'Regex':
    case 'Code2':
      return <Code2 className={className} />;
    case 'Terminal':
      return <Terminal className={className} />;
    case 'Cpu':
      return <Cpu className={className} />;
    default:
      return <Activity className={className} />;
  }
};

export const ToolCard: React.FC<ToolCardProps> = ({
  tool,
  usageCount,
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
      className="group relative flex flex-col justify-between rounded-2xl p-5 bg-white border border-zinc-200/90 shadow-[0_1px_3px_rgba(0,0,0,0.03),0_4px_12px_rgba(0,0,0,0.02)] hover:shadow-[0_16px_36px_rgba(0,0,0,0.06),0_2px_8px_rgba(0,0,0,0.04)] hover:border-zinc-400/80 hover:-translate-y-1 transition-all duration-300 cursor-pointer overflow-hidden"
    >
      {/* 1. Subtle Caustic Glow on Hover */}
      <div
        className="pointer-events-none absolute -inset-px rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{
          background:
            'radial-gradient(280px circle at var(--card-mouse-x, 50%) var(--card-mouse-y, 50%), rgba(0, 0, 0, 0.025), transparent 70%)',
        }}
      />

      {/* 2. Top Specular Glass Accent Line */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-zinc-900/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      {/* Main Content Area */}
      <div className="relative z-10">
        {/* Header: Tool Icon, Names & Star / Usage Rating */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-3 min-w-0">
            {/* Visual Icon Badge */}
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-zinc-100 border border-zinc-200/80 text-zinc-900 shadow-2xs transition-transform duration-200 group-hover:scale-105 group-hover:bg-zinc-900 group-hover:text-white group-hover:border-zinc-900">
              {renderToolIcon(tool.icon, 'h-5 w-5')}
            </div>

            <div className="min-w-0">
              <h3 className="font-sans text-sm font-bold text-zinc-950 tracking-tight group-hover:text-zinc-900 transition-colors truncate">
                {tool.name}
              </h3>
              <p className="text-[11px] text-zinc-400 font-mono font-medium truncate">
                by @{tool.author}
              </p>
            </div>
          </div>

          {/* Badges: Usage Count & Star Rating */}
          <div className="flex shrink-0 items-center gap-1.5">
            {usageCount !== undefined && usageCount > 0 && (
              <div
                className="flex items-center gap-1 rounded-full bg-zinc-100 border border-zinc-200/80 px-2 py-0.5 text-[10px] font-mono font-bold text-zinc-800 shadow-2xs animate-in fade-in"
                title={`Used ${usageCount} time${usageCount > 1 ? 's' : ''}`}
              >
                <span>⚡</span>
                <span>{usageCount} {usageCount === 1 ? 'use' : 'uses'}</span>
              </div>
            )}
            <div className="flex shrink-0 items-center gap-1 rounded-full bg-amber-50/90 border border-amber-200/80 px-2.5 py-0.5 text-[11px] font-mono font-bold text-amber-800 shadow-sm">
              <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-500" />
              <span>{tool.stars}</span>
            </div>
          </div>
        </div>

        {/* Description (Fixed line clamp & uniform height) */}
        <p className="mt-3.5 text-xs leading-relaxed text-zinc-600 line-clamp-2 min-h-[2.5rem] font-normal">
          {tool.description}
        </p>

        {/* Tech Stack Chips */}
        <div className="mt-3 flex flex-wrap items-center gap-1.5">
          {tool.techStack.slice(0, 3).map((tech) => (
            <span
              key={tech}
              className="rounded-lg bg-zinc-50 border border-zinc-200/80 px-2 py-0.5 text-[10px] font-mono font-medium text-zinc-600 group-hover:border-zinc-300 transition-colors"
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
      <div className="relative z-10 mt-5 pt-3.5 border-t border-zinc-100 flex items-center justify-between">
        <button
          onClick={(e) => {
            e.stopPropagation();
            sound.click();
            onViewAudit(tool);
          }}
          className="flex items-center gap-1.5 rounded-lg bg-zinc-50 border border-zinc-200/80 px-2 py-1 text-[10px] font-mono font-bold text-zinc-700 hover:bg-zinc-100 hover:text-zinc-950 transition-colors shadow-2xs"
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
              className="flex items-center gap-1 rounded-md bg-emerald-50 border border-emerald-200/70 px-1.5 py-0.5 text-[10px] font-mono font-semibold text-emerald-700"
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
            className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100 transition-colors"
            title="GitHub Repository"
          >
            <GithubIcon className="h-3.5 w-3.5" />
          </a>

          <div className="flex items-center gap-1 rounded-xl bg-zinc-100 px-2.5 py-1 text-[11px] font-bold text-zinc-900 border border-zinc-200/80 group-hover:bg-zinc-900 group-hover:text-white group-hover:border-zinc-900 shadow-2xs transition-all">
            <span>Open</span>
            <ArrowUpRight className="h-3 w-3 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </div>
        </div>
      </div>
    </div>
  );
};
