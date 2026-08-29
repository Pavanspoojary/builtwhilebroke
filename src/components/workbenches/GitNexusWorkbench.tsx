import React, { useState } from 'react';
import {
  GitBranch,
  Star,
  GitFork,
  Eye,
  Code2,
  Search,
  Activity,
} from 'lucide-react';
import { sound } from '../../lib/soundFx';

interface RepoProfile {
  fullName: string;
  name: string;
  owner: string;
  description: string;
  stars: string;
  forks: string;
  watchers: string;
  primaryLang: string;
  languages: { name: string; pct: number; color: string }[];
  license: string;
  openIssues: number;
  lastCommit: string;
  heatmap: number[]; // 52 weeks activity index (0 - 4)
}

const PRESET_REPOS: Record<string, RepoProfile> = {
  'electric-sql/pglite': {
    fullName: 'electric-sql/pglite',
    name: 'pglite',
    owner: 'electric-sql',
    description: 'Lightweight WASM Postgres build packaged into a TypeScript client library for browser, Node.js and Bun.',
    stars: '13.4k',
    forks: '420',
    watchers: '185',
    primaryLang: 'TypeScript',
    languages: [
      { name: 'TypeScript', pct: 64, color: '#3178c6' },
      { name: 'C / WASM', pct: 28, color: '#555555' },
      { name: 'JavaScript', pct: 8, color: '#f7df1e' },
    ],
    license: 'Apache-2.0',
    openIssues: 34,
    lastCommit: '2 hours ago',
    heatmap: Array.from({ length: 52 }, () => Math.floor(Math.random() * 5)),
  },
  'stackblitz-labs/bolt.diy': {
    fullName: 'stackblitz-labs/bolt.diy',
    name: 'bolt.diy',
    owner: 'stackblitz-labs',
    description: 'Prompt, build and deploy fullstack web apps in browser WebContainers with AI.',
    stars: '15.8k',
    forks: '2.1k',
    watchers: '310',
    primaryLang: 'TypeScript',
    languages: [
      { name: 'TypeScript', pct: 78, color: '#3178c6' },
      { name: 'React / TSX', pct: 16, color: '#61dafb' },
      { name: 'CSS', pct: 6, color: '#563d7c' },
    ],
    license: 'MIT',
    openIssues: 82,
    lastCommit: '45 mins ago',
    heatmap: Array.from({ length: 52 }, () => Math.floor(Math.random() * 5)),
  },
  'jupyterlite/jupyterlite': {
    fullName: 'jupyterlite/jupyterlite',
    name: 'jupyterlite',
    owner: 'jupyterlite',
    description: 'Wasm powered Jupyter running entirely in the browser without remote kernels.',
    stars: '6.9k',
    forks: '540',
    watchers: '140',
    primaryLang: 'Python / TypeScript',
    languages: [
      { name: 'TypeScript', pct: 52, color: '#3178c6' },
      { name: 'Python', pct: 36, color: '#3572A5' },
      { name: 'HTML/CSS', pct: 12, color: '#e34c26' },
    ],
    license: 'BSD-3-Clause',
    openIssues: 46,
    lastCommit: 'Yesterday',
    heatmap: Array.from({ length: 52 }, () => Math.floor(Math.random() * 5)),
  },
};

