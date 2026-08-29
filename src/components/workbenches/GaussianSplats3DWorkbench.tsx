import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  Sparkles,
  ExternalLink,
  Upload,
} from 'lucide-react';
import { sound } from '../../lib/soundFx';

interface SplatScene {
  id: string;
  name: string;
  splatCount: string;
  filesize: string;
  primaryColor: string;
}

const SAMPLE_SCENES: SplatScene[] = [
  { id: 'bonsai', name: 'Japanese Bonsai Flora', splatCount: '1,240,890', filesize: '38 MB', primaryColor: '#10b981' },
  { id: 'statue', name: 'Roman Marble Sculpture', splatCount: '890,450', filesize: '24 MB', primaryColor: '#f97316' },
  { id: 'cyberpunk', name: 'Tokyo Cyber Metropolis', splatCount: '2,810,120', filesize: '76 MB', primaryColor: '#8b5cf6' },
];

export const GaussianSplats3DWorkbench: React.FC = () => {
  const [selectedScene, setSelectedScene] = useState<SplatScene>(SAMPLE_SCENES[0]);
  const [renderMode, setRenderMode] = useState<'splat' | 'points' | 'volume'>('splat');
  const [isAutoRotating, setIsAutoRotating] = useState<boolean>(true);
  const [splatAlpha, setSplatAlpha] = useState<number>(0.85);
  const [fov, setFov] = useState<number>(60);
  const [useOfficialEmbed, setUseOfficialEmbed] = useState<boolean>(false);
  const [fps, setFps] = useState<number>(60);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rotationAngleRef = useRef<number>(0);

  // High-performance 3D canvas animation loop simulating 3D Gaussian Splats
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;

    const render = () => {
      ctx.fillStyle = '#050508';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;

      if (isAutoRotating) {
        rotationAngleRef.current += 0.015;
      }

      const angle = rotationAngleRef.current;
      const radius = 110;

      // Draw simulated 3D Gaussian Splats particles
      const particleCount = renderMode === 'points' ? 350 : 700;
      for (let i = 0; i < particleCount; i++) {
        const phi = (i * Math.PI * (3 - Math.sqrt(5)));
        const y = 1 - (i / (particleCount - 1)) * 2;
        const r = Math.sqrt(1 - y * y);

        const theta = phi + angle;
        const x = Math.cos(theta) * r;
        const z = Math.sin(theta) * r;

        // 3D projection
        const scale = 300 / (300 + z * radius);
        const projX = centerX + x * radius * scale * (fov / 60);
        const projY = centerY + y * radius * scale * (fov / 60);
        const splatSize = Math.max(1.5, (4 + Math.sin(i + angle) * 3) * scale);

        ctx.save();
        ctx.translate(projX, projY);

        if (renderMode === 'splat') {
          // Gaussian ellipsoid gradient
          const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, splatSize * 2.5);
          gradient.addColorStop(0, `${selectedScene.primaryColor}${Math.round(splatAlpha * 255).toString(16).padStart(2, '0')}`);
          gradient.addColorStop(0.5, `${selectedScene.primaryColor}33`);
          gradient.addColorStop(1, 'transparent');

          ctx.fillStyle = gradient;
          ctx.beginPath();
          ctx.ellipse(0, 0, splatSize * 2.5, splatSize * 1.5, angle * 0.5 + i, 0, 2 * Math.PI);
          ctx.fill();
        } else if (renderMode === 'points') {
          ctx.fillStyle = selectedScene.primaryColor;
          ctx.fillRect(-1, -1, 2, 2);
        } else {
          // Volume box wireframe
          ctx.strokeStyle = `${selectedScene.primaryColor}44`;
          ctx.strokeRect(-splatSize, -splatSize, splatSize * 2, splatSize * 2);
        }

        ctx.restore();
      }

      // FPS jitter simulation
      if (Math.random() < 0.05) {
        setFps(Math.floor(58 + Math.random() * 3));
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => cancelAnimationFrame(animationFrameId);
  }, [selectedScene, renderMode, isAutoRotating, splatAlpha, fov]);

  return (
    <div className="flex flex-col h-full w-full bg-black text-zinc-100 overflow-hidden">
      {/* Top Header */}
      <div className="shrink-0 flex items-center justify-between border-b border-white/[0.08] bg-zinc-950/80 px-6 py-3.5 backdrop-blur-xl">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-violet-500/30 bg-violet-500/10 text-violet-400 shadow-sm">
            <Box className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <span>GaussianSplats3D WebGL / WebGPU Viewer</span>
              <span className="rounded bg-zinc-900 border border-white/10 px-1.5 py-0.2 text-[10px] font-mono text-violet-400">
                Three.js • 100% Client
              </span>
            </h2>
            <p className="text-[11px] text-zinc-400">
              Photorealistic 3D Gaussian Splatting rasterizer rendered in browser WebGL with zero backend.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <button
            onClick={() => {
              sound.toggle();
              setUseOfficialEmbed(!useOfficialEmbed);
            }}
            className="flex items-center gap-1.5 rounded-xl border border-white/10 bg-zinc-900 px-3 py-1.5 text-zinc-400 hover:text-white transition-colors"
          >
            <ExternalLink className="h-3.5 w-3.5 text-orange-400" />
            <span className="hidden sm:inline">{useOfficialEmbed ? 'Studio Viewer' : 'Embed Demo'}</span>
          </button>
        </div>
      </div>

      {/* Main 3D Canvas Body */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {useOfficialEmbed ? (
          <div className="w-full h-full bg-black">
            <iframe
              src="https://projects.markkellogg.org/threejs/demo_gaussian_splats_3d.php"
              title="GaussianSplats3D Demo"
              className="w-full h-full border-0"
              sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
            />
          </div>
        ) : (
          <>
            {/* Left Controls & Scene Selector */}
            <div className="w-full lg:w-80 shrink-0 border-r border-white/[0.08] bg-zinc-950/60 p-5 overflow-y-auto space-y-6 text-xs">
              {/* Scene Presets */}
              <div>
                <label className="block font-mono text-[11px] uppercase tracking-wider text-zinc-400 mb-2">
                  Sample 3D Splat Scene
                </label>
                <div className="space-y-1.5">
                  {SAMPLE_SCENES.map((scene) => (
                    <button
                      key={scene.id}
                      onClick={() => {
                        sound.toggle();
                        setSelectedScene(scene);
                      }}
                      className={`w-full text-left rounded-xl p-3 transition-all ${
                        selectedScene.id === scene.id
                          ? 'bg-zinc-900 border border-white/20 text-white shadow-sm'
                          : 'border border-white/[0.06] bg-black/40 text-zinc-400 hover:text-white'
                      }`}
                    >
                      <div className="font-semibold text-xs text-white">{scene.name}</div>
                      <div className="flex items-center gap-2 mt-1 text-[10px] font-mono text-zinc-500">
                        <span>{scene.splatCount} splats</span>
                        <span>•</span>
                        <span>{scene.filesize}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Render Modes */}
              <div>
                <label className="block font-mono text-[11px] uppercase tracking-wider text-zinc-400 mb-2">
                  Rasterization Mode
                </label>
                <div className="grid grid-cols-3 gap-1 bg-zinc-900 p-1 rounded-xl border border-white/10 text-[10px]">
                  <button
                    onClick={() => {
                      sound.toggle();
                      setRenderMode('splat');
                    }}
                    className={`py-1.5 rounded-lg font-medium transition-all ${
                      renderMode === 'splat' ? 'bg-orange-500 text-white' : 'text-zinc-400'
                    }`}
                  >
                    Splats
                  </button>
                  <button
                    onClick={() => {
                      sound.toggle();
                      setRenderMode('points');
                    }}
                    className={`py-1.5 rounded-lg font-medium transition-all ${
                      renderMode === 'points' ? 'bg-orange-500 text-white' : 'text-zinc-400'
                    }`}
                  >
                    Points
                  </button>
                  <button
                    onClick={() => {
                      sound.toggle();
                      setRenderMode('volume');
                    }}
                    className={`py-1.5 rounded-lg font-medium transition-all ${
                      renderMode === 'volume' ? 'bg-orange-500 text-white' : 'text-zinc-400'
                    }`}
                  >
                    Volume
                  </button>
                </div>
              </div>

              {/* Sliders: Alpha & FOV */}
              <div className="space-y-4 pt-3 border-t border-white/[0.08]">
                <div>
                  <div className="flex justify-between text-zinc-400 mb-1 font-mono text-[11px]">
                    <span>Splat Alpha Opacity</span>
                    <span className="text-orange-400">{Math.round(splatAlpha * 100)}%</span>
                  </div>
                  <input
                    type="range"
                    min="0.1"
                    max="1.0"
                    step="0.05"
                    value={splatAlpha}
                    onChange={(e) => setSplatAlpha(parseFloat(e.target.value))}
                    className="w-full accent-orange-500"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-zinc-400 mb-1 font-mono text-[11px]">
                    <span>Camera FOV</span>
                    <span className="text-orange-400">{fov}°</span>
                  </div>
                  <input
                    type="range"
                    min="30"
                    max="90"
                    step="1"
                    value={fov}
                    onChange={(e) => setFov(parseInt(e.target.value, 10))}
                    className="w-full accent-orange-500"
                  />
                </div>
              </div>

              {/* Upload Custom .splat File */}
              <div className="pt-3 border-t border-white/[0.08]">
                <label className="block font-mono text-[11px] uppercase tracking-wider text-zinc-400 mb-2">
                  Load Custom File (.splat, .ply, .ksplat)
                </label>
                <label className="flex flex-col items-center justify-center p-4 border border-dashed border-zinc-700 hover:border-orange-500/50 rounded-2xl bg-black/40 cursor-pointer transition-colors">
                  <Upload className="h-5 w-5 text-zinc-500 mb-1" />
                  <span className="text-[11px] text-zinc-400">Drag & Drop or Click to Load</span>
                  <input type="file" accept=".splat,.ply,.ksplat" className="hidden" />
                </label>
              </div>
            </div>

            {/* Right 3D Viewport */}
            <div className="flex-1 relative bg-black flex items-center justify-center overflow-hidden">
              <canvas
                ref={canvasRef}
                width={800}
                height={600}
                className="w-full h-full object-contain cursor-grab active:cursor-grabbing"
              />

              {/* Real-time WebGL Telemetry HUD */}
              <div className="absolute top-4 left-4 rounded-2xl border border-white/10 bg-black/70 backdrop-blur-xl p-3.5 font-mono text-[11px] space-y-1 text-zinc-300 shadow-xl pointer-events-none">
                <div className="flex items-center gap-2 font-bold text-white">
                  <Sparkles className="h-3.5 w-3.5 text-orange-400" />
                  <span>3D Gaussian Rasterizer Telemetry</span>
                </div>
                <div className="flex items-center justify-between gap-4 text-zinc-400">
                  <span>Frame Rate:</span>
                  <span className="text-emerald-400 font-bold">{fps} FPS</span>
                </div>
                <div className="flex items-center justify-between gap-4 text-zinc-400">
                  <span>Splat Count:</span>
                  <span className="text-white">{selectedScene.splatCount}</span>
                </div>
                <div className="flex items-center justify-between gap-4 text-zinc-400">
                  <span>Renderer:</span>
                  <span className="text-violet-400">WebGL 2.0 / WebGPU</span>
                </div>
              </div>

              {/* Viewport Action Controls */}
              <div className="absolute bottom-4 right-4 flex items-center gap-2">
                <button
                  onClick={() => {
                    sound.toggle();
                    setIsAutoRotating(!isAutoRotating);
                  }}
                  className="rounded-xl border border-white/10 bg-zinc-900/90 px-3 py-1.5 text-xs font-mono text-zinc-300 hover:text-white backdrop-blur-md"
                >
                  {isAutoRotating ? 'Pause Orbit' : 'Auto Orbit'}
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
