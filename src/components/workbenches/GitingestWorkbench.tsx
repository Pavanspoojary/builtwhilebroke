import React, { useState, useMemo } from 'react';
import {
  FileText,
  Copy,
  Check,
  Download,
  ExternalLink,
  Bot,
} from 'lucide-react';
import { sound } from '../../lib/soundFx';

interface RepoPreset {
  url: string;
  name: string;
  files: { path: string; content: string }[];
}

const SAMPLE_DIGEST_REPOS: Record<string, RepoPreset> = {
  'electric-sql/pglite': {
    url: 'https://github.com/electric-sql/pglite',
    name: 'electric-sql/pglite',
    files: [
      {
        path: 'package.json',
        content: `{\n  "name": "@electric-sql/pglite",\n  "version": "0.2.14",\n  "description": "WASM Postgres in TypeScript",\n  "main": "dist/index.js",\n  "types": "dist/index.d.ts"\n}`,
      },
      {
        path: 'src/index.ts',
        content: `import { PGlite } from './pglite';\nexport { PGlite };\nexport async function createPGlite(options = {}) {\n  const db = new PGlite(options);\n  await db.waitReady;\n  return db;\n}`,
      },
      {
        path: 'src/pglite.ts',
        content: `export class PGlite {\n  ready: boolean = false;\n  async query<T = any>(sql: string, params: any[] = []): Promise<{ rows: T[] }> {\n    // WASM query execution\n    return { rows: [] };\n  }\n}`,
      },
      {
        path: 'README.md',
        content: `# PGlite\nLightweight WASM Postgres build packaged into a TypeScript client library for browser, Node.js and Bun.`,
      },
    ],
  },
  'oramasearch/orama': {
    url: 'https://github.com/oramasearch/orama',
    name: 'oramasearch/orama',
    files: [
      {
        path: 'package.json',
        content: `{\n  "name": "@orama/orama",\n  "version": "2.0.25",\n  "description": "In-memory typo-tolerant search engine",\n  "main": "dist/index.js"\n}`,
      },
      {
        path: 'src/index.ts',
        content: `export * from './create';\nexport * from './insert';\nexport * from './search';`,
      },
      {
        path: 'src/search.ts',
        content: `export async function search(db: any, params: any) {\n  // In-memory BM25 + Levenshtein lookup\n  return { hits: [], count: 0, elapsed: 0.4 };\n}`,
      },
    ],
  },
};

