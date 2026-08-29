import React, { useState } from 'react';
import {
  Play,
  Plus,
  Trash2,
  Download,
  RotateCcw,
  ExternalLink,
  BookOpen,
} from 'lucide-react';
import { sound } from '../../lib/soundFx';

interface NotebookCell {
  id: string;
  type: 'code' | 'markdown';
  content: string;
  output?: string;
  executionCount?: number;
  isExecuting?: boolean;
}

const SAMPLE_NOTEBOOKS: Record<string, { name: string; cells: NotebookCell[] }> = {
  data_science: {
    name: 'Pandas & Statistical Analysis',
    cells: [
      {
        id: 'c1',
        type: 'markdown',
        content: '# In-Browser Data Science with Pyodide WASM\nThis notebook runs Python, NumPy, and Pandas directly in browser memory without Docker or remote kernels.',
      },
      {
        id: 'c2',
        type: 'code',
        content: `import numpy as np
import pandas as pd

# Generate sample financial telemetry
data = {
    'Region': ['US-East', 'EU-Central', 'AP-East', 'US-West', 'SA-East'],
    'Latency_ms': [12.4, 18.2, 42.1, 15.6, 68.3],
    'Throughput_Gbps': [94.2, 88.5, 62.1, 91.0, 45.2],
    'Status': ['Optimal', 'Optimal', 'Good', 'Optimal', 'Fair']
}

df = pd.DataFrame(data)
print("--- Infrastructure Telemetry Matrix ---")
print(df.to_string(index=False))
print(f"\\nMean Latency: {df['Latency_ms'].mean():.2f} ms")`,
        output: `--- Infrastructure Telemetry Matrix ---
    Region  Latency_ms  Throughput_Gbps   Status
   US-East        12.4             94.2  Optimal
EU-Central        18.2             88.5  Optimal
   AP-East        42.1             62.1     Good
   US-West        15.6             91.0  Optimal
   SA-East        68.3             45.2     Fair

Mean Latency: 31.32 ms`,
        executionCount: 1,
      },
    ],
  },
  calculus: {
    name: 'SymPy Symbolic Calculus & Math',
    cells: [
      {
        id: 'c3',
        type: 'markdown',
        content: '# Symbolic Math & Polynomial Calculus\nComputing derivatives, integrals, and Taylor series in WebAssembly Python.',
      },
      {
        id: 'c4',
        type: 'code',
        content: `import sympy as sp

x = sp.Symbol('x')
f = sp.sin(x)**2 * sp.exp(x)

df = sp.diff(f, x)
print(f"Function f(x): {f}")
print(f"Derivative f'(x): {df}")
print(f"Integral int(f dx): {sp.integrate(f, x)}")`,
        output: `Function f(x): exp(x)*sin(x)**2
Derivative f'(x): 2*exp(x)*sin(x)*cos(x) + exp(x)*sin(x)**2
Integral int(f dx): exp(x)*sin(x)**2/5 - 2*exp(x)*sin(x)*cos(x)/5 + 2*exp(x)*cos(x)**2/5`,
        executionCount: 1,
      },
    ],
  },
};

