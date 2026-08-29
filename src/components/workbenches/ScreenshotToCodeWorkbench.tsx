import React, { useState, useEffect, useRef } from 'react';
import {
  Upload,
  Sparkles,
  Code2,
  Eye,
  Copy,
  Check,
  RotateCcw,
  Key,
  ChevronRight,
  AlertCircle,
  Trash2,
  Lock,
  RefreshCw,
  Cpu,
  Server,
  Loader2,
  Download,
  HardDrive,
  CheckCircle2,
} from 'lucide-react';
import { sound } from '../../lib/soundFx';
import {
  generateCodeFromScreenshot,
  fetchAvailableModels,
  VisionProvider,
  ModelOption,
} from '../../lib/visionInference';
import {
  WEBLMM_MODELS,
  WebLlmModelSpec,
  ModelDownloadState,
  isModelCached,
  downloadAndCacheWebLlmModel,
  deleteCachedModel,
  checkWebGpuSupport,
} from '../../lib/webLlmManager';

interface SampleMockup {
  name: string;
  category: string;
  imgUrl: string;
  sampleCode: string;
}

const SAMPLE_MOCKUPS: SampleMockup[] = [
  {
    name: 'Developer Metrics Dashboard',
    category: 'System Monitor',
    imgUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&auto=format&fit=crop&q=60',
    sampleCode: `<div class="p-6 bg-[#fafafa] text-zinc-900 min-h-full font-sans">
  <div class="flex items-center justify-between border-b border-zinc-200 pb-4 mb-6">
    <div>
      <h2 class="text-lg font-bold text-zinc-950 tracking-tight">System Performance Monitor</h2>
      <p class="text-xs text-zinc-500">Client-side WebAssembly & WebGPU runtime metrics</p>
    </div>
    <div class="flex items-center gap-2">
      <span class="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700 border border-emerald-200">
        <span class="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
        Runtime Healthy
      </span>
    </div>
  </div>

  <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
    <div class="rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm">
      <div class="text-[11px] font-mono uppercase tracking-wider text-zinc-400 font-bold">WASM Latency</div>
      <div class="text-2xl font-extrabold text-zinc-950 mt-1 font-mono">0.42 ms</div>
      <div class="text-[10px] text-emerald-700 mt-1 font-mono font-semibold">↑ 99.8% cache hit rate</div>
    </div>
    <div class="rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm">
      <div class="text-[11px] font-mono uppercase tracking-wider text-zinc-400 font-bold">Client Heap</div>
      <div class="text-2xl font-extrabold text-zinc-950 mt-1 font-mono">14.8 MB</div>
      <div class="text-[10px] text-zinc-400 mt-1 font-mono">Allocated in browser OPFS</div>
    </div>
    <div class="rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm">
      <div class="text-[11px] font-mono uppercase tracking-wider text-zinc-400 font-bold">Telemetry Tracking</div>
      <div class="text-2xl font-extrabold text-orange-600 mt-1 font-mono">0.00%</div>
      <div class="text-[10px] text-orange-700 mt-1 font-mono font-semibold">Strict zero-network sandbox</div>
    </div>
  </div>

  <div class="rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm">
    <div class="text-xs font-bold text-zinc-900 mb-3 font-mono uppercase tracking-wider">Active Worker Threads</div>
    <div class="space-y-2 font-mono text-xs">
      <div class="flex items-center justify-between p-2.5 rounded-xl bg-zinc-50 border border-zinc-200">
        <span class="text-orange-700 font-bold">worker-core-wasm-simd</span>
        <span class="text-emerald-700 text-[11px] font-bold">ACTIVE (Thread #0)</span>
      </div>
      <div class="flex items-center justify-between p-2.5 rounded-xl bg-zinc-50 border border-zinc-200">
        <span class="text-orange-700 font-bold">worker-webgpu-tensor-pipeline</span>
        <span class="text-emerald-700 text-[11px] font-bold">ACTIVE (Thread #1)</span>
      </div>
    </div>
  </div>
</div>`,
  },
  {
    name: 'Data Schema & Query Table',
    category: 'Database Explorer',
    imgUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=60',
    sampleCode: `<div class="p-6 bg-[#fafafa] text-zinc-900 min-h-full font-sans">
  <div class="flex items-center justify-between mb-4">
    <div>
      <h3 class="text-base font-bold text-zinc-950">Database Query Inspector</h3>
      <p class="text-xs text-zinc-500">IndexedDB & In-Memory Parquet Tables</p>
    </div>
    <button class="px-3 py-1.5 rounded-xl bg-white text-xs font-bold text-zinc-800 border border-zinc-200 shadow-sm hover:bg-zinc-50">Export CSV</button>
  </div>

  <div class="overflow-x-auto rounded-2xl border border-zinc-200 bg-white shadow-sm">
    <table class="w-full text-left text-xs text-zinc-700">
      <thead class="bg-zinc-50 text-[10px] font-mono uppercase tracking-wider text-zinc-500 border-b border-zinc-200 font-bold">
        <tr>
          <th class="p-3">Query ID</th>
          <th class="p-3">Target Table</th>
          <th class="p-3">Rows Processed</th>
          <th class="p-3">Execution Time</th>
          <th class="p-3">Status</th>
        </tr>
      </thead>
      <tbody class="divide-y divide-zinc-100 font-mono text-[11px]">
        <tr>
          <td class="p-3 text-orange-600 font-bold">#QX-8921</td>
          <td class="p-3 text-zinc-950 font-semibold">client_benchmarks</td>
          <td class="p-3">124,500</td>
          <td class="p-3 text-emerald-700 font-bold">1.2ms</td>
          <td class="p-3"><span class="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold">SUCCESS</span></td>
        </tr>
        <tr>
          <td class="p-3 text-orange-600 font-bold">#QX-8922</td>
          <td class="p-3 text-zinc-950 font-semibold">vector_embeddings</td>
          <td class="p-3">85,200</td>
          <td class="p-3 text-emerald-700 font-bold">0.8ms</td>
          <td class="p-3"><span class="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold">SUCCESS</span></td>
        </tr>
      </tbody>
    </table>
  </div>
</div>`,
  },
];

