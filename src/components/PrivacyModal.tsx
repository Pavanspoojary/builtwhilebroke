import React, { useState, useEffect } from 'react';
import {
  X,
  Trash2,
  CheckCircle2,
  RotateCcw,
  ShieldCheck,
  HardDrive,
  Layers,
  Database,
  Archive,
  ChevronDown,
  ChevronUp,
  Loader2,
} from 'lucide-react';
import {
  inspectClientStorage,
  purgeAllClientData,
  formatBytes,
  StorageBreakdown,
} from '../lib/clearData';
import { sound } from '../lib/soundFx';

interface PrivacyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PrivacyModal: React.FC<PrivacyModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [storageInfo, setStorageInfo] = useState<StorageBreakdown | null>(null);
  const [isPurging, setIsPurging] = useState<boolean>(false);
  const [purgeResult, setPurgeResult] = useState<{
    items: string[];
    freedBytes: number;
    timestamp: string;
  } | null>(null);
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  const loadStorage = async () => {
    sound.click();
    const info = await inspectClientStorage();
    setStorageInfo(info);
  };

  useEffect(() => {
    if (isOpen) {
      inspectClientStorage().then(setStorageInfo);
      setPurgeResult(null);
      setExpandedSection(null);
    }
  }, [isOpen]);

  // Handle ESC key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const handlePurge = async () => {
    setIsPurging(true);
    sound.launch();

    // Short artificial delay for tactile smooth feedback
    await new Promise((r) => setTimeout(r, 450));

    const res = await purgeAllClientData();
    const now = new Date().toLocaleTimeString();

    setPurgeResult({
      items: res.clearedItems,
      freedBytes: res.totalBytesFreed,
      timestamp: now,
    });

    const updated = await inspectClientStorage();
    setStorageInfo(updated);
    setIsPurging(false);
    sound.pop();
  };

  if (!isOpen) return null;

  const usagePercent =
    storageInfo && storageInfo.quotaBytes > 0
      ? ((storageInfo.estimatedBytes / storageInfo.quotaBytes) * 100).toFixed(4)
      : '0.0001';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/50 p-4 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative flex w-full max-w-xl flex-col rounded-3xl bg-white shadow-[0_25px_60px_-15px_rgba(0,0,0,0.3)] overflow-hidden border border-zinc-200/90 text-zinc-900 animate-in zoom-in-95 duration-200">
        {/* Top Specular Hairline Accent */}
        <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-red-500/40 to-transparent" />

        {/* Header */}
        <div className="flex shrink-0 items-center justify-between border-b border-zinc-100 bg-zinc-50/50 px-6 py-4.5">
          <div className="flex items-center gap-3.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-red-200 bg-red-50/80 text-red-600 shadow-2xs">
              <Trash2 className="h-5 w-5 stroke-[2]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-extrabold tracking-tight text-zinc-950">
                  Client-Side Privacy & Storage Purge Center
                </h2>
              </div>
              <p className="text-xs text-zinc-500 font-normal">
                Inspect local cache and reset browser memory with zero tracking.
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              sound.toggle();
              onClose();
            }}
            className="rounded-xl border border-zinc-200/80 bg-white p-1.5 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-700 transition-colors shadow-2xs"
            title="Close (Esc)"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5 bg-white max-h-[80vh] overflow-y-auto">
          {/* Zero Telemetry Banner */}
          <div className="relative overflow-hidden rounded-2xl border border-emerald-200/80 bg-gradient-to-br from-emerald-50/80 to-emerald-50/20 p-4 text-xs shadow-2xs">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 font-bold text-emerald-900">
                <ShieldCheck className="h-4 w-4 text-emerald-600 shrink-0" />
                <span>Zero-Telemetry & 100% In-Browser Guarantee</span>
              </div>
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100/80 border border-emerald-300/80 px-2 py-0.5 text-[10px] font-mono font-bold text-emerald-800">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span>Isolated</span>
              </span>
            </div>
            <p className="mt-2 text-zinc-600 leading-relaxed text-[11px] font-normal">
              Every tool hosted on BuiltWhileBroke processes images, code, audio, and databases directly in your client browser memory using WebAssembly, WebGL, and WebGPU. No uploaded files or keystrokes are sent to cloud tracking servers.
            </p>
          </div>

          {/* Real Storage Quota Meter */}
          {storageInfo && (
            <div className="rounded-2xl border border-zinc-200/80 bg-zinc-50/60 p-4 shadow-2xs">
              <div className="flex items-center justify-between text-xs mb-2">
                <div className="flex items-center gap-1.5 font-bold text-zinc-800">
                  <HardDrive className="h-3.5 w-3.5 text-zinc-600" />
                  <span>Disk Storage Quota Usage</span>
                </div>
                <div className="font-mono text-xs font-bold text-zinc-950">
                  {formatBytes(storageInfo.estimatedBytes)}{' '}
                  <span className="text-zinc-400 font-normal font-mono text-[11px]">
                    / {storageInfo.quotaBytes > 0 ? formatBytes(storageInfo.quotaBytes) : 'Browser Quota'} ({usagePercent}%)
                  </span>
                </div>
              </div>

              {/* Progress bar */}
              <div className="h-2 w-full overflow-hidden rounded-full bg-zinc-200/80 p-0.5">
                <div
                  className="h-full bg-zinc-900 transition-all duration-500 rounded-full"
                  style={{
                    width: `${Math.max(1, Math.min(100, (storageInfo.estimatedBytes / Math.max(storageInfo.quotaBytes, 1024 * 1024)) * 100))}%`,
                  }}
                />
              </div>
            </div>
          )}

          {/* Storage Breakdown Cards */}
          <div>
            <div className="flex items-center justify-between mb-2.5">
              <h3 className="text-[11px] font-bold text-zinc-700 uppercase tracking-wider font-mono">
                Active Client Storage Usage
              </h3>
              <button
                onClick={loadStorage}
                className="flex items-center gap-1 text-[11px] text-zinc-500 hover:text-zinc-900 transition-colors font-medium cursor-pointer"
                title="Re-inspect storage"
              >
                <RotateCcw className="h-3 w-3" />
                <span>Refresh</span>
              </button>
            </div>

            {storageInfo ? (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-center text-xs">
                {/* LocalStorage Card */}
                <button
                  type="button"
                  onClick={() => {
                    sound.toggle();
                    setExpandedSection(expandedSection === 'local' ? null : 'local');
                  }}
                  className={`group relative rounded-2xl border p-4 transition-all text-left cursor-pointer ${
                    expandedSection === 'local'
                      ? 'border-zinc-950 bg-zinc-950 text-white shadow-md'
                      : 'border-zinc-200/90 bg-white hover:border-zinc-300 hover:bg-zinc-50/80 text-zinc-900 shadow-2xs'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-1.5">
                      <HardDrive className={`h-3.5 w-3.5 ${expandedSection === 'local' ? 'text-zinc-300' : 'text-zinc-500'}`} />
                      <span className={`text-[10px] font-mono uppercase font-bold ${expandedSection === 'local' ? 'text-zinc-300' : 'text-zinc-600'}`}>
                        LocalStorage
                      </span>
                    </div>
                    {storageInfo.localStorageKeys > 0 && (
                      expandedSection === 'local' ? <ChevronUp className="h-3 w-3 text-zinc-400" /> : <ChevronDown className="h-3 w-3 text-zinc-400" />
                    )}
                  </div>
                  <div className="font-mono text-2xl font-extrabold tracking-tight">
                    {storageInfo.localStorageKeys}
                  </div>
                  <div className={`text-[10px] font-mono mt-1 ${expandedSection === 'local' ? 'text-zinc-300' : 'text-zinc-400'}`}>
                    {storageInfo.localStorageKeys === 1 ? '1 active key' : `${storageInfo.localStorageKeys} active keys`}
                  </div>
                </button>

                {/* SessionStorage Card */}
                <button
                  type="button"
                  onClick={() => {
                    sound.toggle();
                    setExpandedSection(expandedSection === 'session' ? null : 'session');
                  }}
                  className={`group relative rounded-2xl border p-4 transition-all text-left cursor-pointer ${
                    expandedSection === 'session'
                      ? 'border-zinc-950 bg-zinc-950 text-white shadow-md'
                      : 'border-zinc-200/90 bg-white hover:border-zinc-300 hover:bg-zinc-50/80 text-zinc-900 shadow-2xs'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-1.5">
                      <Layers className={`h-3.5 w-3.5 ${expandedSection === 'session' ? 'text-zinc-300' : 'text-zinc-500'}`} />
                      <span className={`text-[10px] font-mono uppercase font-bold ${expandedSection === 'session' ? 'text-zinc-300' : 'text-zinc-600'}`}>
                        Session
                      </span>
                    </div>
                    {storageInfo.sessionStorageKeys > 0 && (
                      expandedSection === 'session' ? <ChevronUp className="h-3 w-3 text-zinc-400" /> : <ChevronDown className="h-3 w-3 text-zinc-400" />
                    )}
                  </div>
                  <div className="font-mono text-2xl font-extrabold tracking-tight">
                    {storageInfo.sessionStorageKeys}
                  </div>
                  <div className={`text-[10px] font-mono mt-1 ${expandedSection === 'session' ? 'text-zinc-300' : 'text-zinc-400'}`}>
                    {storageInfo.sessionStorageKeys === 1 ? '1 active key' : `${storageInfo.sessionStorageKeys} active keys`}
                  </div>
                </button>

                {/* CacheStorage Card */}
                <button
                  type="button"
                  onClick={() => {
                    sound.toggle();
                    setExpandedSection(expandedSection === 'cache' ? null : 'cache');
                  }}
                  className={`group relative rounded-2xl border p-4 transition-all text-left cursor-pointer ${
                    expandedSection === 'cache'
                      ? 'border-zinc-950 bg-zinc-950 text-white shadow-md'
                      : 'border-zinc-200/90 bg-white hover:border-zinc-300 hover:bg-zinc-50/80 text-zinc-900 shadow-2xs'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-1.5">
                      <Archive className={`h-3.5 w-3.5 ${expandedSection === 'cache' ? 'text-zinc-300' : 'text-zinc-500'}`} />
                      <span className={`text-[10px] font-mono uppercase font-bold ${expandedSection === 'cache' ? 'text-zinc-300' : 'text-zinc-600'}`}>
                        Cache
                      </span>
                    </div>
                    {storageInfo.cacheStorageEntries > 0 && (
                      expandedSection === 'cache' ? <ChevronUp className="h-3 w-3 text-zinc-400" /> : <ChevronDown className="h-3 w-3 text-zinc-400" />
                    )}
                  </div>
                  <div className="font-mono text-2xl font-extrabold tracking-tight">
                    {storageInfo.cacheStorageEntries}
                  </div>
                  <div className={`text-[10px] font-mono mt-1 ${expandedSection === 'cache' ? 'text-zinc-300' : 'text-zinc-400'}`}>
                    {storageInfo.cacheStorageEntries === 1 ? '1 cache store' : `${storageInfo.cacheStorageEntries} cache stores`}
                  </div>
                </button>

                {/* IndexedDB Card */}
                <button
                  type="button"
                  onClick={() => {
                    sound.toggle();
                    setExpandedSection(expandedSection === 'indexeddb' ? null : 'indexeddb');
                  }}
                  className={`group relative rounded-2xl border p-4 transition-all text-left cursor-pointer ${
                    expandedSection === 'indexeddb'
                      ? 'border-zinc-950 bg-zinc-950 text-white shadow-md'
                      : 'border-zinc-200/90 bg-white hover:border-zinc-300 hover:bg-zinc-50/80 text-zinc-900 shadow-2xs'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-1.5">
                      <Database className={`h-3.5 w-3.5 ${expandedSection === 'indexeddb' ? 'text-zinc-300' : 'text-zinc-500'}`} />
                      <span className={`text-[10px] font-mono uppercase font-bold ${expandedSection === 'indexeddb' ? 'text-zinc-300' : 'text-zinc-600'}`}>
                        IndexedDB
                      </span>
                    </div>
                    {storageInfo.indexedDbDatabases > 0 && (
                      expandedSection === 'indexeddb' ? <ChevronUp className="h-3 w-3 text-zinc-400" /> : <ChevronDown className="h-3 w-3 text-zinc-400" />
                    )}
                  </div>
                  <div className="font-mono text-2xl font-extrabold tracking-tight">
                    {storageInfo.indexedDbDatabases}
                  </div>
                  <div className={`text-[10px] font-mono mt-1 ${expandedSection === 'indexeddb' ? 'text-zinc-300' : 'text-zinc-400'}`}>
                    {storageInfo.indexedDbDatabases === 1 ? '1 database' : `${storageInfo.indexedDbDatabases} databases`}
                  </div>
                </button>
              </div>
            ) : (
              <div className="py-4 text-center text-xs text-zinc-400 font-mono">
                <Loader2 className="mx-auto h-4 w-4 animate-spin mb-1" />
                <span>Inspecting storage subsystems...</span>
              </div>
            )}

            {/* Expandable Key Breakdown Viewer */}
            {expandedSection && storageInfo && (
              <div className="mt-3 rounded-2xl border border-zinc-200/90 bg-zinc-50/90 p-4 text-xs animate-in fade-in slide-in-from-top-1 duration-150">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-zinc-900 font-mono uppercase text-[11px]">
                    {expandedSection === 'local' && 'LocalStorage Keys in Browser'}
                    {expandedSection === 'session' && 'SessionStorage Keys in Browser'}
                    {expandedSection === 'cache' && 'CacheStorage Buckets'}
                    {expandedSection === 'indexeddb' && 'IndexedDB Databases'}
                  </span>
                  <button
                    onClick={() => setExpandedSection(null)}
                    className="text-[11px] text-zinc-400 hover:text-zinc-700 cursor-pointer"
                  >
                    Close inspection
                  </button>
                </div>

                <div className="max-h-32 overflow-y-auto space-y-1 font-mono text-[11px] text-zinc-600 bg-white p-2.5 rounded-xl border border-zinc-200">
                  {expandedSection === 'local' &&
                    (storageInfo.localStorageKeyList.length > 0 ? (
                      storageInfo.localStorageKeyList.map((key) => (
                        <div key={key} className="flex items-center justify-between py-0.5 border-b border-zinc-100 last:border-0">
                          <span className="text-zinc-800 font-semibold">{key}</span>
                          <span className="text-zinc-400 text-[10px]">
                            {localStorage.getItem(key)?.length || 0} chars
                          </span>
                        </div>
                      ))
                    ) : (
                      <p className="text-zinc-400 italic">No LocalStorage keys active.</p>
                    ))}

                  {expandedSection === 'session' &&
                    (storageInfo.sessionStorageKeyList.length > 0 ? (
                      storageInfo.sessionStorageKeyList.map((key) => (
                        <div key={key} className="py-0.5">
                          {key}
                        </div>
                      ))
                    ) : (
                      <p className="text-zinc-400 italic">No SessionStorage keys active.</p>
                    ))}

                  {expandedSection === 'cache' &&
                    (storageInfo.cacheNames.length > 0 ? (
                      storageInfo.cacheNames.map((name) => (
                        <div key={name} className="py-0.5">
                          {name}
                        </div>
                      ))
                    ) : (
                      <p className="text-zinc-400 italic">No CacheStorage buckets active.</p>
                    ))}

                  {expandedSection === 'indexeddb' &&
                    (storageInfo.indexedDbNames.length > 0 ? (
                      storageInfo.indexedDbNames.map((name) => (
                        <div key={name} className="py-0.5">
                          {name}
                        </div>
                      ))
                    ) : (
                      <p className="text-zinc-400 italic">No IndexedDB databases active.</p>
                    ))}
                </div>
              </div>
            )}
          </div>

          {/* Purge Notification & Result Summary */}
          {purgeResult && (
            <div className="rounded-2xl border border-emerald-200/90 bg-emerald-50/90 p-4 text-xs text-emerald-900 shadow-2xs animate-in zoom-in-95 duration-150">
              <div className="flex items-center gap-2 font-bold text-emerald-950 mb-1">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                <span>Client Purge Completed at {purgeResult.timestamp}</span>
              </div>
              <p className="text-emerald-800 text-[11px] leading-relaxed">
                Successfully wiped {purgeResult.items.join(', ')}. All local database caches, model weights, and preferences have been reset to zero.
              </p>
            </div>
          )}

          {/* Action Button */}
          <div className="pt-2">
            <button
              onClick={handlePurge}
              disabled={isPurging}
              className="flex w-full items-center justify-center gap-2 rounded-2xl bg-red-600 px-5 py-3.5 text-xs font-bold text-white shadow-md hover:bg-red-700 active:scale-[0.98] disabled:opacity-60 transition-all cursor-pointer select-none"
            >
              {isPurging ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Wiping All Browser Storage Subsystems...</span>
                </>
              ) : (
                <>
                  <Trash2 className="h-4 w-4" />
                  <span>Purge All Client Data & Offline Caches</span>
                </>
              )}
            </button>
            <p className="mt-2.5 text-center text-[11px] text-zinc-400 font-mono">
              Safely wipes all cached models, local storage keys, and database chunks across all hosted tools.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
