import React, { useState } from 'react';
import {
  Sparkles,
  Copy,
  Check,
  FolderTree,
  FileCode,
  Terminal,
  Code2,
  Download,
  Eye,
} from 'lucide-react';
import { sound } from '../../lib/soundFx';

interface FileItem {
  name: string;
  language: string;
  content: string;
}

const SAMPLE_PROJECT_FILES: Record<string, FileItem> = {
  'src/App.tsx': {
    name: 'src/App.tsx',
    language: 'typescript',
    content: `import React, { useState } from 'react';
import { Sparkles, ArrowRight } from 'lucide-react';

export default function App() {
  const [count, setCount] = useState(0);

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6">
      <div className="p-8 rounded-3xl border border-white/10 bg-zinc-950/80 backdrop-blur-xl max-w-md w-full text-center space-y-4 shadow-2xl">
        <div className="inline-flex p-3 rounded-2xl bg-orange-500/10 text-orange-400 border border-orange-500/20">
          <Sparkles className="h-6 w-6 animate-pulse" />
        </div>
        <h1 className="text-2xl font-bold">Built in bolt.diy</h1>
        <p className="text-sm text-zinc-400">Full-stack React & Node.js application generated directly in browser WebContainers.</p>
        <button
          onClick={() => setCount((c) => c + 1)}
          className="w-full py-2.5 rounded-xl bg-orange-500 font-semibold text-white hover:bg-orange-400 transition-all flex items-center justify-center gap-2 shadow-glow-sm"
        >
          <span>Counter: {count}</span>
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}`,
  },
  'package.json': {
    name: 'package.json',
    language: 'json',
    content: `{
  "name": "bolt-diy-sandbox-app",
  "private": true,
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "lucide-react": "^0.468.0",
    "clsx": "^2.1.1"
  },
  "devDependencies": {
    "@types/react": "^18.3.5",
    "@types/react-dom": "^18.3.0",
    "@vitejs/plugin-react": "^4.3.1",
    "tailwindcss": "^3.4.10",
    "typescript": "^5.5.3",
    "vite": "^5.4.2"
  }
}`,
  },
  'src/index.css': {
    name: 'src/index.css',
    language: 'css',
    content: `@tailwind base;
@tailwind components;
@tailwind utilities;

body {
  margin: 0;
  background-color: #000000;
  color: #f4f4f5;
  font-family: system-ui, -apple-system, sans-serif;
}`,
  },
};