export const ScreenshotToCodeWorkbench: React.FC = () => {
  const [imageSrc, setImageSrc] = useState<string | null>(SAMPLE_MOCKUPS[0].imgUrl);
  const [targetStack, setTargetStack] = useState<'html-tailwind' | 'react-tailwind' | 'vue-tailwind' | 'bootstrap'>('html-tailwind');
  const [provider, setProvider] = useState<VisionProvider>('webgpu');
  const [selectedModel, setSelectedModel] = useState<string>('moondream2');
  const [availableModels, setAvailableModels] = useState<ModelOption[]>([
    { id: 'moondream2', label: 'Moondream 2 Vision (248MB)' },
    { id: 'smolvlm-256m', label: 'SmolVLM-256M (285MB)' },
  ]);
  const [isLoadingModels, setIsLoadingModels] = useState<boolean>(false);

  const [customBaseUrl, setCustomBaseUrl] = useState<string>(() => localStorage.getItem('bwb_custom_base_url') || 'http://localhost:1234/v1');
  const [customModelName, setCustomModelName] = useState<string>(() => localStorage.getItem('bwb_custom_model_name') || 'default');
  const [ollamaEndpoint, setOllamaEndpoint] = useState<string>(() => localStorage.getItem('bwb_ollama_endpoint') || 'http://localhost:11434');

  // WebLLM Model Downloader states
  const [showWebLlmModal, setShowWebLlmModal] = useState<boolean>(false);
  const [modelStates, setModelStates] = useState<Record<string, ModelDownloadState>>(() => {
    const initial: Record<string, ModelDownloadState> = {};
    WEBLMM_MODELS.forEach((m) => {
      initial[m.id] = {
        status: isModelCached(m.id) ? 'cached' : 'idle',
        progressPercent: isModelCached(m.id) ? 100 : 0,
        downloadedMB: isModelCached(m.id) ? m.sizeMB : 0,
      };
    });
    return initial;
  });

  // Provider Keys stored exclusively in local browser cache (localStorage)
  const [apiKeys, setApiKeys] = useState<{ [key in VisionProvider]?: string }>(() => {
    return {
      gemini: localStorage.getItem('bwb_gemini_key') || '',
      openai: localStorage.getItem('bwb_openai_key') || '',
      anthropic: localStorage.getItem('bwb_anthropic_key') || '',
      groq: localStorage.getItem('bwb_groq_key') || '',
      mistral: localStorage.getItem('bwb_mistral_key') || '',
      together: localStorage.getItem('bwb_together_key') || '',
      openrouter: localStorage.getItem('bwb_openrouter_key') || '',
      custom: localStorage.getItem('bwb_custom_key') || '',
      webgpu: '',
      ollama: '',
    };
  });

  const [showKeyModal, setShowKeyModal] = useState<boolean>(false);
  const [customPrompt, setCustomPrompt] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [generationError, setGenerationError] = useState<string | null>(null);
  const [generatedCode, setGeneratedCode] = useState<string>(SAMPLE_MOCKUPS[0].sampleCode);
  const [viewMode, setViewMode] = useState<'preview' | 'code' | 'split'>('split');
  const [copied, setCopied] = useState<boolean>(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const activeApiKey = apiKeys[provider] || '';
  const isZeroKeyProvider = provider === 'webgpu' || provider === 'ollama';
  const gpuStatus = checkWebGpuSupport();

  useEffect(() => {
    let isCancelled = false;

    async function loadModels() {
      setIsLoadingModels(true);
      try {
        const fetched = await fetchAvailableModels(provider, activeApiKey, customBaseUrl, ollamaEndpoint);
        if (!isCancelled) {
          setAvailableModels(fetched);
          if (fetched.length > 0) {
            const exists = fetched.some((m) => m.id === selectedModel);
            if (!exists) {
              setSelectedModel(fetched[0].id);
            }
          }
        }
      } catch (err) {
        console.error('Failed to load models dynamically:', err);
      } finally {
        if (!isCancelled) setIsLoadingModels(false);
      }
    }

    loadModels();

    return () => {
      isCancelled = true;
    };
  }, [provider, activeApiKey, customBaseUrl, ollamaEndpoint]);

  const handleProviderChange = (newProvider: VisionProvider) => {
    sound.click();
    setProvider(newProvider);
    setGenerationError(null);
  };

  const handleImageFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      if (typeof e.target?.result === 'string') {
        setImageSrc(e.target.result);
        setGenerationError(null);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleImageFile(e.target.files[0]);
    }
  };

  const getBase64Image = async (): Promise<string> => {
    if (!imageSrc) throw new Error('No image loaded.');
    if (imageSrc.startsWith('data:image/')) return imageSrc;

    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Canvas context not available'));
          return;
        }
        ctx.drawImage(img, 0, 0);
        resolve(canvas.toDataURL('image/png'));
      };
      img.onerror = () => reject(new Error('Could not load image. Please upload a local image file.'));
      img.src = imageSrc;
    });
  };

  const handleDownloadWebLlmModel = async (model: WebLlmModelSpec) => {
    await downloadAndCacheWebLlmModel(model.id, (state) => {
      setModelStates((prev) => ({ ...prev, [model.id]: state }));
    });
  };

  const handleDeleteWebLlmModel = (modelId: string) => {
    sound.pop();
    deleteCachedModel(modelId);
    setModelStates((prev) => ({
      ...prev,
      [modelId]: { status: 'idle', progressPercent: 0, downloadedMB: 0 },
    }));
  };

  const handleGenerate = async () => {
    if (!isZeroKeyProvider && !activeApiKey.trim() && provider !== 'custom') {
      sound.click();
      setShowKeyModal(true);
      return;
    }

    if (provider === 'webgpu' && modelStates[selectedModel]?.status !== 'cached') {
      const spec = WEBLMM_MODELS.find((m) => m.id === selectedModel) || WEBLMM_MODELS[0];
      await handleDownloadWebLlmModel(spec);
    }

    sound.launch();
    setIsGenerating(true);
    setGenerationError(null);

    try {
      const base64Data = await getBase64Image();

      const code = await generateCodeFromScreenshot({
        provider,
        apiKey: activeApiKey,
        imageBase64: base64Data,
        targetStack,
        customPrompt,
        selectedModel,
        customBaseUrl,
        customModelName,
        ollamaEndpoint,
      });

      if (code) {
        setGeneratedCode(code);
        sound.pop();
      } else {
        throw new Error('Model returned an empty response.');
      }
    } catch (err: any) {
      console.error('Vision Generation Error:', err);
      setGenerationError(err.message || 'Failed to synthesize code from screenshot.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSaveKey = (p: VisionProvider, val: string) => {
    setApiKeys((prev) => ({ ...prev, [p]: val }));
    localStorage.setItem(`bwb_${p}_key`, val.trim());
  };

  const handleClearAllKeys = () => {
    (['gemini', 'openai', 'anthropic', 'groq', 'mistral', 'together', 'openrouter', 'custom'] as VisionProvider[]).forEach((p) => {
      localStorage.removeItem(`bwb_${p}_key`);
    });
    setApiKeys({
      gemini: '',
      openai: '',
      anthropic: '',
      groq: '',
      mistral: '',
      together: '',
      openrouter: '',
      custom: '',
      webgpu: '',
      ollama: '',
    });
    setShowKeyModal(false);
  };

  const handleCopy = () => {
    sound.click();
    navigator.clipboard.writeText(generatedCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex h-full w-full flex-col bg-[#fafafa] text-zinc-900 overflow-hidden font-sans">
      {/* Top Header / Sub-Nav */}
      <div className="shrink-0 flex items-center justify-between border-b border-zinc-200/80 bg-white px-6 py-3.5 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-zinc-200 bg-zinc-100 text-zinc-950 shadow-2xs">
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-zinc-950 flex items-center gap-2">
              <span>Screenshot to Code Studio</span>
              <span className="rounded bg-zinc-100 border border-zinc-200 px-1.5 py-0.2 text-[10px] font-mono font-bold text-zinc-800">
                Visual AI Compiler
              </span>
            </h2>
            <p className="text-[11px] text-zinc-500 font-normal">
              Convert screenshots, mockups & design wireframes into clean, production-ready code with live preview.
            </p>
          </div>
        </div>
      </div>

      {/* Top Configuration Toolbar */}
      <div className="border-b border-zinc-200 bg-white p-4 shadow-2xs">
        <div className="flex flex-wrap items-center justify-between gap-3">
          {/* Left Controls: Stack, Provider, Dynamic Fetched Model & Key Status */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Framework Target */}
            <select
              value={targetStack}
              onChange={(e) => {
                sound.click();
                setTargetStack(e.target.value as any);
              }}
              className="rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2 text-xs font-mono font-bold text-zinc-900 focus:border-zinc-950 focus:outline-none shadow-sm"
            >
              <option value="html-tailwind">HTML + Tailwind CSS</option>
              <option value="react-tailwind">React + Tailwind</option>
              <option value="vue-tailwind">Vue 3 + Tailwind</option>
              <option value="bootstrap">Bootstrap 5</option>
            </select>

            {/* Provider Selector */}
            <select
              value={provider}
              onChange={(e) => handleProviderChange(e.target.value as VisionProvider)}
              className="rounded-xl border border-zinc-200 bg-zinc-100 px-3 py-2 text-xs font-mono text-zinc-900 focus:border-zinc-950 focus:outline-none font-bold shadow-sm"
            >
              <optgroup label="🌟 Zero-Key & On-Device Models">
                <option value="webgpu">Small WebLLM (In-Browser WebGPU)</option>
                <option value="ollama">Local Ollama (localhost:11434)</option>
              </optgroup>
              <optgroup label="⚡ Cloud Vision AI Providers">
                <option value="gemini">Google Gemini</option>
                <option value="groq">Groq Vision</option>
                <option value="openai">OpenAI (GPT-4o)</option>
                <option value="anthropic">Anthropic (Claude 3.5)</option>
                <option value="mistral">Mistral AI (Pixtral)</option>
                <option value="together">Together AI</option>
                <option value="openrouter">OpenRouter</option>
                <option value="custom">Custom Endpoint (LM Studio / vLLM)</option>
              </optgroup>
            </select>

            {/* Dynamic Model Sub-Selector */}
            <div className="relative flex items-center">
              <select
                value={selectedModel}
                disabled={isLoadingModels}
                onChange={(e) => {
                  sound.click();
                  setSelectedModel(e.target.value);
                }}
                className="rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2 text-xs font-mono text-zinc-800 focus:border-zinc-950 focus:outline-none max-w-[220px] truncate shadow-sm font-semibold"
              >
                {availableModels.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.label}
                  </option>
                ))}
              </select>

              {isLoadingModels && (
                <div className="absolute right-2 pointer-events-none">
                  <Loader2 className="h-3.5 w-3.5 animate-spin text-zinc-900" />
                </div>
              )}
            </div>

            {/* WebGPU Model Manager / Cloud Key Configure Button */}
            {provider === 'webgpu' ? (
              <button
                onClick={() => {
                  sound.click();
                  setShowWebLlmModal(true);
                }}
                className="flex items-center gap-1.5 rounded-xl border border-zinc-200 bg-zinc-100 px-3 py-2 text-xs font-bold text-zinc-800 hover:bg-zinc-200 transition shadow-sm"
                title="Manage In-Browser WebGPU Downloaded Models"
              >
                <HardDrive className="h-3.5 w-3.5 text-zinc-900" />
                <span>
                  {modelStates[selectedModel]?.status === 'cached'
                    ? 'Model Cached & Ready'
                    : 'Download / Manage Models'}
                </span>
              </button>
            ) : (
              <button
                onClick={() => {
                  sound.click();
                  setShowKeyModal(true);
                }}
                className={`flex items-center gap-1.5 rounded-xl border px-3 py-2 text-xs font-bold transition shadow-sm ${
                  isZeroKeyProvider
                    ? 'border-zinc-200 bg-zinc-100 text-zinc-800'
                    : activeApiKey
                    ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
                    : 'border-amber-200 bg-amber-50 text-amber-800 animate-pulse'
                }`}
                title="Manage API Keys & Endpoints (Stored 100% in local browser cache)"
              >
                {isZeroKeyProvider ? <Cpu className="h-3.5 w-3.5" /> : <Key className="h-3.5 w-3.5" />}
                <span>
                  {provider === 'ollama'
                    ? 'Ollama (Local)'
                    : activeApiKey
                    ? `${provider.toUpperCase()} Active`
                    : `Enter ${provider.toUpperCase()} Key`}
                </span>
              </button>
            )}
          </div>

          {/* Right: View Mode & Generate Action */}
          <div className="flex items-center gap-2">
            <div className="flex items-center rounded-xl border border-zinc-200 bg-zinc-50 p-0.5 text-xs shadow-sm">
              <button
                onClick={() => {
                  sound.toggle();
                  setViewMode('split');
                }}
                className={`rounded-lg px-2.5 py-1 font-bold transition ${
                  viewMode === 'split' ? 'bg-zinc-900 text-white shadow-sm' : 'text-zinc-600 hover:text-zinc-950'
                }`}
              >
                Split
              </button>
              <button
                onClick={() => {
                  sound.toggle();
                  setViewMode('preview');
                }}
                className={`rounded-lg px-2.5 py-1 font-bold transition ${
                  viewMode === 'preview' ? 'bg-zinc-900 text-white shadow-sm' : 'text-zinc-600 hover:text-zinc-950'
                }`}
              >
                Preview
              </button>
              <button
                onClick={() => {
                  sound.toggle();
                  setViewMode('code');
                }}
                className={`rounded-lg px-2.5 py-1 font-bold transition ${
                  viewMode === 'code' ? 'bg-zinc-900 text-white shadow-sm' : 'text-zinc-600 hover:text-zinc-950'
                }`}
              >
                Code
              </button>
            </div>

            <button
              onClick={handleGenerate}
              disabled={isGenerating}
              className="flex items-center gap-2 rounded-xl bg-zinc-900 px-5 py-2 text-xs font-bold text-white shadow-sm hover:bg-zinc-800 active:scale-[0.98] transition-all disabled:opacity-50"
            >
              {isGenerating ? (
                <RotateCcw className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <Sparkles className="h-3.5 w-3.5" />
              )}
              <span>{isGenerating ? 'Synthesizing UI...' : 'Generate Code'}</span>
            </button>
          </div>
        </div>

        {/* Real-time Error Notification Bar */}
        {generationError && (
          <div className="mt-3 flex items-center justify-between rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs text-rose-800 shadow-sm animate-in fade-in duration-200">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-4 w-4 shrink-0 text-rose-600" />
              <span className="font-medium">{generationError}</span>
            </div>
            <button
              onClick={() => {
                sound.click();
                setShowKeyModal(true);
              }}
              className="rounded-lg bg-white border border-rose-200 px-2.5 py-1 text-[11px] font-bold text-rose-700 hover:bg-rose-100 font-mono shadow-2xs"
            >
              Check Settings
            </button>
          </div>
        )}
      </div>

      {/* Main Studio Area */}
      <div className="flex flex-1 flex-col lg:flex-row divide-y lg:divide-y-0 lg:divide-x divide-zinc-200 overflow-hidden bg-white">
        {/* Left Column: Image Dropzone & Sample Mockups */}
        <div className="w-full lg:w-80 flex flex-col overflow-y-auto bg-zinc-50/40 p-4 space-y-4">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider font-mono text-zinc-500">
                Input Mockup / Screenshot
              </span>
              {imageSrc && (
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="text-[11px] text-orange-600 hover:underline font-semibold"
                >
                  Change Image
                </button>
              )}
            </div>

            <div
              onClick={() => fileInputRef.current?.click()}
              className="mt-2 flex min-h-[160px] cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-zinc-300 bg-white p-3 text-center hover:border-orange-500 hover:bg-orange-50/20 transition overflow-hidden shadow-sm"
            >
              {imageSrc ? (
                <img
                  src={imageSrc}
                  alt="Target Mockup"
                  className="max-h-40 w-full rounded-xl object-contain shadow-sm"
                />
              ) : (
                <>
                  <Upload className="h-6 w-6 text-orange-600" />
                  <span className="mt-2 text-xs font-bold text-zinc-800">
                    Click or Drag Screenshot Here
                  </span>
                  <span className="text-[10px] text-zinc-400 font-mono">PNG, JPG, WEBP</span>
                </>
              )}
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
          </div>

          {/* Optional Refinement Prompt */}
          <div className="space-y-1">
            <span className="text-xs font-bold uppercase tracking-wider font-mono text-zinc-500">
              Refinement Prompt (Optional)
            </span>
            <input
              type="text"
              value={customPrompt}
              onChange={(e) => setCustomPrompt(e.target.value)}
              placeholder="e.g. Make clean white theme, add smooth transitions..."
              className="w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-xs text-zinc-900 placeholder-zinc-400 focus:border-orange-500 focus:outline-none shadow-sm"
            />
          </div>

          {/* Quick Preset Samples */}
          <div className="space-y-2 pt-2 border-t border-zinc-200">
            <span className="text-xs font-bold uppercase tracking-wider font-mono text-zinc-500">
              Sample UI Designs
            </span>
            <div className="space-y-2">
              {SAMPLE_MOCKUPS.map((sample, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    sound.click();
                    setImageSrc(sample.imgUrl);
                    setGeneratedCode(sample.sampleCode);
                    setGenerationError(null);
                  }}
                  className="flex w-full items-center justify-between rounded-xl border border-zinc-200 bg-white p-2.5 text-left text-xs hover:border-orange-300 hover:bg-orange-50/40 transition shadow-sm"
                >
                  <div>
                    <div className="font-bold text-zinc-900">{sample.name}</div>
                    <div className="text-[10px] text-zinc-400 font-mono font-medium">{sample.category}</div>
                  </div>
                  <ChevronRight className="h-4 w-4 text-zinc-400" />
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Center/Right: Code Editor & Live Rendered Preview */}
        <div className="flex-1 flex flex-col lg:flex-row divide-y lg:divide-y-0 lg:divide-x divide-zinc-200 overflow-hidden bg-white">
          {/* Code Viewer Panel */}
          {(viewMode === 'code' || viewMode === 'split') && (
            <div className="flex flex-1 flex-col overflow-hidden bg-white">
              <div className="flex items-center justify-between border-b border-zinc-200 bg-zinc-50/80 px-4 py-2 text-xs font-mono text-zinc-600">
                <div className="flex items-center gap-2">
                  <Code2 className="h-3.5 w-3.5 text-orange-600" />
                  <span className="font-bold text-zinc-950">Generated Code</span>
                  <span className="rounded bg-orange-50 border border-orange-200 px-1.5 py-0.2 text-[10px] text-orange-800 font-bold">
                    {targetStack}
                  </span>
                  <span className="text-[10px] text-zinc-400 font-medium">
                    via {provider.toUpperCase()} ({selectedModel})
                  </span>
                </div>
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-1 text-[11px] font-bold text-zinc-700 hover:text-zinc-950 px-2 py-0.5 rounded hover:bg-zinc-100 transition-colors"
                >
                  {copied ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
                  <span>{copied ? 'Copied' : 'Copy'}</span>
                </button>
              </div>

              <textarea
                value={generatedCode}
                onChange={(e) => setGeneratedCode(e.target.value)}
                className="w-full flex-1 resize-none bg-white p-4 font-mono text-xs leading-relaxed text-zinc-800 focus:outline-none selection:bg-orange-100"
                spellCheck={false}
              />
            </div>
          )}

          {/* Live Rendered Preview Panel */}
          {(viewMode === 'preview' || viewMode === 'split') && (
            <div className="flex flex-1 flex-col overflow-hidden bg-[#fafafa]">
              <div className="flex items-center justify-between border-b border-zinc-200 bg-zinc-50/80 px-4 py-2 text-xs font-mono text-zinc-600">
                <div className="flex items-center gap-2">
                  <Eye className="h-3.5 w-3.5 text-emerald-600" />
                  <span className="font-bold text-zinc-950">Live Rendered Preview</span>
                </div>
                <span className="text-[10px] text-zinc-400 font-medium">Interactive DOM Sandbox</span>
              </div>

              <div className="flex-1 overflow-auto bg-white relative">
                {isGenerating && (
                  <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-white/90 backdrop-blur-sm p-6 text-center">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-50 text-orange-600 border border-orange-200 shadow-sm animate-spin">
                      <RefreshCw className="h-7 w-7" />
                    </div>
                    <p className="mt-4 text-sm font-bold text-zinc-950 font-mono">
                      Running {provider.toUpperCase()} Vision Inference ({selectedModel})...
                    </p>
                    <p className="mt-1 text-xs text-zinc-500 max-w-sm">
                      Analyzing pixel canvas geometry, font hierarchy, and color tokens into responsive {targetStack}
                    </p>
                  </div>
                )}

                <iframe
                  title="Rendered Mockup Preview"
                  srcDoc={`<!DOCTYPE html><html><head><script src="https://cdn.tailwindcss.com"></script></head><body class="bg-[#fafafa] text-zinc-900 min-h-screen p-4">${generatedCode}</body></html>`}
                  className="h-full w-full border-0 bg-white"
                  sandbox="allow-scripts"
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* WebLLM On-Device Model Downloader Modal */}
      {showWebLlmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-md animate-in fade-in duration-150">
          <div className="w-full max-w-2xl rounded-3xl border border-zinc-200 bg-white p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-50 text-orange-600 border border-orange-200 shadow-sm">
                  <HardDrive className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-zinc-950">
                    Small WebLLM Models (100% In-Browser WebGPU)
                  </h3>
                  <p className="text-[11px] text-emerald-700 font-mono font-semibold">
                    Zero API Keys • Offline Ready • Cached in Local Storage
                  </p>
                </div>
              </div>

              <button
                onClick={() => {
                  sound.click();
                  setShowWebLlmModal(false);
                }}
                className="rounded-xl p-2 text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100 transition-colors"
              >
                ✕
              </button>
            </div>

            <div className="flex items-center justify-between rounded-2xl border border-zinc-200 bg-zinc-50 p-3 text-xs">
              <span className="text-zinc-600 font-mono font-bold">Hardware Status:</span>
              <span className={`font-mono text-xs font-bold ${gpuStatus.supported ? 'text-emerald-700' : 'text-amber-700'}`}>
                ● {gpuStatus.details}
              </span>
            </div>

            <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
              {WEBLMM_MODELS.map((model) => {
                const state = modelStates[model.id] || { status: 'idle', progressPercent: 0, downloadedMB: 0 };
                const isDownloaded = state.status === 'cached' || state.status === 'ready';
                const isDownloading = state.status === 'downloading' || state.status === 'loading';

                return (
                  <div
                    key={model.id}
                    className="rounded-2xl border border-zinc-200 bg-zinc-50/50 p-4 space-y-3 hover:border-zinc-300 transition"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-zinc-950 text-sm">{model.name}</span>
                          <span className="rounded-full bg-orange-50 border border-orange-200 px-2 py-0.5 text-[10px] font-mono text-orange-700 font-bold">
                            {model.tag}
                          </span>
                          <span className="text-[11px] font-mono text-zinc-500 font-medium">
                            {model.sizeMB} MB
                          </span>
                        </div>
                        <p className="text-xs text-zinc-600 mt-1">{model.description}</p>
                      </div>

                      <div className="flex items-center gap-2">
                        {isDownloaded ? (
                          <div className="flex items-center gap-2">
                            <span className="inline-flex items-center gap-1 text-xs text-emerald-700 font-mono font-bold">
                              <CheckCircle2 className="h-3.5 w-3.5" />
                              Cached
                            </span>
                            <button
                              onClick={() => handleDeleteWebLlmModel(model.id)}
                              className="rounded-xl p-1.5 text-zinc-400 hover:text-rose-600 hover:bg-rose-50 transition"
                              title="Delete from browser cache"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => handleDownloadWebLlmModel(model)}
                            disabled={isDownloading}
                            className="flex items-center gap-1.5 rounded-xl bg-orange-600 px-3.5 py-1.5 text-xs font-bold text-white hover:bg-orange-500 transition shadow-sm disabled:opacity-50"
                          >
                            <Download className="h-3.5 w-3.5" />
                            <span>{isDownloading ? 'Downloading...' : `Download (${model.sizeMB}MB)`}</span>
                          </button>
                        )}
                      </div>
                    </div>

                    {isDownloading && (
                      <div className="space-y-1.5 pt-1">
                        <div className="flex justify-between text-[11px] font-mono text-zinc-500">
                          <span>Downloading weights into CacheStorage...</span>
                          <span>{state.downloadedMB}MB / {model.sizeMB}MB ({state.progressPercent}%)</span>
                        </div>
                        <div className="h-2 w-full rounded-full bg-zinc-200 overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-orange-500 to-emerald-500 transition-all duration-300"
                            style={{ width: `${state.progressPercent}%` }}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="flex justify-end pt-3 border-t border-zinc-200">
              <button
                onClick={() => {
                  sound.click();
                  setShowWebLlmModal(false);
                }}
                className="rounded-xl bg-orange-600 px-5 py-2 text-xs font-bold text-white hover:bg-orange-500 shadow-sm transition-all"
              >
                Close Manager
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Cloud API Key Configuration Modal */}
      {showKeyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-md animate-in fade-in duration-150">
          <div className="w-full max-w-xl rounded-3xl border border-zinc-200 bg-white p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-50 text-orange-600 border border-orange-200 shadow-sm">
                  <Lock className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-zinc-950">
                    Configure Vision API Keys & Endpoints
                  </h3>
                  <p className="text-[11px] text-emerald-700 font-mono font-semibold">
                    100% Browser Cache Only • Zero Server/DB
                  </p>
                </div>
              </div>

              <button
                onClick={() => {
                  sound.click();
                  setShowKeyModal(false);
                }}
                className="rounded-xl p-2 text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100 transition-colors"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-zinc-600 leading-relaxed">
              API keys are saved <strong>only inside your browser's local cache</strong>. When you enter a key, models are dynamically queried directly from the provider API in real-time.
            </p>

            <div className="space-y-3.5 max-h-80 overflow-y-auto pr-1">
              {/* Google Gemini */}
              <div>
                <label className="text-xs font-bold text-zinc-700 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
                    Google Gemini API Key
                  </span>
                  <span className="text-[10px] font-mono text-zinc-400">generativelanguage.googleapis.com</span>
                </label>
                <input
                  type="password"
                  value={apiKeys.gemini || ''}
                  onChange={(e) => handleSaveKey('gemini', e.target.value)}
                  placeholder="AIzaSy..."
                  className="mt-1 w-full rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2 text-xs font-mono text-zinc-900 placeholder-zinc-400 focus:border-orange-500 focus:bg-white focus:outline-none shadow-sm"
                />
              </div>

              {/* Groq */}
              <div>
                <label className="text-xs font-bold text-zinc-700 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-orange-500"></span>
                    Groq API Key (Llama 3.2 Vision)
                  </span>
                  <span className="text-[10px] font-mono text-zinc-400">api.groq.com</span>
                </label>
                <input
                  type="password"
                  value={apiKeys.groq || ''}
                  onChange={(e) => handleSaveKey('groq', e.target.value)}
                  placeholder="gsk_..."
                  className="mt-1 w-full rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2 text-xs font-mono text-zinc-900 placeholder-zinc-400 focus:border-orange-500 focus:bg-white focus:outline-none shadow-sm"
                />
              </div>

              {/* OpenAI */}
              <div>
                <label className="text-xs font-bold text-zinc-700 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
                    OpenAI API Key (GPT-4o)
                  </span>
                  <span className="text-[10px] font-mono text-zinc-400">api.openai.com</span>
                </label>
                <input
                  type="password"
                  value={apiKeys.openai || ''}
                  onChange={(e) => handleSaveKey('openai', e.target.value)}
                  placeholder="sk-proj-..."
                  className="mt-1 w-full rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2 text-xs font-mono text-zinc-900 placeholder-zinc-400 focus:border-orange-500 focus:bg-white focus:outline-none shadow-sm"
                />
              </div>

              {/* Anthropic */}
              <div>
                <label className="text-xs font-bold text-zinc-700 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-purple-500"></span>
                    Anthropic API Key (Claude 3.5 Sonnet)
                  </span>
                  <span className="text-[10px] font-mono text-zinc-400">api.anthropic.com</span>
                </label>
                <input
                  type="password"
                  value={apiKeys.anthropic || ''}
                  onChange={(e) => handleSaveKey('anthropic', e.target.value)}
                  placeholder="sk-ant-..."
                  className="mt-1 w-full rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2 text-xs font-mono text-zinc-900 placeholder-zinc-400 focus:border-orange-500 focus:bg-white focus:outline-none shadow-sm"
                />
              </div>

              {/* Mistral AI */}
              <div>
                <label className="text-xs font-bold text-zinc-700 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-amber-500"></span>
                    Mistral AI API Key (Pixtral 12B)
                  </span>
                  <span className="text-[10px] font-mono text-zinc-400">api.mistral.ai</span>
                </label>
                <input
                  type="password"
                  value={apiKeys.mistral || ''}
                  onChange={(e) => handleSaveKey('mistral', e.target.value)}
                  placeholder="mistral-..."
                  className="mt-1 w-full rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2 text-xs font-mono text-zinc-900 placeholder-zinc-400 focus:border-orange-500 focus:bg-white focus:outline-none shadow-sm"
                />
              </div>

              {/* Together AI */}
              <div>
                <label className="text-xs font-bold text-zinc-700 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-blue-500"></span>
                    Together AI API Key (Llama / Qwen-VL)
                  </span>
                  <span className="text-[10px] font-mono text-zinc-400">api.together.xyz</span>
                </label>
                <input
                  type="password"
                  value={apiKeys.together || ''}
                  onChange={(e) => handleSaveKey('together', e.target.value)}
                  placeholder="together-..."
                  className="mt-1 w-full rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2 text-xs font-mono text-zinc-900 placeholder-zinc-400 focus:border-orange-500 focus:bg-white focus:outline-none shadow-sm"
                />
              </div>

              {/* OpenRouter */}
              <div>
                <label className="text-xs font-bold text-zinc-700 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-indigo-500"></span>
                    OpenRouter API Key
                  </span>
                  <span className="text-[10px] font-mono text-zinc-400">openrouter.ai</span>
                </label>
                <input
                  type="password"
                  value={apiKeys.openrouter || ''}
                  onChange={(e) => handleSaveKey('openrouter', e.target.value)}
                  placeholder="sk-or-v1-..."
                  className="mt-1 w-full rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2 text-xs font-mono text-zinc-900 placeholder-zinc-400 focus:border-orange-500 focus:bg-white focus:outline-none shadow-sm"
                />
              </div>

              {/* Custom OpenAI-Compatible Base URL */}
              <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-3.5 space-y-2">
                <div className="text-xs font-bold text-zinc-900 flex items-center gap-1.5">
                  <Server className="h-3.5 w-3.5 text-orange-600" />
                  <span>Custom OpenAI-Compatible Endpoint (LM Studio / vLLM)</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[10px] font-mono text-zinc-500 font-bold">Base URL</label>
                    <input
                      type="text"
                      value={customBaseUrl}
                      onChange={(e) => {
                        setCustomBaseUrl(e.target.value);
                        localStorage.setItem('bwb_custom_base_url', e.target.value);
                      }}
                      placeholder="http://localhost:1234/v1"
                      className="mt-0.5 w-full rounded-xl border border-zinc-200 bg-white px-2.5 py-1.5 text-xs font-mono text-zinc-900 placeholder-zinc-400 focus:outline-none shadow-sm"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-mono text-zinc-500 font-bold">Model Name</label>
                    <input
                      type="text"
                      value={customModelName}
                      onChange={(e) => {
                        setCustomModelName(e.target.value);
                        localStorage.setItem('bwb_custom_model_name', e.target.value);
                      }}
                      placeholder="default"
                      className="mt-0.5 w-full rounded-xl border border-zinc-200 bg-white px-2.5 py-1.5 text-xs font-mono text-zinc-900 placeholder-zinc-400 focus:outline-none shadow-sm"
                    />
                  </div>
                </div>
              </div>

              {/* Ollama Endpoint */}
              <div>
                <label className="text-xs font-bold text-zinc-700 flex items-center justify-between">
                  <span>Local Ollama Endpoint (Zero Key Required)</span>
                  <span className="text-[10px] font-mono text-zinc-400">localhost:11434</span>
                </label>
                <input
                  type="text"
                  value={ollamaEndpoint}
                  onChange={(e) => {
                    setOllamaEndpoint(e.target.value);
                    localStorage.setItem('bwb_ollama_endpoint', e.target.value);
                  }}
                  placeholder="http://localhost:11434"
                  className="mt-1 w-full rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2 text-xs font-mono text-zinc-900 placeholder-zinc-400 focus:border-orange-500 focus:bg-white focus:outline-none shadow-sm"
                />
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-zinc-200">
              <button
                onClick={() => {
                  sound.pop();
                  handleClearAllKeys();
                }}
                className="flex items-center gap-1.5 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-xs font-bold text-rose-700 hover:bg-rose-100 transition shadow-2xs"
              >
                <Trash2 className="h-3.5 w-3.5" />
                <span>Wipe All Keys from Browser</span>
              </button>

              <button
                onClick={() => {
                  sound.click();
                  setShowKeyModal(false);
                }}
                className="rounded-xl bg-orange-600 px-5 py-2 text-xs font-bold text-white hover:bg-orange-500 shadow-sm transition-all"
              >
                Save & Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