export const GitNexusWorkbench: React.FC = () => {
  const [repoInput, setRepoInput] = useState<string>('electric-sql/pglite');
  const [selectedRepoKey, setSelectedRepoKey] = useState<string>('electric-sql/pglite');

  const profile = PRESET_REPOS[selectedRepoKey] || PRESET_REPOS['electric-sql/pglite'];

  const handleSearch = () => {
    sound.launch();
    if (PRESET_REPOS[repoInput.trim()]) {
      setSelectedRepoKey(repoInput.trim());
    } else {
      setSelectedRepoKey('electric-sql/pglite');
    }
  };

  const handleSelectPreset = (key: string) => {
    sound.click();
    setRepoInput(key);
    setSelectedRepoKey(key);
  };

  return (
    <div className="flex flex-col h-full w-full bg-[#fafafa] text-zinc-900 overflow-y-auto font-sans">
      {/* Top Header */}
      <div className="shrink-0 flex items-center justify-between border-b border-zinc-200/80 bg-white px-6 py-3.5 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-orange-200 bg-orange-50 text-orange-600 shadow-sm">
            <GitBranch className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-zinc-950 flex items-center gap-2">
              <span>GitNexus Repository Intelligence & Network Visualizer</span>
              <span className="rounded bg-orange-50 border border-orange-200 px-1.5 py-0.2 text-[10px] font-mono font-bold text-orange-700">
                GitHub API • 100% Client
              </span>
            </h2>
            <p className="text-[11px] text-zinc-500 font-normal">
              Interactive commit telemetry, language distributions, and repository network analytics.
            </p>
          </div>
        </div>
      </div>

      {/* Main Studio Body */}
      <div className="p-6 max-w-6xl mx-auto w-full space-y-6">
        {/* Top Search & Presets Bar */}
        <div className="rounded-3xl border border-zinc-200/90 bg-white p-6 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-3.5 h-4 w-4 text-zinc-400" />
              <input
                type="text"
                value={repoInput}
                onChange={(e) => setRepoInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                placeholder="Enter GitHub repo (e.g. owner/repo)..."
                className="w-full rounded-2xl border border-zinc-200 bg-zinc-50 py-3 pl-11 pr-4 text-xs font-mono text-zinc-900 placeholder-zinc-400 focus:border-orange-500 focus:bg-white focus:outline-none shadow-sm"
              />
            </div>
            <button
              onClick={handleSearch}
              className="flex items-center justify-center gap-2 rounded-2xl bg-orange-600 px-6 py-3 text-xs font-bold text-white shadow-sm hover:bg-orange-500 transition-all active:scale-95"
            >
              <span>Analyze Repo</span>
            </button>
          </div>

          {/* Quick Preset Pills */}
          <div className="flex items-center gap-2 flex-wrap text-xs">
            <span className="font-mono text-[10px] uppercase text-zinc-400 font-bold">Popular Repos:</span>
            {Object.keys(PRESET_REPOS).map((key) => (
              <button
                key={key}
                onClick={() => handleSelectPreset(key)}
                className={`rounded-xl px-3 py-1 font-mono text-[11px] font-semibold transition-all ${
                  selectedRepoKey === key
                    ? 'bg-orange-600 text-white font-bold shadow-sm'
                    : 'border border-zinc-200 bg-zinc-50 text-zinc-600 hover:bg-zinc-100 hover:text-zinc-950'
                }`}
              >
                {key}
              </button>
            ))}
          </div>
        </div>

        {/* Repo Overview Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 font-mono">
          <div className="rounded-2xl border border-zinc-200/90 bg-white p-4 shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between text-zinc-500 text-xs">
              <span className="font-bold">Stargazers</span>
              <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
            </div>
            <div className="text-2xl font-extrabold text-zinc-950 mt-2">{profile.stars}</div>
            <span className="text-[10px] text-emerald-700 font-semibold">Top 1% Trending</span>
          </div>

          <div className="rounded-2xl border border-zinc-200/90 bg-white p-4 shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between text-zinc-500 text-xs">
              <span className="font-bold">Forks</span>
              <GitFork className="h-4 w-4 text-orange-600" />
            </div>
            <div className="text-2xl font-extrabold text-zinc-950 mt-2">{profile.forks}</div>
            <span className="text-[10px] text-zinc-400">Active Ecosystem</span>
          </div>

          <div className="rounded-2xl border border-zinc-200/90 bg-white p-4 shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between text-zinc-500 text-xs">
              <span className="font-bold">Watchers</span>
              <Eye className="h-4 w-4 text-indigo-600" />
            </div>
            <div className="text-2xl font-extrabold text-zinc-950 mt-2">{profile.watchers}</div>
            <span className="text-[10px] text-zinc-400">Subscribers</span>
          </div>

          <div className="rounded-2xl border border-zinc-200/90 bg-white p-4 shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between text-zinc-500 text-xs">
              <span className="font-bold">License</span>
              <span className="text-emerald-700 text-xs font-extrabold">{profile.license}</span>
            </div>
            <div className="text-xs text-zinc-800 mt-2 truncate font-sans font-semibold">{profile.name}</div>
            <span className="text-[10px] text-zinc-400">Commercial Permitted</span>
          </div>
        </div>

        {/* 2-Column Section: Language Distribution & 52-Week Commit Heatmap */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Language Distribution Breakdown */}
          <div className="rounded-3xl border border-zinc-200/90 bg-white p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-wider text-zinc-800">
                <Code2 className="h-4 w-4 text-orange-600" />
                <span>Language Composition</span>
              </div>
              <span className="text-[10px] font-mono text-zinc-400">GitHub Linguistic Stats</span>
            </div>

            {/* Progress Multi-Bar */}
            <div className="flex h-3 w-full overflow-hidden rounded-full bg-zinc-100 border border-zinc-200">
              {profile.languages.map((l) => (
                <div
                  key={l.name}
                  style={{ width: `${l.pct}%`, backgroundColor: l.color }}
                  title={`${l.name}: ${l.pct}%`}
                />
              ))}
            </div>

            {/* Language Legend */}
            <div className="grid grid-cols-2 gap-2 pt-2 font-mono text-xs">
              {profile.languages.map((l) => (
                <div key={l.name} className="flex items-center justify-between p-2.5 rounded-xl bg-zinc-50 border border-zinc-200">
                  <div className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: l.color }} />
                    <span className="text-zinc-800 font-semibold">{l.name}</span>
                  </div>
                  <span className="text-zinc-500 font-bold">{l.pct}%</span>
                </div>
              ))}
            </div>
          </div>

          {/* 52-Week Contribution Activity Heatmap */}
          <div className="rounded-3xl border border-zinc-200/90 bg-white p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-wider text-zinc-800">
                <Activity className="h-4 w-4 text-emerald-600" />
                <span>52-Week Commit Velocity</span>
              </div>
              <span className="text-[10px] font-mono text-emerald-700 font-bold">Last commit {profile.lastCommit}</span>
            </div>

            {/* Contribution Grid */}
            <div className="grid grid-cols-13 gap-1.5 p-3 rounded-2xl bg-zinc-50 border border-zinc-200">
              {profile.heatmap.map((val, idx) => {
                const colors = [
                  'bg-zinc-200 border border-zinc-200/60',
                  'bg-orange-100 border border-orange-200',
                  'bg-orange-300 border border-orange-300',
                  'bg-orange-500 border border-orange-500',
                  'bg-orange-600 shadow-sm',
                ];
                return (
                  <div
                    key={idx}
                    className={`h-4 w-full rounded-md transition-transform hover:scale-125 ${colors[val]}`}
                    title={`Week ${idx + 1}: ${val * 8} commits`}
                  />
                );
              })}
            </div>

            <div className="flex items-center justify-between text-[10px] font-mono text-zinc-400">
              <span>1 Year Ago</span>
              <div className="flex items-center gap-1">
                <span>Less</span>
                <div className="flex gap-1">
                  <span className="h-2 w-2 rounded bg-zinc-200" />
                  <span className="h-2 w-2 rounded bg-orange-100" />
                  <span className="h-2 w-2 rounded bg-orange-300" />
                  <span className="h-2 w-2 rounded bg-orange-600" />
                </div>
                <span>More</span>
              </div>
              <span>Today</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
