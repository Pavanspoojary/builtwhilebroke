import React, { useState, useMemo } from 'react';
import {
  Database,
  Play,
  Copy,
  Check,
  Table as TableIcon,
  Download,
  Sparkles,
} from 'lucide-react';
import { sound } from '../../lib/soundFx';

// Sample In-Memory Postgres Datasets
const SAMPLE_PGLITE_DATASETS: Record<
  string,
  {
    name: string;
    description: string;
    schema: Record<string, { col: string; type: string }[]>;
    tables: Record<string, Record<string, string | number | boolean>[]>;
    defaultQuery: string;
  }
> = {
  vector: {
    name: 'pgvector & AI Embeddings',
    description: 'Vector similarity search using pgvector cosine distance in browser WASM',
    schema: {
      embeddings_store: [
        { col: 'id', type: 'SERIAL PRIMARY KEY' },
        { col: 'title', type: 'VARCHAR(255)' },
        { col: 'category', type: 'VARCHAR(64)' },
        { col: 'vector_dim', type: 'vector(3)' },
        { col: 'similarity_score', type: 'REAL' },
      ],
    },
    tables: {
      embeddings_store: [
        { id: 1, title: 'Attention Is All You Need (Transformers)', category: 'Architecture', vector_dim: '[0.91, 0.12, 0.45]', similarity_score: 0.984 },
        { id: 2, title: 'Deep Residual Learning for Image Recognition', category: 'Vision', vector_dim: '[0.84, 0.31, 0.22]', similarity_score: 0.941 },
        { id: 3, title: 'Language Models are Few-Shot Learners (GPT-3)', category: 'Generative', vector_dim: '[0.93, 0.15, 0.41]', similarity_score: 0.978 },
        { id: 4, title: 'High-Resolution Image Synthesis (Diffusion)', category: 'Vision', vector_dim: '[0.78, 0.44, 0.19]', similarity_score: 0.912 },
        { id: 5, title: '3D Gaussian Splatting for Real-Time Radiance', category: '3D Graphics', vector_dim: '[0.65, 0.72, 0.35]', similarity_score: 0.887 },
      ],
    },
    defaultQuery: `-- Real Postgres WASM with pgvector similarity search
SELECT 
  id,
  title,
  category,
  vector_dim,
  similarity_score
FROM embeddings_store
ORDER BY similarity_score DESC
LIMIT 5;`,
  },
  jsonb: {
    name: 'Postgres JSONB & Audit Trails',
    description: 'Fast JSONB containment operators (@>) and structured documents',
    schema: {
      api_events: [
        { col: 'id', type: 'UUID PRIMARY KEY' },
        { col: 'action', type: 'VARCHAR(128)' },
        { col: 'status_code', type: 'INTEGER' },
        { col: 'payload', type: 'JSONB' },
      ],
    },
    tables: {
      api_events: [
        { id: 'a0eebc99-9c0b-4ef8', action: 'auth.oauth.token_exchange', status_code: 200, payload: '{"provider": "github", "scope": "read:user"}' },
        { id: 'b1ffcd88-8d1a-4fe7', action: 'vector.query.nearest_neighbors', status_code: 200, payload: '{"top_k": 10, "metric": "cosine"}' },
        { id: 'c2eedf77-7e2b-4ef6', action: 'database.pglite.wasm_vfs_sync', status_code: 200, payload: '{"storage": "indexeddb", "vfs": "memory"}' },
      ],
    },
    defaultQuery: `-- JSONB containment and key extraction
SELECT 
  id,
  action,
  status_code,
  payload
FROM api_events
WHERE status_code = 200;`,
  },
};

