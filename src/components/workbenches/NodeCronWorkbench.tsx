import React, { useState, useMemo } from 'react';
import { Copy, Check, RefreshCw } from 'lucide-react';
import { sound } from '../../lib/soundFx';

const EXAMPLES = [
  { expr: '* * * * *', label: 'every minute' },
  { expr: '*/2 * * * *', label: 'every even minute' },
  { expr: '1-59/2 * * * *', label: 'every uneven minute' },
  { expr: '*/5 * * * *', label: 'every 5 minutes' },
  { expr: '*/10 * * * *', label: 'every 10 minutes' },
  { expr: '*/15 * * * *', label: 'every 15 minutes' },
  { expr: '*/30 * * * *', label: 'every 30 minutes' },
  { expr: '0 * * * *', label: 'every hour' },
  { expr: '0 */2 * * *', label: 'every 2 hours' },
  { expr: '0 0 * * *', label: 'every day at midnight' },
  { expr: '0 1 * * *', label: 'every day at 1am' },
  { expr: '0 0 * * 0', label: 'every Sunday at midnight' },
  { expr: '0 0 * * 1-5', label: 'every weekday (Mon-Fri) at midnight' },
  { expr: '0 0 1 * *', label: 'on the 1st of every month at midnight' },
  { expr: '0 0 1 1 *', label: 'on January 1st at midnight' },
];

