import React, { useState, useRef, useEffect } from 'react';
import {
  Bot,
  Send,
  Settings2,
  Trash2,
  Copy,
  Check,
  Sliders,
  Loader2,
  Key,
} from 'lucide-react';
import { sound } from '../../lib/soundFx';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  model?: string;
  tokPerSec?: number;
}

const SYSTEM_PROMPTS = [
  { label: 'General Assistant', prompt: 'You are an ultra-fast, helpful, and concise AI assistant.' },
  { label: 'Senior Software Architect', prompt: 'You are a staff engineer. Write clean, idiomatic, performant TypeScript, Rust, and Python code.' },
  { label: 'Security & Penetration Tester', prompt: 'You are a cybersecurity researcher analyzing vulnerabilities, OWASP patterns, and secure architectures.' },
  { label: 'Code Reviewer', prompt: 'Review code diffs for edge cases, memory leaks, and performance bottlenecks.' },
];

const LOCAL_MODELS = [
  { id: 'webllm-smollm2', name: 'SmolLM2 135M (In-Browser WASM)', provider: 'WebLLM', memory: '180 MB' },
  { id: 'webllm-qwen-0.5b', name: 'Qwen 2.5 0.5B Instruct (WASM)', provider: 'WebLLM', memory: '350 MB' },
  { id: 'webllm-llama-1b', name: 'Llama 3.2 1B Instruct (WebGPU)', provider: 'WebLLM', memory: '850 MB' },
  { id: 'ollama-deepseek-r1', name: 'DeepSeek-R1 (Local Ollama)', provider: 'Ollama', memory: 'Local Daemon' },
  { id: 'ollama-qwen-coder', name: 'Qwen2.5-Coder 7B (Local Ollama)', provider: 'Ollama', memory: 'Local Daemon' },
  { id: 'openai-gpt4o-mini', name: 'GPT-4o Mini (OpenAI API)', provider: 'OpenAI', memory: 'Cloud API' },
];

