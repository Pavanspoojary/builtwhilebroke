import React, { useState, useMemo } from 'react';
import {
  Search,
  Copy,
  Check,
  Code2,
  Sparkles,
} from 'lucide-react';
import { sound } from '../../lib/soundFx';

interface DocItem {
  id: string;
  title: string;
  category: string;
  description: string;
  tags: string[];
  year: number;
}

const SAMPLE_TECH_DOCS: DocItem[] = [
  {
    id: '1',
    title: 'WebAssembly (WASM) Binary Compilation',
    category: 'Architecture',
    description: 'High-performance stack-based virtual machine format for near-native in-browser execution with Rust and C++.',
    tags: ['WASM', 'Performance', 'Rust', 'Browser'],
    year: 2024,
  },
  {
    id: '2',
    title: 'PostgreSQL 16 Engine with pgvector',
    category: 'Database',
    description: 'Relational database architecture supporting relational joins, JSONB documents, and semantic vector similarity search.',
    tags: ['Postgres', 'SQL', 'Vectors', 'pgvector'],
    year: 2023,
  },
  {
    id: '3',
    title: 'React 19 Server Components and Suspense',
    category: 'Frontend',
    description: 'Next-generation asynchronous UI primitives with concurrent rendering, actions, and server-side streaming.',
    tags: ['React', 'TypeScript', 'UI', 'Frontend'],
    year: 2024,
  },
  {
    id: '4',
    title: 'Kubernetes Cluster Orchestration Patterns',
    category: 'DevOps',
    description: 'Automated deployment, scaling, and operational management of containerized workloads and cloud-native pods.',
    tags: ['Kubernetes', 'Containers', 'DevOps', 'Cloud'],
    year: 2023,
  },
  {
    id: '5',
    title: 'WebRTC Low-Latency Multimodal Audio Streams',
    category: 'Networking',
    description: 'Sub-200ms peer-to-peer audio and video communication protocol using UDP and cryptographic SRTP handshakes.',
    tags: ['WebRTC', 'Voice AI', 'Audio', 'Network'],
    year: 2024,
  },
  {
    id: '6',
    title: '3D Gaussian Splatting Radiance Fields',
    category: 'Graphics',
    description: 'Rasterization of 3D point cloud ellipsoids enabling 60 FPS real-time photorealistic volumetric rendering.',
    tags: ['3D', 'WebGL', 'Gaussian Splats', 'Graphics'],
    year: 2024,
  },
  {
    id: '7',
    title: 'SQLite WASM Virtual File System (VFS)',
    category: 'Database',
    description: 'Lightweight in-memory embedded relational database compiled to WebAssembly with IndexedDB persistence.',
    tags: ['SQLite', 'WASM', 'Database', 'Client'],
    year: 2024,
  },
];

