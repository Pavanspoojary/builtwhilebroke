import React, { useState, useMemo } from 'react';
import {
  Copy,
  Check,
  BookOpen,
} from 'lucide-react';

const CHEATSHEET = [
  { group: 'Character Classes', items: [
    { pattern: '.', desc: 'Any character except newline' },
    { pattern: '\\d', desc: 'Any digit (0-9)' },
    { pattern: '\\w', desc: 'Any word character (a-z, A-Z, 0-9, _)' },
    { pattern: '\\s', desc: 'Any whitespace character' },
    { pattern: '[abc]', desc: 'Any character in set (a, b, or c)' },
    { pattern: '[^abc]', desc: 'Any character NOT in set' },
    { pattern: '[a-z]', desc: 'Character range from a to z' },
  ]},
  { group: 'Quantifiers', items: [
    { pattern: '*', desc: '0 or more matches (greedy)' },
    { pattern: '+', desc: '1 or more matches' },
    { pattern: '?', desc: '0 or 1 match (optional)' },
    { pattern: '{3}', desc: 'Exactly 3 matches' },
    { pattern: '{2,5}', desc: 'Between 2 and 5 matches' },
    { pattern: '*?', desc: 'Lazy matching (minimum chars)' },
  ]},
  { group: 'Anchors & Boundaries', items: [
    { pattern: '^', desc: 'Start of string or line' },
    { pattern: '$', desc: 'End of string or line' },
    { pattern: '\\b', desc: 'Word boundary' },
    { pattern: '\\B', desc: 'Non-word boundary' },
  ]},
  { group: 'Groups & Lookaround', items: [
    { pattern: '(abc)', desc: 'Capture group' },
    { pattern: '(?:abc)', desc: 'Non-capturing group' },
    { pattern: '(?=abc)', desc: 'Positive lookahead' },
    { pattern: '(?!abc)', desc: 'Negative lookahead' },
    { pattern: '(?<=abc)', desc: 'Positive lookbehind' },
    { pattern: '(?<!abc)', desc: 'Negative lookbehind' },
  ]},
];

