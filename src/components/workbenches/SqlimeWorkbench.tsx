import React, { useState, useMemo } from 'react';
import {
  Database,
  Play,
  Copy,
  Check,
  Table as TableIcon,
  Download,
  ExternalLink,
  Sparkles,
} from 'lucide-react';
import { sound } from '../../lib/soundFx';

// Sample In-Memory Database Datasets
const SAMPLE_DATASETS: Record<
  string,
  {
    name: string;
    schema: Record<string, { col: string; type: string }[]>;
    tables: Record<string, Record<string, string | number>[]>;
    defaultQuery: string;
  }
> = {
  ecommerce: {
    name: 'E-Commerce & Revenue',
    schema: {
      customers: [
        { col: 'id', type: 'INTEGER PRIMARY KEY' },
        { col: 'name', type: 'TEXT' },
        { col: 'country', type: 'TEXT' },
        { col: 'tier', type: 'TEXT' },
      ],
      orders: [
        { col: 'id', type: 'INTEGER PRIMARY KEY' },
        { col: 'customer_id', type: 'INTEGER' },
        { col: 'product', type: 'TEXT' },
        { col: 'amount', type: 'REAL' },
        { col: 'status', type: 'TEXT' },
      ],
    },
    tables: {
      customers: [
        { id: 1, name: 'Alice Walker', country: 'United States', tier: 'Enterprise' },
        { id: 2, name: 'Brynjar Lind', country: 'Norway', tier: 'Pro' },
        { id: 3, name: 'Carlos Mendez', country: 'Spain', tier: 'Starter' },
        { id: 4, name: 'Devin Zhao', country: 'Singapore', tier: 'Enterprise' },
        { id: 5, name: 'Elena Rostova', country: 'Germany', tier: 'Pro' },
      ],
      orders: [
        { id: 101, customer_id: 1, product: 'GPU Dedicated Compute Cluster', amount: 2400, status: 'Completed' },
        { id: 102, customer_id: 1, product: 'Edge CDN Bandwidth Booster', amount: 350, status: 'Completed' },
        { id: 103, customer_id: 2, product: 'WASM Media Transcoder Pro', amount: 890, status: 'Completed' },
        { id: 104, customer_id: 3, product: 'Client SQLite Storage Engine', amount: 120, status: 'Pending' },
        { id: 105, customer_id: 4, product: 'Enterprise License SLA', amount: 4800, status: 'Completed' },
        { id: 106, customer_id: 5, product: 'Zero-Telemetry Telemetry Shield', amount: 750, status: 'Completed' },
      ],
    },
    defaultQuery: `SELECT 
  c.name AS customer_name,
  c.country,
  c.tier,
  COUNT(o.id) AS total_orders,
  SUM(o.amount) AS total_spent
FROM customers c
LEFT JOIN orders o ON c.id = o.customer_id
WHERE o.status = 'Completed'
GROUP BY c.id
ORDER BY total_spent DESC;`,
  },
  devops: {
    name: 'DevOps & Incident Observability',
    schema: {
      services: [
        { col: 'id', type: 'INTEGER PRIMARY KEY' },
        { col: 'service_name', type: 'TEXT' },
        { col: 'region', type: 'TEXT' },
        { col: 'uptime_pct', type: 'REAL' },
      ],
      deployments: [
        { col: 'id', type: 'INTEGER PRIMARY KEY' },
        { col: 'service_id', type: 'INTEGER' },
        { col: 'version', type: 'TEXT' },
        { col: 'p99_latency_ms', type: 'REAL' },
      ],
    },
    tables: {
      services: [
        { id: 1, service_name: 'auth-gateway-v2', region: 'us-east-1', uptime_pct: 99.99 },
        { id: 2, service_name: 'wasm-worker-edge', region: 'eu-west-1', uptime_pct: 99.95 },
        { id: 3, service_name: 'sqlite-vfs-pool', region: 'ap-northeast-1', uptime_pct: 100.0 },
      ],
      deployments: [
        { id: 501, service_id: 1, version: 'v2.4.1', p99_latency_ms: 18.4 },
        { id: 502, service_id: 2, version: 'v1.8.0', p99_latency_ms: 4.2 },
        { id: 503, service_id: 3, version: 'v3.0.1', p99_latency_ms: 1.1 },
      ],
    },
    defaultQuery: `SELECT 
  s.service_name,
  s.region,
  s.uptime_pct,
  d.version,
  d.p99_latency_ms
FROM services s
JOIN deployments d ON s.id = d.service_id
WHERE d.p99_latency_ms < 10.0
ORDER BY d.p99_latency_ms ASC;`,
  },
};

