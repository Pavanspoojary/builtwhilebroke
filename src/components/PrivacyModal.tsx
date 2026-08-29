import React, { useState, useEffect } from 'react';
import {
  X,
  Trash2,
  CheckCircle2,
  RotateCcw,
  Lock,
} from 'lucide-react';
import {
  inspectClientStorage,
  purgeAllClientData,
  StorageBreakdown,
} from '../lib/clearData';

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
  const [purgeResult, setPurgeResult] = useState<string[] | null>(null);

  const loadStorage = async () => {
    const info = await inspectClientStorage();
    setStorageInfo(info);
  };

  useEffect(() => {
    if (isOpen) {
      loadStorage();
      setPurgeResult(null);
    }
  }, [isOpen]);

  const handlePurge = async () => {
    setIsPurging(true);
    const res = await purgeAllClientData();
    setPurgeResult(res.clearedItems);
    await loadStorage();
    setIsPurging(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-xl animate-in fade-in duration-200">
      <div className="flex w-full max-w-xl flex-col rounded-3xl bg-white shadow-2xl overflow-hidden border border-zinc-200/90 text-zinc-900">
        {/* Header */}
        <div className="flex shrink-0 items-center justify-between border-b border-zinc-200 bg-white px-6 py-4.5">
          <div className="flex items-center gap-3.5">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-red-200 bg-red-50 text-red-600 shadow-sm">
              <Trash2 className="h-5.5 w-5.5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-zinc-950">
                Client-Side Privacy & Storage Purge Center
              </h2>
              <p className="text-xs text-zinc-500">
                Inspect local cache and reset browser memory with zero tracking.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="rounded-xl border border-zinc-200 bg-zinc-50 p-2 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-700 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5 bg-white">
          {/* Zero Telemetry Banner */}
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50/50 p-4 text-xs shadow-sm">
            <div className="flex items-center gap-2 font-bold text-emerald-800">
              <Lock className="h-4 w-4 text-emerald-600" />
              <span>Zero-Telemetry & 100% In-Browser Guarantee</span>
            </div>
            <p className="mt-1.5 text-zinc-600 leading-relaxed text-[11px]">
              Every tool hosted on BuiltWhileBroke processes images, code, audio, and databases directly in your client browser memory using WebAssembly, WebGL, and WebGPU. No uploaded files or keystrokes are sent to cloud tracking servers.
            </p>
          </div>

          {/* Current Storage Breakdown */}
          <div>
            <div className="flex items-center justify-between mb-2.5">
              <h3 className="text-xs font-bold text-zinc-800 uppercase tracking-wider font-mono">
                Active Client Storage Usage
              </h3>
              <button
                onClick={loadStorage}
                className="flex items-center gap-1 text-[11px] text-zinc-500 hover:text-zinc-900 transition-colors font-medium"
              >
                <RotateCcw className="h-3 w-3" />
                <span>Refresh</span>
              </button>
            </div>

            {storageInfo ? (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-center text-xs">
                <div className="rounded-2xl border border-zinc-200 bg-zinc-50/70 p-3.5 shadow-sm">
                  <div className="font-mono text-lg font-extrabold text-zinc-900">
                    {storageInfo.localStorageKeys}
                  </div>
                  <div className="text-[10px] text-zinc-500 font-mono mt-0.5 font-medium">LocalStorage</div>
                </div>

                <div className="rounded-2xl border border-zinc-200 bg-zinc-50/70 p-3.5 shadow-sm">
                  <div className="font-mono text-lg font-extrabold text-zinc-900">
                    {storageInfo.sessionStorageKeys}
                  </div>
                  <div className="text-[10px] text-zinc-500 font-mono mt-0.5 font-medium">SessionStorage</div>
                </div>

                <div className="rounded-2xl border border-zinc-200 bg-zinc-50/70 p-3.5 shadow-sm">
                  <div className="font-mono text-lg font-extrabold text-zinc-900">
                    {storageInfo.cacheStorageEntries}
                  </div>
                  <div className="text-[10px] text-zinc-500 font-mono mt-0.5 font-medium">Cache Storage</div>
                </div>

                <div className="rounded-2xl border border-zinc-200 bg-zinc-50/70 p-3.5 shadow-sm">
                  <div className="font-mono text-lg font-extrabold text-zinc-900">
                    {storageInfo.indexedDbDatabases}
                  </div>
                  <div className="text-[10px] text-zinc-500 font-mono mt-0.5 font-medium">IndexedDB</div>
                </div>
              </div>
            ) : (
              <div className="py-4 text-center text-xs text-zinc-400 font-mono">
                Inspecting storage...
              </div>
            )}
          </div>

          {/* Purge Notification */}
          {purgeResult && (
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-3.5 text-xs text-emerald-800 flex items-center gap-2 shadow-sm font-medium">
              <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
              <span>
                Purge complete: Cleared {purgeResult.join(', ')}.
              </span>
            </div>
          )}

          {/* Action Button */}
          <div className="pt-2">
            <button
              onClick={handlePurge}
              disabled={isPurging}
              className="flex w-full items-center justify-center gap-2 rounded-2xl bg-red-600 px-4 py-3 text-xs font-bold text-white shadow-sm hover:bg-red-700 active:scale-[0.98] disabled:opacity-50 transition-all"
            >
              <Trash2 className="h-4 w-4" />
              <span>{isPurging ? 'Purging Local Storage...' : 'Purge All Client Data & Offline Caches'}</span>
            </button>
            <p className="mt-2.5 text-center text-[11px] text-zinc-400 font-mono">
              This safely wipes all cached models, local storage keys, and database chunks across all hosted tools.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