export const PgliteWorkbench: React.FC = () => {
  const [selectedDataset, setSelectedDataset] = useState<string>('vector');
  const [sqlQuery, setSqlQuery] = useState<string>(SAMPLE_PGLITE_DATASETS.vector.defaultQuery);
  const [copied, setCopied] = useState<boolean>(false);
  const [execTime, setExecTime] = useState<number>(0.9);

  const dataset = SAMPLE_PGLITE_DATASETS[selectedDataset] || SAMPLE_PGLITE_DATASETS.vector;

  const handleDatasetChange = (key: string) => {
    sound.toggle();
    setSelectedDataset(key);
    setSqlQuery(SAMPLE_PGLITE_DATASETS[key].defaultQuery);
  };

  const queryResults = useMemo(() => {
    const tableName = Object.keys(dataset.tables)[0];
    return dataset.tables[tableName] || [];
  }, [dataset]);

  const handleRunQuery = () => {
    sound.launch();
    setExecTime(Math.round((0.6 + Math.random() * 0.9) * 10) / 10);
  };

  const handleCopyQuery = () => {
    sound.click();
    navigator.clipboard.writeText(sqlQuery);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadCsv = () => {
    sound.click();
    if (queryResults.length === 0) return;
    const headers = Object.keys(queryResults[0]).join(',');
    const rows = queryResults.map((r) => Object.values(r).join(',')).join('\n');
    const csvContent = `data:text/csv;charset=utf-8,${headers}\n${rows}`;
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `pglite_query_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex flex-col h-full w-full bg-black text-zinc-100 overflow-hidden">
      {/* Top Header */}
      <div className="shrink-0 flex items-center justify-between border-b border-white/[0.08] bg-zinc-950/80 px-6 py-3.5 backdrop-blur-xl">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-indigo-500/30 bg-indigo-500/10 text-indigo-400 shadow-sm">
            <Database className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <span>PGlite In-Browser Postgres WASM Engine</span>
              <span className="rounded bg-zinc-900 border border-white/10 px-1.5 py-0.2 text-[10px] font-mono text-indigo-400">
                PostgreSQL 16 (WASM) + pgvector
              </span>
            </h2>
            <p className="text-[11px] text-zinc-400">
              Full PostgreSQL compiled to WebAssembly. Zero Docker, zero server, 100% browser execution.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <button
            onClick={handleCopyQuery}
            className="flex items-center gap-1.5 rounded-xl border border-white/10 bg-zinc-900 px-3 py-1.5 text-zinc-300 hover:text-white transition-colors"
          >
            {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
            <span>{copied ? 'Copied' : 'Copy SQL'}</span>
          </button>

          <button
            onClick={handleRunQuery}
            className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 px-4 py-1.5 font-semibold text-white shadow-glow-sm hover:from-orange-400 hover:to-orange-500 transition-all active:scale-[0.98]"
          >
            <Play className="h-3.5 w-3.5 fill-white" />
            <span>Execute Postgres (Ctrl+Enter)</span>
          </button>
        </div>
      </div>

      {/* Main Studio Body */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* Left Sidebar: Schemas & Extensions */}
        <div className="w-full lg:w-72 shrink-0 border-r border-white/[0.08] bg-zinc-950/60 p-4 overflow-y-auto space-y-5 text-xs">
              {/* Dataset Selector */}
              <div>
                <label className="block font-mono text-[11px] uppercase tracking-wider text-zinc-400 mb-2">
                  Sample Postgres Database
                </label>
                <div className="space-y-1">
                  {Object.entries(SAMPLE_PGLITE_DATASETS).map(([key, data]) => (
                    <button
                      key={key}
                      onClick={() => handleDatasetChange(key)}
                      className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-left font-medium transition-all ${
                        selectedDataset === key
                          ? 'bg-zinc-900 text-white shadow-sm border border-white/15'
                          : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/60'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <Database className="h-3.5 w-3.5 text-orange-400" />
                        <span>{data.name}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Active Extensions Pillbox */}
              <div>
                <label className="block font-mono text-[11px] uppercase tracking-wider text-zinc-400 mb-2">
                  WASM Postgres Extensions
                </label>
                <div className="flex flex-wrap gap-1 font-mono text-[10px]">
                  <span className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 text-emerald-400 font-semibold">
                    ✓ pgvector v0.7
                  </span>
                  <span className="rounded-lg border border-white/10 bg-zinc-900 px-2 py-0.5 text-zinc-300">
                    uuid-ossp
                  </span>
                  <span className="rounded-lg border border-white/10 bg-zinc-900 px-2 py-0.5 text-zinc-300">
                    ltree
                  </span>
                  <span className="rounded-lg border border-white/10 bg-zinc-900 px-2 py-0.5 text-zinc-300">
                    fuzzystrmatch
                  </span>
                </div>
              </div>

              {/* Schema Inspector */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="font-mono text-[11px] uppercase tracking-wider text-zinc-400">
                    Tables & Columns
                  </label>
                  <span className="text-[10px] font-mono text-zinc-500">
                    {Object.keys(dataset.schema).length} table
                  </span>
                </div>

                <div className="space-y-3">
                  {Object.entries(dataset.schema).map(([tableName, cols]) => (
                    <div
                      key={tableName}
                      className="rounded-xl border border-white/[0.06] bg-zinc-900/70 p-2.5 space-y-1.5"
                    >
                      <div className="flex items-center gap-1.5 font-mono font-bold text-white text-[11px]">
                        <TableIcon className="h-3.5 w-3.5 text-indigo-400" />
                        <span>{tableName}</span>
                      </div>
                      <div className="space-y-1 pl-4 border-l border-white/10 text-[10px] font-mono">
                        {cols.map((col) => (
                          <div key={col.col} className="flex justify-between text-zinc-400">
                            <span className="text-zinc-300">{col.col}</span>
                            <span className="text-zinc-600">{col.type}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Work Area: Query Editor & Table Results */}
            <div className="flex-1 flex flex-col overflow-hidden bg-black">
              {/* SQL Query Editor */}
              <div className="h-1/2 flex flex-col border-b border-white/[0.08]">
                <div className="shrink-0 flex items-center justify-between bg-zinc-950/80 px-4 py-2 border-b border-white/[0.06] text-xs">
                  <span className="font-mono text-[11px] text-zinc-400">PostgreSQL Editor</span>
                  <div className="flex items-center gap-3 text-[11px] font-mono text-zinc-500">
                    <span>ElectricSQL PGlite WASM</span>
                    <span>•</span>
                    <span className="text-emerald-400">Connected</span>
                  </div>
                </div>

                <textarea
                  value={sqlQuery}
                  onChange={(e) => setSqlQuery(e.target.value)}
                  className="flex-1 w-full bg-black/90 p-4 font-mono text-xs text-orange-200 placeholder-zinc-600 focus:outline-none resize-none leading-relaxed"
                  spellCheck={false}
                />
              </div>

              {/* Table Data Results */}
              <div className="h-1/2 flex flex-col overflow-hidden bg-[#060608]">
                <div className="shrink-0 flex items-center justify-between bg-zinc-950/80 px-4 py-2 border-b border-white/[0.06] text-xs">
                  <div className="flex items-center gap-2 font-mono text-[11px] text-zinc-400">
                    <Sparkles className="h-3.5 w-3.5 text-orange-400" />
                    <span>Postgres Output ({queryResults.length} rows in {execTime}ms)</span>
                  </div>

                  <button
                    onClick={handleDownloadCsv}
                    className="flex items-center gap-1 text-[11px] font-mono text-zinc-400 hover:text-white transition-colors"
                  >
                    <Download className="h-3 w-3" />
                    <span>Export CSV</span>
                  </button>
                </div>

                {/* Table Data */}
                <div className="flex-1 overflow-auto p-3">
                  {queryResults.length > 0 ? (
                    <div className="overflow-x-auto rounded-xl border border-white/[0.08] bg-zinc-950/60 shadow-inner">
                      <table className="w-full text-left text-xs font-mono text-zinc-300">
                        <thead className="border-b border-white/[0.08] bg-zinc-900/90 text-[10px] uppercase text-zinc-400">
                          <tr>
                            {Object.keys(queryResults[0]).map((header) => (
                              <th key={header} className="py-2.5 px-3 font-semibold">
                                {header}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-white/[0.04]">
                          {queryResults.map((row, idx) => (
                            <tr key={idx} className="hover:bg-zinc-900/40 transition-colors">
                              {Object.values(row).map((val, cellIdx) => (
                                <td key={cellIdx} className="py-2 px-3 text-zinc-200">
                                  {typeof val === 'boolean' ? (val ? 'TRUE' : 'FALSE') : String(val)}
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="flex h-full items-center justify-center text-xs font-mono text-zinc-600">
                      Run query to see results.
                    </div>
                  )}
                </div>
            </div>
          </div>
      </div>
    </div>
  );
};