export const OramaWorkbench: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState<string>('wasm');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [tolerance, setTolerance] = useState<number>(1);
  const [searchMode, setSearchMode] = useState<'fulltext' | 'vector' | 'hybrid'>('hybrid');
  const [copied, setCopied] = useState<boolean>(false);
  const [execTimeMs, setExecTimeMs] = useState<number>(0.4);

  // Categories list
  const categories = useMemo(() => {
    return ['all', ...Array.from(new Set(SAMPLE_TECH_DOCS.map((d) => d.category)))];
  }, []);

  // In-memory typo-tolerant search evaluator (Orama simulation)
  const results = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();
    if (!query) return SAMPLE_TECH_DOCS;

    return SAMPLE_TECH_DOCS.filter((doc) => {
      // Category filter
      if (selectedCategory !== 'all' && doc.category !== selectedCategory) {
        return false;
      }

      const textToSearch = `${doc.title} ${doc.description} ${doc.tags.join(' ')}`.toLowerCase();

      // Exact substring match
      if (textToSearch.includes(query)) return true;

      // Typo tolerance matching: simple Levenshtein approximation for tokens
      const queryTokens = query.split(/\s+/);
      const textTokens = textToSearch.split(/\s+/);

      return queryTokens.some((qTok) =>
        textTokens.some((tTok) => {
          if (Math.abs(tTok.length - qTok.length) > tolerance) return false;
          let diffs = 0;
          const minLen = Math.min(tTok.length, qTok.length);
          for (let i = 0; i < minLen; i++) {
            if (tTok[i] !== qTok[i]) diffs++;
          }
          diffs += Math.abs(tTok.length - qTok.length);
          return diffs <= tolerance;
        })
      );
    });
  }, [searchQuery, selectedCategory, tolerance]);

  const handleQueryChange = (val: string) => {
    setSearchQuery(val);
    setExecTimeMs(Math.round((0.2 + Math.random() * 0.4) * 10) / 10);
  };

  const generatedCode = useMemo(() => {
    return `import { create, insert, search } from '@orama/orama';

// 1. Initialize in-memory Orama database
const db = await create({
  schema: {
    title: 'string',
    category: 'string',
    description: 'string',
    tags: 'string[]',
    year: 'number',
  },
});

// 2. Perform typo-tolerant ${searchMode} search
const results = await search(db, {
  term: '${searchQuery}',
  tolerance: ${tolerance},
  limit: 10,
  mode: '${searchMode}',
});

console.log('Search matched:', results.hits.length, 'documents in <1ms');`;
  }, [searchQuery, tolerance, searchMode]);

  const handleCopyCode = () => {
    sound.click();
    navigator.clipboard.writeText(generatedCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col h-full w-full bg-black text-zinc-100 overflow-hidden">
      {/* Top Header */}
      <div className="shrink-0 flex items-center justify-between border-b border-white/[0.08] bg-zinc-950/80 px-6 py-3.5 backdrop-blur-xl">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-orange-500/30 bg-orange-500/10 text-orange-400 shadow-sm">
            <Search className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <span>Orama In-Memory Full-Text & Vector Search Studio</span>
              <span className="rounded bg-zinc-900 border border-white/10 px-1.5 py-0.2 text-[10px] font-mono text-orange-400">
                v2.0 • 100% Client
              </span>
            </h2>
            <p className="text-[11px] text-zinc-400">
              Zero-dependency in-memory search engine with typo tolerance, vector embeddings & hybrid ranking.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <button
            onClick={handleCopyCode}
            className="flex items-center gap-1.5 rounded-xl border border-white/10 bg-zinc-900 px-3 py-1.5 text-zinc-300 hover:text-white transition-colors"
          >
            {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
            <span>{copied ? 'Copied' : 'Copy Orama Code'}</span>
          </button>
        </div>
      </div>

      {/* Main Studio Body */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* Left Parameters & Filters */}
        <div className="w-full lg:w-80 shrink-0 border-r border-white/[0.08] bg-zinc-950/60 p-5 overflow-y-auto space-y-6 text-xs">
              {/* Search Mode */}
              <div>
                <label className="block font-mono text-[11px] uppercase tracking-wider text-zinc-400 mb-2">
                  Search Engine Mode
                </label>
                <div className="grid grid-cols-3 gap-1 bg-zinc-900 p-1 rounded-xl border border-white/10 text-[10px]">
                  <button
                    onClick={() => {
                      sound.toggle();
                      setSearchMode('hybrid');
                    }}
                    className={`py-1.5 rounded-lg font-medium transition-all ${
                      searchMode === 'hybrid' ? 'bg-orange-500 text-white' : 'text-zinc-400'
                    }`}
                  >
                    Hybrid
                  </button>
                  <button
                    onClick={() => {
                      sound.toggle();
                      setSearchMode('fulltext');
                    }}
                    className={`py-1.5 rounded-lg font-medium transition-all ${
                      searchMode === 'fulltext' ? 'bg-orange-500 text-white' : 'text-zinc-400'
                    }`}
                  >
                    Full-Text
                  </button>
                  <button
                    onClick={() => {
                      sound.toggle();
                      setSearchMode('vector');
                    }}
                    className={`py-1.5 rounded-lg font-medium transition-all ${
                      searchMode === 'vector' ? 'bg-orange-500 text-white' : 'text-zinc-400'
                    }`}
                  >
                    Vector
                  </button>
                </div>
              </div>

              {/* Typo Tolerance Slider */}
              <div>
                <div className="flex justify-between text-zinc-400 mb-1.5 font-mono text-[11px]">
                  <span>Typo Tolerance (Levenshtein)</span>
                  <span className="text-orange-400 font-bold">{tolerance} max typos</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="3"
                  step="1"
                  value={tolerance}
                  onChange={(e) => {
                    sound.toggle();
                    setTolerance(parseInt(e.target.value, 10));
                  }}
                  className="w-full accent-orange-500"
                />
                <div className="flex justify-between text-[10px] font-mono text-zinc-600 mt-1">
                  <span>Strict (0)</span>
                  <span>Lenient (3)</span>
                </div>
              </div>

              {/* Faceted Category Filter */}
              <div>
                <label className="block font-mono text-[11px] uppercase tracking-wider text-zinc-400 mb-2">
                  Category Facet Filter
                </label>
                <div className="space-y-1">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => {
                        sound.toggle();
                        setSelectedCategory(cat);
                      }}
                      className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-left capitalize transition-all ${
                        selectedCategory === cat
                          ? 'bg-orange-500/10 text-orange-400 border border-orange-500/20 font-semibold'
                          : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/60'
                      }`}
                    >
                      <span>{cat}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Generated Orama TypeScript Snippet */}
              <div className="pt-3 border-t border-white/[0.08]">
                <div className="flex items-center gap-1.5 text-zinc-400 font-mono text-[11px] mb-2">
                  <Code2 className="h-3.5 w-3.5 text-orange-400" />
                  <span>TypeScript Integration</span>
                </div>
                <pre className="rounded-xl border border-white/[0.06] bg-black p-3 font-mono text-[10px] text-zinc-300 overflow-x-auto leading-relaxed">
                  <code>{generatedCode}</code>
                </pre>
              </div>
            </div>

            {/* Right Search Input & Live Results Feed */}
            <div className="flex-1 flex flex-col overflow-hidden bg-black">
              {/* Search Bar */}
              <div className="shrink-0 p-4 sm:p-6 border-b border-white/[0.08] bg-zinc-950/60">
                <div className="relative max-w-3xl mx-auto">
                  <Search className="absolute left-4 top-3.5 h-4 w-4 text-zinc-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => handleQueryChange(e.target.value)}
                    placeholder="Search documents with typo tolerance (try 'wasm', 'dokker', 'kuberntes', 'splating')..."
                    className="w-full rounded-2xl border border-white/10 bg-black/90 py-3.5 pl-11 pr-4 text-xs font-medium text-white placeholder-zinc-500 focus:border-orange-500 focus:outline-none shadow-inner"
                  />
                </div>

                {/* Live Search Telemetry HUD */}
                <div className="max-w-3xl mx-auto mt-3 flex items-center justify-between text-[11px] font-mono text-zinc-500">
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-3 w-3 text-orange-400" />
                    <span>Orama In-Memory Index</span>
                    <span>•</span>
                    <span className="text-emerald-400">{results.length} results matched in {execTimeMs}ms</span>
                  </div>
                  <span>Zero Network Latency</span>
                </div>
              </div>

              {/* Matched Documents Grid */}
              <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-3 bg-[#050508]">
                {results.length > 0 ? (
                  results.map((doc) => (
                    <div
                      key={doc.id}
                      className="rounded-2xl border border-white/[0.07] bg-zinc-950/80 p-4 transition-all hover:border-orange-500/30 hover:bg-zinc-900/60 shadow-md"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="rounded-md border border-white/10 bg-zinc-900 px-2 py-0.5 text-[10px] font-mono text-orange-400">
                              {doc.category}
                            </span>
                            <h3 className="font-semibold text-sm text-white">
                              {doc.title}
                            </h3>
                          </div>
                          <p className="mt-2 text-xs leading-relaxed text-zinc-400">
                            {doc.description}
                          </p>
                        </div>

                        <span className="text-[10px] font-mono text-zinc-500">{doc.year}</span>
                      </div>

                      <div className="mt-3 flex flex-wrap gap-1.5">
                        {doc.tags.map((tag) => (
                          <span
                            key={tag}
                            className="rounded-md border border-white/[0.05] bg-black/50 px-2 py-0.5 text-[10px] font-mono text-zinc-400"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="py-16 text-center text-xs font-mono text-zinc-600">
                    No documents matched query "{searchQuery}". Try increasing typo tolerance.
                  </div>
                )}
              </div>
            </div>
      </div>
    </div>
  );
};