export const NodeCronWorkbench: React.FC = () => {
  const [expression, setExpression] = useState<string>('*/5 * * * *');
  const [copied, setCopied] = useState<boolean>(false);
  const [activeSlot, setActiveSlot] = useState<number | null>(null);

  // Split expression into 5 fields
  const fields = useMemo(() => {
    const parts = expression.trim().split(/\s+/);
    while (parts.length < 5) parts.push('*');
    return parts.slice(0, 5);
  }, [expression]);

  // Human Readable Translation
  const humanTranslation = useMemo(() => {
    const [min, hour, dom, mon, dow] = fields;

    // Special exact matches
    const exact = EXAMPLES.find((e) => e.expr === expression.trim());
    if (exact) {
      return `“${exact.label.charAt(0).toUpperCase() + exact.label.slice(1)}”`;
    }

    let res = '';
    if (min === '*' && hour === '*') {
      res = 'Every minute';
    } else if (min.startsWith('*/')) {
      res = `Every ${min.slice(2)} minutes`;
    } else if (min === '0' && hour.startsWith('*/')) {
      res = `Every ${hour.slice(2)} hours, on the hour`;
    } else if (min === '0' && hour === '*') {
      res = 'Every hour, on the hour';
    } else if (min !== '*' && hour !== '*') {
      res = `At ${hour.padStart(2, '0')}:${min.padStart(2, '0')}`;
    } else if (min !== '*' && hour === '*') {
      res = `At minute ${min} past every hour`;
    } else {
      res = `At minute ${min}, past hour ${hour}`;
    }

    if (dom !== '*' && mon === '*') {
      res += ` on day ${dom} of the month`;
    } else if (dom !== '*' && mon !== '*') {
      res += ` on day ${dom} in month ${mon}`;
    } else if (dom === '*' && mon !== '*') {
      res += ` in month ${mon}`;
    }

    if (dow !== '*') {
      const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
      if (dow === '1-5') res += ' on every day-of-week from Monday through Friday';
      else if (dow === '0,6' || dow === '6,0') res += ' on weekends';
      else if (dow === '0' || dow === '7') res += ' on Sunday';
      else res += ` on day-of-week ${dow.split(',').map((d) => days[Number(d)] || d).join(', ')}`;
    }

    return `“${res}”`;
  }, [fields, expression]);

  // Compute Next Execution Timestamp
  const nextRun = useMemo(() => {
    const now = new Date();
    const [minPart, hourPart] = fields;
    let candidate = new Date(now.getTime());
    candidate.setSeconds(0, 0);

    for (let i = 0; i < 5000; i++) {
      candidate = new Date(candidate.getTime() + 60 * 1000);
      const m = candidate.getMinutes();
      const h = candidate.getHours();

      let minMatch = false;
      if (minPart === '*') minMatch = true;
      else if (minPart.startsWith('*/')) {
        const step = parseInt(minPart.slice(2), 10);
        minMatch = !isNaN(step) && m % step === 0;
      } else {
        const exactMins = minPart.split(',').map(Number);
        minMatch = exactMins.includes(m);
      }

      let hourMatch = false;
      if (hourPart === '*') hourMatch = true;
      else if (hourPart.startsWith('*/')) {
        const step = parseInt(hourPart.slice(2), 10);
        hourMatch = !isNaN(step) && h % step === 0;
      } else {
        const exactHours = hourPart.split(',').map(Number);
        hourMatch = exactHours.includes(h);
      }

      if (minMatch && hourMatch) {
        return candidate.toISOString().replace('T', ' ').slice(0, 19);
      }
    }
    return 'in the future';
  }, [fields]);

  const handleCopy = () => {
    sound.click();
    navigator.clipboard.writeText(expression);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleRandom = () => {
    sound.pop();
    const rand = EXAMPLES[Math.floor(Math.random() * EXAMPLES.length)];
    setExpression(rand.expr);
  };

  return (
    <div className="flex flex-col h-full w-full bg-[#fafafa] text-zinc-800 font-sans overflow-y-auto">
      {/* Authentic Crontab.guru Container */}
      <div className="max-w-4xl mx-auto w-full px-4 py-8 sm:py-12 space-y-6">
        {/* Title Header */}
        <div className="text-center space-y-1">
          <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-zinc-950">
            Crontab Expression Editor & Schedule Parser
          </h1>
          <p className="text-xs text-zinc-500 font-normal">
            The quick and simple editor for cron schedule expressions (node-cron compatible)
          </p>
        </div>

        {/* Big Amber / Orange Expression Display Banner */}
        <div className="bg-white border border-zinc-200/90 rounded-2xl p-6 sm:p-8 shadow-sm text-center space-y-4">
          {/* Expression Input Bar */}
          <div className="flex items-center justify-center gap-2">
            <input
              type="text"
              value={expression}
              onChange={(e) => setExpression(e.target.value)}
              placeholder="* * * * *"
              className="bg-zinc-50 border border-zinc-200 text-zinc-950 font-mono text-3xl sm:text-5xl font-extrabold text-center px-4 py-3 rounded-2xl focus:border-zinc-950 focus:outline-none w-full max-w-lg tracking-widest selection:bg-zinc-900 selection:text-white shadow-inner"
              autoFocus
            />
            <button
              onClick={handleCopy}
              className="bg-zinc-100 hover:bg-zinc-200 text-zinc-700 p-3.5 rounded-2xl border border-zinc-200 transition-colors shadow-sm"
              title="Copy cron expression"
            >
              {copied ? <Check className="h-5 w-5 text-emerald-600" /> : <Copy className="h-5 w-5" />}
            </button>
            <button
              onClick={handleRandom}
              className="bg-zinc-100 hover:bg-zinc-200 text-zinc-700 p-3.5 rounded-2xl border border-zinc-200 transition-colors shadow-sm"
              title="Random example"
            >
              <RefreshCw className="h-5 w-5" />
            </button>
          </div>

          {/* Human Readable Translation */}
          <div className="text-lg sm:text-2xl font-bold text-zinc-950 min-h-[32px] flex items-center justify-center tracking-tight">
            {humanTranslation}
          </div>

          {/* Next execution time */}
          <div className="text-xs font-mono text-zinc-500">
            next at <span className="text-zinc-900 font-bold">{nextRun}</span>
          </div>

          {/* 5-Field Interactive Slots */}
          <div className="grid grid-cols-5 gap-2 pt-4 max-w-lg mx-auto font-mono text-xs">
            {[
              { label: 'minute', range: '0 - 59' },
              { label: 'hour', range: '0 - 23' },
              { label: 'day (month)', range: '1 - 31' },
              { label: 'month', range: '1 - 12' },
              { label: 'day (week)', range: '0 - 6' },
            ].map((slot, idx) => (
              <div
                key={slot.label}
                onMouseEnter={() => setActiveSlot(idx)}
                onMouseLeave={() => setActiveSlot(null)}
                className={`p-2.5 rounded-xl border transition-all ${
                  activeSlot === idx
                    ? 'bg-zinc-100 border-zinc-300 text-zinc-950 shadow-sm'
                    : 'bg-zinc-50 border-zinc-200 text-zinc-700'
                }`}
              >
                <div className="text-base sm:text-lg font-extrabold text-zinc-950 mb-1 truncate">
                  {fields[idx] || '*'}
                </div>
                <div className="text-[10px] text-zinc-500 uppercase font-sans font-semibold truncate">
                  {slot.label}
                </div>
                <div className="text-[9px] text-zinc-400">{slot.range}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Examples Section */}
        <div className="bg-white border border-zinc-200/90 rounded-2xl p-5 space-y-3 shadow-sm">
          <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-500 font-mono">
            Common Cron Schedule Examples
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 text-xs font-mono">
            {EXAMPLES.map((ex) => (
              <button
                key={ex.expr}
                onClick={() => {
                  sound.toggle();
                  setExpression(ex.expr);
                }}
                className={`flex items-center justify-between p-2.5 rounded-xl text-left transition-all ${
                  expression.trim() === ex.expr
                    ? 'bg-zinc-900 text-white font-bold shadow-sm'
                    : 'bg-zinc-50 hover:bg-zinc-100 text-zinc-700 border border-zinc-200'
                }`}
              >
                <span className="truncate">{ex.label}</span>
                <span className="text-[11px] opacity-75 shrink-0 ml-2 font-bold">{ex.expr}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Crontab Syntax & Special Characters Cheat Sheet */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          {/* Syntax Reference */}
          <div className="bg-white border border-zinc-200/90 rounded-2xl p-4 space-y-2 shadow-sm">
            <h3 className="font-bold text-zinc-900 uppercase text-[11px] font-mono">
              Cron Format Specification
            </h3>
            <pre className="font-mono text-[11px] text-zinc-800 bg-zinc-50 p-3 rounded-xl border border-zinc-200 leading-relaxed overflow-x-auto">
{`┌───────────── minute (0 - 59)
│ ┌───────────── hour (0 - 23)
│ │ ┌───────────── day of the month (1 - 31)
│ │ │ ┌───────────── month (1 - 12)
│ │ │ │ ┌───────────── day of the week (0 - 6) (Sun to Sat)
│ │ │ │ │
* * * * *`}
            </pre>
          </div>

          {/* Special Characters */}
          <div className="bg-white border border-zinc-200/90 rounded-2xl p-4 space-y-2 shadow-sm">
            <h3 className="font-bold text-zinc-900 uppercase text-[11px] font-mono">
              Special Characters
            </h3>
            <div className="space-y-1.5 font-mono text-[11px]">
              <div className="flex items-center justify-between bg-zinc-50 px-2.5 py-1.5 rounded-lg border border-zinc-200">
                <code className="text-zinc-950 font-bold">*</code>
                <span className="text-zinc-500">any value / wildcard</span>
              </div>
              <div className="flex items-center justify-between bg-zinc-50 px-2.5 py-1.5 rounded-lg border border-zinc-200">
                <code className="text-zinc-950 font-bold">,</code>
                <span className="text-zinc-500">value list separator (e.g. 1,3,5)</span>
              </div>
              <div className="flex items-center justify-between bg-zinc-50 px-2.5 py-1.5 rounded-lg border border-zinc-200">
                <code className="text-zinc-950 font-bold">-</code>
                <span className="text-zinc-500">range of values (e.g. 1-5)</span>
              </div>
              <div className="flex items-center justify-between bg-zinc-50 px-2.5 py-1.5 rounded-lg border border-zinc-200">
                <code className="text-zinc-950 font-bold">/</code>
                <span className="text-zinc-500">step values (e.g. */10)</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
