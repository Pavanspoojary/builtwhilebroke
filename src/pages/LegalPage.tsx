import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ArrowLeft, ChevronRight, Printer, Share2, Check, ShieldCheck } from 'lucide-react';
import { LEGAL_DOCUMENTS, LegalDocument } from '../data/legalDocuments';
import { sound } from '../lib/soundFx';
import { SeoHead } from '../components/SeoHead';

export const LegalPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const docIdFromUrl = searchParams.get('doc');

  const [selectedDoc, setSelectedDoc] = useState<LegalDocument | null>(null);
  const [copiedLink, setCopiedLink] = useState<boolean>(false);

  useEffect(() => {
    if (docIdFromUrl) {
      const found = LEGAL_DOCUMENTS.find((d) => d.id === docIdFromUrl);
      if (found) {
        setSelectedDoc(found);
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }
    }
    setSelectedDoc(null);
  }, [docIdFromUrl]);

  const handleSelectDoc = (doc: LegalDocument) => {
    sound.click();
    setSearchParams({ doc: doc.id });
    setSelectedDoc(doc);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToHub = () => {
    sound.toggle();
    setSearchParams({});
    setSelectedDoc(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCopyLink = () => {
    sound.pop();
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handlePrint = () => {
    sound.click();
    window.print();
  };

  return (
    <div className="min-h-screen py-16 sm:py-24">
      <SeoHead
        title={selectedDoc ? selectedDoc.title : 'Legal Policies & Compliance Hub'}
        description={selectedDoc ? selectedDoc.summary : 'Explore BuiltWhileBroke terms of service, privacy policies, acceptable use, and zero-telemetry agreements.'}
        pageType="legal"
      />

      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        {!selectedDoc ? (
          /* Legal Hub Grid View (Matches reference design exactly) */
          <div>
            {/* Header */}
            <div className="text-center">
              <h1 className="font-sans text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-zinc-950">
                Legal
              </h1>
              <p className="mx-auto mt-4 max-w-xl text-sm sm:text-base leading-relaxed text-zinc-600 font-normal">
                Explore our legal documents to understand the terms, policies, and agreements that govern the use of our services.
              </p>
            </div>

            {/* 2-Column Cards Grid */}
            <div className="mt-12 grid grid-cols-1 gap-4 sm:gap-5 md:grid-cols-2">
              {LEGAL_DOCUMENTS.map((doc) => (
                <div
                  key={doc.id}
                  onClick={() => handleSelectDoc(doc)}
                  className="group relative flex items-center justify-between rounded-2xl border border-zinc-200/80 bg-white p-6 sm:p-7 shadow-[0_1px_3px_rgba(0,0,0,0.03),0_4px_12px_rgba(0,0,0,0.02)] hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.07),0_1px_3px_rgba(0,0,0,0.02)] hover:border-zinc-300 hover:-translate-y-1 active:scale-[0.99] transition-all duration-300 ease-out cursor-pointer overflow-hidden select-none"
                >
                  {/* Top Specular Accent Line */}
                  <div className="pointer-events-none absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-zinc-900/15 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                  <div className="pr-4">
                    <h2 className="font-sans text-base sm:text-lg font-bold tracking-tight text-zinc-950 group-hover:text-zinc-900 transition-colors">
                      {doc.title}
                    </h2>
                    <p className="mt-1 text-xs text-zinc-400 font-mono font-medium">
                      Effective {doc.effectiveDate}
                    </p>
                  </div>

                  <div className="shrink-0 flex items-center gap-1.5 rounded-xl border border-zinc-200/80 bg-zinc-50 px-3.5 py-1.5 text-xs font-bold text-zinc-800 shadow-2xs transition-all duration-200 group-hover:bg-zinc-950 group-hover:text-white group-hover:border-zinc-950 group-hover:shadow-sm">
                    <span>Read</span>
                    <ChevronRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                  </div>
                </div>
              ))}
            </div>

            {/* Bottom Open Source Transparency Note */}
            <div className="mt-16 rounded-2xl border border-zinc-200/80 bg-white/70 backdrop-blur-md p-6 text-center shadow-xs">
              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50/80 px-3 py-1 text-xs font-semibold text-emerald-800 mb-2">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
                <span>100% In-Browser Execution & Zero Telemetry</span>
              </div>
              <p className="text-xs text-zinc-500 max-w-xl mx-auto">
                BuiltWhileBroke is operated as a free public open-source platform. All processing runs locally inside your browser runtime.
              </p>
            </div>
          </div>
        ) : (
          /* Document Reader View */
          <div className="animate-in fade-in duration-200">
            {/* Top Toolbar */}
            <div className="mb-8 flex flex-wrap items-center justify-between gap-4 border-b border-zinc-200 pb-5">
              <button
                onClick={handleBackToHub}
                className="flex items-center gap-2 rounded-xl border border-zinc-200 bg-white px-3.5 py-2 text-xs font-bold text-zinc-700 hover:bg-zinc-100 hover:text-zinc-950 transition shadow-2xs"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                <span>Back to Legal Hub</span>
              </button>

              <div className="flex items-center gap-2 text-xs">
                <button
                  onClick={handleCopyLink}
                  className="flex items-center gap-1.5 rounded-xl border border-zinc-200 bg-white px-3 py-2 font-semibold text-zinc-700 hover:bg-zinc-100 transition shadow-2xs"
                  title="Copy Document Link"
                >
                  {copiedLink ? (
                    <>
                      <Check className="h-3.5 w-3.5 text-emerald-600" />
                      <span className="text-emerald-700">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Share2 className="h-3.5 w-3.5 text-zinc-500" />
                      <span>Share Link</span>
                    </>
                  )}
                </button>

                <button
                  onClick={handlePrint}
                  className="flex items-center gap-1.5 rounded-xl bg-zinc-900 px-3.5 py-2 font-bold text-white shadow-sm hover:bg-zinc-800 transition"
                  title="Print / Save PDF"
                >
                  <Printer className="h-3.5 w-3.5" />
                  <span>Print Document</span>
                </button>
              </div>
            </div>

            {/* Document Body */}
            <div className="rounded-3xl border border-zinc-200/90 bg-white p-8 sm:p-12 shadow-sm">
              <div className="border-b border-zinc-100 pb-6">
                <span className="font-mono text-[11px] font-bold uppercase tracking-widest text-zinc-400">
                  BuiltWhileBroke Legal Repository
                </span>
                <h1 className="font-sans text-3xl sm:text-4xl font-extrabold tracking-tight text-zinc-950 mt-1">
                  {selectedDoc.title}
                </h1>
                <p className="mt-2 text-xs text-zinc-500 font-mono">
                  Effective Date: <strong className="text-zinc-900">{selectedDoc.effectiveDate}</strong>
                </p>
                <p className="mt-4 text-sm text-zinc-600 leading-relaxed font-normal bg-zinc-50 border border-zinc-200/60 rounded-xl p-4">
                  {selectedDoc.summary}
                </p>
              </div>

              {/* Sections */}
              <div className="mt-8 space-y-8 text-zinc-800 text-sm leading-relaxed">
                {selectedDoc.content.map((sec, idx) => (
                  <section key={idx} className="space-y-3">
                    <h2 className="font-sans text-base sm:text-lg font-bold text-zinc-950 tracking-tight">
                      {sec.sectionTitle}
                    </h2>
                    {sec.paragraphs.map((p, pIdx) => (
                      <p key={pIdx} className="text-zinc-600 leading-relaxed">
                        {p}
                      </p>
                    ))}
                  </section>
                ))}
              </div>

              {/* Document Sign-off */}
              <div className="mt-12 pt-8 border-t border-zinc-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-500 font-mono">
                <div>Published by BuiltWhileBroke Legal &amp; Governance</div>
                <button
                  onClick={handleBackToHub}
                  className="text-zinc-900 font-bold hover:underline"
                >
                  ← Return to all legal policies
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