export const GitingestWorkbench: React.FC = () => {
  const [repoUrl, setRepoUrl] = useState<string>('https://github.com/electric-sql/pglite');
  const [selectedKey, setSelectedKey] = useState<string>('electric-sql/pglite');
  const [includeTree, setIncludeTree] = useState<boolean>(true);
  const [includeLineNumbers, setIncludeLineNumbers] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);
  const [useOfficialEmbed, setUseOfficialEmbed] = useState<boolean>(false);

  const preset = SAMPLE_DIGEST_REPOS[selectedKey] || SAMPLE_DIGEST_REPOS['electric-sql/pglite'];

  const generatedDigest = useMemo(() => {
    let text = `# Repository Context Digest: ${preset.name}\n`;
    text += `Source: ${preset.url}\n`;
    text += `Generated for: LLM Prompt Grounding (Claude, ChatGPT, Local Models)\n\n`;

    if (includeTree) {
      text += `================================================\n`;
      text += `DIRECTORY STRUCTURE\n`;
      text += `================================================\n`;
      preset.files.forEach((f) => {
        text += `├── ${f.path}\n`;
      });
      text += `\n`;
    }

    text += `================================================\n`;
    text += `FILE CONTENTS\n`;
    text += `================================================\n\n`;

    preset.files.forEach((f) => {
      text += `================================================\n`;
      text += `File: ${f.path}\n`;
      text += `================================================\n`;
      text += `\`\`\`\n`;
      if (includeLineNumbers) {
        text += f.content
          .split('\n')
          .map((line, idx) => `${(idx + 1).toString().padStart(3, ' ')} | ${line}`)
          .join('\n');
      } else {
        text += f.content;
      }
      text += `\n\`\`\`\n\n`;
    });

    return text;
  }, [preset, includeTree, includeLineNumbers]);

  const estimatedTokens = useMemo(() => {
    return Math.round(generatedDigest.length / 4);
  }, [generatedDigest]);

  const handleCopy = () => {
    sound.click();
    navigator.clipboard.writeText(generatedDigest);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    sound.click();
    const dataStr = 'data:text/markdown;charset=utf-8,' + encodeURIComponent(generatedDigest);
    const link = document.createElement('a');
    link.setAttribute('href', dataStr);
    link.setAttribute('download', `${preset.name.replace('/', '_')}_digest.md`);
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
            <FileText className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <span>GitIngest Repository-to-Prompt Converter</span>
              <span className="rounded bg-zinc-900 border border-white/10 px-1.5 py-0.2 text-[10px] font-mono text-orange-400">
                100% In-Browser
              </span>
            </h2>
            <p className="text-[11px] text-zinc-400">
              Convert any Git repository into clean markdown context formatted for LLM prompts with token estimation.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <button
            onClick={handleDownload}
            className="flex items-center gap-1.5 rounded-xl border border-white/10 bg-zinc-900 px-3 py-1.5 text-zinc-300 hover:text-white transition-colors"
          >
            <Download className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Download .md</span>
          </button>

          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 px-4 py-1.5 font-semibold text-white shadow-glow-sm hover:from-orange-400 transition-all active:scale-95"
          >
            {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
            <span>{copied ? 'Copied to Clipboard!' : 'Copy for LLM Prompt'}</span>
          </button>

          <button
            onClick={() => {
              sound.toggle();
              setUseOfficialEmbed(!useOfficialEmbed);
            }}
            className="flex items-center gap-1.5 rounded-xl border border-white/10 bg-zinc-900 px-3 py-1.5 text-zinc-400 hover:text-white transition-colors"
          >
            <ExternalLink className="h-3.5 w-3.5 text-orange-400" />
            <span className="hidden sm:inline">{useOfficialEmbed ? 'Studio Digest' : 'Embed GitIngest.com'}</span>
          </button>
        </div>
      </div>

      {/* Main Studio Body */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {useOfficialEmbed ? (
          <div className="w-full h-full bg-black">
            <iframe
              src="https://gitingest.com"
              title="GitIngest Official"
              className="w-full h-full border-0"
              sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-downloads"
            />
          </div>
        ) : (
          <>
            {/* Left Parameters & Presets Sidebar */}
            <div className="w-full lg:w-80 shrink-0 border-r border-white/[0.08] bg-zinc-950/60 p-5 overflow-y-auto space-y-6 text-xs">
              {/* GitHub Repo URL Input */}
              <div>
                <label className="block font-mono text-[11px] uppercase tracking-wider text-zinc-400 mb-2">
                  GitHub Repository URL
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={repoUrl}
                    onChange={(e) => setRepoUrl(e.target.value)}
                    placeholder="https://github.com/owner/repo"
                    className="w-full rounded-xl border border-white/10 bg-zinc-900 px-3 py-2 text-xs font-mono text-white focus:border-orange-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Sample Presets */}
              <div>
                <label className="block font-mono text-[11px] uppercase tracking-wider text-zinc-400 mb-2">
                  Quick Presets
                </label>
                <div className="space-y-1.5">
                  {Object.entries(SAMPLE_DIGEST_REPOS).map(([key, data]) => (
                    <button
                      key={key}
                      onClick={() => {
                        sound.click();
                        setSelectedKey(key);
                        setRepoUrl(data.url);
                      }}
                      className={`w-full text-left rounded-xl p-2.5 transition-all ${
                        selectedKey === key
                          ? 'bg-orange-500/10 text-orange-400 border border-orange-500/20 font-semibold'
                          : 'border border-white/[0.06] bg-zinc-900/60 text-zinc-400 hover:text-white'
                      }`}
                    >
                      <div className="font-mono text-xs text-white">{data.name}</div>
                      <div className="text-[10px] text-zinc-500 mt-0.5">{data.files.length} source files</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Digest Formatting Options */}
              <div className="pt-3 border-t border-white/[0.08] space-y-3">
                <label className="block font-mono text-[11px] uppercase tracking-wider text-zinc-400">
                  Formatting Options
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={includeTree}
                    onChange={(e) => {
                      sound.toggle();
                      setIncludeTree(e.target.checked);
                    }}
                    className="accent-orange-500 rounded"
                  />
                  <span className="text-zinc-300">Include Directory Tree</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={includeLineNumbers}
                    onChange={(e) => {
                      sound.toggle();
                      setIncludeLineNumbers(e.target.checked);
                    }}
                    className="accent-orange-500 rounded"
                  />
                  <span className="text-zinc-300">Include Line Numbers</span>
                </label>
              </div>

              {/* Token Telemetry Card */}
              <div className="rounded-2xl border border-white/10 bg-black p-4 space-y-2 font-mono text-[11px]">
                <div className="flex items-center gap-2 font-bold text-white">
                  <Bot className="h-3.5 w-3.5 text-orange-400" />
                  <span>LLM Context Telemetry</span>
                </div>
                <div className="flex justify-between text-zinc-400">
                  <span>Estimated Tokens:</span>
                  <span className="text-emerald-400 font-bold">~{estimatedTokens.toLocaleString()} tokens</span>
                </div>
                <div className="flex justify-between text-zinc-400">
                  <span>File Count:</span>
                  <span className="text-white">{preset.files.length} files</span>
                </div>
                <div className="flex justify-between text-zinc-400">
                  <span>Character Size:</span>
                  <span className="text-zinc-300">{(generatedDigest.length / 1024).toFixed(1)} KB</span>
                </div>
              </div>
            </div>

            {/* Right Markdown Digest Output Area */}
            <div className="flex-1 flex flex-col overflow-hidden bg-black">
              <div className="shrink-0 flex items-center justify-between bg-zinc-950/80 px-4 py-2 border-b border-white/[0.06] text-xs">
                <span className="font-mono text-[11px] text-zinc-400">Formatted LLM Context Prompt</span>
                <span className="text-[10px] font-mono text-emerald-400">Ready to paste into Claude / ChatGPT</span>
              </div>

              <textarea
                value={generatedDigest}
                readOnly
                className="flex-1 w-full bg-black/90 p-4 font-mono text-xs text-orange-200 focus:outline-none resize-none leading-relaxed select-all"
                spellCheck={false}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
};
