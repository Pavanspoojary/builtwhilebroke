import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { TOOLS } from '../data/toolsData';
import { ToolItem } from '../types/tool';
import { GithubIcon } from '../components/Icons';
import {
  ArrowLeft,
  RotateCcw,
  Maximize2,
  Minimize2,
  Shield,
  Star,
  Check,
  Sparkles,
  Lock,
  Layers,
  ChevronDown,
  ChevronUp,
  Search,
  Loader2,
  Code2,
} from 'lucide-react';
import { NodeCronWorkbench } from '../components/workbenches/NodeCronWorkbench';
import { HatshWorkbench } from '../components/workbenches/HatshWorkbench';
import { OpenWebUiWorkbench } from '../components/workbenches/OpenWebUiWorkbench';
import { BoltDiyWorkbench } from '../components/workbenches/BoltDiyWorkbench';
import { GitNexusWorkbench } from '../components/workbenches/GitNexusWorkbench';
import { LivekitAgentsWorkbench } from '../components/workbenches/LivekitAgentsWorkbench';
import { HoppscotchWorkbench } from '../components/workbenches/HoppscotchWorkbench';
import { ScreenshotToCodeWorkbench } from '../components/workbenches/ScreenshotToCodeWorkbench';
import { DocumensoWorkbench } from '../components/workbenches/DocumensoWorkbench';
import { InpaintWebWorkbench } from '../components/workbenches/InpaintWebWorkbench';
import { incrementToolUsage, getToolUsageCounts } from '../lib/toolUsage';

interface ToolDetailPageProps {
  onViewAudit: (tool: ToolItem) => void;
}

