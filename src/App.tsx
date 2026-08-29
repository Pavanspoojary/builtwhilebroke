import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { LicenseAuditModal } from './components/LicenseAuditModal';
import { CommandPalette } from './components/CommandPalette';
import { PrivacyModal } from './components/PrivacyModal';
import { TOOLS } from './data/toolsData';
import { ToolItem } from './types/tool';
import { SpotlightGrid } from './components/SpotlightGrid';

// Code-split route level pages
const HomePage = React.lazy(() => import('./pages/HomePage').then(m => ({ default: m.HomePage })));
const ToolsPage = React.lazy(() => import('./pages/ToolsPage').then(m => ({ default: m.ToolsPage })));
const ToolDetailPage = React.lazy(() => import('./pages/ToolDetailPage').then(m => ({ default: m.ToolDetailPage })));
const LegalPage = React.lazy(() => import('./pages/LegalPage').then(m => ({ default: m.LegalPage })));
const RequestedToolsPage = React.lazy(() => import('./pages/RequestedToolsPage').then(m => ({ default: m.RequestedToolsPage })));

const PageLoadingFallback: React.FC = () => (
  <div className="flex min-h-[60vh] w-full items-center justify-center">
    <div className="h-8 w-8 animate-spin rounded-full border-2 border-zinc-200 border-t-zinc-900" />
  </div>
);

function AppContent() {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedToolForAudit, setSelectedToolForAudit] = useState<ToolItem | null>(null);
  const [isLicenseAuditOpen, setIsLicenseAuditOpen] = useState<boolean>(false);
  const [isPrivacyOpen, setIsPrivacyOpen] = useState<boolean>(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState<boolean>(false);

  // Check if we are on an individual tool workspace page
  const isToolDetailPage =
    location.pathname.startsWith('/tools/') && location.pathname !== '/tools';

  // Global Cmd+K / Ctrl+K keyboard shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleOpenAuditForTool = (tool: ToolItem) => {
    setSelectedToolForAudit(tool);
    setIsLicenseAuditOpen(true);
  };

  const handleSelectToolFromPalette = (tool: ToolItem) => {
    navigate(`/tools/${tool.id}`);
  };

  const handleSelectCategoryFromPalette = (categoryId: string) => {
    if (categoryId === 'all') {
      navigate('/tools');
    } else {
      navigate(`/tools?category=${categoryId}`);
    }
  };

  return (
    <div className="relative min-h-screen bg-[#fafafa] text-zinc-900 flex flex-col selection:bg-zinc-900 selection:text-white">
      {/* Interactive Cursor Spotlight & Cyber Matrix Dot Grid */}
      <SpotlightGrid />

      {/* Global Ambient Liquid Glass Radiance Blobs */}
      <div className="liquid-ambient-mesh" aria-hidden="true">
        <div className="liquid-blob-light" />
        <div className="liquid-blob-subtle" />
      </div>

      {/* Global Tactile Micro-Grain Overlay */}
      <svg
        className="pointer-events-none fixed inset-0 z-0 h-full w-full opacity-[0.025] mix-blend-overlay"
        aria-hidden="true"
      >
        <filter id="global-noise-grain">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.8"
            numOctaves="3"
            stitchTiles="stitch"
          />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#global-noise-grain)" />
      </svg>

      {/* Sticky Header: only on Home & Tools directory pages */}
      {!isToolDetailPage && (
        <div className="relative z-30">
          <Header
            onOpenLicenseAudit={() => {
              setSelectedToolForAudit(null);
              setIsLicenseAuditOpen(true);
            }}
            onOpenPrivacy={() => setIsPrivacyOpen(true)}
            totalTools={TOOLS.length}
          />
        </div>
      )}

      {/* Main Routed Content */}
      <div className="relative z-10 flex-1">
        <React.Suspense fallback={<PageLoadingFallback />}>
          <Routes>
            <Route
              path="/"
              element={<HomePage onViewAudit={handleOpenAuditForTool} />}
            />
            <Route
              path="/tools"
              element={<ToolsPage onViewAudit={handleOpenAuditForTool} />}
            />
            <Route
              path="/tools/:toolId"
              element={<ToolDetailPage onViewAudit={handleOpenAuditForTool} />}
            />
            <Route
              path="/legal"
              element={<LegalPage />}
            />
            <Route
              path="/requested"
              element={<RequestedToolsPage />}
            />
            <Route
              path="*"
              element={<ToolsPage onViewAudit={handleOpenAuditForTool} />}
            />
          </Routes>
        </React.Suspense>
      </div>

      {/* Footer: only on Home & Tools directory pages */}
      {!isToolDetailPage && (
        <Footer
          onOpenLicenseAudit={() => {
            setSelectedToolForAudit(null);
            setIsLicenseAuditOpen(true);
          }}
          onOpenPrivacy={() => setIsPrivacyOpen(true)}
        />
      )}

      {/* Modals & Command Palette */}
      <LicenseAuditModal
        tools={TOOLS}
        isOpen={isLicenseAuditOpen}
        onClose={() => {
          setIsLicenseAuditOpen(false);
          setSelectedToolForAudit(null);
        }}
        selectedToolForAudit={selectedToolForAudit}
      />

      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        tools={TOOLS}
        onSelectTool={handleSelectToolFromPalette}
        onSelectCategory={handleSelectCategoryFromPalette}
        onOpenLicenseAudit={() => {
          setSelectedToolForAudit(null);
          setIsLicenseAuditOpen(true);
        }}
        onOpenPrivacy={() => setIsPrivacyOpen(true)}
      />

      <PrivacyModal
        isOpen={isPrivacyOpen}
        onClose={() => setIsPrivacyOpen(false)}
      />
    </div>
  );
}

export function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;
