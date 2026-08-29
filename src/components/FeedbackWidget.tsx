import React, { useState, useRef, useEffect } from 'react';
import {
  MessageSquare,
  X,
  Megaphone,
  Star,
  PackagePlus,
  Bug,
  ExternalLink,
  Loader2,
} from 'lucide-react';
import { sound } from '../lib/soundFx';

type FeedbackModalType = 'feedback' | 'rate' | 'request-tool' | 'bug' | null;

interface TallyOptionConfig {
  title: string;
  subtitle: string;
  badge?: string;
  icon: React.ReactNode;
  url: string;
  embedUrl: string;
}

const TALLY_CONFIG: Record<NonNullable<FeedbackModalType>, TallyOptionConfig> = {
  feedback: {
    title: 'Give feedback',
    subtitle: 'Share your thoughts & insights',
    icon: <Megaphone className="h-4 w-4" />,
    url: 'https://tally.so/r/LZLAD1',
    embedUrl: 'https://tally.so/embed/LZLAD1?alignLeft=1&hideTitle=1&transparentBackground=1&dynamicHeight=1',
  },
  rate: {
    title: 'Rate your experience',
    subtitle: 'Rate your quality level of interaction',
    icon: <Star className="h-4 w-4" />,
    url: 'https://tally.so/r/1AoZWW',
    embedUrl: 'https://tally.so/embed/1AoZWW?alignLeft=1&hideTitle=1&transparentBackground=1&dynamicHeight=1',
  },
  'request-tool': {
    title: 'Request a tool',
    subtitle: 'Suggest an open-source tool to add',
    badge: 'New',
    icon: <PackagePlus className="h-4 w-4" />,
    url: 'https://tally.so/r/J9va1d',
    embedUrl: 'https://tally.so/embed/J9va1d?alignLeft=1&hideTitle=1&transparentBackground=1&dynamicHeight=1',
  },
  bug: {
    title: 'Report a bug',
    subtitle: 'Help us improve with your catches',
    icon: <Bug className="h-4 w-4" />,
    url: 'https://tally.so/r/XxPV54',
    embedUrl: 'https://tally.so/embed/XxPV54?alignLeft=1&hideTitle=1&transparentBackground=1&dynamicHeight=1',
  },
};