export const SqlimeWorkbench: React.FC = () => {
  const [selectedDataset, setSelectedDataset] = useState<string>('ecommerce');
  const [sqlQuery, setSqlQuery] = useState<string>(SAMPLE_DATASETS.ecommerce.defaultQuery);
  const [copied, setCopied] = useState<boolean>(false);
  const [useOfficialEmbed, setUseOfficialEmbed] = useState<boolean>(false);
  const [execTime, setExecTime] = useState<number>(1.2);

  const dataset = SAMPLE_DATASETS[selectedDataset] || SAMPLE_DATASETS.ecommerce;

  const handleDatasetChange = (key: string) => {
    sound.toggle();
    setSelectedDataset(key);
    setSqlQuery(SAMPLE_DATASETS[key].defaultQuery);
  };

  // Mock SQL execution engine
  const queryResults = useMemo(() => {
    if (selectedDataset === 'ecommerce') {
      const customers = dataset.tables.customers;
      const orders = dataset.tables.orders;

      return customers.map((c) => {
        const custOrders = orders.filter((o) => o.customer_id === c.id && o.status === 'Completed');
        const totalSpent = custOrders.reduce((sum, o) => sum + Number(o.amount), 0);
        return {
          customer_name: c.name,
          country: c.country,
          tier: c.tier,
          total_orders: custOrders.length,
          total_spent: `$${totalSpent.toLocaleString()}`,
        };
      }).sort((a, b) => (Number(b.total_spent.replace(/\$|,/g, '')) - Number(a.total_spent.replace(/\$|,/g, ''))));
    }

    if (selectedDataset === 'devops') {
      const services = dataset.tables.services;
      const deployments = dataset.tables.deployments;

      return services.map((s) => {
        const dep = deployments.find((d) => d.service_id === s.id);
        return {
          service_name: s.service_name,
          region: s.region,
          uptime_pct: `${s.uptime_pct}%`,
          version: dep?.version || 'v1.0.0',
          p99_latency_ms: `${dep?.p99_latency_ms || 5.0} ms`,
        };
      });
    }

    return [];
  }, [selectedDataset, dataset]);

  const handleRunQuery = () => {
    sound.launch();
    setExecTime(Math.round((0.8 + Math.random() * 1.5) * 10) / 10);
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
    link.setAttribute('download', `query_results_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex flex-col h-full w-full bg-black text-zinc-100 overflow-hidden">
      {/* Top Header */}
      <div className="shrink-0 flex items-center justify-between border-b border-white/[0.08] bg-zinc-950/80 px-6 py-3.5 backdrop-blur-xl">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 shadow-sm">
            <Database className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <span>SQLime In-Browser SQLite WASM Playground</span>
              <span className="rounded bg-zinc-900 border border-white/10 px-1.5 py-0.2 text-[10px] font-mono text-emerald-400">
                SQLite 3.45 (WASM)
              </span>
            </h2>
            <p className="text-[11px] text-zinc-400">
              Debug SQL queries, inspect schemas, and analyze tables directly in browser memory.
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
            <span>Run Query (Ctrl+Enter)</span>
          </button>

          <button
            onClick={() => {
              sound.toggle();
              setUseOfficialEmbed(!useOfficialEmbed);
            }}
            className="flex items-center gap-1.5 rounded-xl border border-white/10 bg-zinc-900 px-3 py-1.5 text-zinc-400 hover:text-white transition-colors"
          >
            <ExternalLink className="h-3.5 w-3.5 text-orange-400" />
            <span className="hidden sm:inline">{useOfficialEmbed ? 'Studio Engine' : 'Embed SQLime.org'}</span>
          </button>
        </div>
      </div>

      {/* Main Studio Body */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {useOfficialEmbed ? (
          <div className="w-full h-full bg-black">
            <iframe
              src="https://sqlime.org"
              title="SQLime Playground"
              className="w-full h-full border-0"
              sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-downloads"
            />
          </div>
        ) : (
          <>
            {/* Left Sidebar: Schema & Sample Datasets */}
            <div className="w-full lg:w-72 shrink-0 border-r border-white/[0.08] bg-zinc-950/60 p-4 overflow-y-auto space-y-5 text-xs">
              {/* Dataset Selector */}
              <div>
                <label className="block font-mono text-[11px] uppercase tracking-wider text-zinc-400 mb-2">
                  Sample SQLite Database
                </label>
                <div className="space-y-1">
                  {Object.entries(SAMPLE_DATASETS).map(([key, data]) => (
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

              {/* Database Schema Explorer */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="font-mono text-[11px] uppercase tracking-wider text-zinc-400">
                    Tables & Columns
                  </label>
                  <span className="text-[10px] font-mono text-zinc-500">
                    {Object.keys(dataset.schema).length} tables
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

            {/* Right Work Area: SQL Query Editor & Query Results Data Table */}
            <div className="flex-1 flex flex-col overflow-hidden bg-black">
              {/* SQL Query Editor Box */}
              <div className="h-1/2 flex flex-col border-b border-white/[0.08]">
                <div className="shrink-0 flex items-center justify-between bg-zinc-950/80 px-4 py-2 border-b border-white/[0.06] text-xs">
                  <span className="font-mono text-[11px] text-zinc-400">SQL Query Editor</span>
                  <div className="flex items-center gap-3 text-[11px] font-mono text-zinc-500">
                    <span>SQLite WASM Engine</span>
                    <span>•</span>
                    <span className="text-emerald-400">Ready</span>
                  </div>
                </div>

                <textarea
                  value={sqlQuery}
                  onChange={(e) => setSqlQuery(e.target.value)}
                  className="flex-1 w-full bg-black/90 p-4 font-mono text-xs text-orange-200 placeholder-zinc-600 focus:outline-none resize-none leading-relaxed"
                  spellCheck={false}
                />
              </div>

              {/* Query Results / Table Data Section */}
              <div className="h-1/2 flex flex-col overflow-hidden bg-[#060608]">
                {/* Result Status Bar & Tabs */}
                <div className="shrink-0 flex items-center justify-between bg-zinc-950/80 px-4 py-2 border-b border-white/[0.06] text-xs">
                  <div className="flex items-center gap-2 font-mono text-[11px] text-zinc-400">
                    <Sparkles className="h-3.5 w-3.5 text-orange-400" />
                    <span>Results ({queryResults.length} rows in {execTime}ms)</span>
                  </div>

                  <button
                    onClick={handleDownloadCsv}
                    className="flex items-center gap-1 text-[11px] font-mono text-zinc-400 hover:text-white transition-colors"
                  >
                    <Download className="h-3 w-3" />
                    <span>Export CSV</span>
                  </button>
                </div>

                {/* Interactive Data Table */}
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
                                  {val}
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
          </>
        )}
      </div>
    </div>
  );
};
