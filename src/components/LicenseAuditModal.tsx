import React, { useState } from 'react';
import {
  X,
  ShieldCheck,
  CheckCircle2,
  ExternalLink,
  Search,
  Scale,
  Sparkles,
} from 'lucide-react';
import { GithubIcon } from './Icons';
import { ToolItem } from '../types/tool';
import { sound } from '../lib/soundFx';

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

  const permissiveCount = tools.filter((t) => t.commercialStatus === 'Permitted').length;
  const copyleftCount = tools.filter((t) => t.commercialStatus === 'Permitted (Copyleft)').length;

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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/50 p-3 sm:p-6 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative flex h-[92vh] w-full max-w-6xl flex-col rounded-3xl bg-white shadow-[0_25px_60px_-15px_rgba(0,0,0,0.3)] overflow-hidden border border-zinc-200/90 text-zinc-900 animate-in zoom-in-95 duration-200">
        {/* Top Specular Hairline Highlight */}
        <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-emerald-500/40 to-transparent" />

        {/* Modal Header */}
        <div className="flex shrink-0 items-center justify-between border-b border-zinc-100 bg-zinc-50/50 px-6 py-4.5">
          <div className="flex items-center gap-3.5">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-emerald-200 bg-emerald-50 text-emerald-700 shadow-2xs">
              <Scale className="h-5.5 w-5.5 stroke-[2]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-extrabold tracking-tight text-zinc-950">
                  100% Commercially Permitted Open-Source Audit
                </h2>
                <span className="hidden sm:inline-flex items-center gap-1 rounded-full bg-emerald-50 border border-emerald-200 px-2 py-0.5 text-[10px] font-mono font-bold text-emerald-800">
                  Certified
                </span>
              </div>
              <p className="text-xs text-zinc-500 font-normal">
                All {tools.length} active tools are verified free for commercial hosting, internal tooling, and client-side execution.
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              sound.toggle();
              onClose();
            }}
            className="rounded-xl border border-zinc-200/80 bg-white p-2 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-700 transition-colors shadow-2xs"
            title="Close (Esc)"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Bento Stat Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 border-b border-zinc-100 bg-zinc-50/30 p-5 text-xs">
          {/* Permissive Card */}
          <div className="group relative rounded-2xl border border-zinc-200/80 bg-white p-4.5 shadow-2xs hover:shadow-xs transition-all">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2 font-bold text-zinc-950">
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                <span>Permissive Licenses</span>
              </div>
              <span className="font-mono text-base font-extrabold text-zinc-950">
                {permissiveCount}
              </span>
            </div>
            <div className="text-[11px] font-mono text-zinc-500 font-semibold mb-1">
              MIT / Apache-2.0 / BSD-3-Clause
            </div>
            <p className="text-zinc-600 leading-relaxed text-[11px] font-normal">
              100% unrestricted commercial usage. Authorizes complete removal of promotional banners, Discord CTAs, and telemetry with copyright retention.
            </p>
          </div>

          {/* Copyleft Card */}
          <div className="group relative rounded-2xl border border-zinc-200/80 bg-white p-4.5 shadow-2xs hover:shadow-xs transition-all">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2 font-bold text-zinc-950">
                <ShieldCheck className="h-4 w-4 text-blue-600" />
                <span>Copyleft & Library Licenses</span>
              </div>
              <span className="font-mono text-base font-extrabold text-zinc-950">
                {copyleftCount}
              </span>
            </div>
            <div className="text-[11px] font-mono text-zinc-500 font-semibold mb-1">
              GPL-3.0 / AGPL-3.0 / LGPL-3.0
            </div>
            <p className="text-zinc-600 leading-relaxed text-[11px] font-normal">
              Permitted for commercial hosting and client-side execution. Modifications to the standalone source code remain open-source under the same terms.
            </p>
          </div>

          {/* Sponsor & Ad Stripping Audit */}
          <div className="group relative rounded-2xl border border-zinc-200/80 bg-white p-4.5 shadow-2xs hover:shadow-xs transition-all">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2 font-bold text-zinc-950">
                <Sparkles className="h-4 w-4 text-amber-600" />
                <span>Sponsor & Ad Stripping Audit</span>
              </div>
              <span className="font-mono text-xs font-extrabold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                100% Clean
              </span>
            </div>
            <div className="text-[11px] font-mono text-zinc-500 font-semibold mb-1">
              Zero Promotional Telemetry
            </div>
            <p className="text-zinc-600 leading-relaxed text-[11px] font-normal">
              All tools have been audited to ensure clean standalone operation with zero mandatory cloud telemetry, trackers, or commercial paywalls.
            </p>
          </div>
        </div>

        {/* Filter Controls & Search */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 border-b border-zinc-100 bg-white px-6 py-3.5">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-zinc-400 pointer-events-none" />
            <input
              type="text"
              value={filterQuery}
              onChange={(e) => setFilterQuery(e.target.value)}
              placeholder="Search audit by tool name, license, author..."
              className="w-full rounded-xl border border-zinc-200 bg-zinc-50/70 py-2 pl-9 pr-3 text-xs text-zinc-900 placeholder-zinc-400 focus:border-zinc-950 focus:bg-white focus:outline-none shadow-2xs transition-all"
            />
          </div>

          {/* Status Tabs */}
          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-zinc-100/80 border border-zinc-200/80 text-xs">
            <button
              onClick={() => {
                sound.toggle();
                setStatusFilter('all');
              }}
              className={`rounded-lg px-3 py-1 font-semibold transition-all ${
                statusFilter === 'all'
                  ? 'bg-white text-zinc-950 shadow-2xs font-bold'
                  : 'text-zinc-500 hover:text-zinc-900'
              }`}
            >
              All ({tools.length})
            </button>
            <button
              onClick={() => {
                sound.toggle();
                setStatusFilter('permitted');
              }}
              className={`rounded-lg px-3 py-1 font-semibold transition-all ${
                statusFilter === 'permitted'
                  ? 'bg-white text-zinc-950 shadow-2xs font-bold'
                  : 'text-zinc-500 hover:text-zinc-900'
              }`}
            >
              Permissive ({permissiveCount})
            </button>
            <button
              onClick={() => {
                sound.toggle();
                setStatusFilter('copyleft');
              }}
              className={`rounded-lg px-3 py-1 font-semibold transition-all ${
                statusFilter === 'copyleft'
                  ? 'bg-white text-zinc-950 shadow-2xs font-bold'
                  : 'text-zinc-500 hover:text-zinc-900'
              }`}
            >
              Copyleft ({copyleftCount})
            </button>
          </div>
        </div>

        {/* Scrollable Audit Table / Cards */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 bg-[#fafafa]">
          <div className="overflow-hidden rounded-2xl border border-zinc-200/90 bg-white shadow-2xs">
            <table className="w-full text-left text-xs text-zinc-700">
              <thead className="border-b border-zinc-200/80 bg-zinc-50/80 text-[11px] uppercase tracking-wider text-zinc-500 font-mono font-bold">
                <tr>
                  <th className="py-3.5 px-5">Tool & Author</th>
                  <th className="py-3.5 px-4">License</th>
                  <th className="py-3.5 px-4">Commercial Status</th>
                  <th className="py-3.5 px-5">Legal & Commercial Guidance</th>
                  <th className="py-3.5 px-4 text-right">Links</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {filteredTools.map((tool) => {
                  const isSelected = selectedToolForAudit?.id === tool.id;

                  return (
                    <tr
                      key={tool.id}
                      className={`group transition-colors hover:bg-zinc-50/80 ${
                        isSelected ? 'bg-amber-50/50 font-semibold' : ''
                      }`}
                    >
                      {/* Tool & Author */}
                      <td className="py-4 px-5">
                        <div className="font-bold text-zinc-950 flex items-center gap-1.5 text-[13px]">
                          {tool.name}
                        </div>
                        <div className="text-[11px] text-zinc-400 font-mono font-normal mt-0.5">
                          by {tool.author}
                        </div>
                      </td>

                      {/* License Badge */}
                      <td className="py-4 px-4 font-mono text-[11px]">
                        <span className="inline-flex items-center rounded-lg bg-zinc-100 border border-zinc-200/80 px-2.5 py-1 text-zinc-800 font-bold shadow-2xs">
                          {tool.license}
                        </span>
                      </td>

                      {/* Commercial Status Pill */}
                      <td className="py-4 px-4">
                        <span
                          className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[10px] font-mono font-bold shadow-2xs ${
                            tool.commercialStatus === 'Permitted'
                              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                              : 'bg-blue-50 text-blue-800 border border-blue-200'
                          }`}
                        >
                          <span
                            className={`h-1.5 w-1.5 rounded-full ${
                              tool.commercialStatus === 'Permitted'
                                ? 'bg-emerald-500'
                                : 'bg-blue-500'
                            }`}
                          />
                          <span>{tool.commercialStatus === 'Permitted' ? 'Permitted (Clean)' : 'Permitted (Copyleft)'}</span>
                        </span>
                      </td>

                      {/* Commercial Notes */}
                      <td className="py-4 px-5 text-zinc-600 max-w-md leading-relaxed text-[11px] font-normal">
                        {tool.commercialNotes}
                      </td>

                      {/* Upstream & Live Links */}
                      <td className="py-4 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <a
                            href={tool.githubUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={() => sound.click()}
                            className="rounded-xl border border-zinc-200/80 bg-white p-2 text-zinc-500 hover:bg-zinc-100 hover:text-zinc-950 transition-colors shadow-2xs"
                            title="Upstream Repository"
                          >
                            <GithubIcon className="h-3.5 w-3.5" />
                          </a>
                          <a
                            href={tool.liveUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={() => sound.click()}
                            className="rounded-xl border border-zinc-200/80 bg-white p-2 text-zinc-500 hover:bg-zinc-100 hover:text-zinc-950 transition-colors shadow-2xs"
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

        {/* Modal Footer */}
        <div className="flex shrink-0 items-center justify-between border-t border-zinc-100 bg-white px-6 py-4 text-xs text-zinc-500">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-emerald-600" />
            <span className="font-mono font-medium text-[11px]">
              100% Commercial Compliance Certified · All {tools.length} tools free for commercial hosting.
            </span>
          </div>
          <button
            onClick={() => {
              sound.toggle();
              onClose();
            }}
            className="rounded-xl bg-zinc-950 px-4 py-2 text-xs font-bold text-white hover:bg-zinc-800 active:scale-95 transition-all shadow-sm cursor-pointer"
          >
            Close Audit
          </button>
        </div>
      </div>
    </div>
  );
};
