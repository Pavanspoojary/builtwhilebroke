import React, { useState, useRef, useEffect } from 'react';
import {
  Mic,
  MicOff,
  Radio,
  Bot,
} from 'lucide-react';
import { sound } from '../../lib/soundFx';

interface TranscriptItem {
  id: string;
  sender: 'user' | 'agent';
  text: string;
  timestamp: string;
  latencyMs?: number;
}

export const LivekitAgentsWorkbench: React.FC = () => {
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [agentState, setAgentState] = useState<'idle' | 'listening' | 'thinking' | 'speaking'>('idle');
  const [sttProvider, setSttProvider] = useState<string>('Deepgram Nova-2 (Real-Time)');
  const [llmProvider, setLlmProvider] = useState<string>('Llama-3.3 70B (Groq LPU)');
  const [ttsProvider, setTtsProvider] = useState<string>('Cartesia Sonic (90ms TTS)');
  const [transcripts, setTranscripts] = useState<TranscriptItem[]>([
    {
      id: '1',
      sender: 'agent',
      text: 'LiveKit Voice Agent connected. I am listening via WebRTC audio streaming. Say something or tap Test Voice.',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      latencyMs: 180,
    },
  ]);

  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Animated Audio Frequency Waveform Canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let phase = 0;

    const render = () => {
      ctx.fillStyle = '#fafafa';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const numBars = 32;
      const barWidth = canvas.width / numBars - 2;
      const centerY = canvas.height / 2;

      phase += 0.08;

      for (let i = 0; i < numBars; i++) {
        let height = 4;
        if (isConnected && !isMuted) {
          if (agentState === 'speaking' || agentState === 'listening') {
            height = Math.sin(phase + i * 0.3) * 35 + Math.cos(phase * 1.5 + i * 0.2) * 20 + 25;
          } else {
            height = Math.sin(phase * 0.5 + i * 0.2) * 8 + 10;
          }
        }

        const x = i * (barWidth + 2);
        const y = centerY - height / 2;

        const gradient = ctx.createLinearGradient(0, y, 0, y + height);
        gradient.addColorStop(0, '#ea580c');
        gradient.addColorStop(1, '#f97316');

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.roundRect(x, y, barWidth, Math.max(height, 4), 3);
        ctx.fill();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => cancelAnimationFrame(animationFrameId);
  }, [isConnected, isMuted, agentState]);

  const handleConnect = () => {
    sound.launch();
    setIsConnected(true);
    setAgentState('listening');
  };

  const handleDisconnect = () => {
    sound.pop();
    setIsConnected(false);
    setAgentState('idle');
  };

  const handleSimulateUtterance = (text: string) => {
    sound.click();
    const userEntry: TranscriptItem = {
      id: Date.now().toString(),
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setTranscripts((prev) => [...prev, userEntry]);
    setAgentState('thinking');

    setTimeout(() => {
      sound.toggle();
      setAgentState('speaking');
      let reply = 'All WebRTC data channels are healthy with 18ms jitter buffer and 0% packet loss.';
      if (text.toLowerCase().includes('weather')) {
        reply = 'The weather in San Francisco is currently 64°F with light fog and 68% humidity.';
      }

      const agentEntry: TranscriptItem = {
        id: (Date.now() + 1).toString(),
        sender: 'agent',
        text: reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        latencyMs: Math.floor(190 + Math.random() * 60),
      };

      setTranscripts((prev) => [...prev, agentEntry]);

      setTimeout(() => {
        setAgentState('listening');
      }, 2500);
    }, 900);
  };

  return (
    <div className="flex flex-col h-full w-full bg-[#fafafa] text-zinc-900 overflow-hidden font-sans">
      {/* Top Header */}
      <div className="shrink-0 flex items-center justify-between border-b border-zinc-200/80 bg-white px-6 py-3.5 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-orange-200 bg-orange-50 text-orange-600 shadow-sm">
            <Radio className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-zinc-950 flex items-center gap-2">
              <span>LiveKit Multimodal Voice AI Playground</span>
              <span className="rounded bg-orange-50 border border-orange-200 px-1.5 py-0.2 text-[10px] font-mono font-bold text-orange-700">
                WebRTC Audio Stream
              </span>
            </h2>
            <p className="text-[11px] text-zinc-500 font-normal">
              Real-time speech-to-speech voice agent studio with sub-250ms conversational latency.
            </p>
          </div>
        </div>
      </div>

      {/* Main Voice Studio Body */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden bg-white">
        {/* Left Model Pipeline Configuration */}
        <div className="w-full lg:w-80 shrink-0 border-r border-zinc-200 bg-zinc-50/60 p-5 overflow-y-auto space-y-5 text-xs">
          <div>
            <label className="block font-mono text-[11px] uppercase tracking-wider text-zinc-500 font-bold mb-2">
              Speech-to-Text (STT) Engine
            </label>
            <select
              value={sttProvider}
              onChange={(e) => setSttProvider(e.target.value)}
              className="w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-xs font-mono text-zinc-900 focus:border-orange-500 focus:outline-none shadow-sm"
            >
              <option>Deepgram Nova-2 (Real-Time)</option>
              <option>Whisper Large-v3 Turbo (WASM)</option>
              <option>AssemblyAI Conformer-2</option>
            </select>
          </div>

          <div>
            <label className="block font-mono text-[11px] uppercase tracking-wider text-zinc-500 font-bold mb-2">
              Language Model (LLM) Reasoning
            </label>
            <select
              value={llmProvider}
              onChange={(e) => setLlmProvider(e.target.value)}
              className="w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-xs font-mono text-zinc-900 focus:border-orange-500 focus:outline-none shadow-sm"
            >
              <option>Llama-3.3 70B (Groq LPU)</option>
              <option>GPT-4o Realtime Voice API</option>
              <option>DeepSeek-V3 671B</option>
              <option>Local Ollama Daemon</option>
            </select>
          </div>

          <div>
            <label className="block font-mono text-[11px] uppercase tracking-wider text-zinc-500 font-bold mb-2">
              Text-to-Speech (TTS) Synthesizer
            </label>
            <select
              value={ttsProvider}
              onChange={(e) => setTtsProvider(e.target.value)}
              className="w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-xs font-mono text-zinc-900 focus:border-orange-500 focus:outline-none shadow-sm"
            >
              <option>Cartesia Sonic (90ms TTS)</option>
              <option>ElevenLabs Turbo v2.5</option>
              <option>OpenAI TTS-1-HD</option>
            </select>
          </div>

          {/* Sample Voice Prompts */}
          <div className="pt-3 border-t border-zinc-200">
            <label className="block font-mono text-[11px] uppercase tracking-wider text-zinc-500 font-bold mb-2">
              Quick Voice Utterances
            </label>
            <div className="space-y-1.5">
              <button
                onClick={() => handleSimulateUtterance('What is the current server status and WebRTC audio bitrate?')}
                className="w-full text-left rounded-xl border border-zinc-200 bg-white p-2.5 text-[11px] font-semibold text-zinc-700 hover:text-zinc-950 hover:bg-zinc-100 transition-all shadow-sm"
              >
                "What is current server status?"
              </button>
              <button
                onClick={() => handleSimulateUtterance('Check the weather in San Francisco today.')}
                className="w-full text-left rounded-xl border border-zinc-200 bg-white p-2.5 text-[11px] font-semibold text-zinc-700 hover:text-zinc-950 hover:bg-zinc-100 transition-all shadow-sm"
              >
                "Check the weather in SF."
              </button>
            </div>
          </div>
        </div>

        {/* Right Interactive WebRTC Room & Real-Time Transcripts */}
        <div className="flex-1 flex flex-col overflow-hidden bg-white">
          {/* Audio Waveform Canvas Box */}
          <div className="h-48 shrink-0 relative border-b border-zinc-200 bg-[#fafafa] flex flex-col items-center justify-center p-4">
            <canvas
              ref={canvasRef}
              width={600}
              height={120}
              className="w-full h-28 object-contain"
            />

            {/* State Pill */}
            <div className="absolute top-4 left-4 flex items-center gap-2 rounded-full border border-zinc-200 bg-white px-3 py-1 text-[11px] font-mono text-zinc-700 shadow-sm font-semibold">
              <span className={`h-2 w-2 rounded-full ${
                isConnected ? 'bg-emerald-500 animate-pulse' : 'bg-zinc-400'
              }`} />
              <span className="capitalize">{isConnected ? agentState : 'Disconnected'}</span>
            </div>

            {/* Main Audio Action Controls */}
            <div className="absolute bottom-4 flex items-center gap-3">
              {!isConnected ? (
                <button
                  onClick={handleConnect}
                  className="flex items-center gap-2 rounded-2xl bg-orange-600 px-6 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-orange-500 transition-all"
                >
                  <Mic className="h-4 w-4" />
                  <span>Start Voice Session</span>
                </button>
              ) : (
                <>
                  <button
                    onClick={() => {
                      sound.toggle();
                      setIsMuted(!isMuted);
                    }}
                    className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition-all shadow-sm ${
                      isMuted ? 'bg-red-50 text-red-600 border border-red-200' : 'bg-white border border-zinc-200 text-zinc-800'
                    }`}
                  >
                    {isMuted ? <MicOff className="h-3.5 w-3.5" /> : <Mic className="h-3.5 w-3.5" />}
                    <span>{isMuted ? 'Unmute' : 'Mute Mic'}</span>
                  </button>

                  <button
                    onClick={handleDisconnect}
                    className="rounded-xl border border-zinc-200 bg-white px-4 py-2 text-xs font-semibold text-zinc-600 hover:text-zinc-950 shadow-sm"
                  >
                    End Session
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Real-time Turn-Taking Transcripts */}
          <div className="flex-1 overflow-y-auto p-5 space-y-3 bg-[#fafafa]">
            <div className="font-mono text-[11px] uppercase tracking-wider text-zinc-400 font-bold mb-2">
              Live Conversational Transcript
            </div>

            {transcripts.map((t) => (
              <div
                key={t.id}
                className={`flex gap-3 max-w-2xl ${
                  t.sender === 'user' ? 'ml-auto flex-row-reverse' : 'mr-auto'
                }`}
              >
                <div
                  className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-xs font-bold shadow-sm ${
                    t.sender === 'user'
                      ? 'bg-orange-50 text-orange-600 border border-orange-200'
                      : 'bg-white text-zinc-700 border border-zinc-200'
                  }`}
                >
                  {t.sender === 'user' ? 'U' : <Bot className="h-3.5 w-3.5 text-orange-600" />}
                </div>

                <div
                  className={`rounded-2xl p-3.5 text-xs leading-relaxed shadow-sm ${
                    t.sender === 'user'
                      ? 'bg-orange-600 text-white'
                      : 'bg-white border border-zinc-200/90 text-zinc-800'
                  }`}
                >
                  <div>{t.text}</div>
                  <div className={`mt-1.5 flex items-center gap-2 font-mono text-[10px] ${
                    t.sender === 'user' ? 'text-orange-200' : 'text-zinc-400'
                  }`}>
                    <span>{t.timestamp}</span>
                    {t.latencyMs && (
                      <>
                        <span>•</span>
                        <span className={t.sender === 'user' ? 'text-white font-bold' : 'text-emerald-700 font-bold'}>{t.latencyMs} ms E2E</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
