import React, { useState } from 'react';
import {
  Lock,
  Unlock,
  ShieldCheck,
  Download,
  Copy,
  Check,
  Upload,
  RefreshCw,
  Eye,
  EyeOff,
} from 'lucide-react';
import { sound } from '../../lib/soundFx';

export const HatshWorkbench: React.FC = () => {
  const [mode, setMode] = useState<'encrypt' | 'decrypt'>('encrypt');
  const [targetType, setTargetType] = useState<'text' | 'file'>('text');
  const [plainText, setPlainText] = useState<string>('My confidential database connection string: postgres://admin:secret_pass@db.local:5432/production');
  const [cipherText, setCipherText] = useState<string>('');
  const [password, setPassword] = useState<string>('bwb-vault-secure-key-2026');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [selectedFileName, setSelectedFileName] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);
  const [cryptoMetadata, setCryptoMetadata] = useState<{
    algorithm: string;
    iterations: number;
    saltHex: string;
    ivHex: string;
  } | null>(null);

  // Generate strong random password
  const generatePassword = () => {
    sound.pop();
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=';
    let pass = '';
    const array = new Uint32Array(20);
    crypto.getRandomValues(array);
    for (let i = 0; i < 20; i++) {
      pass += chars[array[i] % chars.length];
    }
    setPassword(pass);
  };

  // Real in-browser AES-GCM encryption using Web Crypto API
  const handleEncrypt = async () => {
    if (!password) return;
    sound.launch();
    setIsProcessing(true);

    try {
      const enc = new TextEncoder();
      const rawData = enc.encode(plainText);

      // 1. Generate random 16-byte salt and 12-byte IV
      const salt = crypto.getRandomValues(new Uint8Array(16));
      const iv = crypto.getRandomValues(new Uint8Array(12));

      // 2. Derive key using PBKDF2
      const passKey = await crypto.subtle.importKey(
        'raw',
        enc.encode(password),
        { name: 'PBKDF2' },
        false,
        ['deriveKey']
      );

      const aesKey = await crypto.subtle.deriveKey(
        {
          name: 'PBKDF2',
          salt,
          iterations: 100000,
          hash: 'SHA-256',
        },
        passKey,
        { name: 'AES-GCM', length: 256 },
        false,
        ['encrypt']
      );

      // 3. Encrypt payload
      const encryptedBuffer = await crypto.subtle.encrypt(
        { name: 'AES-GCM', iv },
        aesKey,
        rawData
      );

      // 4. Pack salt + iv + ciphertext into Base64
      const combined = new Uint8Array(salt.length + iv.length + encryptedBuffer.byteLength);
      combined.set(salt, 0);
      combined.set(iv, salt.length);
      combined.set(new Uint8Array(encryptedBuffer), salt.length + iv.length);

      let binary = '';
      for (let i = 0; i < combined.length; i++) {
        binary += String.fromCharCode(combined[i]);
      }
      const b64 = btoa(binary);

      setCipherText(b64);
      setCryptoMetadata({
        algorithm: 'AES-256-GCM',
        iterations: 100000,
        saltHex: Array.from(salt).map((b) => b.toString(16).padStart(2, '0')).join(''),
        ivHex: Array.from(iv).map((b) => b.toString(16).padStart(2, '0')).join(''),
      });
      sound.pop();
    } catch {
      alert('Encryption failed');
    } finally {
      setIsProcessing(false);
    }
  };

  // Real in-browser AES-GCM decryption using Web Crypto API
  const handleDecrypt = async () => {
    if (!password || !cipherText) return;
    sound.launch();
    setIsProcessing(true);

    try {
      const enc = new TextEncoder();
      const binary = atob(cipherText);
      const combined = new Uint8Array(binary.length);
      for (let i = 0; i < binary.length; i++) {
        combined[i] = binary.charCodeAt(i);
      }

      // Extract salt (16 bytes), IV (12 bytes), ciphertext
      const salt = combined.slice(0, 16);
      const iv = combined.slice(16, 28);
      const data = combined.slice(28);

      const passKey = await crypto.subtle.importKey(
        'raw',
        enc.encode(password),
        { name: 'PBKDF2' },
        false,
        ['deriveKey']
      );

      const aesKey = await crypto.subtle.deriveKey(
        {
          name: 'PBKDF2',
          salt,
          iterations: 100000,
          hash: 'SHA-256',
        },
        passKey,
        { name: 'AES-GCM', length: 256 },
        false,
        ['decrypt']
      );

      const decryptedBuffer = await crypto.subtle.decrypt(
        { name: 'AES-GCM', iv },
        aesKey,
        data
      );

      const dec = new TextDecoder();
      setPlainText(dec.decode(decryptedBuffer));
      sound.pop();
    } catch {
      alert('Decryption failed. Please check your password.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCopyCipher = () => {
    sound.click();
    navigator.clipboard.writeText(cipherText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadEncryptedFile = () => {
    sound.click();
    const blob = new Blob([cipherText], { type: 'application/octet-stream' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${selectedFileName || 'vault_secret'}.enc`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex flex-col h-full w-full bg-[#fafafa] text-zinc-900 overflow-hidden font-sans">
      {/* Top Header */}
      <div className="shrink-0 flex items-center justify-between border-b border-zinc-200/80 bg-white px-6 py-3.5 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-emerald-200 bg-emerald-50 text-emerald-600 shadow-sm">
            <Lock className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-zinc-950 flex items-center gap-2">
              <span>Hat.sh Client-Side File & Text Encryption</span>
              <span className="rounded bg-emerald-50 border border-emerald-200 px-1.5 py-0.2 text-[10px] font-mono font-bold text-emerald-700">
                AES-256-GCM • Web Crypto API
              </span>
            </h2>
            <p className="text-[11px] text-zinc-500 font-normal">
              Zero-knowledge client-side encryption. Data never leaves your browser memory.
            </p>
          </div>
        </div>
      </div>

      {/* Main Studio Body */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden bg-white">
        {/* Left Parameters & Password Vault */}
        <div className="w-full lg:w-96 shrink-0 border-r border-zinc-200 bg-zinc-50/60 p-5 overflow-y-auto space-y-5 text-xs">
          {/* Mode Toggle (Encrypt vs Decrypt) */}
          <div>
            <label className="block font-mono text-[11px] uppercase tracking-wider text-zinc-500 font-bold mb-2">
              Cryptographic Operation
            </label>
            <div className="grid grid-cols-2 gap-1 bg-white p-1 rounded-xl border border-zinc-200 text-xs shadow-sm">
              <button
                onClick={() => {
                  sound.toggle();
                  setMode('encrypt');
                }}
                className={`flex items-center justify-center gap-1.5 py-2 rounded-lg font-bold transition-all ${
                  mode === 'encrypt'
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-zinc-600 hover:text-zinc-950'
                }`}
              >
                <Lock className="h-3.5 w-3.5" />
                <span>Encrypt Mode</span>
              </button>
              <button
                onClick={() => {
                  sound.toggle();
                  setMode('decrypt');
                }}
                className={`flex items-center justify-center gap-1.5 py-2 rounded-lg font-bold transition-all ${
                  mode === 'decrypt'
                    ? 'bg-zinc-900 text-white shadow-sm'
                    : 'text-zinc-600 hover:text-zinc-950'
                }`}
              >
                <Unlock className="h-3.5 w-3.5" />
                <span>Decrypt Mode</span>
              </button>
            </div>
          </div>

          {/* Password Input & Generator */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="font-mono text-[11px] uppercase tracking-wider text-zinc-500 font-bold">
                Encryption Passphrase
              </label>
              <button
                onClick={generatePassword}
                className="flex items-center gap-1 text-[10px] font-mono text-zinc-900 hover:text-zinc-600 font-bold"
              >
                <RefreshCw className="h-3 w-3" />
                <span>Generate Strong Key</span>
              </button>
            </div>

            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter secret passphrase..."
                className="w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-xs font-mono text-zinc-900 pr-9 focus:border-zinc-950 focus:outline-none shadow-sm"
              />
              <button
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-2.5 top-2.5 text-zinc-400 hover:text-zinc-700"
              >
                {showPassword ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
              </button>
            </div>

            <div className="flex items-center gap-1.5 text-[10px] font-mono text-emerald-700 font-semibold pt-1">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
              <span>PBKDF2 (100,000 rounds) + 256-bit AES Key</span>
            </div>
          </div>

          {/* Target Selector */}
          <div>
            <label className="block font-mono text-[11px] uppercase tracking-wider text-zinc-500 font-bold mb-2">
              Payload Type
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setTargetType('text')}
                className={`rounded-xl border py-2 font-semibold transition-all ${
                  targetType === 'text'
                    ? 'bg-zinc-900 border-zinc-900 text-white shadow-sm'
                    : 'border-zinc-200 bg-white text-zinc-600 hover:bg-zinc-100'
                }`}
              >
                Text & Secrets
              </button>
              <button
                onClick={() => setTargetType('file')}
                className={`rounded-xl border py-2 font-semibold transition-all ${
                  targetType === 'file'
                    ? 'bg-zinc-900 border-zinc-900 text-white shadow-sm'
                    : 'border-zinc-200 bg-white text-zinc-600 hover:bg-zinc-100'
                }`}
              >
                Binary File
              </button>
            </div>
          </div>

          {/* Action Button */}
          <button
            onClick={mode === 'encrypt' ? handleEncrypt : handleDecrypt}
            disabled={isProcessing || !password}
            className={`w-full flex items-center justify-center gap-2 rounded-2xl py-3 text-xs font-bold text-white shadow-sm transition-all active:scale-[0.98] ${
              mode === 'encrypt'
                ? 'bg-zinc-900 hover:bg-zinc-800'
                : 'bg-zinc-900 hover:bg-zinc-800'
            }`}
          >
            {mode === 'encrypt' ? <Lock className="h-4 w-4" /> : <Unlock className="h-4 w-4" />}
            <span>{mode === 'encrypt' ? 'Encrypt Payload with AES-256' : 'Decrypt with Password'}</span>
          </button>

          {/* Cryptographic Metadata Audit Block */}
          {cryptoMetadata && (
            <div className="rounded-2xl border border-zinc-200 bg-white p-3.5 space-y-1.5 font-mono text-[10px] text-zinc-600 shadow-sm">
              <div className="flex items-center gap-1.5 font-bold text-emerald-700 mb-1">
                <ShieldCheck className="h-3.5 w-3.5" />
                <span>Cryptographic Audit Envelope</span>
              </div>
              <div className="flex justify-between">
                <span>Cipher:</span>
                <span className="text-zinc-900 font-bold">{cryptoMetadata.algorithm}</span>
              </div>
              <div className="flex justify-between">
                <span>PBKDF2 Rounds:</span>
                <span className="text-zinc-900 font-bold">{cryptoMetadata.iterations.toLocaleString()}</span>
              </div>
              <div className="truncate">
                <span>Salt: </span>
                <span className="text-zinc-400">{cryptoMetadata.saltHex}</span>
              </div>
              <div className="truncate">
                <span>IV: </span>
                <span className="text-zinc-400">{cryptoMetadata.ivHex}</span>
              </div>
            </div>
          )}
        </div>

        {/* Right Plaintext & Ciphertext Split View */}
        <div className="flex-1 flex flex-col lg:flex-row overflow-hidden bg-white">
          {/* Plaintext Box */}
          <div className="w-full lg:w-1/2 flex flex-col border-b lg:border-b-0 lg:border-r border-zinc-200">
            <div className="shrink-0 flex items-center justify-between bg-zinc-50/80 px-4 py-2.5 border-b border-zinc-200 text-xs">
              <span className="font-mono text-[11px] text-zinc-500 font-bold">
                {mode === 'encrypt' ? 'Plaintext / Decrypted Input' : 'Decrypted Output'}
              </span>
            </div>

            <div className="flex-1 p-4 bg-white">
              {targetType === 'text' ? (
                <textarea
                  value={plainText}
                  onChange={(e) => setPlainText(e.target.value)}
                  placeholder="Enter sensitive text to encrypt..."
                  className="w-full h-full bg-transparent font-mono text-xs text-zinc-900 focus:outline-none resize-none leading-relaxed"
                  spellCheck={false}
                />
              ) : (
                <div className="h-full flex flex-col items-center justify-center border border-dashed border-zinc-300 rounded-2xl p-6 text-center bg-zinc-50/40">
                  <Upload className="h-8 w-8 text-zinc-400 mb-2" />
                  <span className="text-xs text-zinc-800 font-semibold">Select file to encrypt</span>
                  <span className="text-[10px] text-zinc-500 font-mono mt-1">Images, PDFs, documents, archives</span>
                  <input
                    type="file"
                    onChange={(e) => {
                      if (e.target.files?.[0]) {
                        setSelectedFileName(e.target.files[0].name);
                      }
                    }}
                    className="mt-3 text-xs text-zinc-600"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Ciphertext Box */}
          <div className="w-full lg:w-1/2 flex flex-col bg-zinc-50/30">
            <div className="shrink-0 flex items-center justify-between bg-zinc-50/80 px-4 py-2.5 border-b border-zinc-200 text-xs font-mono">
              <span className="text-[11px] text-zinc-500 font-bold">
                {mode === 'encrypt' ? 'AES-256-GCM Ciphertext (Base64)' : 'Ciphertext to Decrypt'}
              </span>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleDownloadEncryptedFile}
                  className="flex items-center gap-1 text-[11px] text-zinc-600 hover:text-zinc-950 font-medium"
                  title="Download .enc file"
                >
                  <Download className="h-3 w-3" />
                  <span>.enc</span>
                </button>

                <button
                  onClick={handleCopyCipher}
                  className="p-1 text-zinc-500 hover:text-zinc-900"
                  title="Copy Ciphertext"
                >
                  {copied ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
                </button>
              </div>
            </div>

            <div className="flex-1 p-4">
              <textarea
                value={cipherText}
                onChange={(e) => setCipherText(e.target.value)}
                placeholder="Ciphertext payload will appear here after encryption..."
                className="w-full h-full bg-transparent font-mono text-xs text-emerald-700 focus:outline-none resize-none leading-relaxed select-all"
                spellCheck={false}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
