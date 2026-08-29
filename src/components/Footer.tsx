import React from 'react';
import { Link } from 'react-router-dom';
import {
  Shield,
  Lock,
} from 'lucide-react';
import { CategoryId } from '../types/tool';
import { TOOLS } from '../data/toolsData';
import { sound } from '../lib/soundFx';
import { BuyMeACoffeeButton } from './BuyMeACoffeeButton';

interface FooterProps {
  onSelectCategory?: (id: CategoryId) => void;
  onOpenLicenseAudit: () => void;
  onOpenPrivacy: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onOpenLicenseAudit,
  onOpenPrivacy,
}) => {
  return (
    <footer className="mt-20 border-t border-zinc-200/80 bg-white text-zinc-600 text-xs">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Brand & Purpose */}
          <div className="flex items-center gap-3">
            <Link
              to="/"
              onClick={() => sound.click()}
              className="flex items-center gap-2 text-zinc-900 font-extrabold text-sm tracking-tight"
            >
              <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-zinc-100 border border-zinc-200/80 p-0.5 shadow-2xs">
                <img src="/logo.png" alt="BuiltWhileBroke" className="h-full w-full object-contain" />
              </div>
              <span>BuiltWhile<span className="text-zinc-500">Broke</span></span>
            </Link>
            <span className="text-zinc-300">•</span>
            <span className="text-zinc-500 text-[11px] font-mono font-medium">{TOOLS.length} In-Browser Workbenches</span>
          </div>

          {/* Quick Legal, Coffee & Purge Links */}
          <div className="flex flex-wrap items-center gap-4 text-[11px] font-mono">
            <BuyMeACoffeeButton variant="footer" />

            <Link
              to="/legal"
              onClick={() => sound.click()}
              className="flex items-center gap-1 text-zinc-600 hover:text-zinc-950 font-medium transition-colors"
            >
              <span>Legal Policies</span>
            </Link>

            <button
              onClick={() => {
                sound.click();
                onOpenLicenseAudit();
              }}
              className="flex items-center gap-1 text-zinc-600 hover:text-zinc-950 font-medium transition-colors"
            >
              <Shield className="h-3 w-3 text-zinc-900" />
              <span>Commercial Audit</span>
            </button>

            <button
              onClick={() => {
                sound.click();
                onOpenPrivacy();
              }}
              className="flex items-center gap-1 text-zinc-600 hover:text-zinc-950 font-medium transition-colors"
            >
              <Lock className="h-3 w-3" />
              <span>Zero Telemetry Purge</span>
            </button>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="mt-6 pt-6 border-t border-zinc-100 text-center text-[10px] text-zinc-400 font-mono">
          © {new Date().getFullYear()} BuiltWhileBroke. Crafted for open-source builders with zero cloud tracking.
        </div>
      </div>
    </footer>
  );
};