export const FeedbackWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [activeModal, setActiveModal] = useState<FeedbackModalType>(null);
  const [isIframeLoading, setIsIframeLoading] = useState<boolean>(true);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu on outside click
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleOutsideClick);
    }
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, [isOpen]);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (activeModal) setActiveModal(null);
        else if (isOpen) setIsOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeModal, isOpen]);

  const handleOpenMenu = () => {
    sound.toggle();
    setIsOpen(!isOpen);
  };

  const handleSelectOption = (type: FeedbackModalType) => {
    sound.click();
    setIsOpen(false);
    setIsIframeLoading(true);
    setActiveModal(type);
  };

  const currentConfig = activeModal ? TALLY_CONFIG[activeModal] : null;

  return (
    <>
      {/* Floating Bottom Right Trigger & Menu */}
      <div ref={menuRef} className="fixed bottom-6 right-6 z-50 flex flex-col items-end select-none">
        {/* Popover Menu matching reference design */}
        {isOpen && (
          <div className="mb-3 w-72 sm:w-80 rounded-2xl border border-zinc-200/90 bg-white shadow-[0_16px_40px_-10px_rgba(0,0,0,0.12),0_2px_6px_rgba(0,0,0,0.04)] overflow-hidden animate-in fade-in slide-in-from-bottom-3 duration-200">
            {/* Header / List options */}
            <div className="p-2 space-y-0.5">
              {/* Option 1: Give feedback */}
              <button
                onClick={() => handleSelectOption('feedback')}
                className="group flex w-full items-center gap-3.5 rounded-xl p-3 text-left transition-colors hover:bg-zinc-50 active:bg-zinc-100"
              >
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-zinc-50 border border-zinc-200/80 text-zinc-700 transition-transform group-hover:scale-105 group-hover:bg-zinc-950 group-hover:text-white group-hover:border-zinc-950">
                  <Megaphone className="h-4 w-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="font-sans text-xs font-bold text-zinc-950">
                    Give feedback
                  </div>
                  <div className="text-[11px] text-zinc-400 font-normal truncate">
                    Share your thoughts & insights
                  </div>
                </div>
              </button>

              {/* Option 2: Rate your experience */}
              <button
                onClick={() => handleSelectOption('rate')}
                className="group flex w-full items-center gap-3.5 rounded-xl p-3 text-left transition-colors hover:bg-zinc-50 active:bg-zinc-100"
              >
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-zinc-50 border border-zinc-200/80 text-zinc-700 transition-transform group-hover:scale-105 group-hover:bg-zinc-950 group-hover:text-white group-hover:border-zinc-950">
                  <Star className="h-4 w-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="font-sans text-xs font-bold text-zinc-950">
                    Rate your experience
                  </div>
                  <div className="text-[11px] text-zinc-400 font-normal truncate">
                    Rate your quality level of interaction
                  </div>
                </div>
              </button>

              {/* Option 3: Request a tool */}
              <button
                onClick={() => handleSelectOption('request-tool')}
                className="group flex w-full items-center gap-3.5 rounded-xl p-3 text-left transition-colors hover:bg-zinc-50 active:bg-zinc-100"
              >
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-zinc-50 border border-zinc-200/80 text-zinc-700 transition-transform group-hover:scale-105 group-hover:bg-zinc-950 group-hover:text-white group-hover:border-zinc-950">
                  <PackagePlus className="h-4 w-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="font-sans text-xs font-bold text-zinc-950 flex items-center gap-1.5">
                    <span>Request a tool</span>
                    <span className="rounded bg-emerald-50 text-emerald-700 border border-emerald-200 px-1.5 py-0.2 text-[9px] font-mono font-bold">
                      New
                    </span>
                  </div>
                  <div className="text-[11px] text-zinc-400 font-normal truncate">
                    Suggest an open-source tool to add
                  </div>
                </div>
              </button>

              {/* Option 4: Report a bug */}
              <button
                onClick={() => handleSelectOption('bug')}
                className="group flex w-full items-center gap-3.5 rounded-xl p-3 text-left transition-colors hover:bg-zinc-50 active:bg-zinc-100"
              >
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-zinc-50 border border-zinc-200/80 text-zinc-700 transition-transform group-hover:scale-105 group-hover:bg-zinc-950 group-hover:text-white group-hover:border-zinc-950">
                  <Bug className="h-4 w-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="font-sans text-xs font-bold text-zinc-950">
                    Report a bug
                  </div>
                  <div className="text-[11px] text-zinc-400 font-normal truncate">
                    Help us improve with your catches
                  </div>
                </div>
              </button>
            </div>

            {/* Bottom Footer Attribution */}
            <div className="border-t border-zinc-100 bg-zinc-50/70 px-4 py-2 text-center text-[10px] font-mono text-zinc-400">
              Zero-Telemetry Community Hub
            </div>
          </div>
        )}

        {/* Circular Floating Action Trigger Button */}
        <button
          onClick={handleOpenMenu}
          className={`flex h-12 w-12 items-center justify-center rounded-full bg-zinc-900 text-white shadow-[0_8px_24px_rgba(0,0,0,0.18)] hover:bg-zinc-950 hover:scale-105 active:scale-95 transition-all duration-200 ${
            isOpen ? 'rotate-90 bg-zinc-950' : ''
          }`}
          title="Feedback & Suggestions"
        >
          {isOpen ? (
            <X className="h-5 w-5" />
          ) : (
            <MessageSquare className="h-5 w-5" />
          )}
        </button>
      </div>

      {/* Embedded Tally Modal */}
      {activeModal && currentConfig && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/45 p-4 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative flex flex-col h-[85vh] max-h-[680px] w-full max-w-lg rounded-2xl border border-zinc-200/90 bg-white shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-zinc-200/80 px-5 py-3.5 bg-zinc-50/70">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-white border border-zinc-200 text-zinc-900 shadow-2xs">
                  {currentConfig.icon}
                </div>
                <div className="min-w-0">
                  <h3 className="font-sans text-xs font-bold text-zinc-950 truncate">
                    {currentConfig.title}
                  </h3>
                  <p className="text-[11px] text-zinc-400 truncate">
                    {currentConfig.subtitle}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                <a
                  href={currentConfig.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 rounded-lg border border-zinc-200/80 bg-white px-2.5 py-1 text-[10px] font-mono font-medium text-zinc-600 hover:bg-zinc-100 hover:text-zinc-950 shadow-2xs transition"
                  title="Open in new tab"
                >
                  <ExternalLink className="h-3 w-3" />
                  <span className="hidden sm:inline">New tab</span>
                </a>

                <button
                  onClick={() => setActiveModal(null)}
                  className="rounded-lg p-1 text-zinc-400 hover:bg-zinc-200/80 hover:text-zinc-900 transition-colors"
                  title="Close (Esc)"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Tally Embedded Iframe */}
            <div className="relative flex-1 w-full bg-white overflow-hidden">
              {isIframeLoading && (
                <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-white">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-50 border border-zinc-200 animate-spin">
                    <Loader2 className="h-5 w-5 text-zinc-900" />
                  </div>
                  <p className="mt-3 text-xs font-mono text-zinc-400">Loading form...</p>
                </div>
              )}

              <iframe
                src={currentConfig.embedUrl}
                title={currentConfig.title}
                onLoad={() => setIsIframeLoading(false)}
                className="h-full w-full border-0 bg-transparent"
                allow="camera; microphone; autoplay; encrypted-media; fullscreen"
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
};