export const ToolDetailPage: React.FC<ToolDetailPageProps> = ({ onViewAudit }) => {
  const { toolId } = useParams<{ toolId: string }>();
  const navigate = useNavigate();
  const [iframeKey, setIframeKey] = useState<number>(0);
  const [isFocusMode, setIsFocusMode] = useState<boolean>(false);
  const [showGuide, setShowGuide] = useState<boolean>(false);
  const [showSwitcher, setShowSwitcher] = useState<boolean>(false);
  const [switcherQuery, setSwitcherQuery] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [hasError, setHasError] = useState<boolean>(false);

  const switcherRef = useRef<HTMLDivElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const tool: ToolItem | undefined = TOOLS.find((t) => t.id === toolId);

  // Close switcher on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (switcherRef.current && !switcherRef.current.contains(e.target as Node)) {
        setShowSwitcher(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    setIframeKey((prev) => prev + 1);
    setIsLoading(true);
    setHasError(false);
    setShowSwitcher(false);
    setSwitcherQuery('');
    if (toolId) {
      incrementToolUsage(toolId);
    }
  }, [toolId]);

  const [showJsonEditor, setShowJsonEditor] = useState<boolean>(false);
  const [jsonInput, setJsonInput] = useState<string>(() =>
    JSON.stringify(
      {
        name: "BuiltWhileBroke",
        version: "2.0.0",
        description: "Zero-telemetry open-source browser powerhouses",
        runtime: {
          wasm: true,
          webgpu: true,
          webAudio: true,
          offlineStorage: "IndexedDB / OPFS"
        },
        services: [
          { id: "pglite", name: "PostgreSQL WASM", status: "online" },
          { id: "drawio", name: "Draw.io Diagrams", status: "online" },
          { id: "jsoncrack", name: "JSON Crack Graph", status: "online" }
        ],
        author: {
          brand: "BuiltWhileBroke",
          license: "MIT / Apache-2.0",
          privacy: "100% Client-Side Private"
        }
      },
      null,
      2
    )
  );

  const postJsonCrack = (jsonStr: string) => {
    if (!iframeRef.current?.contentWindow) return;
    try {
      // JSON Crack Widget accepts both direct object and string payload
      iframeRef.current.contentWindow.postMessage({ json: jsonStr }, '*');
      iframeRef.current.contentWindow.postMessage(JSON.stringify({ json: jsonStr }), '*');
    } catch {
      // Ignore
    }
  };

  const handleIframeLoad = () => {
    setIsLoading(false);
    try {
      const iframeDoc = iframeRef.current?.contentDocument;
      if (iframeDoc) {
        // Find and remove ONLY the Buy me a coffee link (https://buymeacoffee.com/cthmsst)
        const buyCoffeeLinks = iframeDoc.querySelectorAll('a[href*="buymeacoffee.com"], a[href*="cthmsst"]');
        buyCoffeeLinks.forEach((el) => {
          const btn = el.closest('.n-button') || el;
          (btn as HTMLElement).style.display = 'none';
        });

        // Inject persistent CSS to guarantee only the buymeacoffee button stays hidden across SPA navigations
        const style = iframeDoc.createElement('style');
        style.textContent = `
          a[href*="buymeacoffee.com"],
          a[href*="cthmsst"],
          .n-button:has(a[href*="buymeacoffee.com"]),
          .n-button:has(a[href*="cthmsst"]) {
            display: none !important;
          }
        `;
        iframeDoc.head.appendChild(style);
      }
    } catch {
      // Cross-origin fallback
    }

    // If jsoncrack, initialize with sample data
    if (toolId === 'jsoncrack') {
      postJsonCrack(jsonInput);
      setTimeout(() => postJsonCrack(jsonInput), 400);
      setTimeout(() => postJsonCrack(jsonInput), 1200);
    }
  };

  // Draw.io & JSON Crack iframe communication protocol listener
  useEffect(() => {
    const handleMessage = (e: MessageEvent) => {
      if (!e.data) return;
      try {
        const msg = typeof e.data === 'string' ? JSON.parse(e.data) : e.data;
        if (msg.event === 'init') {
          setIsLoading(false);
          // Handshake response to Draw.io
          iframeRef.current?.contentWindow?.postMessage(
            JSON.stringify({
              action: 'load',
              autosave: 1,
              xml: '<mxfile><diagram><mxGraphModel><root><mxCell id="0"/><mxCell id="1" parent="0"/></root></mxGraphModel></diagram></mxfile>',
            }),
            '*'
          );
        }
      } catch {
        // Non-JSON message from other extensions or iframes
      }
    };

    window.addEventListener('message', handleMessage);

    // Initial trigger for JSON crack if already loaded
    if (toolId === 'jsoncrack') {
      const timer1 = setTimeout(() => postJsonCrack(jsonInput), 600);
      const timer2 = setTimeout(() => postJsonCrack(jsonInput), 1500);
      return () => {
        window.removeEventListener('message', handleMessage);
        clearTimeout(timer1);
        clearTimeout(timer2);
      };
    }

    return () => window.removeEventListener('message', handleMessage);
  }, [toolId, jsonInput]);

  // Keyboard shortcut listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (showSwitcher) {
          setShowSwitcher(false);
        } else if (showGuide) {
          setShowGuide(false);
        } else if (isFocusMode) {
          setIsFocusMode(false);
        } else {
          navigate('/tools');
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFocusMode, showGuide, showSwitcher, navigate]);

  if (!tool) {
    return (
      <div className="flex h-screen w-screen flex-col items-center justify-center bg-[#fafafa] p-6 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-zinc-200 bg-white text-zinc-600 shadow-sm">
          <Layers className="h-8 w-8 text-orange-600" />
        </div>
        <h2 className="mt-4 text-2xl font-bold text-zinc-950">Tool Not Found</h2>
        <p className="mt-2 max-w-sm text-xs text-zinc-500">
          The requested tool "{toolId}" does not exist in the curated catalogue.
        </p>
        <Link
          to="/tools"
          className="mt-6 inline-flex items-center gap-2 rounded-xl bg-zinc-900 px-5 py-2.5 text-xs font-semibold text-white shadow-sm hover:bg-zinc-800"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to All Tools</span>
        </Link>
      </div>
    );
  }

  const handleReload = () => {
    setIsLoading(true);
    setHasError(false);
    setIframeKey((prev) => prev + 1);
  };

  const usageCounts = getToolUsageCounts();

  const filteredSwitcherTools = TOOLS.filter(
    (t) =>
      t.name.toLowerCase().includes(switcherQuery.toLowerCase()) ||
      t.tagline.toLowerCase().includes(switcherQuery.toLowerCase()) ||
      t.category.toLowerCase().includes(switcherQuery.toLowerCase())
  ).sort((a, b) => (usageCounts[b.id] || 0) - (usageCounts[a.id] || 0));

  // Render authentic original tool workbenches
  const renderWorkbenchContent = () => {
    // node-cron is an npm library without a web domain; render the authentic crontab.guru UI
    if (tool.id === 'node-cron') return <NodeCronWorkbench />;
    // Hat.sh sends X-Frame-Options: SAMEORIGIN; render the in-browser Web Crypto AES-256 vault directly
    if (tool.id === 'hatsh') return <HatshWorkbench />;
    // Open WebUI requires local Docker/Ollama backend; render the in-browser WebLLM & Ollama chat workbench directly
    if (tool.id === 'open-webui') return <OpenWebUiWorkbench />;
    // bolt.diy domain redirects to github.com which blocks iframes; render the in-browser WebContainer AI app builder directly
    if (tool.id === 'bolt-diy') return <BoltDiyWorkbench />;
    // GitNexus GitHub repo blocks iframes; render the interactive repository intelligence visualizer directly
    if (tool.id === 'gitnexus') return <GitNexusWorkbench />;
    // LiveKit Playground requires active deployment cloud tokens; render the real-time WebRTC voice agent playground directly
    if (tool.id === 'livekit-agents') return <LivekitAgentsWorkbench />;
    // Hoppscotch.io sends X-Frame-Options: SAMEORIGIN; render the in-browser REST API workbench directly
    if (tool.id === 'hoppscotch') return <HoppscotchWorkbench />;
    // Screenshot to code website is marketing only; render the interactive AI vision compilation studio directly
    if (tool.id === 'screenshot-to-code') return <ScreenshotToCodeWorkbench />;
    // Documenso cloud sends Cloudflare/auth gate; render the in-browser cryptographic signing & seal studio directly
    if (tool.id === 'documenso') return <DocumensoWorkbench />;
    // Inpaint-web domain is offline; render the in-browser AI inpainting & object removal studio directly
    if (tool.id === 'inpaint-web') return <InpaintWebWorkbench />;

    // ALL OTHER TOOLS: Load 100% Authentic Original Web Applications (PGlite REPL, JupyterLite, Restfox, GitIngest, SQLime, Carbon, LibreSpeed, Hoppscotch, PDFme, Documenso, Excalidraw, Draw.io, CyberChef, Squoosh, etc.)
    return (
      <div className="relative h-full w-full bg-white overflow-hidden">
        {isLoading && !hasError && (
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-white/95 backdrop-blur-md">
            <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl bg-zinc-50 border border-zinc-200 shadow-sm">
              <Loader2 className="h-7 w-7 text-zinc-900 animate-spin" />
            </div>
            <p className="mt-4 text-xs font-semibold text-zinc-800">
              Launching <span className="font-bold text-zinc-950">{tool.name}</span>...
            </p>
            <p className="mt-1 text-[11px] text-zinc-400 font-mono">
              Loading official original environment
            </p>
          </div>
        )}

        {!hasError ? (
          <iframe
            ref={iframeRef}
            key={iframeKey}
            src={tool.embedUrl}
            title={tool.name}
            onLoad={handleIframeLoad}
            onError={() => {
              setIsLoading(false);
              setHasError(true);
            }}
            className="h-full w-full border-0 bg-white"
            sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-downloads allow-modals allow-pointer-lock allow-top-navigation-by-user-activation"
            allow="accelerometer; autoplay; clipboard-write; clipboard-read; encrypted-media; gyroscope; picture-in-picture; web-share; camera; microphone; display-capture"
          />
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center p-8 text-center bg-zinc-50">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-zinc-200 bg-white text-zinc-900 shadow-sm">
              <Layers className="h-8 w-8 text-zinc-900" />
            </div>
            <h3 className="mt-4 text-xl font-bold text-zinc-900">
              {tool.name}
            </h3>
            <p className="mt-2 max-w-md text-xs text-zinc-600 leading-relaxed">
              This tool can be accessed directly on its official website.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <a
                href={tool.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 rounded-xl bg-zinc-900 px-5 py-2.5 text-xs font-semibold text-white shadow-sm hover:bg-zinc-800"
              >
                <span>Launch {tool.name} in New Tab</span>
              </a>
              <button
                onClick={handleReload}
                className="flex items-center gap-2 rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-xs font-medium text-zinc-700 hover:bg-zinc-100 shadow-sm"
              >
                <RotateCcw className="h-4 w-4" />
                <span>Reload</span>
              </button>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-30 flex flex-col h-screen w-screen bg-[#fafafa] overflow-hidden select-none">
      {/* Sleek Top Navigation Bar (Hidden in Full Focus Mode) */}
      {!isFocusMode && (
        <header className="shrink-0 flex h-14 items-center justify-between border-b border-zinc-200/80 bg-white/95 px-3 sm:px-5 backdrop-blur-2xl z-40 specular-rim shadow-sm">
          {/* Left: Brand Logo, Back to Catalogue & Current Tool */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            <Link
              to="/"
              className="flex items-center gap-2 group transition"
              title="BuiltWhileBroke Home"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-zinc-100 border border-zinc-200/80 p-1 shadow-2xs transition group-hover:scale-105">
                <img src="/logo.png" alt="BuiltWhileBroke" className="h-full w-full object-contain" />
              </div>
            </Link>

            <div className="h-4 w-[1px] bg-zinc-200" />

            <button
              onClick={() => navigate('/tools')}
              className="flex items-center gap-1.5 rounded-lg border border-zinc-200 bg-zinc-50 px-2.5 py-1.5 text-xs font-semibold text-zinc-700 transition hover:bg-zinc-100 hover:text-zinc-950 active:scale-[0.98] shadow-sm"
              title="Back to /tools directory (Esc)"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Tools</span>
            </button>

            <div className="h-4 w-[1px] bg-zinc-200 hidden md:block" />

            {/* Current Active Tool Title & Status */}
            <div className="flex items-center gap-2">
              <div
                className="flex h-7 w-7 items-center justify-center rounded-lg border border-zinc-200 bg-zinc-50 font-mono text-[10px] font-extrabold text-zinc-900 shadow-sm"
              >
                {tool.name.slice(0, 2).toUpperCase()}
              </div>

              <div className="flex items-center gap-1.5">
                <span className="text-sm font-bold text-zinc-950 tracking-tight">
                  {tool.name}
                </span>
                <span className="rounded bg-zinc-100 px-1.5 py-0.2 text-[9px] font-mono text-zinc-600 border border-zinc-200">
                  {tool.license}
                </span>
                <span
                  className={`hidden sm:inline-flex rounded px-1.5 py-0.2 text-[9px] font-semibold ${
                    tool.commercialStatus === 'Permitted'
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      : 'bg-cyan-50 text-cyan-700 border border-cyan-200'
                  }`}
                >
                  {tool.commercialStatus === 'Permitted' ? 'Commercial Free' : 'GPL Copyleft'}
                </span>
              </div>
            </div>
          </div>

          {/* Center: Quick Switcher Dropdown */}
          <div className="relative hidden lg:block" ref={switcherRef}>
            <button
              onClick={() => setShowSwitcher(!showSwitcher)}
              className="flex items-center gap-2 rounded-xl border border-zinc-200 bg-zinc-50/80 px-3.5 py-1.5 text-xs text-zinc-700 transition hover:border-zinc-300 hover:bg-white hover:text-zinc-950 shadow-sm"
            >
              <Search className="h-3.5 w-3.5 text-zinc-400" />
              <span>Switch Workbench</span>
              <ChevronDown className="h-3 w-3 text-zinc-400" />
            </button>

            {showSwitcher && (
              <div className="absolute left-1/2 -translate-x-1/2 top-full mt-2 w-80 rounded-2xl bg-white p-2.5 shadow-2xl z-50 specular-rim animate-in fade-in duration-150 border border-zinc-200/90">
                <div className="relative mb-2">
                  <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-zinc-400 pointer-events-none" />
                  <input
                    type="text"
                    value={switcherQuery}
                    onChange={(e) => setSwitcherQuery(e.target.value)}
                    placeholder="Search tools..."
                    className="w-full rounded-xl border border-zinc-200 bg-zinc-50 py-1.5 pl-8 pr-3 text-xs text-zinc-900 placeholder-zinc-400 focus:border-zinc-950 focus:outline-none shadow-sm"
                    autoFocus
                  />
                </div>

                <div className="max-h-64 overflow-y-auto space-y-1">
                  {filteredSwitcherTools.map((t) => (
                    <button
                      key={t.id}
                      onClick={() => {
                        navigate(`/tools/${t.id}`);
                        setShowSwitcher(false);
                      }}
                      className={`flex w-full items-center justify-between rounded-xl px-2.5 py-1.5 text-left text-xs transition ${
                        t.id === tool.id
                          ? 'bg-zinc-900 text-white font-semibold'
                          : 'text-zinc-700 hover:bg-zinc-100 hover:text-zinc-950'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span
                          className={`font-mono text-[10px] font-bold ${t.id === tool.id ? 'text-zinc-300' : 'text-zinc-600'}`}
                        >
                          {t.name.slice(0, 2).toUpperCase()}
                        </span>
                        <span className="font-medium">{t.name}</span>
                      </div>
                      <span className={`text-[10px] font-mono ${t.id === tool.id ? 'text-zinc-400' : 'text-zinc-500'}`}>
                        {t.category}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right: Actions & Workbench Controls */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* JSON Crack Editor Drawer Toggle */}
            {tool.id === 'jsoncrack' && (
              <button
                onClick={() => setShowJsonEditor(!showJsonEditor)}
                className={`flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs font-bold transition shadow-sm ${
                  showJsonEditor
                    ? 'border-zinc-900 bg-zinc-900 text-white'
                    : 'border-zinc-200 bg-zinc-50 text-zinc-800 hover:bg-zinc-100'
                }`}
                title="Edit JSON Data"
              >
                <Code2 className="h-3.5 w-3.5" />
                <span>Edit JSON</span>
              </button>
            )}

            {/* Specs / Guide Toggle */}
            <button
              onClick={() => setShowGuide(!showGuide)}
              className={`flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs font-semibold transition ${
                showGuide
                  ? 'border-zinc-300 bg-zinc-100 text-zinc-950 font-bold'
                  : 'border-zinc-200 bg-zinc-50 text-zinc-700 hover:text-zinc-950 hover:bg-zinc-100 shadow-sm'
              }`}
              title="Toggle specs & guide"
            >
              <Sparkles className="h-3.5 w-3.5 text-zinc-900" />
              <span className="hidden md:inline">Specs</span>
              {showGuide ? (
                <ChevronUp className="h-3 w-3" />
              ) : (
                <ChevronDown className="h-3 w-3" />
              )}
            </button>

            {/* Reload Frame */}
            <button
              onClick={handleReload}
              className="flex items-center justify-center rounded-lg border border-zinc-200 bg-zinc-50 p-1.5 text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900 transition shadow-sm"
              title="Reload Tool Workbench"
            >
              <RotateCcw className="h-4 w-4" />
            </button>

            {/* Focus / Fullscreen Mode */}
            <button
              onClick={() => setIsFocusMode(true)}
              className="flex items-center gap-1 rounded-lg border border-zinc-200 bg-zinc-50 px-2.5 py-1.5 text-xs font-semibold text-zinc-700 hover:bg-zinc-100 hover:text-zinc-950 transition shadow-sm"
              title="Focus Mode (Full Screen)"
            >
              <Maximize2 className="h-3.5 w-3.5 text-zinc-500" />
              <span className="hidden sm:inline">Focus</span>
            </button>

            {/* Commercial Audit Button */}
            <button
              onClick={() => onViewAudit(tool)}
              className="hidden sm:flex items-center gap-1 rounded-lg border border-zinc-200 bg-zinc-50 px-2.5 py-1.5 text-xs font-semibold text-zinc-700 hover:bg-zinc-100 hover:text-zinc-950 shadow-sm"
              title="View Commercial Compliance Audit"
            >
              <Shield className="h-3.5 w-3.5 text-zinc-900" />
              <span className="hidden lg:inline">Audit</span>
            </button>

            {/* Source Code */}
            <a
              href={tool.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center rounded-lg border border-zinc-200 bg-zinc-50 p-1.5 text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900 transition shadow-sm"
              title="Upstream GitHub Source"
            >
              <GithubIcon className="h-4 w-4" />
            </a>
          </div>
        </header>
      )}

      {/* Floating Exit Focus Button (Only visible in Focus Mode) */}
      {isFocusMode && (
        <div className="absolute top-3 right-4 z-50 flex items-center gap-2">
          <div className="flex items-center gap-2 rounded-full border border-zinc-200 bg-white/95 px-3 py-1.5 text-xs text-zinc-900 backdrop-blur-xl shadow-2xl">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-bold text-zinc-950">{tool.name}</span>
            <div className="h-3 w-[1px] bg-zinc-200" />
            <button
              onClick={handleReload}
              className="p-0.5 text-zinc-500 hover:text-zinc-900"
              title="Reload Frame"
            >
              <RotateCcw className="h-3.5 w-3.5" />
            </button>
            <button
              onClick={() => setIsFocusMode(false)}
              className="flex items-center gap-1 rounded-md bg-zinc-100 px-2 py-0.5 text-[11px] font-semibold text-zinc-700 hover:bg-zinc-200"
              title="Exit Focus Mode (Esc)"
            >
              <Minimize2 className="h-3 w-3" />
              <span>Exit (Esc)</span>
            </button>
          </div>
        </div>
      )}

      {/* Collapsible Info/Guide Drawer */}
      {showGuide && !isFocusMode && (
        <div className="shrink-0 border-b border-zinc-200 bg-white p-5 text-xs text-zinc-700 specular-rim z-30 shadow-lg">
          <div className="mx-auto max-w-7xl grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h4 className="font-bold text-zinc-900 uppercase tracking-wider font-mono text-[11px] flex items-center gap-2">
                <span>About {tool.name}</span>
                <span className="h-1.5 w-1.5 rounded-full bg-zinc-900" />
              </h4>
              <p className="mt-1.5 text-zinc-600 leading-relaxed text-[11px]">
                {tool.description}
              </p>
              <div className="mt-2.5 flex items-center gap-2 text-zinc-500">
                <span>Author: <strong className="text-zinc-900">{tool.author}</strong></span>
                <span>•</span>
                <span className="flex items-center gap-1 text-amber-500 font-semibold">
                  <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                  <span>{tool.stars}</span>
                </span>
              </div>
            </div>

            <div>
              <h4 className="font-bold text-zinc-900 uppercase tracking-wider font-mono text-[11px]">
                Key Features
              </h4>
              <ul className="mt-1.5 space-y-1.5 text-[11px] text-zinc-600">
                {tool.features.map((feat, idx) => (
                  <li key={idx} className="flex items-start gap-1.5">
                    <Check className="mt-0.5 h-3 w-3 shrink-0 text-emerald-600" />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-zinc-900 uppercase tracking-wider font-mono text-[11px]">
                Tech Stack & Privacy
              </h4>
              <div className="mt-1.5 flex flex-wrap gap-1">
                {tool.techStack.map((tech) => (
                  <span
                    key={tech}
                    className="rounded-md border border-zinc-200 bg-zinc-100 px-2 py-0.5 text-[10px] font-mono text-zinc-700 font-medium"
                  >
                    {tech}
                  </span>
                ))}
              </div>
              <div className="mt-3 flex items-center gap-1.5 text-[11px] text-emerald-600 font-medium">
                <Lock className="h-3.5 w-3.5" />
                <span>100% in-browser client execution</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Collapsible JSON Crack Editor Drawer */}
      {showJsonEditor && tool.id === 'jsoncrack' && !isFocusMode && (
        <div className="shrink-0 border-b border-zinc-200 bg-white p-4 text-xs text-zinc-700 specular-rim z-30 shadow-lg animate-in slide-in-from-top-2 duration-150">
          <div className="mx-auto max-w-7xl space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="font-bold text-zinc-950 font-mono uppercase tracking-wider text-[11px]">
                  JSON Input & Graph Data
                </span>
                <span className="text-[10px] text-zinc-400 font-mono">
                  (Changes update the graph canvas in real-time)
                </span>
              </div>

              {/* Preset Sample Selector */}
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-[10px] font-mono text-zinc-500 font-bold">Presets:</span>
                <button
                  onClick={() => {
                    const data = {
                      appName: "BuiltWhileBroke",
                      version: "2.0.0",
                      features: ["PostgreSQL WASM", "Draw.io", "JSON Crack", "CyberChef", "PDFme"],
                      offlineReady: true,
                      privacyGrade: "A+"
                    };
                    const str = JSON.stringify(data, null, 2);
                    setJsonInput(str);
                    postJsonCrack(str);
                  }}
                  className="rounded-lg border border-zinc-200 bg-zinc-50 px-2 py-1 text-[10px] font-mono text-zinc-700 hover:bg-zinc-100 hover:text-zinc-950"
                >
                  App Suite
                </button>
                <button
                  onClick={() => {
                    const data = {
                      apiVersion: "apps/v1",
                      kind: "Deployment",
                      metadata: { name: "api-gateway", namespace: "production", replicas: 3 },
                      spec: {
                        template: {
                          containers: [
                            { name: "envoy-proxy", port: 8080, resources: { cpu: "500m", memory: "512Mi" } },
                            { name: "auth-sidecar", port: 9000 }
                          ]
                        }
                      }
                    };
                    const str = JSON.stringify(data, null, 2);
                    setJsonInput(str);
                    postJsonCrack(str);
                  }}
                  className="rounded-lg border border-zinc-200 bg-zinc-50 px-2 py-1 text-[10px] font-mono text-zinc-700 hover:bg-zinc-100 hover:text-zinc-950"
                >
                  K8s Deployment
                </button>
                <button
                  onClick={() => {
                    const data = {
                      user: {
                        id: "usr_9982",
                        name: "Alex Mercer",
                        role: "Admin",
                        permissions: ["read", "write", "deploy", "audit"],
                        preferences: { theme: "white", notifications: { email: true, slack: false } }
                      }
                    };
                    const str = JSON.stringify(data, null, 2);
                    setJsonInput(str);
                    postJsonCrack(str);
                  }}
                  className="rounded-lg border border-zinc-200 bg-zinc-50 px-2 py-1 text-[10px] font-mono text-zinc-700 hover:bg-zinc-100 hover:text-zinc-950"
                >
                  User Profile
                </button>
              </div>
            </div>

            <div className="relative">
              <textarea
                value={jsonInput}
                onChange={(e) => setJsonInput(e.target.value)}
                rows={5}
                placeholder="Paste or type JSON data here..."
                className="w-full rounded-2xl border border-zinc-200 bg-zinc-50/70 p-3 font-mono text-xs text-zinc-900 placeholder-zinc-400 focus:border-zinc-950 focus:bg-white focus:outline-none shadow-sm selection:bg-zinc-900 selection:text-white"
                spellCheck={false}
              />
            </div>

            <div className="flex items-center justify-between">
              <button
                onClick={() => {
                  try {
                    const parsed = JSON.parse(jsonInput);
                    const formatted = JSON.stringify(parsed, null, 2);
                    setJsonInput(formatted);
                  } catch {
                    // Invalid JSON format
                  }
                }}
                className="rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-1.5 text-xs font-mono text-zinc-700 hover:bg-zinc-100 hover:text-zinc-950"
              >
                Format JSON
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowJsonEditor(false)}
                  className="rounded-xl border border-zinc-200 bg-zinc-50 px-3.5 py-1.5 text-xs font-semibold text-zinc-600 hover:bg-zinc-100"
                >
                  Collapse
                </button>
                <button
                  onClick={() => {
                    postJsonCrack(jsonInput);
                  }}
                  className="rounded-xl bg-zinc-900 px-4 py-1.5 text-xs font-bold text-white hover:bg-zinc-800 shadow-sm transition"
                >
                  Update Graph Canvas
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Interactive Workbench Area */}
      <main className="relative flex-1 w-full h-full bg-[#fafafa] overflow-hidden">
        {renderWorkbenchContent()}
      </main>
    </div>
  );
};
