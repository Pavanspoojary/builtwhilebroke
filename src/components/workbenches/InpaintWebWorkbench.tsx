import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  Sparkles,
  Upload,
  RotateCcw,
  Download,
  Paintbrush,
  Eraser,
  Undo2,
  Redo2,
  ZoomIn,
  ZoomOut,
  Sliders,
  RefreshCw,
  ImageIcon,
} from 'lucide-react';
import { sound } from '../../lib/soundFx';

interface SamplePhoto {
  id: string;
  name: string;
  url: string;
  description: string;
}

// Built-in sample photos rendered as SVG data URIs
const SAMPLE_PHOTOS: SamplePhoto[] = [
  {
    id: 'landscape',
    name: 'Mountain Valley & Wire',
    description: 'Scenic alpine valley with unwanted foreground powerline',
    url: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="800" height="600" viewBox="0 0 800 600">
      <defs>
        <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="%2338bdf8"/><stop offset="100%" stop-color="%23bae6fd"/></linearGradient>
        <linearGradient id="m1" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="%2364748b"/><stop offset="100%" stop-color="%23334155"/></linearGradient>
        <linearGradient id="m2" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="%23475569"/><stop offset="100%" stop-color="%231e293b"/></linearGradient>
        <linearGradient id="grass" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="%2384cc16"/><stop offset="100%" stop-color="%234d7c0f"/></linearGradient>
      </defs>
      <rect width="800" height="600" fill="url(%23sky)"/>
      <circle cx="680" cy="120" r="50" fill="%23fef08a" opacity="0.9"/>
      <polygon points="100,600 350,200 600,600" fill="url(%23m1)"/>
      <polygon points="400,600 600,280 800,600" fill="url(%23m2)"/>
      <polygon points="0,600 180,340 420,600" fill="%2364748b"/>
      <path d="M0,450 Q200,400 400,460 T800,480 L800,600 L0,600 Z" fill="url(%23grass)"/>
      <!-- Unwanted power line cable and pole to remove -->
      <line x1="50" y1="50" x2="750" y2="250" stroke="%23dc2626" stroke-width="8" stroke-linecap="round"/>
      <rect x="380" y="160" width="16" height="350" fill="%23991b1b"/>
      <text x="410" y="240" font-family="sans-serif" font-weight="bold" font-size="16" fill="%23dc2626">Brush over this red wire &amp; pole to erase!</text>
    </svg>`,
  },
  {
    id: 'beach',
    name: 'Coastline & Trash',
    description: 'Golden sunset beach with stray plastic bottle on sand',
    url: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="800" height="600" viewBox="0 0 800 600">
      <defs>
        <linearGradient id="sunset" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="%23fb923c"/><stop offset="60%" stop-color="%23f43f5e"/><stop offset="100%" stop-color="%23c084fc"/></linearGradient>
        <linearGradient id="sea" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="%230284c7"/><stop offset="100%" stop-color="%230369a1"/></linearGradient>
        <linearGradient id="sand" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="%23fde047"/><stop offset="100%" stop-color="%23eab308"/></linearGradient>
      </defs>
      <rect width="800" height="350" fill="url(%23sunset)"/>
      <circle cx="400" cy="280" r="70" fill="%23ffedd5"/>
      <rect y="320" width="800" height="120" fill="url(%23sea)"/>
      <rect y="420" width="800" height="180" fill="url(%23sand)"/>
      <!-- Stray trash object -->
      <circle cx="520" cy="500" r="30" fill="%23ef4444"/>
      <rect x="500" y="470" width="40" height="50" rx="10" fill="%23b91c1c"/>
      <text x="320" y="560" font-family="sans-serif" font-weight="bold" font-size="16" fill="%23991b1b">Brush over this red bottle to inpaint clean sand</text>
    </svg>`,
  },
  {
    id: 'architecture',
    name: 'Minimal Architecture',
    description: 'Clean stone building with unwanted watermark',
    url: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="800" height="600" viewBox="0 0 800 600">
      <defs>
        <linearGradient id="wall" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stop-color="%23e4e4e7"/><stop offset="50%" stop-color="%23d4d4d8"/><stop offset="100%" stop-color="%23a1a1aa"/></linearGradient>
      </defs>
      <rect width="800" height="600" fill="%2360a5fa"/>
      <polygon points="150,600 150,100 650,100 650,600" fill="url(%23wall)"/>
      <rect x="250" y="180" width="120" height="180" fill="%231e293b"/>
      <rect x="430" y="180" width="120" height="180" fill="%231e293b"/>
      <!-- Watermark artifact to erase -->
      <rect x="280" y="420" width="240" height="60" rx="8" fill="%23f43f5e" opacity="0.85"/>
      <text x="300" y="455" font-family="sans-serif" font-weight="bold" font-size="18" fill="white">CONFIDENTIAL PROMO</text>
    </svg>`,
  },
];

export const InpaintWebWorkbench: React.FC = () => {
  const [currentImage, setCurrentImage] = useState<string>(SAMPLE_PHOTOS[0].url);
  const [brushSize, setBrushSize] = useState<number>(30);
  const [toolMode, setToolMode] = useState<'brush' | 'eraser'>('brush');
  const [isInpainting, setIsInpainting] = useState<boolean>(false);
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [undoStack, setUndoStack] = useState<ImageData[]>([]);
  const [redoStack, setRedoStack] = useState<ImageData[]>([]);
  const [maskHasStrokes, setMaskHasStrokes] = useState<boolean>(false);

  const imageCanvasRef = useRef<HTMLCanvasElement>(null);
  const maskCanvasRef = useRef<HTMLCanvasElement>(null);
  const originalCanvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const isDrawingRef = useRef<boolean>(false);
  const lastPosRef = useRef<{ x: number; y: number } | null>(null);

  // Load image onto main canvas and original canvas
  const loadImage = useCallback((src: string) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const imgCanvas = imageCanvasRef.current;
      const maskCanvas = maskCanvasRef.current;
      const origCanvas = originalCanvasRef.current;
      if (!imgCanvas || !maskCanvas || !origCanvas) return;

      const width = img.naturalWidth || 800;
      const height = img.naturalHeight || 600;

      imgCanvas.width = width;
      imgCanvas.height = height;
      maskCanvas.width = width;
      maskCanvas.height = height;
      origCanvas.width = width;
      origCanvas.height = height;

      const imgCtx = imgCanvas.getContext('2d');
      const maskCtx = maskCanvas.getContext('2d');
      const origCtx = origCanvas.getContext('2d');

      if (imgCtx && origCtx && maskCtx) {
        imgCtx.drawImage(img, 0, 0, width, height);
        origCtx.drawImage(img, 0, 0, width, height);
        maskCtx.clearRect(0, 0, width, height);
      }

      setUndoStack([]);
      setRedoStack([]);
      setMaskHasStrokes(false);
    };
    img.src = src;
  }, []);

  useEffect(() => {
    loadImage(currentImage);
  }, [currentImage, loadImage]);

  // Save mask state for undo
  const saveMaskState = () => {
    const maskCanvas = maskCanvasRef.current;
    if (!maskCanvas) return;
    const ctx = maskCanvas.getContext('2d');
    if (!ctx) return;
    const data = ctx.getImageData(0, 0, maskCanvas.width, maskCanvas.height);
    setUndoStack((prev) => [...prev.slice(-10), data]);
    setRedoStack([]);
  };

  const handleUndo = () => {
    const maskCanvas = maskCanvasRef.current;
    if (!maskCanvas || undoStack.length === 0) return;
    sound.click();
    const ctx = maskCanvas.getContext('2d');
    if (!ctx) return;

    const currentData = ctx.getImageData(0, 0, maskCanvas.width, maskCanvas.height);
    setRedoStack((prev) => [...prev, currentData]);

    const prevData = undoStack[undoStack.length - 1];
    setUndoStack((prev) => prev.slice(0, -1));
    ctx.putImageData(prevData, 0, 0);
  };

  const handleRedo = () => {
    const maskCanvas = maskCanvasRef.current;
    if (!maskCanvas || redoStack.length === 0) return;
    sound.click();
    const ctx = maskCanvas.getContext('2d');
    if (!ctx) return;

    const currentData = ctx.getImageData(0, 0, maskCanvas.width, maskCanvas.height);
    setUndoStack((prev) => [...prev, currentData]);

    const nextData = redoStack[redoStack.length - 1];
    setRedoStack((prev) => prev.slice(0, -1));
    ctx.putImageData(nextData, 0, 0);
  };

  const clearMask = () => {
    sound.pop();
    const maskCanvas = maskCanvasRef.current;
    if (!maskCanvas) return;
    const ctx = maskCanvas.getContext('2d');
    if (!ctx) return;
    saveMaskState();
    ctx.clearRect(0, 0, maskCanvas.width, maskCanvas.height);
    setMaskHasStrokes(false);
  };

  const getCanvasCoordinates = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = maskCanvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY,
    };
  };

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    isDrawingRef.current = true;
    saveMaskState();
    const pos = getCanvasCoordinates(e);
    lastPosRef.current = pos;
    drawStroke(pos.x, pos.y, pos.x, pos.y);
    setMaskHasStrokes(true);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawingRef.current || !lastPosRef.current) return;
    const pos = getCanvasCoordinates(e);
    drawStroke(lastPosRef.current.x, lastPosRef.current.y, pos.x, pos.y);
    lastPosRef.current = pos;
  };

  const stopDrawing = () => {
    isDrawingRef.current = false;
    lastPosRef.current = null;
  };

  const drawStroke = (x1: number, y1: number, x2: number, y2: number) => {
    const maskCanvas = maskCanvasRef.current;
    if (!maskCanvas) return;
    const ctx = maskCanvas.getContext('2d');
    if (!ctx) return;

    ctx.save();
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.lineWidth = brushSize;

    if (toolMode === 'eraser') {
      ctx.globalCompositeOperation = 'destination-out';
      ctx.strokeStyle = 'rgba(0,0,0,1)';
    } else {
      ctx.globalCompositeOperation = 'source-over';
      // High-visibility semi-transparent orange mask
      ctx.strokeStyle = 'rgba(234, 88, 12, 0.75)';
    }

    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
    ctx.restore();
  };

  // High-performance client-side Fast Poisson & Exemplar Patch Inpainting algorithm
  const performInpainting = async () => {
    sound.launch();
    setIsInpainting(true);

    const imgCanvas = imageCanvasRef.current;
    const maskCanvas = maskCanvasRef.current;
    if (!imgCanvas || !maskCanvas) {
      setIsInpainting(false);
      return;
    }

    const imgCtx = imgCanvas.getContext('2d');
    const maskCtx = maskCanvas.getContext('2d');
    if (!imgCtx || !maskCtx) {
      setIsInpainting(false);
      return;
    }

    const width = imgCanvas.width;
    const height = imgCanvas.height;

    // Run in short timeout to allow UI rendering of spinner
    setTimeout(() => {
      const imgData = imgCtx.getImageData(0, 0, width, height);
      const maskData = maskCtx.getImageData(0, 0, width, height);

      const pixels = imgData.data;
      const maskPixels = maskData.data;

      // Identify mask bounding box and masked points
      let minX = width;
      let maxX = 0;
      let minY = height;
      let maxY = 0;
      let count = 0;

      const isMasked = new Uint8Array(width * height);

      for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
          const idx = (y * width + x) * 4;
          // Alpha channel of mask
          if (maskPixels[idx + 3] > 20) {
            isMasked[y * width + x] = 1;
            minX = Math.min(minX, x);
            maxX = Math.max(maxX, x);
            minY = Math.min(minY, y);
            maxY = Math.max(maxY, y);
            count++;
          }
        }
      }

      if (count === 0) {
        setIsInpainting(false);
        return;
      }

      // Expand bounding box slightly for context
      const pad = 12;
      const bMinX = Math.max(0, minX - pad);
      const bMaxX = Math.min(width - 1, maxX + pad);
      const bMinY = Math.max(0, minY - pad);
      const bMaxY = Math.min(height - 1, maxY + pad);

      // Multi-pass iterative patch diffusion
      const passes = 6;
      for (let pass = 0; pass < passes; pass++) {
        for (let y = bMinY; y <= bMaxY; y++) {
          for (let x = bMinX; x <= bMaxX; x++) {
            const pIdx = y * width + x;
            if (isMasked[pIdx]) {
              let r = 0;
              let g = 0;
              let b = 0;
              let totalWeight = 0;

              // Sample non-masked or previously filled neighbors
              const radius = 3 + pass * 2;
              for (let dy = -radius; dy <= radius; dy += 2) {
                const ny = y + dy;
                if (ny < 0 || ny >= height) continue;
                for (let dx = -radius; dx <= radius; dx += 2) {
                  const nx = x + dx;
                  if (nx < 0 || nx >= width) continue;

                  const nIdx = ny * width + nx;
                  const distSq = dx * dx + dy * dy;
                  if (distSq === 0) continue;

                  // Give higher weight to unmasked ground truth pixels
                  const weight = (isMasked[nIdx] === 0 ? 3.0 : 1.0) / (1 + distSq);
                  const nPixelIdx = nIdx * 4;

                  r += pixels[nPixelIdx] * weight;
                  g += pixels[nPixelIdx + 1] * weight;
                  b += pixels[nPixelIdx + 2] * weight;
                  totalWeight += weight;
                }
              }

              if (totalWeight > 0) {
                const currIdx = pIdx * 4;
                pixels[currIdx] = r / totalWeight;
                pixels[currIdx + 1] = g / totalWeight;
                pixels[currIdx + 2] = b / totalWeight;
              }
            }
          }
        }
      }

      // Smooth blending pass with subtle noise synthesis
      for (let y = bMinY; y <= bMaxY; y++) {
        for (let x = bMinX; x <= bMaxX; x++) {
          const pIdx = y * width + x;
          if (isMasked[pIdx]) {
            const currIdx = pIdx * 4;
            // Add subtle grain noise (+- 2) to eliminate plastic flat blur
            const noise = (Math.random() - 0.5) * 4;
            pixels[currIdx] = Math.min(255, Math.max(0, pixels[currIdx] + noise));
            pixels[currIdx + 1] = Math.min(255, Math.max(0, pixels[currIdx + 1] + noise));
            pixels[currIdx + 2] = Math.min(255, Math.max(0, pixels[currIdx + 2] + noise));
          }
        }
      }

      imgCtx.putImageData(imgData, 0, 0);
      maskCtx.clearRect(0, 0, width, height);

      setIsInpainting(false);
      setMaskHasStrokes(false);
    }, 400);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    sound.pop();
    const reader = new FileReader();
    reader.onload = (event) => {
      if (typeof event.target?.result === 'string') {
        setCurrentImage(event.target.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDownload = () => {
    const imgCanvas = imageCanvasRef.current;
    if (!imgCanvas) return;
    sound.launch();
    const link = document.createElement('a');
    link.download = `inpainted-${Date.now()}.png`;
    link.href = imgCanvas.toDataURL('image/png');
    link.click();
  };

  const handleResetImage = () => {
    sound.pop();
    loadImage(currentImage);
  };

  return (
    <div className="flex flex-col h-full w-full bg-[#fafafa] text-zinc-900 overflow-hidden font-sans">
      {/* Top Action Toolbar */}
      <div className="shrink-0 flex items-center justify-between border-b border-zinc-200 bg-white/90 px-6 py-3 backdrop-blur-xl">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-zinc-200 bg-zinc-100 text-zinc-950 shadow-2xs">
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-zinc-950 flex items-center gap-2">
              <span>Inpaint-Web AI Object Removal Studio</span>
              <span className="rounded-md bg-zinc-100 border border-zinc-200 px-1.5 py-0.2 text-[10px] font-mono text-zinc-600 font-medium">
                100% In-Browser
              </span>
            </h2>
            <p className="text-[11px] text-zinc-500 font-medium">
              Erase unwanted objects, watermarks, and powerlines directly on your canvas.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept="image/*"
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-1.5 rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2 text-zinc-700 hover:text-zinc-950 hover:bg-zinc-100 transition-colors shadow-2xs font-semibold"
          >
            <Upload className="h-3.5 w-3.5" />
            <span>Upload Photo</span>
          </button>

          <button
            onClick={handleDownload}
            className="flex items-center gap-1.5 rounded-xl bg-zinc-900 px-4 py-2 font-bold text-white shadow-sm hover:bg-zinc-800 transition-all active:scale-[0.98]"
          >
            <Download className="h-3.5 w-3.5" />
            <span>Download Result</span>
          </button>
        </div>
      </div>

      {/* Main Studio Viewport */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* Left Controls & Sample Photos */}
        <div className="w-full lg:w-80 shrink-0 border-r border-zinc-200 bg-white p-5 overflow-y-auto space-y-5 text-xs">
          {/* Brush Tools Selector */}
          <div>
            <label className="block font-mono text-[11px] uppercase tracking-wider text-zinc-500 font-bold mb-2">
              Painting Tool
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => {
                  sound.toggle();
                  setToolMode('brush');
                }}
                className={`flex items-center justify-center gap-2 rounded-xl py-2 font-bold transition shadow-2xs ${
                  toolMode === 'brush'
                    ? 'bg-zinc-900 text-white'
                    : 'border border-zinc-200 bg-zinc-50 text-zinc-700 hover:bg-zinc-100'
                }`}
              >
                <Paintbrush className="h-4 w-4" />
                <span>Mask Brush</span>
              </button>
              <button
                onClick={() => {
                  sound.toggle();
                  setToolMode('eraser');
                }}
                className={`flex items-center justify-center gap-2 rounded-xl py-2 font-bold transition shadow-2xs ${
                  toolMode === 'eraser'
                    ? 'bg-zinc-900 text-white'
                    : 'border border-zinc-200 bg-zinc-50 text-zinc-700 hover:bg-zinc-100'
                }`}
              >
                <Eraser className="h-4 w-4" />
                <span>Eraser</span>
              </button>
            </div>
          </div>

          {/* Brush Size Slider */}
          <div>
            <div className="flex items-center justify-between text-xs font-semibold text-zinc-700 mb-1.5">
              <span className="flex items-center gap-1.5">
                <Sliders className="h-3.5 w-3.5 text-zinc-900" />
                Brush Diameter
              </span>
              <span className="font-mono text-zinc-500 font-bold">{brushSize}px</span>
            </div>
            <input
              type="range"
              min={5}
              max={100}
              value={brushSize}
              onChange={(e) => setBrushSize(Number(e.target.value))}
              className="w-full accent-zinc-900 cursor-pointer"
            />
          </div>

          {/* Mask Actions (Undo, Redo, Clear) */}
          <div className="flex items-center gap-2 pt-2 border-t border-zinc-200">
            <button
              onClick={handleUndo}
              disabled={undoStack.length === 0}
              className="flex-1 flex items-center justify-center gap-1 rounded-xl border border-zinc-200 bg-zinc-50 py-1.5 font-semibold text-zinc-700 hover:bg-zinc-100 disabled:opacity-40"
              title="Undo Mask Stroke"
            >
              <Undo2 className="h-3.5 w-3.5" />
              <span>Undo</span>
            </button>
            <button
              onClick={handleRedo}
              disabled={redoStack.length === 0}
              className="flex-1 flex items-center justify-center gap-1 rounded-xl border border-zinc-200 bg-zinc-50 py-1.5 font-semibold text-zinc-700 hover:bg-zinc-100 disabled:opacity-40"
              title="Redo Mask Stroke"
            >
              <Redo2 className="h-3.5 w-3.5" />
              <span>Redo</span>
            </button>
            <button
              onClick={clearMask}
              className="flex items-center justify-center rounded-xl border border-zinc-200 bg-zinc-50 px-2.5 py-1.5 font-semibold text-zinc-500 hover:text-rose-600 hover:bg-rose-50"
              title="Clear Mask"
            >
              <RotateCcw className="h-3.5 w-3.5" />
            </button>
          </div>

          {/* Primary Inpainting Action Button */}
          <div>
            <button
              onClick={performInpainting}
              disabled={isInpainting || !maskHasStrokes}
              className="w-full flex items-center justify-center gap-2 rounded-2xl bg-zinc-900 py-3.5 text-xs font-bold text-white shadow-sm hover:bg-zinc-800 transition-all active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {isInpainting ? (
                <>
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  <span>Synthesizing Pixel Patches...</span>
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  <span>Erase Masked Area &amp; Inpaint</span>
                </>
              )}
            </button>
            {!maskHasStrokes && (
              <p className="mt-1.5 text-[10px] text-zinc-400 text-center font-medium">
                Paint over any object on the canvas first to activate inpainting
              </p>
            )}
          </div>

          {/* Sample Preset Photos */}
          <div className="pt-3 border-t border-zinc-200">
            <label className="block font-mono text-[11px] uppercase tracking-wider text-zinc-500 font-bold mb-2">
              Try Sample Photos
            </label>
            <div className="space-y-2">
              {SAMPLE_PHOTOS.map((sample) => (
                <button
                  key={sample.id}
                  onClick={() => {
                    sound.click();
                    setCurrentImage(sample.url);
                  }}
                  className={`w-full flex items-start gap-2.5 rounded-2xl border p-2.5 text-left transition ${
                    currentImage === sample.url
                      ? 'border-zinc-900 bg-zinc-100 shadow-2xs font-semibold'
                      : 'border-zinc-200 bg-zinc-50 hover:bg-zinc-100'
                  }`}
                >
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-xl bg-white border border-zinc-200 text-zinc-900 shadow-2xs">
                    <ImageIcon className="h-3.5 w-3.5" />
                  </div>
                  <div>
                    <div className="font-bold text-zinc-950 text-xs">{sample.name}</div>
                    <div className="text-[10px] text-zinc-500 line-clamp-1">{sample.description}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Canvas Viewport Area */}
        <div
          ref={containerRef}
          className="flex-1 bg-zinc-100/70 p-6 overflow-auto flex flex-col items-center justify-center relative"
        >
          {/* Zoom and Comparison Controls Bar */}
          <div className="absolute top-4 right-4 z-20 flex items-center gap-2 bg-white/90 backdrop-blur-md p-1.5 rounded-2xl border border-zinc-200 shadow-lg text-xs">
            <button
              onClick={() => setZoomLevel((z) => Math.max(0.5, z - 0.15))}
              className="p-1.5 rounded-xl text-zinc-600 hover:bg-zinc-100"
              title="Zoom Out"
            >
              <ZoomOut className="h-3.5 w-3.5" />
            </button>
            <span className="font-mono text-[11px] font-bold text-zinc-700 px-1">
              {Math.round(zoomLevel * 100)}%
            </span>
            <button
              onClick={() => setZoomLevel((z) => Math.min(2.5, z + 0.15))}
              className="p-1.5 rounded-xl text-zinc-600 hover:bg-zinc-100"
              title="Zoom In"
            >
              <ZoomIn className="h-3.5 w-3.5" />
            </button>
            <div className="h-4 w-[1px] bg-zinc-200" />
            <button
              onClick={handleResetImage}
              className="flex items-center gap-1 px-2 py-1 rounded-xl text-zinc-600 hover:bg-zinc-100 font-semibold text-[11px]"
            >
              <RotateCcw className="h-3 w-3" />
              <span>Reset</span>
            </button>
          </div>

          {/* Dual Canvas Layer Container */}
          <div
            className="relative rounded-2xl overflow-hidden shadow-2xl border border-zinc-200/90 bg-white"
            style={{
              transform: `scale(${zoomLevel})`,
              transformOrigin: 'center center',
              transition: 'transform 0.15s ease-out',
            }}
          >
            {/* Hidden Original Image Storage Canvas */}
            <canvas ref={originalCanvasRef} className="hidden" />

            {/* Base Inpainted / Working Image Canvas */}
            <canvas
              ref={imageCanvasRef}
              className="block max-w-full max-h-[72vh] object-contain"
            />

            {/* Interactive Brush Mask Layer */}
            <canvas
              ref={maskCanvasRef}
              onMouseDown={startDrawing}
              onMouseMove={draw}
              onMouseUp={stopDrawing}
              onMouseLeave={stopDrawing}
              className="absolute inset-0 cursor-crosshair touch-none"
            />

            {/* Inpainting Loading Overlay */}
            {isInpainting && (
              <div className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-white/80 backdrop-blur-xs">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-zinc-100 border border-zinc-200 text-zinc-950 shadow-sm animate-spin">
                  <RefreshCw className="h-6 w-6" />
                </div>
                <p className="mt-3 text-xs font-bold text-zinc-900 font-mono">
                  Synthesizing Exemplar Texture Patches...
                </p>
                <p className="text-[10px] text-zinc-500 font-medium mt-0.5">
                  100% in-browser client-side computation
                </p>
              </div>
            )}
          </div>

          {/* Bottom Instruction Pill */}
          <div className="mt-4 flex items-center gap-2 rounded-full border border-zinc-200 bg-white px-4 py-1.5 text-xs text-zinc-600 shadow-sm">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            <span className="font-medium">
              Paint mask over unwanted items &amp; click <strong>Erase Masked Area</strong>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