export const RegexrWorkbench: React.FC = () => {
  const [pattern, setPattern] = useState<string>('(\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}):(\\d+)');
  const [flags, setFlags] = useState<{ [key: string]: boolean }>({
    g: true,
    i: true,
    m: true,
    s: false,
    u: false,
  });
  const [testString, setTestString] = useState<string>(
    `[2026-08-29 04:50:12] [INFO] Worker node assigned to 192.168.1.45:8080 (datacenter-us-east)\n[2026-08-29 04:50:13] [DEBUG] Direct stream socket connected to 10.0.4.12:9090\n[2026-08-29 04:50:14] [WARN] Health check timeout on backup host 172.16.254.1:3000\n[2026-08-29 04:50:15] [INFO] Failover completed successfully to 127.0.0.1:8443`
  );
  const [replaceString, setReplaceString] = useState<string>('HOST[$1] PORT[$2]');
  const [showCheatsheet, setShowCheatsheet] = useState<boolean>(true);
  const [copied, setCopied] = useState<boolean>(false);

  const activeFlagsString = Object.entries(flags)
    .filter(([_, active]) => active)
    .map(([f]) => f)
    .join('');

  // Execute regex safely
  const { matches, error, replacedText } = useMemo(() => {
    if (!pattern) return { matches: [], error: null, replacedText: testString };

    try {
      const regex = new RegExp(pattern, activeFlagsString);
      const results: { match: string; index: number; groups: string[] }[] = [];

      if (flags.g) {
        let m;
        let count = 0;
        while ((m = regex.exec(testString)) !== null && count < 200) {
          results.push({
            match: m[0],
            index: m.index,
            groups: m.slice(1),
          });
          if (m.index === regex.lastIndex) regex.lastIndex++;
          count++;
        }
      } else {
        const m = regex.exec(testString);
        if (m) {
          results.push({
            match: m[0],
            index: m.index,
            groups: m.slice(1),
          });
        }
      }

      let replaced = '';
      try {
        replaced = testString.replace(regex, replaceString);
      } catch {
        replaced = testString;
      }

      return { matches: results, error: null, replacedText: replaced };
    } catch (err: any) {
      return { matches: [], error: err.message, replacedText: testString };
    }
  }, [pattern, activeFlagsString, testString, replaceString, flags.g]);

  return (
    <div className="flex h-full w-full flex-col bg-[#09090b] text-zinc-200 overflow-hidden">
      {/* Top Expression Bar */}
      <div className="border-b border-white/[0.08] bg-[#101014] p-3 sm:p-4">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          {/* Pattern Input Box */}
          <div className="flex flex-1 items-center rounded-xl border border-white/10 bg-zinc-900 px-3 py-2 font-mono text-sm shadow-inner focus-within:border-indigo-500">
            <span className="text-zinc-500 select-none">/</span>
            <input
              type="text"
              value={pattern}
              onChange={(e) => setPattern(e.target.value)}
              placeholder="Enter regular expression pattern..."
              className="flex-1 bg-transparent px-2 text-indigo-300 placeholder-zinc-600 focus:outline-none"
            />
            <span className="text-zinc-500 select-none">/{activeFlagsString}</span>
          </div>

          {/* Regex Flags Toggles */}
          <div className="flex items-center gap-1 rounded-xl border border-white/10 bg-zinc-900/90 p-1 font-mono text-xs">
            {(['g', 'i', 'm', 's', 'u'] as const).map((flag) => {
              const active = flags[flag];
              return (
                <button
                  key={flag}
                  onClick={() => setFlags({ ...flags, [flag]: !active })}
                  className={`rounded-lg px-2.5 py-1 font-bold transition ${
                    active
                      ? 'bg-indigo-600 text-white shadow-glow-sm'
                      : 'text-zinc-500 hover:text-zinc-300'
                  }`}
                  title={`Toggle /${flag} flag`}
                >
                  {flag}
                </button>
              );
            })}
          </div>

          {/* Cheatsheet Toggle */}
          <button
            onClick={() => setShowCheatsheet(!showCheatsheet)}
            className={`flex items-center gap-1.5 rounded-xl border px-3 py-2 text-xs font-medium transition ${
              showCheatsheet
                ? 'border-indigo-500 bg-indigo-500/20 text-indigo-300'
                : 'border-white/10 bg-zinc-900 text-zinc-400 hover:text-white'
            }`}
          >
            <BookOpen className="h-3.5 w-3.5" />
            <span>Cheatsheet</span>
          </button>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mt-2 text-xs font-mono text-rose-400">
            Syntax Error: {error}
          </div>
        )}
      </div>

      {/* Main Split Body: Test Editor + Matches Breakdown + Cheatsheet */}
      <div className="flex flex-1 flex-col lg:flex-row divide-y lg:divide-y-0 lg:divide-x divide-white/[0.08] overflow-hidden">
        {/* Test Textarea & Replace Preview */}
        <div className="flex flex-1 flex-col overflow-hidden bg-[#0c0c10]">
          {/* Test String Header */}
          <div className="flex items-center justify-between border-b border-white/[0.08] bg-[#09090b] px-4 py-2 text-xs font-mono text-zinc-400">
            <span className="font-semibold text-zinc-300">Test String</span>
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] text-emerald-400 border border-emerald-500/20">
                {matches.length} {matches.length === 1 ? 'Match' : 'Matches'} Found
              </span>
            </div>
          </div>

          {/* Editor */}
          <textarea
            value={testString}
            onChange={(e) => setTestString(e.target.value)}
            rows={8}
            placeholder="Type or paste sample text to test against your regular expression..."
            className="w-full flex-1 resize-none bg-transparent p-4 font-mono text-xs leading-relaxed text-zinc-200 focus:outline-none"
          />

          {/* Substitution / Replace Section */}
          <div className="border-t border-white/[0.08] bg-[#101014] p-3 space-y-2">
            <div className="flex items-center justify-between text-xs font-mono text-zinc-400">
              <span className="font-semibold text-zinc-300">Substitution / Replace</span>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(replacedText);
                  setCopied(true);
                  setTimeout(() => setCopied(false), 2000);
                }}
                className="flex items-center gap-1 text-[11px] text-indigo-400 hover:underline"
              >
                {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                <span>{copied ? 'Copied' : 'Copy Result'}</span>
              </button>
            </div>
            <input
              type="text"
              value={replaceString}
              onChange={(e) => setReplaceString(e.target.value)}
              placeholder="Replacement pattern (e.g. $1, $2)..."
              className="w-full rounded-lg border border-white/10 bg-zinc-900 px-3 py-1.5 text-xs text-white placeholder-zinc-600 font-mono focus:border-indigo-500 focus:outline-none"
            />
            <div className="rounded-lg bg-zinc-900/60 p-2 text-xs font-mono text-emerald-300 whitespace-pre-wrap max-h-24 overflow-y-auto">
              {replacedText}
            </div>
          </div>
        </div>

        {/* Matches Breakdown & Capture Groups */}
        <div className="flex w-full lg:w-80 flex-col overflow-hidden bg-[#09090b]">
          <div className="border-b border-white/[0.08] bg-[#101014] px-4 py-2 text-xs font-semibold text-zinc-300 font-mono">
            Match Details & Groups
          </div>

          <div className="flex-1 overflow-y-auto p-3 space-y-2 font-mono text-xs">
            {matches.length > 0 ? (
              matches.map((m, idx) => (
                <div
                  key={idx}
                  className="rounded-xl border border-white/[0.08] bg-zinc-900/70 p-3 space-y-1.5"
                >
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-bold text-indigo-400">Match #{idx + 1}</span>
                    <span className="text-zinc-500 text-[10px]">Index: {m.index}</span>
                  </div>
                  <div className="rounded bg-black/50 p-1.5 text-emerald-300 break-all text-[11px]">
                    "{m.match}"
                  </div>
                  {m.groups.length > 0 && (
                    <div className="pt-1 space-y-1">
                      <span className="text-[10px] text-zinc-500 uppercase">Capture Groups:</span>
                      {m.groups.map((grp, gIdx) => (
                        <div key={gIdx} className="flex items-center gap-1.5 text-[11px]">
                          <span className="text-zinc-500 font-bold">${gIdx + 1}:</span>
                          <span className="text-amber-300 truncate">"{grp}"</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="p-6 text-center text-zinc-500 text-xs">
                No active matches in current test string.
              </div>
            )}
          </div>
        </div>

        {/* Sidebar Cheatsheet */}
        {showCheatsheet && (
          <div className="flex w-full lg:w-72 flex-col overflow-hidden border-l border-white/[0.08] bg-[#0c0c10]">
            <div className="border-b border-white/[0.08] bg-[#101014] px-4 py-2 text-xs font-semibold text-zinc-300 font-mono">
              Regex Quick Reference
            </div>

            <div className="flex-1 overflow-y-auto p-3 space-y-4 text-xs font-mono">
              {CHEATSHEET.map((group) => (
                <div key={group.group} className="space-y-1.5">
                  <h4 className="text-[10px] font-bold uppercase tracking-wider text-indigo-400">
                    {group.group}
                  </h4>
                  <div className="space-y-1">
                    {group.items.map((item) => (
                      <button
                        key={item.pattern}
                        onClick={() => setPattern((prev) => prev + item.pattern)}
                        className="flex w-full items-center justify-between rounded-lg p-1.5 text-left text-[11px] text-zinc-300 hover:bg-zinc-800 transition"
                        title="Click to append to expression"
                      >
                        <code className="rounded bg-zinc-900 px-1 text-emerald-400 font-bold">
                          {item.pattern}
                        </code>
                        <span className="text-zinc-500 text-[10px] text-right truncate max-w-[120px]">
                          {item.desc}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