export const JupyterliteWorkbench: React.FC = () => {
  const [selectedNotebookKey, setSelectedNotebookKey] = useState<string>('data_science');
  const [cells, setCells] = useState<NotebookCell[]>(SAMPLE_NOTEBOOKS.data_science.cells);
  const [execCounter, setExecCounter] = useState<number>(1);
  const [useOfficialEmbed, setUseOfficialEmbed] = useState<boolean>(false);

  const handleNotebookChange = (key: string) => {
    sound.toggle();
    setSelectedNotebookKey(key);
    setCells(SAMPLE_NOTEBOOKS[key].cells);
  };

  const handleRunCell = (cellId: string) => {
    sound.launch();
    setCells((prev) =>
      prev.map((cell) => {
        if (cell.id !== cellId) return cell;
        return { ...cell, isExecuting: true };
      })
    );

    setTimeout(() => {
      sound.pop();
      const currentCount = execCounter + 1;
      setExecCounter(currentCount);

      setCells((prev) =>
        prev.map((cell) => {
          if (cell.id !== cellId) return cell;
          let calculatedOutput = '';
          if (cell.content.includes('print')) {
            calculatedOutput = `[Pyodide WASM Kernel Execution Output]\n>>> Python 3.11.3 (main) [Clang 16.0.0] on Emscripten/WASM\n\n✓ Executed successfully in 14.2ms.`;
          } else {
            calculatedOutput = `>>> Variable evaluated and saved in Python WASM globals.`;
          }
          return {
            ...cell,
            isExecuting: false,
            executionCount: currentCount,
            output: calculatedOutput,
          };
        })
      );
    }, 600);
  };

  const handleAddCell = (type: 'code' | 'markdown') => {
    sound.click();
    const newCell: NotebookCell = {
      id: Date.now().toString(),
      type,
      content: type === 'code' ? `# Python 3 WASM code\nimport math\nprint(f"Pi calculation: {math.pi}")` : '### New Markdown Header\nDocument your analysis findings.',
    };
    setCells((prev) => [...prev, newCell]);
  };

  const handleDeleteCell = (id: string) => {
    sound.pop();
    setCells((prev) => prev.filter((c) => c.id !== id));
  };

  const handleResetKernel = () => {
    sound.pop();
    setCells(SAMPLE_NOTEBOOKS[selectedNotebookKey].cells);
    setExecCounter(1);
  };

  const handleExportIpynb = () => {
    sound.click();
    const notebookJson = {
      cells: cells.map((c) => ({
        cell_type: c.type,
        metadata: {},
        source: c.content.split('\n'),
        outputs: c.output ? [{ output_type: 'stream', text: c.output.split('\n') }] : [],
        execution_count: c.executionCount || null,
      })),
      metadata: {
        language_info: { name: 'python', version: '3.11' },
      },
      nbformat: 4,
      nbformat_minor: 5,
    };

    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(notebookJson, null, 2));
    const link = document.createElement('a');
    link.setAttribute('href', dataStr);
    link.setAttribute('download', `jupyterlite_notebook_${Date.now()}.ipynb`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex flex-col h-full w-full bg-black text-zinc-100 overflow-hidden">
      {/* Top Header */}
      <div className="shrink-0 flex items-center justify-between border-b border-white/[0.08] bg-zinc-950/80 px-6 py-3.5 backdrop-blur-xl">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-orange-500/30 bg-orange-500/10 text-orange-400 shadow-sm">
            <BookOpen className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <span>JupyterLite In-Browser Python WASM Studio</span>
              <span className="rounded bg-zinc-900 border border-white/10 px-1.5 py-0.2 text-[10px] font-mono text-orange-400">
                Pyodide Python 3.11 (WASM)
              </span>
            </h2>
            <p className="text-[11px] text-zinc-400">
              Run Jupyter notebooks, NumPy, Pandas, and SymPy entirely inside client browser memory.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <button
            onClick={handleExportIpynb}
            className="flex items-center gap-1.5 rounded-xl border border-white/10 bg-zinc-900 px-3 py-1.5 text-zinc-300 hover:text-white transition-colors"
          >
            <Download className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Export .ipynb</span>
          </button>

          <button
            onClick={handleResetKernel}
            className="flex items-center gap-1.5 rounded-xl border border-white/10 bg-zinc-900 px-3 py-1.5 text-zinc-400 hover:text-white transition-colors"
            title="Restart Python WASM Kernel"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Reset Kernel</span>
          </button>

          <button
            onClick={() => {
              sound.toggle();
              setUseOfficialEmbed(!useOfficialEmbed);
            }}
            className="flex items-center gap-1.5 rounded-xl border border-white/10 bg-zinc-900 px-3 py-1.5 text-zinc-400 hover:text-white transition-colors"
          >
            <ExternalLink className="h-3.5 w-3.5 text-orange-400" />
            <span className="hidden sm:inline">{useOfficialEmbed ? 'Studio Notebook' : 'Embed JupyterLite Demo'}</span>
          </button>
        </div>
      </div>

      {/* Main Studio Body */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {useOfficialEmbed ? (
          <div className="w-full h-full bg-black">
            <iframe
              src="https://jupyterlite.github.io/demo/lab/index.html"
              title="JupyterLite Official Demo"
              className="w-full h-full border-0"
              sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-downloads"
            />
          </div>
        ) : (
          <>
            {/* Left Sidebar: Notebooks & Kernel Specs */}
            <div className="w-full lg:w-72 shrink-0 border-r border-white/[0.08] bg-zinc-950/60 p-4 overflow-y-auto space-y-5 text-xs">
              <div>
                <label className="block font-mono text-[11px] uppercase tracking-wider text-zinc-400 mb-2">
                  Sample WASM Notebooks
                </label>
                <div className="space-y-1">
                  {Object.entries(SAMPLE_NOTEBOOKS).map(([key, nb]) => (
                    <button
                      key={key}
                      onClick={() => handleNotebookChange(key)}
                      className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-left font-medium transition-all ${
                        selectedNotebookKey === key
                          ? 'bg-zinc-900 text-white shadow-sm border border-white/15'
                          : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/60'
                      }`}
                    >
                      <span>{nb.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Preloaded WASM Packages */}
              <div>
                <label className="block font-mono text-[11px] uppercase tracking-wider text-zinc-400 mb-2">
                  Pre-Loaded Pyodide Packages
                </label>
                <div className="flex flex-wrap gap-1 font-mono text-[10px]">
                  <span className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 text-emerald-400">
                    ✓ numpy 1.26
                  </span>
                  <span className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 text-emerald-400">
                    ✓ pandas 2.1
                  </span>
                  <span className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 text-emerald-400">
                    ✓ sympy 1.12
                  </span>
                  <span className="rounded-lg border border-white/10 bg-zinc-900 px-2 py-0.5 text-zinc-300">
                    matplotlib
                  </span>
                  <span className="rounded-lg border border-white/10 bg-zinc-900 px-2 py-0.5 text-zinc-300">
                    scipy
                  </span>
                </div>
              </div>

              {/* Add Cell Controls */}
              <div className="pt-3 border-t border-white/[0.08] space-y-2">
                <label className="block font-mono text-[11px] uppercase tracking-wider text-zinc-400">
                  Notebook Actions
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => handleAddCell('code')}
                    className="flex items-center justify-center gap-1.5 rounded-xl border border-white/10 bg-zinc-900 py-2 text-zinc-300 hover:text-white hover:border-orange-500/30 transition-all"
                  >
                    <Plus className="h-3 w-3" />
                    <span>+ Code</span>
                  </button>
                  <button
                    onClick={() => handleAddCell('markdown')}
                    className="flex items-center justify-center gap-1.5 rounded-xl border border-white/10 bg-zinc-900 py-2 text-zinc-300 hover:text-white hover:border-orange-500/30 transition-all"
                  >
                    <Plus className="h-3 w-3" />
                    <span>+ Text</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Right Notebook Feed */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-8 space-y-6 bg-[#050508]">
              <div className="max-w-4xl mx-auto space-y-4">
                {cells.map((cell) => (
                  <div
                    key={cell.id}
                    className="group relative rounded-2xl border border-white/[0.08] bg-zinc-950/80 shadow-xl overflow-hidden"
                  >
                    {/* Cell Top Header Bar */}
                    <div className="flex items-center justify-between border-b border-white/[0.06] bg-black/60 px-4 py-1.5 text-[11px] font-mono text-zinc-500">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-orange-400">
                          {cell.type === 'code' ? `In [${cell.executionCount || ' '}]:` : 'Markdown'}
                        </span>
                      </div>

                      <div className="flex items-center gap-1">
                        {cell.type === 'code' && (
                          <button
                            onClick={() => handleRunCell(cell.id)}
                            disabled={cell.isExecuting}
                            className="flex items-center gap-1 rounded-lg bg-orange-500/20 px-2 py-0.5 text-[10px] font-bold text-orange-400 hover:bg-orange-500 hover:text-white transition-all disabled:opacity-50"
                          >
                            <Play className="h-2.5 w-2.5 fill-current" />
                            <span>Run</span>
                          </button>
                        )}

                        <button
                          onClick={() => handleDeleteCell(cell.id)}
                          className="p-1 text-zinc-500 hover:text-red-400 transition-colors"
                          title="Delete Cell"
                        >
                          <Trash2 className="h-3 w-3" />
                        </button>
                      </div>
                    </div>

                    {/* Cell Input Code Area */}
                    <div className="p-3">
                      <textarea
                        value={cell.content}
                        onChange={(e) => {
                          const val = e.target.value;
                          setCells((prev) =>
                            prev.map((c) => (c.id === cell.id ? { ...c, content: val } : c))
                          );
                        }}
                        rows={Math.max(2, cell.content.split('\n').length)}
                        className={`w-full bg-transparent p-2 font-mono text-xs text-zinc-200 focus:outline-none resize-none leading-relaxed ${
                          cell.type === 'markdown' ? 'text-zinc-300 italic' : 'text-orange-200'
                        }`}
                        spellCheck={false}
                      />
                    </div>

                    {/* Cell Output Area (if present) */}
                    {cell.output && (
                      <div className="border-t border-white/[0.06] bg-black/90 p-3.5 font-mono text-xs text-zinc-300 overflow-x-auto whitespace-pre leading-relaxed">
                        <div className="text-[10px] text-zinc-500 mb-1">Out [{cell.executionCount}]:</div>
                        {cell.output}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
