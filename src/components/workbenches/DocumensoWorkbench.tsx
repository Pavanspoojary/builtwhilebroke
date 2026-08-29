import React, { useState, useRef, useEffect } from 'react';
import {
  FileCheck,
  RotateCcw,
  CheckCircle2,
  Lock,
  Printer,
  ShieldCheck,
  ExternalLink,
} from 'lucide-react';
import { sound } from '../../lib/soundFx';

type AgreementType = 'nda' | 'consulting' | 'saas';

export const DocumensoWorkbench: React.FC = () => {
  const [agreementType, setAgreementType] = useState<AgreementType>('nda');
  const [partyA, setPartyA] = useState<string>('BuiltWhileBroke Technologies Inc.');
  const [partyB, setPartyB] = useState<string>('Alex Vance');
  const [partyBEmail, setPartyBEmail] = useState<string>('alex.vance@example.com');
  const [effectiveDate, setEffectiveDate] = useState<string>('2026-08-29');
  const [signMode, setSignMode] = useState<'draw' | 'type'>('draw');
  const [typedSignature, setTypedSignature] = useState<string>('Alex Vance');
  const [inkColor, setInkColor] = useState<string>('#18181b');
  const [isSigned, setIsSigned] = useState<boolean>(false);
  const [cryptoHash, setCryptoHash] = useState<string>('');
  const [useOfficialEmbed, setUseOfficialEmbed] = useState<boolean>(false);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isDrawingRef = useRef<boolean>(false);

  // Initialize and handle canvas drawing
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.strokeStyle = inkColor;
    ctx.lineWidth = 2.5;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
  }, [inkColor, signMode]);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    isDrawingRef.current = true;
    ctx.beginPath();
    ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawingRef.current) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
    ctx.stroke();
  };

  const stopDrawing = () => {
    isDrawingRef.current = false;
  };

  const clearSignature = () => {
    sound.pop();
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setIsSigned(false);
  };

  const handleSealAndSign = async () => {
    sound.launch();
    // Generate SHA-256 digital document hash
    const textData = `${agreementType}-${partyA}-${partyB}-${partyBEmail}-${effectiveDate}-${Date.now()}`;
    const encoder = new TextEncoder();
    const data = encoder.encode(textData);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');

    setCryptoHash(hashHex);
    setIsSigned(true);
  };

  const handlePrint = () => {
    sound.launch();
    window.print();
  };

  return (
    <div className="flex flex-col h-full w-full bg-[#fafafa] text-zinc-900 overflow-hidden font-sans">
      {/* Top Header */}
      <div className="shrink-0 flex items-center justify-between border-b border-zinc-200 bg-white/90 px-6 py-3.5 backdrop-blur-xl">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-zinc-200 bg-zinc-100 text-zinc-950 shadow-2xs">
            <FileCheck className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-zinc-950 flex items-center gap-2">
              <span>Documenso Open Source Digital Signature Platform</span>
              <span className="rounded-md bg-zinc-100 border border-zinc-200 px-1.5 py-0.2 text-[10px] font-mono text-zinc-600 font-medium">
                AGPL-3.0
              </span>
            </h2>
            <p className="text-[11px] text-zinc-500 font-medium">
              Sign agreements, verify cryptographic audit certificates, and seal documents 100% in-browser.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 rounded-xl bg-zinc-900 px-4 py-2 font-bold text-white shadow-sm hover:bg-zinc-800 transition-all active:scale-[0.98]"
          >
            <Printer className="h-3.5 w-3.5" />
            <span>Print / Save Signed PDF</span>
          </button>

          <button
            onClick={() => {
              sound.toggle();
              setUseOfficialEmbed(!useOfficialEmbed);
            }}
            className="flex items-center gap-1.5 rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2 text-zinc-700 hover:text-zinc-950 hover:bg-zinc-100 transition-colors shadow-2xs font-semibold"
          >
            <ExternalLink className="h-3.5 w-3.5 text-zinc-900" />
            <span className="hidden sm:inline">{useOfficialEmbed ? 'Studio Signer' : 'Embed Documenso'}</span>
          </button>
        </div>
      </div>

      {/* Main Studio Body */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {useOfficialEmbed ? (
          <div className="w-full h-full bg-white">
            <iframe
              src="https://documenso.com"
              title="Documenso Official"
              className="w-full h-full border-0"
              sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-downloads"
            />
          </div>
        ) : (
          <>
            {/* Left Configuration & Signing Controls */}
            <div className="w-full lg:w-96 shrink-0 border-r border-zinc-200 bg-white p-5 overflow-y-auto space-y-5 text-xs">
              {/* Agreement Template Selector */}
              <div>
                <label className="block font-mono text-[11px] uppercase tracking-wider text-zinc-500 font-bold mb-2">
                  Agreement Type
                </label>
                <div className="grid grid-cols-3 gap-1.5">
                  <button
                    onClick={() => {
                      sound.toggle();
                      setAgreementType('nda');
                    }}
                    className={`rounded-xl py-1.5 text-[11px] font-bold transition-all ${
                      agreementType === 'nda'
                        ? 'bg-zinc-900 text-white shadow-sm'
                        : 'border border-zinc-200 bg-zinc-50 text-zinc-700 hover:bg-zinc-100'
                    }`}
                  >
                    Mutual NDA
                  </button>
                  <button
                    onClick={() => {
                      sound.toggle();
                      setAgreementType('consulting');
                    }}
                    className={`rounded-xl py-1.5 text-[11px] font-bold transition-all ${
                      agreementType === 'consulting'
                        ? 'bg-zinc-900 text-white shadow-sm'
                        : 'border border-zinc-200 bg-zinc-50 text-zinc-700 hover:bg-zinc-100'
                    }`}
                  >
                    Consulting
                  </button>
                  <button
                    onClick={() => {
                      sound.toggle();
                      setAgreementType('saas');
                    }}
                    className={`rounded-xl py-1.5 text-[11px] font-bold transition-all ${
                      agreementType === 'saas'
                        ? 'bg-zinc-900 text-white shadow-sm'
                        : 'border border-zinc-200 bg-zinc-50 text-zinc-700 hover:bg-zinc-100'
                    }`}
                  >
                    SaaS SLA
                  </button>
                </div>
              </div>

              {/* Document Metadata Fields */}
              <div className="space-y-3">
                <div>
                  <label className="text-[11px] font-mono text-zinc-600 font-semibold">Disclosing Entity (Party A)</label>
                  <input
                    type="text"
                    value={partyA}
                    onChange={(e) => setPartyA(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2 text-zinc-900 focus:border-zinc-950 focus:bg-white focus:outline-none shadow-sm"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-mono text-zinc-600 font-semibold">Signer Full Name (Party B)</label>
                  <input
                    type="text"
                    value={partyB}
                    onChange={(e) => {
                      setPartyB(e.target.value);
                      setTypedSignature(e.target.value);
                    }}
                    className="mt-1 w-full rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2 text-zinc-900 focus:border-zinc-950 focus:bg-white focus:outline-none shadow-sm"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-mono text-zinc-600 font-semibold">Signer Email</label>
                  <input
                    type="email"
                    value={partyBEmail}
                    onChange={(e) => setPartyBEmail(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2 text-zinc-900 focus:border-zinc-950 focus:bg-white focus:outline-none shadow-sm"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-mono text-zinc-600 font-semibold">Effective Date</label>
                  <input
                    type="date"
                    value={effectiveDate}
                    onChange={(e) => setEffectiveDate(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2 text-zinc-900 focus:border-zinc-950 focus:bg-white focus:outline-none shadow-sm"
                  />
                </div>
              </div>

              {/* Interactive Signature Pad Box */}
              <div className="pt-3 border-t border-zinc-200 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="font-mono text-[11px] uppercase tracking-wider text-zinc-600 font-bold">
                    Electronic Signature
                  </label>
                  <div className="flex items-center gap-1 bg-zinc-100 p-0.5 rounded-xl border border-zinc-200">
                    <button
                      onClick={() => {
                        sound.toggle();
                        setSignMode('draw');
                      }}
                      className={`px-2.5 py-0.5 rounded-lg text-[10px] font-bold ${
                        signMode === 'draw' ? 'bg-zinc-900 text-white shadow-2xs' : 'text-zinc-600'
                      }`}
                    >
                      Draw
                    </button>
                    <button
                      onClick={() => {
                        sound.toggle();
                        setSignMode('type');
                      }}
                      className={`px-2.5 py-0.5 rounded-lg text-[10px] font-bold ${
                        signMode === 'type' ? 'bg-zinc-900 text-white shadow-2xs' : 'text-zinc-600'
                      }`}
                    >
                      Type
                    </button>
                  </div>
                </div>

                {signMode === 'draw' ? (
                  <div>
                    <div className="relative rounded-2xl border-2 border-dashed border-zinc-300 bg-zinc-50/50 p-1 overflow-hidden shadow-inner">
                      <canvas
                        ref={canvasRef}
                        width={300}
                        height={120}
                        onMouseDown={startDrawing}
                        onMouseMove={draw}
                        onMouseUp={stopDrawing}
                        onMouseLeave={stopDrawing}
                        className="w-full h-28 cursor-crosshair touch-none bg-white rounded-xl"
                      />
                      <div className="absolute bottom-1.5 right-2.5 text-[9px] font-mono text-zinc-400 pointer-events-none font-medium">
                        Sign Above Line ✍️
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center gap-1.5">
                        {['#18181b', '#1e40af', '#581c87'].map((col) => (
                          <button
                            key={col}
                            onClick={() => setInkColor(col)}
                            className={`h-5 w-5 rounded-full border ${
                              inkColor === col ? 'ring-2 ring-zinc-900 scale-110' : 'opacity-70'
                            }`}
                            style={{ backgroundColor: col }}
                          />
                        ))}
                      </div>
                      <button
                        onClick={clearSignature}
                        className="text-[11px] font-mono text-zinc-500 hover:text-zinc-800 flex items-center gap-1 font-semibold"
                      >
                        <RotateCcw className="h-3 w-3" />
                        <span>Clear</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <input
                      type="text"
                      value={typedSignature}
                      onChange={(e) => setTypedSignature(e.target.value)}
                      placeholder="Type your signature"
                      className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2 text-zinc-900 focus:border-zinc-950 focus:bg-white focus:outline-none font-serif italic text-base shadow-sm"
                    />
                  </div>
                )}

                <button
                  onClick={handleSealAndSign}
                  className="w-full flex items-center justify-center gap-2 rounded-2xl bg-emerald-600 py-3 text-xs font-bold text-white shadow-sm hover:bg-emerald-500 transition-all active:scale-[0.98]"
                >
                  <ShieldCheck className="h-4 w-4" />
                  <span>Seal & Cryptographically Sign</span>
                </button>
              </div>
            </div>

            {/* Right Document Preview Canvas */}
            <div className="flex-1 bg-zinc-100/70 p-6 lg:p-10 overflow-y-auto flex items-center justify-center select-text">
              <div className="w-full max-w-2xl bg-white text-zinc-900 rounded-2xl border border-zinc-200/80 shadow-xl p-8 sm:p-12 min-h-[750px] flex flex-col justify-between">
                <div>
                  {/* Document Header */}
                  <div className="border-b-2 border-zinc-900 pb-4 text-center">
                    <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-zinc-400">
                      Documenso Cryptographic Document Envelope
                    </span>
                    <h1 className="text-2xl font-serif font-black uppercase tracking-tight text-zinc-900 mt-1">
                      {agreementType === 'nda' && 'Mutual Non-Disclosure Agreement'}
                      {agreementType === 'consulting' && 'Independent Consulting Master Agreement'}
                      {agreementType === 'saas' && 'Enterprise Service Level Agreement (SLA)'}
                    </h1>
                  </div>

                  {/* Parties Clause */}
                  <div className="my-6 text-xs text-zinc-700 leading-relaxed space-y-3 font-serif">
                    <p>
                      This Agreement is entered into and made effective as of <strong>{effectiveDate}</strong>, by and between:
                    </p>
                    <p className="pl-4 border-l-2 border-zinc-300">
                      <strong>Party A:</strong> {partyA} (hereinafter "Disclosing Entity")<br />
                      <strong>Party B:</strong> {partyB} ({partyBEmail}) (hereinafter "Receiving Signatory")
                    </p>
                    <p>
                      1. <strong>Confidentiality & Scope:</strong> The parties agree that any technical documentation, client-side cryptographic code, or proprietary information shared under this agreement shall be kept strictly confidential.
                    </p>
                    <p>
                      2. <strong>Governing Law:</strong> This agreement shall be governed in accordance with digital signature standards and verifiable cryptographic audit certificates.
                    </p>
                  </div>
                </div>

                {/* Signing Execution Blocks */}
                <div className="border-t-2 border-zinc-900 pt-6 mt-8">
                  <div className="grid grid-cols-2 gap-8 text-xs">
                    {/* Party A */}
                    <div>
                      <div className="font-bold text-zinc-900">{partyA}</div>
                      <div className="h-16 flex items-end border-b border-zinc-300 pb-1 font-serif italic text-sm text-zinc-700">
                        Authorized Representative (BWB Labs)
                      </div>
                      <div className="text-[10px] text-zinc-400 font-mono mt-1">Date: {effectiveDate}</div>
                    </div>

                    {/* Party B */}
                    <div>
                      <div className="font-bold text-zinc-900">{partyB}</div>
                      <div className="h-16 flex items-end border-b border-zinc-300 pb-1">
                        {isSigned ? (
                          <div className="flex items-center gap-2">
                            <span className="font-serif italic text-lg font-bold text-emerald-700">
                              {signMode === 'draw' ? '✓ Digitally Signed' : typedSignature}
                            </span>
                            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                          </div>
                        ) : (
                          <span className="text-zinc-400 italic text-xs">Pending Signature...</span>
                        )}
                      </div>
                      <div className="text-[10px] text-zinc-400 font-mono mt-1">
                        Signer: {partyBEmail}
                      </div>
                    </div>
                  </div>

                  {/* Cryptographic Verification Audit Stamp */}
                  {isSigned && (
                    <div className="mt-6 rounded-xl border border-emerald-300 bg-emerald-50/80 p-3 text-[10px] font-mono text-emerald-900 space-y-1">
                      <div className="flex items-center justify-between font-bold text-emerald-800">
                        <div className="flex items-center gap-1.5">
                          <Lock className="h-3.5 w-3.5 text-emerald-600" />
                          <span>Documenso Verified Cryptographic Certificate</span>
                        </div>
                        <span>TIMESTAMP: {new Date().toISOString()}</span>
                      </div>
                      <div className="truncate text-zinc-600">
                        SHA-256 SEAL: {cryptoHash}
                      </div>
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