export const OpenWebUiWorkbench: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Welcome to Open WebUI Workbench! You can run in-browser WebLLM models with zero telemetry, connect to your local Ollama instance (`localhost:11434`), or use your custom OpenAI-compatible API keys.',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      model: 'SmolLM2 135M (In-Browser WASM)',
    },
  ]);
  const [inputPrompt, setInputPrompt] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [selectedModel, setSelectedModel] = useState<string>(LOCAL_MODELS[0].id);
  const [selectedSystemPrompt, setSelectedSystemPrompt] = useState<string>(SYSTEM_PROMPTS[0].prompt);
  const [temperature, setTemperature] = useState<number>(0.7);
  const [showSettings, setShowSettings] = useState<boolean>(false);
  const [apiKey, setApiKey] = useState<string>(() => localStorage.getItem('bwb_openwebui_key') || '');
  const [ollamaUrl, setOllamaUrl] = useState<string>('http://localhost:11434');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSaveApiKey = (key: string) => {
    setApiKey(key);
    localStorage.setItem('bwb_openwebui_key', key);
  };

  const handleSendMessage = () => {
    if (!inputPrompt.trim() || isGenerating) return;

    sound.launch();
    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: inputPrompt.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputPrompt('');
    setIsGenerating(true);

    const currentModelObj = LOCAL_MODELS.find((m) => m.id === selectedModel);
    const modelName = currentModelObj?.name || 'Local AI Engine';

    // Simulate responsive streaming token generation
    setTimeout(() => {
      let mockReply = '';
      if (userMsg.content.toLowerCase().includes('hello') || userMsg.content.toLowerCase().includes('hi')) {
        mockReply = `Hello! I'm running directly inside your client environment via **${modelName}**. All prompt data remains 100% private in browser memory.\n\nHow can I help with your code or architecture today?`;
      } else if (userMsg.content.toLowerCase().includes('code') || userMsg.content.toLowerCase().includes('sql') || userMsg.content.toLowerCase().includes('function')) {
        mockReply = `Here is the solution using idiomatic TypeScript with strict type inference:\n\n\`\`\`typescript\nexport async function processTask<T>(payload: T): Promise<{ success: boolean; data: T }> {\n  console.log('[OpenWebUI] Executing in sandbox:', payload);\n  return { success: true, data: payload };\n}\n\`\`\`\n\n- **Zero Server Latency**: Running directly in your browser/local engine.\n- **Memory Safe**: Automatic garbage collection when conversation clears.`;
      } else {
        mockReply = `Understood. Analyzing "${userMsg.content}" with temperature ${temperature}.\n\n1. **Core Architecture**: Designed for modularity, zero-telemetry, and sub-second inference.\n2. **Security & Privacy**: No logs are transmitted to external servers without explicit API routing.\n3. **Recommendation**: You can configure custom system prompts in the parameters panel.`;
      }

      const assistantMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: mockReply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        model: modelName,
        tokPerSec: Math.round((28 + Math.random() * 15) * 10) / 10,
      };

      setMessages((prev) => [...prev, assistantMsg]);
      setIsGenerating(false);
      sound.pop();
    }, 1200);
  };

  const handleCopyMessage = (id: string, text: string) => {
    sound.click();
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleClearChat = () => {
    sound.pop();
    setMessages([]);
  };

  return (
    <div className="flex flex-col h-full w-full bg-[#fafafa] text-zinc-900 overflow-hidden font-sans">
      {/* Top Header */}
      <div className="shrink-0 flex items-center justify-between border-b border-zinc-200/80 bg-white px-6 py-3.5 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-orange-200 bg-orange-50 text-orange-600 shadow-sm">
            <Bot className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-zinc-950 flex items-center gap-2">
              <span>Open WebUI AI Studio</span>
              <span className="rounded bg-orange-50 border border-orange-200 px-1.5 py-0.2 text-[10px] font-mono font-bold text-orange-700">
                Ollama • WebLLM • OpenAI
              </span>
            </h2>
            <p className="text-[11px] text-zinc-500 font-normal">
              Offline-ready AI workspace with local model inference and custom API endpoints.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs font-semibold">
          {/* Model Picker Pill */}
          <select
            value={selectedModel}
            onChange={(e) => {
              sound.toggle();
              setSelectedModel(e.target.value);
            }}
            className="rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-1.5 text-xs font-mono text-zinc-800 focus:border-orange-500 focus:outline-none shadow-sm"
          >
            {LOCAL_MODELS.map((m) => (
              <option key={m.id} value={m.id}>
                {m.name}
              </option>
            ))}
          </select>

          <button
            onClick={() => {
              sound.toggle();
              setShowSettings(!showSettings);
            }}
            className={`flex items-center gap-1.5 rounded-xl border px-3 py-1.5 transition-colors shadow-sm ${
              showSettings ? 'bg-orange-600 text-white border-orange-600 font-bold' : 'border-zinc-200 bg-zinc-50 text-zinc-700 hover:bg-zinc-100 hover:text-zinc-950'
            }`}
          >
            <Settings2 className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Settings</span>
          </button>

          <button
            onClick={handleClearChat}
            className="p-1.5 rounded-xl border border-zinc-200 bg-zinc-50 text-zinc-500 hover:text-red-600 hover:bg-red-50 hover:border-red-200 transition-colors shadow-sm"
            title="Clear Chat History"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Main Studio Body */}
      <div className="flex-1 flex overflow-hidden">
        {/* Center Chat Feed */}
        <div className="flex-1 flex flex-col justify-between overflow-hidden bg-[#fafafa]">
          {/* Message Scroll Container */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-3 max-w-3xl ${
                  msg.role === 'user' ? 'ml-auto flex-row-reverse' : 'mr-auto'
                }`}
              >
                {/* Avatar */}
                <div
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border text-xs font-bold shadow-sm ${
                    msg.role === 'user'
                      ? 'border-orange-200 bg-orange-50 text-orange-600'
                      : 'border-zinc-200 bg-white text-zinc-700'
                  }`}
                >
                  {msg.role === 'user' ? 'U' : <Bot className="h-4 w-4 text-orange-600" />}
                </div>

                {/* Message Bubble */}
                <div
                  className={`group relative rounded-2xl p-4 text-xs leading-relaxed transition-all shadow-sm ${
                    msg.role === 'user'
                      ? 'border border-orange-200 bg-orange-600 text-white'
                      : 'border border-zinc-200/90 bg-white text-zinc-800'
                  }`}
                >
                  <div className="whitespace-pre-wrap">{msg.content}</div>

                  {/* Message Footer Info */}
                  <div className={`mt-2 flex items-center justify-between gap-4 border-t pt-1.5 text-[10px] font-mono ${
                    msg.role === 'user' ? 'border-orange-500 text-orange-100' : 'border-zinc-100 text-zinc-400'
                  }`}>
                    <div className="flex items-center gap-2">
                      <span>{msg.timestamp}</span>
                      {msg.model && (
                        <>
                          <span>•</span>
                          <span className={msg.role === 'user' ? 'text-orange-200' : 'text-orange-600'}>{msg.model}</span>
                        </>
                      )}
                      {msg.tokPerSec && (
                        <>
                          <span>•</span>
                          <span className="text-emerald-600 font-bold">{msg.tokPerSec} tok/s</span>
                        </>
                      )}
                    </div>

                    <button
                      onClick={() => handleCopyMessage(msg.id, msg.content)}
                      className="opacity-0 group-hover:opacity-100 hover:scale-105 transition-all"
                      title="Copy Message"
                    >
                      {copiedId === msg.id ? (
                        <Check className="h-3 w-3 text-emerald-500" />
                      ) : (
                        <Copy className="h-3 w-3" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ))}

            {isGenerating && (
              <div className="flex gap-3 mr-auto max-w-3xl">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border border-zinc-200 bg-white text-zinc-700">
                  <Bot className="h-4 w-4 text-orange-600 animate-pulse" />
                </div>
                <div className="flex items-center gap-2 rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-xs text-zinc-600 shadow-sm">
                  <Loader2 className="h-3.5 w-3.5 animate-spin text-orange-600" />
                  <span>Generating response in local WebAssembly engine...</span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Chat Input Bar */}
          <div className="shrink-0 border-t border-zinc-200 bg-white p-4">
            <div className="max-w-4xl mx-auto flex items-center gap-2">
              <input
                type="text"
                value={inputPrompt}
                onChange={(e) => setInputPrompt(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
                placeholder="Ask anything or generate code with local AI..."
                className="flex-1 rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-xs text-zinc-900 placeholder-zinc-400 focus:border-orange-500 focus:bg-white focus:outline-none shadow-sm"
              />
              <button
                onClick={handleSendMessage}
                disabled={!inputPrompt.trim() || isGenerating}
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-orange-600 text-white shadow-sm hover:bg-orange-500 transition-all disabled:opacity-40 disabled:pointer-events-none active:scale-95"
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Right Settings & Telemetry Sidebar */}
        {showSettings && (
          <div className="w-80 shrink-0 border-l border-zinc-200 bg-white p-5 overflow-y-auto space-y-6 text-xs shadow-xl animate-in slide-in-from-right duration-200">
            <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
              <div className="flex items-center gap-2 font-bold text-zinc-900">
                <Sliders className="h-4 w-4 text-orange-600" />
                <span>Inference Parameters</span>
              </div>
              <button
                onClick={() => setShowSettings(false)}
                className="text-zinc-400 hover:text-zinc-700"
              >
                ✕
              </button>
            </div>

            {/* System Prompt Presets */}
            <div>
              <label className="block font-mono text-[11px] uppercase tracking-wider text-zinc-500 font-bold mb-2">
                System Role Preset
              </label>
              <div className="space-y-1.5">
                {SYSTEM_PROMPTS.map((sp) => (
                  <button
                    key={sp.label}
                    onClick={() => {
                      sound.toggle();
                      setSelectedSystemPrompt(sp.prompt);
                    }}
                    className={`w-full text-left rounded-xl px-3 py-2 text-[11px] font-semibold transition-all ${
                      selectedSystemPrompt === sp.prompt
                        ? 'bg-orange-600 text-white shadow-sm'
                        : 'border border-zinc-200 bg-zinc-50 text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900'
                    }`}
                  >
                    {sp.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Temperature Slider */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="font-mono text-[11px] uppercase tracking-wider text-zinc-500 font-bold">
                  Temperature
                </label>
                <span className="font-mono text-[11px] text-orange-600 font-extrabold">
                  {temperature}
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="1.5"
                step="0.1"
                value={temperature}
                onChange={(e) => setTemperature(parseFloat(e.target.value))}
                className="w-full accent-orange-600"
              />
              <div className="flex justify-between text-[10px] font-mono text-zinc-400 mt-1">
                <span>Deterministic (0.0)</span>
                <span>Creative (1.5)</span>
              </div>
            </div>

            {/* Local Ollama Endpoint */}
            <div>
              <label className="block font-mono text-[11px] uppercase tracking-wider text-zinc-500 font-bold mb-1.5">
                Local Ollama URL
              </label>
              <input
                type="text"
                value={ollamaUrl}
                onChange={(e) => setOllamaUrl(e.target.value)}
                className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2 font-mono text-[11px] text-zinc-900 focus:border-orange-500 focus:outline-none shadow-sm"
              />
            </div>

            {/* API Key (stored in browser local storage only) */}
            <div>
              <div className="flex items-center gap-1.5 mb-1.5">
                <Key className="h-3.5 w-3.5 text-emerald-600" />
                <label className="font-mono text-[11px] uppercase tracking-wider text-zinc-500 font-bold">
                  OpenAI / OpenRouter Key
                </label>
              </div>
              <input
                type="password"
                value={apiKey}
                onChange={(e) => handleSaveApiKey(e.target.value)}
                placeholder="sk-..."
                className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2 font-mono text-[11px] text-zinc-900 focus:border-orange-500 focus:outline-none shadow-sm"
              />
              <p className="mt-1 text-[10px] text-zinc-400 font-mono">
                Stored 100% in client localStorage. Never sent to backend.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
