import React, { useState, useEffect } from 'react';
import { Link, NavLink } from 'react-router-dom';
import {
  Search,
  Shield,
  Trash2,
  Volume2,
  VolumeX,
} from 'lucide-react';
import { sound } from '../lib/soundFx';
import { BuyMeACoffeeButton } from './BuyMeACoffeeButton';

interface HeaderProps {
  onOpenSearch: () => void;
  onOpenLicenseAudit: () => void;
  onOpenPrivacy: () => void;
  totalTools: number;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenSearch,
  onOpenLicenseAudit,
  onOpenPrivacy,
  totalTools,
}) => {
  const [isMuted, setIsMuted] = useState<boolean>(false);

  useEffect(() => {
    setIsMuted(sound.getMuted());
  }, []);

  const handleToggleSound = () => {
    const muted = sound.toggleMute();
    setIsMuted(muted);
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-zinc-200/80 bg-white/85 backdrop-blur-2xl transition-all shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand Logo & Main Nav Links */}
        <div className="flex items-center gap-6">
          <Link
            to="/"
            onClick={() => sound.click()}
            className="flex items-center gap-2.5 group"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-zinc-100 border border-zinc-200/80 p-1 shadow-2xs transition-transform duration-200 group-hover:scale-105">
              <img src="/logo.png" alt="BuiltWhileBroke" className="h-full w-full object-contain" />
            </div>
            <span className="font-sans text-sm font-extrabold tracking-tight text-zinc-900">
              BuiltWhile<span className="text-zinc-500">Broke</span>
            </span>
          </Link>

          {/* Minimal Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 text-xs font-semibold">
            <NavLink
              to="/"
              onClick={() => sound.toggle()}
              className={({ isActive }) =>
                `rounded-lg px-2.5 py-1.5 transition-colors ${
                  isActive
                    ? 'bg-zinc-100 text-zinc-900 font-bold'
                    : 'text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100/60'
                }`
              }
            >
              Home
            </NavLink>

            <NavLink
              to="/tools"
              onClick={() => sound.toggle()}
              className={({ isActive }) =>
                `rounded-lg px-2.5 py-1.5 transition-colors ${
                  isActive
                    ? 'bg-zinc-100 text-zinc-900 font-bold'
                    : 'text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100/60'
                }`
              }
            >
              Tools ({totalTools})
            </NavLink>

            <NavLink
              to="/legal"
              onClick={() => sound.toggle()}
              className={({ isActive }) =>
                `rounded-lg px-2.5 py-1.5 transition-colors ${
                  isActive
                    ? 'bg-zinc-100 text-zinc-900 font-bold'
                    : 'text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100/60'
                }`
              }
            >
              Legal
            </NavLink>
          </nav>
        </div>

        {/* Global Actions */}
        <div className="flex items-center gap-2">
          {/* Audio Feedback Toggle */}
          <button
            onClick={handleToggleSound}
            className={`rounded-lg p-1.5 text-xs transition-colors ${
              isMuted
                ? 'text-zinc-400 hover:text-zinc-600'
                : 'text-zinc-900 hover:text-zinc-600'
            }`}
            title={isMuted ? 'Unmute UI sounds' : 'Mute UI sounds'}
          >
            {isMuted ? (
              <VolumeX className="h-4 w-4" />
            ) : (
              <Volume2 className="h-4 w-4" />
            )}
          </button>

          {/* Quick Search Bar Trigger */}
          <button
            onClick={() => {
              sound.click();
              onOpenSearch();
            }}
            className="flex items-center gap-2 rounded-xl border border-zinc-200 bg-zinc-50/80 px-3 py-1.5 text-xs text-zinc-600 transition-colors hover:border-zinc-300 hover:bg-white hover:text-zinc-900 shadow-sm"
          >
            <Search className="h-3.5 w-3.5 text-zinc-400" />
            <span className="hidden sm:inline">Search</span>
            <kbd className="hidden sm:inline rounded bg-zinc-200/80 px-1.5 py-0.2 text-[10px] font-mono text-zinc-600 font-medium">
              ⌘K
            </kbd>
          </button>

          {/* Buy me a coffee (Dodo Payments) */}
          <BuyMeACoffeeButton variant="header" />

          {/* Commercial License Audit Modal Button */}
          <button
            onClick={() => {
              sound.click();
              onOpenLicenseAudit();
            }}
            className="flex items-center gap-1.5 rounded-xl border border-zinc-200 bg-zinc-50/80 px-2.5 py-1.5 text-xs font-semibold text-zinc-700 transition-colors hover:border-zinc-300 hover:bg-white hover:text-zinc-900 shadow-sm"
            title="Commercial Licensing Audit"
          >
            <Shield className="h-3.5 w-3.5 text-zinc-900" />
            <span className="hidden md:inline">Audit</span>
          </button>

          {/* Master Privacy & Purge Trigger */}
          <button
            onClick={() => {
              sound.click();
              onOpenPrivacy();
            }}
            className="rounded-lg p-1.5 text-zinc-400 hover:text-red-500 transition-colors"
            title="Purge local storage & cache"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </header>
  );
};