export const BoltDiyWorkbench: React.FC = () => {
  const [prompt, setPrompt] = useState<string>('Create a real-time analytics dashboard with interactive charts and dark obsidian glass cards');
  const [activeFile, setActiveFile] = useState<string>('src/App.tsx');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [previewTab, setPreviewTab] = useState<'code' | 'preview'>('code');
  const [copied, setCopied] = useState<boolean>(false);
  const [files, setFiles] = useState<Record<string, FileItem>>(SAMPLE_PROJECT_FILES);
  const [terminalLogs, setTerminalLogs] = useState<string[]>([
    '[WebContainer] Node.js v20.11.0 runtime initialized in WebAssembly worker.',
    '[WebContainer] Vite v5.4.2 dev server running on http://localhost:5173',
  ]);

  const handleGenerate = () => {
    if (!prompt.trim() || isGenerating) return;
    sound.launch();
    setIsGenerating(true);

    setTerminalLogs((prev) => [
      `[bolt.diy] Synthesizing full-stack project for prompt: "${prompt}"...`,
      ...prev,
    ]);

    setTimeout(() => {
      setIsGenerating(false);
      sound.pop();
      setTerminalLogs((prev) => [
        `[bolt.diy] ✓ Generated 3 files successfully. Dev server hot reloaded.`,
        ...prev,
      ]);
    }, 1500);
  };

  const handleCopyCode = () => {
    sound.click();
    navigator.clipboard.writeText(files[activeFile]?.content || '');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadZip = () => {
    sound.click();
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(files, null, 2));
    const link = document.createElement('a');
    link.setAttribute('href', dataStr);
    link.setAttribute('download', `bolt_diy_project_${Date.now()}.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex flex-col h-full w-full bg-[#fafafa] text-zinc-900 overflow-hidden font-sans">
      {/* Top Header */}
      <div className="shrink-0 flex items-center justify-between border-b border-zinc-200/80 bg-white px-6 py-3.5 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-orange-200 bg-orange-50 text-orange-600 shadow-sm">
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-zinc-950 flex items-center gap-2">
              <span>bolt.diy In-Browser Full-Stack AI App Builder</span>
              <span className="rounded bg-orange-50 border border-orange-200 px-1.5 py-0.2 text-[10px] font-mono font-bold text-orange-700">
                WebContainer WASM
              </span>
            </h2>
            <p className="text-[11px] text-zinc-500 font-normal">
              Prompt-to-fullstack application builder powered by browser WebContainers with zero backend required.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs font-semibold">
          <button
            onClick={handleDownloadZip}
            className="flex items-center gap-1.5 rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-1.5 text-zinc-700 hover:bg-zinc-100 hover:text-zinc-950 transition-colors shadow-sm"
          >
            <Download className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Export Project</span>
          </button>
        </div>
      </div>

      {/* Main Studio Body */}
      <div className="flex-1 flex flex-col overflow-hidden bg-white">
        {/* Top Prompt Generation Bar */}
        <div className="shrink-0 p-4 border-b border-zinc-200 bg-zinc-50/70">
          <div className="max-w-5xl mx-auto flex gap-2">
            <input
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
              placeholder="Describe the full-stack app you want to generate in WebContainers..."
              className="flex-1 rounded-2xl border border-zinc-200 bg-white px-4 py-2.5 text-xs text-zinc-900 placeholder-zinc-400 focus:border-orange-500 focus:outline-none shadow-sm"
            />
            <button
              onClick={handleGenerate}
              disabled={isGenerating}
              className="flex items-center gap-2 rounded-2xl bg-orange-600 px-5 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-orange-500 transition-all disabled:opacity-50"
            >
              <Sparkles className="h-3.5 w-3.5" />
              <span>{isGenerating ? 'Synthesizing...' : 'Build App'}</span>
            </button>
          </div>
        </div>

        {/* Split View: File Tree, Code Editor & Live Preview */}
        <div className="flex-1 flex overflow-hidden">
          {/* Left File Explorer */}
          <div className="w-56 shrink-0 border-r border-zinc-200 bg-zinc-50/50 p-3 overflow-y-auto space-y-4 text-xs">
            <div>
              <div className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-wider text-zinc-500 font-bold mb-2">
                <FolderTree className="h-3.5 w-3.5" />
                <span>Project Files</span>
              </div>
              <div className="space-y-1">
                {Object.keys(files).map((filepath) => (
                  <button
                    key={filepath}
                    onClick={() => {
                      sound.click();
                      setActiveFile(filepath);
                    }}
                    className={`flex w-full items-center gap-2 rounded-xl px-2.5 py-1.5 font-mono text-[11px] font-semibold transition-all ${
                      activeFile === filepath
                        ? 'bg-orange-50 text-orange-800 border border-orange-200 shadow-sm'
                        : 'text-zinc-600 hover:text-zinc-950 hover:bg-zinc-100'
                    }`}
                  >
                    <FileCode className="h-3.5 w-3.5" />
                    <span className="truncate">{filepath}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Center Code Editor / Live Preview */}
          <div className="flex-1 flex flex-col overflow-hidden bg-white">
            {/* Editor Tab Bar */}
            <div className="shrink-0 flex items-center justify-between border-b border-zinc-200 bg-zinc-50/80 px-4 py-2 text-xs">
              <div className="flex items-center gap-2">
                <span className="font-mono text-[11px] text-zinc-700 font-bold">{activeFile}</span>
              </div>

              <div className="flex items-center gap-2">
                <div className="flex items-center bg-white rounded-lg p-0.5 border border-zinc-200 text-[10px] shadow-sm">
                  <button
                    onClick={() => {
                      sound.toggle();
                      setPreviewTab('code');
                    }}
                    className={`flex items-center gap-1 px-2.5 py-1 rounded-md font-semibold transition-all ${
                      previewTab === 'code' ? 'bg-orange-600 text-white' : 'text-zinc-600 hover:text-zinc-900'
                    }`}
                  >
                    <Code2 className="h-3 w-3" />
                    <span>Code</span>
                  </button>
                  <button
                    onClick={() => {
                      sound.toggle();
                      setPreviewTab('preview');
                    }}
                    className={`flex items-center gap-1 px-2.5 py-1 rounded-md font-semibold transition-all ${
                      previewTab === 'preview' ? 'bg-orange-600 text-white' : 'text-zinc-600 hover:text-zinc-900'
                    }`}
                  >
                    <Eye className="h-3 w-3" />
                    <span>Preview</span>
                  </button>
                </div>

                <button
                  onClick={handleCopyCode}
                  className="p-1 text-zinc-500 hover:text-zinc-900"
                  title="Copy Code"
                >
                  {copied ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
                </button>
              </div>
            </div>

            {/* Editor Content or Live Preview */}
            <div className="flex-1 overflow-auto">
              {previewTab === 'code' ? (
                <textarea
                  value={files[activeFile]?.content || ''}
                  onChange={(e) => {
                    const newContent = e.target.value;
                    setFiles((prev) => ({
                      ...prev,
                      [activeFile]: {
                        ...prev[activeFile],
                        content: newContent,
                      },
                    }));
                  }}
                  className="w-full h-full bg-white p-4 font-mono text-xs text-zinc-800 focus:outline-none resize-none leading-relaxed"
                  spellCheck={false}
                />
              ) : (
                <div className="h-full w-full flex items-center justify-center bg-zinc-50 p-6">
                  <div className="p-8 rounded-3xl border border-zinc-200/90 bg-white backdrop-blur-xl max-w-md w-full text-center space-y-4 shadow-xl">
                    <div className="inline-flex p-3 rounded-2xl bg-orange-50 text-orange-600 border border-orange-200 shadow-sm">
                      <Sparkles className="h-6 w-6 animate-pulse" />
                    </div>
                    <h1 className="text-xl font-extrabold text-zinc-950">Live WebContainer Sandbox</h1>
                    <p className="text-xs text-zinc-500 leading-relaxed">
                      Interactive component rendering directly in browser memory without server hops.
                    </p>
                    <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 font-mono text-xs text-emerald-800 font-semibold shadow-sm">
                      ✓ All modules compiled (Vite 5.4.2)
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Bottom Terminal Logger */}
            <div className="h-28 shrink-0 border-t border-zinc-200 bg-zinc-50/80 p-3 overflow-y-auto font-mono text-[10px] text-zinc-600 space-y-1">
              <div className="flex items-center gap-1.5 text-zinc-500 font-bold mb-1">
                <Terminal className="h-3 w-3 text-orange-600" />
                <span>WebContainer Console</span>
              </div>
              {terminalLogs.map((log, idx) => (
                <div key={idx} className="truncate">{log}</div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
