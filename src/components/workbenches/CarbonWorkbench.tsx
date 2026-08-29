import React, { useState, useRef } from 'react';
import {
  Copy,
  Check,
  Sliders,
} from 'lucide-react';

const GRADIENTS = [
  { id: 'cosmic', name: 'Cosmic Indigo', class: 'from-indigo-600 via-purple-600 to-pink-600' },
  { id: 'sunset', name: 'Sunset Amber', class: 'from-amber-500 via-rose-500 to-purple-600' },
  { id: 'cyber', name: 'Cyber Cyan', class: 'from-cyan-500 via-blue-600 to-indigo-600' },
  { id: 'emerald', name: 'Neon Emerald', class: 'from-emerald-500 via-teal-600 to-cyan-600' },
  { id: 'dark', name: 'Midnight Minimal', class: 'from-zinc-900 via-zinc-950 to-black' },
];

export const CarbonWorkbench: React.FC = () => {
  const [code, setCode] = useState<string>(
`// Least Recently Used (LRU) Cache Algorithm
export class LRUCache<K, V> {
  private capacity: number;
  private cache: Map<K, V> = new Map();

  constructor(capacity: number) {
    this.capacity = capacity;
  }

  get(key: K): V | undefined {
    if (!this.cache.has(key)) return undefined;
    const value = this.cache.get(key)!;
    this.cache.delete(key);
    this.cache.set(key, value);
    return value;
  }

  put(key: K, value: V): void {
    if (this.cache.has(key)) this.cache.delete(key);
    else if (this.cache.size >= this.capacity) {
      const oldest = this.cache.keys().next().value;
      if (oldest !== undefined) this.cache.delete(oldest);
    }
    this.cache.set(key, value);
  }
}`
  );
  const [language, setLanguage] = useState<string>('typescript');
  const [title, setTitle] = useState<string>('lru_cache.ts');
  const [gradient, setGradient] = useState<string>('cosmic');
  const [padding, setPadding] = useState<number>(32);
  const [showMacButtons] = useState<boolean>(true);
  const [copied, setCopied] = useState<boolean>(false);

  const cardRef = useRef<HTMLDivElement>(null);

  const activeGradientClass =
    GRADIENTS.find((g) => g.id === gradient)?.class || GRADIENTS[0].class;

  const handleCopyCode = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex h-full w-full flex-col bg-[#09090b] text-zinc-200 overflow-hidden">
      {/* Top Configuration Toolbar */}
      <div className="border-b border-white/[0.08] bg-[#101014] p-3 sm:p-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          {/* Left Controls: Language & Title */}
          <div className="flex items-center gap-2">
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="rounded-xl border border-white/10 bg-zinc-900 px-3 py-1.5 text-xs font-mono text-white focus:outline-none"
            >
              <option value="typescript">TypeScript</option>
              <option value="javascript">JavaScript</option>
              <option value="python">Python</option>
              <option value="rust">Rust</option>
              <option value="go">Go</option>
              <option value="html">HTML / JSX</option>
              <option value="css">CSS / Tailwind</option>
              <option value="sql">SQL</option>
              <option value="json">JSON</option>
            </select>

            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="filename.ts"
              className="rounded-xl border border-white/10 bg-zinc-900 px-3 py-1.5 text-xs font-mono text-white placeholder-zinc-500 focus:border-indigo-500 focus:outline-none"
            />
          </div>

          {/* Center: Gradient Preset Chips */}
          <div className="flex items-center gap-1.5">
            {GRADIENTS.map((g) => (
              <button
                key={g.id}
                onClick={() => setGradient(g.id)}
                className={`h-6 w-6 rounded-full bg-gradient-to-tr ${g.class} transition ${
                  gradient === g.id
                    ? 'ring-2 ring-white ring-offset-2 ring-offset-zinc-900 scale-110'
                    : 'opacity-70 hover:opacity-100'
                }`}
                title={g.name}
              />
            ))}
          </div>

          {/* Right: Padding & Options */}
          <div className="flex items-center gap-2 text-xs">
            <div className="flex items-center gap-1.5 rounded-xl border border-white/10 bg-zinc-900 px-3 py-1 text-zinc-400 font-mono">
              <Sliders className="h-3.5 w-3.5 text-indigo-400" />
              <span>Padding: {padding}px</span>
              <input
                type="range"
                min={16}
                max={64}
                step={4}
                value={padding}
                onChange={(e) => setPadding(parseInt(e.target.value))}
                className="w-16 accent-indigo-500 ml-1"
              />
            </div>

            <button
              onClick={handleCopyCode}
              className="flex items-center gap-1.5 rounded-xl border border-white/10 bg-zinc-900 px-3 py-1.5 text-xs font-medium text-zinc-200 hover:bg-zinc-800"
            >
              {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
              <span>{copied ? 'Copied' : 'Copy Code'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Interactive Studio Canvas */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-8 flex items-center justify-center bg-[#070709]">
        {/* Rendered Snapshot Card Container */}
        <div
          ref={cardRef}
          className={`relative rounded-3xl bg-gradient-to-tr ${activeGradientClass} shadow-2xl transition-all duration-300 w-full max-w-3xl`}
          style={{ padding: `${padding}px` }}
        >
          {/* Inner Code Editor Window */}
          <div className="rounded-2xl border border-white/15 bg-[#121216]/95 backdrop-blur-2xl shadow-2xl overflow-hidden">
            {/* macOS Window Title Bar */}
            <div className="flex items-center justify-between border-b border-white/[0.08] bg-[#18181f]/90 px-4 py-3">
              {showMacButtons ? (
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-[#ff5f56] shadow-sm" />
                  <div className="h-3 w-3 rounded-full bg-[#ffbd2e] shadow-sm" />
                  <div className="h-3 w-3 rounded-full bg-[#27c93f] shadow-sm" />
                </div>
              ) : <div />}

              <span className="font-mono text-xs font-medium text-zinc-400 select-none">
                {title || 'untitled'}
              </span>

              <div className="w-10" />
            </div>

            {/* Code Body Textarea */}
            <div className="relative p-4 font-mono text-xs leading-relaxed">
              <textarea
                value={code}
                onChange={(e) => setCode(e.target.value)}
                rows={12}
                spellCheck={false}
                className="w-full resize-none bg-transparent font-mono text-indigo-200 focus:outline-none selection:bg-indigo-500/40"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
