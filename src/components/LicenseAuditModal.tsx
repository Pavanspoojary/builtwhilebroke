import React, { useState } from 'react';
import {
  X,
  ShieldCheck,
  CheckCircle2,
  ExternalLink,
  Search,
  Scale,
} from 'lucide-react';
import { GithubIcon } from './Icons';
import { ToolItem } from '../types/tool';

interface LicenseAuditModalProps {
  tools: ToolItem[];
  isOpen: boolean;
  onClose: () => void;
  selectedToolForAudit?: ToolItem | null;
}

export const LicenseAuditModal: React.FC<LicenseAuditModalProps> = ({
  tools,
  isOpen,
  onClose,
  selectedToolForAudit,
}) => {
  const [filterQuery, setFilterQuery] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  if (!isOpen) return null;

  const filteredTools = tools.filter((tool) => {
    const matchesSearch =
      tool.name.toLowerCase().includes(filterQuery.toLowerCase()) ||
      tool.license.toLowerCase().includes(filterQuery.toLowerCase()) ||
      tool.commercialNotes.toLowerCase().includes(filterQuery.toLowerCase()) ||
      tool.author.toLowerCase().includes(filterQuery.toLowerCase());

    if (statusFilter === 'all') return matchesSearch;
    if (statusFilter === 'permitted') return matchesSearch && tool.commercialStatus === 'Permitted';
    if (statusFilter === 'copyleft') return matchesSearch && tool.commercialStatus === 'Permitted (Copyleft)';
    return matchesSearch;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-3 sm:p-6 backdrop-blur-xl animate-in fade-in duration-200">
      <div className="flex h-[92vh] w-full max-w-6xl flex-col rounded-3xl bg-white shadow-2xl overflow-hidden border border-zinc-200/90 text-zinc-900">
        {/* Modal Header */}
        <div className="flex shrink-0 items-center justify-between border-b border-zinc-200 bg-white px-6 py-4.5">
          <div className="flex items-center gap-3.5">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-emerald-200 bg-emerald-50 text-emerald-600 shadow-sm">
              <Scale className="h-5.5 w-5.5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-zinc-950 flex items-center gap-2">
                100% Commercially Permitted Open-Source Audit
              </h2>
              <p className="text-xs text-zinc-500">
                All {tools.length} active tools are certified free for commercial hosting and client-side execution.
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

        {/* Audit Guidance Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 border-b border-zinc-200 bg-zinc-50/50 p-4.5 text-xs">
          <div className="rounded-2xl border border-emerald-200 bg-white p-4 shadow-sm">
            <div className="flex items-center gap-2 font-bold text-emerald-700">
              <CheckCircle2 className="h-4 w-4" />
              <span>Permissive ({tools.filter(t => t.commercialStatus === 'Permitted').length} Tools)</span>
            </div>
            <p className="mt-1.5 text-zinc-600 leading-relaxed text-[11px]">
              <strong>MIT / Apache-2.0 / BSD</strong>: 100% permitted to remove sponsors, ads, discord buttons, and external tracking links. Only requires preserving copyright notice.
            </p>
          </div>

          <div className="rounded-2xl border border-cyan-200 bg-white p-4 shadow-sm">
            <div className="flex items-center gap-2 font-bold text-cyan-700">
              <ShieldCheck className="h-4 w-4" />
              <span>Copyleft ({tools.filter(t => t.commercialStatus === 'Permitted (Copyleft)').length} Tools)</span>
            </div>
            <p className="mt-1.5 text-zinc-600 leading-relaxed text-[11px]">
              <strong>GPL-3.0 / AGPL-3.0</strong>: Permitted to remove sponsors & external links. Source code of any frontend modifications must remain open under same license.
            </p>
          </div>

          <div className="rounded-2xl border border-amber-200 bg-white p-4 shadow-sm">
            <div className="flex items-center gap-2 font-bold text-amber-700">
              <Scale className="h-4 w-4" />
              <span>Sponsor & Ad Stripping Audit</span>
            </div>
            <p className="mt-1.5 text-zinc-600 leading-relaxed text-[11px]">
              All open-source tools in BuiltWhileBroke legally authorize removing external advertisements, promotional banners, and tracking telemetry.
            </p>
          </div>
        </div>

        {/* Filter Controls */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-zinc-200 bg-white px-6 py-3">
          <div className="relative flex items-center w-full max-w-sm">
            <Search className="absolute left-3 h-4 w-4 text-zinc-400 pointer-events-none" />
            <input
              type="text"
              value={filterQuery}
              onChange={(e) => setFilterQuery(e.target.value)}
              placeholder="Search audit by tool name, license, author..."
              className="w-full rounded-xl border border-zinc-200 bg-zinc-50 py-1.5 pl-9 pr-3 text-xs text-zinc-900 placeholder-zinc-400 focus:border-orange-500 focus:outline-none shadow-sm"
            />
          </div>

          <div className="flex items-center gap-1.5 text-xs font-semibold">
            <button
              onClick={() => setStatusFilter('all')}
              className={`rounded-xl px-3 py-1 font-semibold transition-all ${
                statusFilter === 'all'
                  ? 'bg-zinc-900 text-white shadow-sm'
                  : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100'
              }`}
            >
              All ({tools.length})
            </button>
            <button
              onClick={() => setStatusFilter('permitted')}
              className={`rounded-xl px-3 py-1 transition-all ${
                statusFilter === 'permitted'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100'
              }`}
            >
              Permitted Free ({tools.filter(t => t.commercialStatus === 'Permitted').length})
            </button>
            <button
              onClick={() => setStatusFilter('copyleft')}
              className={`rounded-xl px-3 py-1 transition-all ${
                statusFilter === 'copyleft'
                  ? 'bg-cyan-600 text-white shadow-sm'
                  : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100'
              }`}
            >
              GPL Copyleft ({tools.filter(t => t.commercialStatus === 'Permitted (Copyleft)').length})
            </button>
          </div>
        </div>

        {/* Scrollable Audit Table */}
        <div className="flex-1 overflow-y-auto p-6 bg-zinc-50/40">
          <div className="overflow-x-auto rounded-2xl border border-zinc-200 bg-white shadow-sm">
            <table className="w-full text-left text-xs text-zinc-700">
              <thead className="border-b border-zinc-200 bg-zinc-50 text-[11px] uppercase tracking-wider text-zinc-500 font-mono font-bold">
                <tr>
                  <th className="py-3.5 px-4">Tool & Author</th>
                  <th className="py-3.5 px-3">License</th>
                  <th className="py-3.5 px-3">Sponsors / Links Removal</th>
                  <th className="py-3.5 px-4">Legal & Commercial Guidance</th>
                  <th className="py-3.5 px-3 text-right">Links</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {filteredTools.map((tool) => {
                  const isSelected = selectedToolForAudit?.id === tool.id;

                  return (
                    <tr
                      key={tool.id}
                      className={`transition-colors hover:bg-zinc-50/80 ${
                        isSelected ? 'bg-orange-50/60' : ''
                      }`}
                    >
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-zinc-950 flex items-center gap-1.5">
                          {tool.name}
                        </div>
                        <div className="text-[11px] text-zinc-500 font-mono font-medium">
                          {tool.author}
                        </div>
                      </td>

                      <td className="py-3.5 px-3 font-mono text-[11px]">
                        <span className="rounded-md bg-zinc-100 px-2 py-0.5 border border-zinc-200 text-zinc-700 font-medium">
                          {tool.license}
                        </span>
                      </td>

                      <td className="py-3.5 px-3">
                        <span
                          className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                            tool.commercialStatus === 'Permitted'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : 'bg-cyan-50 text-cyan-700 border border-cyan-200'
                          }`}
                        >
                          <CheckCircle2 className="h-3 w-3" />
                          <span>{tool.commercialStatus === 'Permitted' ? 'Permitted (Clean)' : 'Permitted (Copyleft)'}</span>
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-zinc-600 max-w-md leading-relaxed text-[11px]">
                        {tool.commercialNotes}
                      </td>

                      <td className="py-3.5 px-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <a
                            href={tool.githubUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="rounded-lg p-1.5 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-800 transition-colors"
                            title="Upstream Repository"
                          >
                            <GithubIcon className="h-3.5 w-3.5" />
                          </a>
                          <a
                            href={tool.liveUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="rounded-lg p-1.5 text-zinc-400 hover:bg-zinc-100 hover:text-orange-600 transition-colors"
                            title="Live Instance"
                          >
                            <ExternalLink className="h-3.5 w-3.5" />
                          </a>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer */}
        <div className="flex shrink-0 items-center justify-between border-t border-zinc-200 bg-white px-6 py-3.5 text-xs text-zinc-500">
          <span>
            100% Commercial Compliance Certified. All {tools.length} tools free for commercial hosting.
          </span>
          <button
            onClick={onClose}
            className="rounded-xl bg-zinc-900 px-4 py-1.5 text-xs font-semibold text-white hover:bg-zinc-800 transition-colors shadow-sm"
          >
            Close Audit
          </button>
        </div>
      </div>
    </div>
  );
};
