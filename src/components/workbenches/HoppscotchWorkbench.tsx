import React, { useState } from 'react';
import {
  Send,
  Plus,
  Trash2,
  Copy,
  Check,
  Download,
  RotateCcw,
  Clock,
  Database,
  CheckCircle2,
} from 'lucide-react';
import { sound } from '../../lib/soundFx';

interface KeyValue {
  id: string;
  key: string;
  value: string;
  enabled: boolean;
}

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH' | 'HEAD' | 'OPTIONS';

const SAMPLE_ENDPOINTS = [
  { name: 'Get Users List', method: 'GET', url: 'https://jsonplaceholder.typicode.com/users' },
  { name: 'Get Post Detail', method: 'GET', url: 'https://jsonplaceholder.typicode.com/posts/1' },
  {
    name: 'Create Post',
    method: 'POST',
    url: 'https://jsonplaceholder.typicode.com/posts',
    body: '{\n  "title": "BuiltWhileBroke",\n  "body": "Private Client API Workbench",\n  "userId": 1\n}',
  },
  { name: 'HTTPBin Headers', method: 'GET', url: 'https://httpbin.org/headers' },
];

export const HoppscotchWorkbench: React.FC = () => {
  const [method, setMethod] = useState<HttpMethod>('GET');
  const [url, setUrl] = useState<string>('https://jsonplaceholder.typicode.com/users/1');
  const [activeTab, setActiveTab] = useState<'params' | 'headers' | 'auth' | 'body'>('params');
  const [authType, setAuthType] = useState<'none' | 'bearer' | 'basic'>('none');
  const [authToken, setAuthToken] = useState<string>('');
  const [basicUser, setBasicUser] = useState<string>('');
  const [basicPass, setBasicPass] = useState<string>('');
  const [bodyContent, setBodyContent] = useState<string>(
    '{\n  "name": "BuiltWhileBroke",\n  "status": "active"\n}'
  );

  const [params, setParams] = useState<KeyValue[]>([
    { id: '1', key: '', value: '', enabled: true },
  ]);
  const [headers, setHeaders] = useState<KeyValue[]>([
    { id: '1', key: 'Accept', value: 'application/json', enabled: true },
    { id: '2', key: '', value: '', enabled: true },
  ]);

  const [loading, setLoading] = useState<boolean>(false);
  const [responseStatus, setResponseStatus] = useState<number | null>(null);
  const [responseStatusText, setResponseStatusText] = useState<string>('');
  const [responseTime, setResponseTime] = useState<number | null>(null);
  const [responseSize, setResponseSize] = useState<string | null>(null);
  const [responseBody, setResponseBody] = useState<string>('');
  const [responseHeaders, setResponseHeaders] = useState<Record<string, string>>({});
  const [responseTab, setResponseTab] = useState<'body' | 'headers'>('body');
  const [copied, setCopied] = useState<boolean>(false);

  const handleSend = async () => {
    if (!url.trim()) return;

    sound.launch();
    setLoading(true);
    setResponseStatus(null);
    setResponseBody('');
    const startTime = performance.now();

    try {
      // Build final URL with query params
      const parsedUrl = new URL(url.startsWith('http') ? url : `https://${url}`);
      params.forEach((p) => {
        if (p.enabled && p.key.trim()) {
          parsedUrl.searchParams.append(p.key.trim(), p.value);
        }
      });

      // Build Headers
      const requestHeaders: Record<string, string> = {};
      headers.forEach((h) => {
        if (h.enabled && h.key.trim()) {
          requestHeaders[h.key.trim()] = h.value;
        }
      });

      if (authType === 'bearer' && authToken.trim()) {
        requestHeaders['Authorization'] = `Bearer ${authToken.trim()}`;
      } else if (authType === 'basic' && (basicUser || basicPass)) {
        requestHeaders['Authorization'] = `Basic ${btoa(`${basicUser}:${basicPass}`)}`;
      }

      const options: RequestInit = {
        method,
        headers: requestHeaders,
      };

      if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(method) && bodyContent.trim()) {
        options.body = bodyContent;
        if (!requestHeaders['Content-Type']) {
          requestHeaders['Content-Type'] = 'application/json';
        }
      }

      const res = await fetch(parsedUrl.toString(), options);
      const endTime = performance.now();
      setResponseTime(Math.round(endTime - startTime));
      setResponseStatus(res.status);
      setResponseStatusText(res.statusText || 'OK');

      // Response Headers
      const resHeaders: Record<string, string> = {};
      res.headers.forEach((v, k) => {
        resHeaders[k] = v;
      });
      setResponseHeaders(resHeaders);

      // Body
      const text = await res.text();
      setResponseSize(`${(new Blob([text]).size / 1024).toFixed(2)} KB`);

      try {
        const json = JSON.parse(text);
        setResponseBody(JSON.stringify(json, null, 2));
      } catch {
        setResponseBody(text);
      }
      sound.pop();
    } catch (err: unknown) {
      const endTime = performance.now();
      setResponseTime(Math.round(endTime - startTime));
      setResponseStatus(0);
      setResponseStatusText('Network / CORS Error');
      setResponseBody(
        JSON.stringify(
          {
            error: 'Request failed',
            message: err instanceof Error ? err.message : String(err),
            tip: 'If this is a local endpoint or third-party domain without CORS headers, ensure standard CORS headers are allowed.',
          },
          null,
          2
        )
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (!responseBody) return;
    sound.click();
    navigator.clipboard.writeText(responseBody);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    if (!responseBody) return;
    sound.click();
    const blob = new Blob([responseBody], { type: 'application/json' });
    const u = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = u;
    a.download = `response-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(u);
  };

  return (
    <div className="flex h-full w-full flex-col bg-[#fafafa] text-zinc-900 overflow-hidden font-sans">
      {/* Top Header / Sub-Nav */}
      <div className="shrink-0 flex items-center justify-between border-b border-zinc-200/80 bg-white px-6 py-3.5 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-orange-200 bg-orange-50 text-orange-600 shadow-sm">
            <Send className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-zinc-950 flex items-center gap-2">
              <span>Hoppscotch API Workbench</span>
              <span className="rounded bg-orange-50 border border-orange-200 px-1.5 py-0.2 text-[10px] font-mono font-bold text-orange-700">
                100% In-Browser REST Client
              </span>
            </h2>
            <p className="text-[11px] text-zinc-500 font-normal">
              Zero-telemetry client-side HTTP/REST request suite running without remote proxies.
            </p>
          </div>
        </div>
      </div>

      {/* Top Request Bar */}
      <div className="border-b border-zinc-200 bg-white p-4 shadow-2xs">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
          {/* HTTP Method Dropdown */}
          <select
            value={method}
            onChange={(e) => {
              sound.click();
              setMethod(e.target.value as HttpMethod);
            }}
            className={`rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2.5 text-xs font-mono font-bold transition focus:border-orange-500 focus:outline-none shadow-sm ${
              method === 'GET'
                ? 'text-emerald-700'
                : method === 'POST'
                ? 'text-orange-700'
                : method === 'PUT'
                ? 'text-amber-700'
                : method === 'DELETE'
                ? 'text-rose-700'
                : 'text-purple-700'
            }`}
          >
            <option value="GET">GET</option>
            <option value="POST">POST</option>
            <option value="PUT">PUT</option>
            <option value="DELETE">DELETE</option>
            <option value="PATCH">PATCH</option>
            <option value="HEAD">HEAD</option>
            <option value="OPTIONS">OPTIONS</option>
          </select>

          {/* URL Input */}
          <div className="relative flex-1">
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="https://api.example.com/v1/resource"
              className="w-full rounded-xl border border-zinc-200 bg-zinc-50 py-2.5 pl-3.5 pr-10 text-xs text-zinc-900 placeholder-zinc-400 font-mono shadow-sm focus:border-orange-500 focus:bg-white focus:outline-none"
            />
          </div>

          {/* Send Button */}
          <button
            onClick={handleSend}
            disabled={loading}
            className="flex items-center justify-center gap-2 rounded-xl bg-orange-600 px-6 py-2.5 text-xs font-bold text-white shadow-sm transition hover:bg-orange-500 active:scale-[0.98] disabled:opacity-50"
          >
            {loading ? (
              <RotateCcw className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
            <span>{loading ? 'Sending...' : 'Send Request'}</span>
          </button>
        </div>

        {/* Quick Samples Pills */}
        <div className="mt-3 flex flex-wrap items-center gap-1.5 text-[11px]">
          <span className="text-zinc-400 font-mono text-[10px] font-bold uppercase">Quick Samples:</span>
          {SAMPLE_ENDPOINTS.map((s, idx) => (
            <button
              key={idx}
              onClick={() => {
                sound.click();
                setMethod(s.method as HttpMethod);
                setUrl(s.url);
                if (s.body) setBodyContent(s.body);
              }}
              className="rounded-lg border border-zinc-200 bg-zinc-50 px-2.5 py-1 text-zinc-600 hover:border-orange-300 hover:bg-orange-50 hover:text-orange-800 transition shadow-2xs font-mono text-[11px]"
            >
              {s.name}
            </button>
          ))}
        </div>
      </div>

      {/* Main Workbench Body: Split View (Request Config | Response Viewer) */}
      <div className="flex flex-1 flex-col lg:flex-row divide-y lg:divide-y-0 lg:divide-x divide-zinc-200 overflow-hidden bg-white">
        {/* Left Side: Request Config Tabs */}
        <div className="flex flex-1 flex-col overflow-hidden bg-zinc-50/40">
          {/* Sub Navigation Tabs */}
          <div className="flex border-b border-zinc-200 bg-white px-3 pt-2">
            {(['params', 'headers', 'auth', 'body'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => {
                  sound.toggle();
                  setActiveTab(tab);
                }}
                className={`flex items-center gap-1.5 border-b-2 px-4 py-2 text-xs font-bold uppercase tracking-wider font-mono transition ${
                  activeTab === tab
                    ? 'border-orange-600 text-orange-600 bg-orange-50/40'
                    : 'border-transparent text-zinc-500 hover:text-zinc-900'
                }`}
              >
                <span>{tab}</span>
                {tab === 'params' && params.filter((p) => p.key).length > 0 && (
                  <span className="rounded-full bg-orange-100 border border-orange-200 px-1.5 py-0.2 text-[10px] text-orange-700 font-bold">
                    {params.filter((p) => p.key).length}
                  </span>
                )}
                {tab === 'headers' && headers.filter((h) => h.key).length > 0 && (
                  <span className="rounded-full bg-orange-100 border border-orange-200 px-1.5 py-0.2 text-[10px] text-orange-700 font-bold">
                    {headers.filter((h) => h.key).length}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="flex-1 overflow-y-auto p-5">
            {activeTab === 'params' && (
              <div className="space-y-3">
                <div className="flex items-center justify-between text-[11px] font-mono text-zinc-500 font-bold">
                  <span>Query Parameters</span>
                  <button
                    onClick={() => {
                      sound.click();
                      setParams([...params, { id: String(Date.now()), key: '', value: '', enabled: true }]);
                    }}
                    className="flex items-center gap-1 text-orange-600 hover:underline font-semibold"
                  >
                    <Plus className="h-3 w-3" />
                    <span>Add Param</span>
                  </button>
                </div>
                {params.map((p, idx) => (
                  <div key={p.id} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={p.enabled}
                      onChange={(e) => {
                        const next = [...params];
                        next[idx].enabled = e.target.checked;
                        setParams(next);
                      }}
                      className="rounded border-zinc-300 text-orange-600 focus:ring-0 h-4 w-4"
                    />
                    <input
                      type="text"
                      value={p.key}
                      onChange={(e) => {
                        const next = [...params];
                        next[idx].key = e.target.value;
                        setParams(next);
                      }}
                      placeholder="Parameter Key"
                      className="flex-1 rounded-xl border border-zinc-200 bg-white px-3 py-2 text-xs text-zinc-900 placeholder-zinc-400 font-mono shadow-sm focus:border-orange-500 focus:outline-none"
                    />
                    <input
                      type="text"
                      value={p.value}
                      onChange={(e) => {
                        const next = [...params];
                        next[idx].value = e.target.value;
                        setParams(next);
                      }}
                      placeholder="Parameter Value"
                      className="flex-1 rounded-xl border border-zinc-200 bg-white px-3 py-2 text-xs text-zinc-900 placeholder-zinc-400 font-mono shadow-sm focus:border-orange-500 focus:outline-none"
                    />
                    <button
                      onClick={() => {
                        sound.pop();
                        setParams(params.filter((_, i) => i !== idx));
                      }}
                      className="p-1.5 text-zinc-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors"
                      title="Remove parameter"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'headers' && (
              <div className="space-y-3">
                <div className="flex items-center justify-between text-[11px] font-mono text-zinc-500 font-bold">
                  <span>HTTP Headers</span>
                  <button
                    onClick={() => {
                      sound.click();
                      setHeaders([...headers, { id: String(Date.now()), key: '', value: '', enabled: true }]);
                    }}
                    className="flex items-center gap-1 text-orange-600 hover:underline font-semibold"
                  >
                    <Plus className="h-3 w-3" />
                    <span>Add Header</span>
                  </button>
                </div>
                {headers.map((h, idx) => (
                  <div key={h.id} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={h.enabled}
                      onChange={(e) => {
                        const next = [...headers];
                        next[idx].enabled = e.target.checked;
                        setHeaders(next);
                      }}
                      className="rounded border-zinc-300 text-orange-600 focus:ring-0 h-4 w-4"
                    />
                    <input
                      type="text"
                      value={h.key}
                      onChange={(e) => {
                        const next = [...headers];
                        next[idx].key = e.target.value;
                        setHeaders(next);
                      }}
                      placeholder="Header Key (e.g. Authorization)"
                      className="flex-1 rounded-xl border border-zinc-200 bg-white px-3 py-2 text-xs text-zinc-900 placeholder-zinc-400 font-mono shadow-sm focus:border-orange-500 focus:outline-none"
                    />
                    <input
                      type="text"
                      value={h.value}
                      onChange={(e) => {
                        const next = [...headers];
                        next[idx].value = e.target.value;
                        setHeaders(next);
                      }}
                      placeholder="Header Value"
                      className="flex-1 rounded-xl border border-zinc-200 bg-white px-3 py-2 text-xs text-zinc-900 placeholder-zinc-400 font-mono shadow-sm focus:border-orange-500 focus:outline-none"
                    />
                    <button
                      onClick={() => {
                        sound.pop();
                        setHeaders(headers.filter((_, i) => i !== idx));
                      }}
                      className="p-1.5 text-zinc-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors"
                      title="Remove header"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'auth' && (
              <div className="space-y-4 max-w-lg">
                <div>
                  <label className="text-xs font-bold text-zinc-700">Authentication Type</label>
                  <select
                    value={authType}
                    onChange={(e) => {
                      sound.click();
                      setAuthType(e.target.value as any);
                    }}
                    className="mt-1.5 w-full rounded-xl border border-zinc-200 bg-white px-3 py-2.5 text-xs text-zinc-900 font-mono focus:border-orange-500 focus:outline-none shadow-sm"
                  >
                    <option value="none">No Auth</option>
                    <option value="bearer">Bearer Token</option>
                    <option value="basic">Basic Auth (Username / Password)</option>
                  </select>
                </div>

                {authType === 'bearer' && (
                  <div>
                    <label className="text-xs font-bold text-zinc-700">Bearer Token</label>
                    <input
                      type="text"
                      value={authToken}
                      onChange={(e) => setAuthToken(e.target.value)}
                      placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                      className="mt-1.5 w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-xs text-zinc-900 font-mono placeholder-zinc-400 focus:border-orange-500 focus:outline-none shadow-sm"
                    />
                  </div>
                )}

                {authType === 'basic' && (
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-bold text-zinc-700">Username</label>
                      <input
                        type="text"
                        value={basicUser}
                        onChange={(e) => setBasicUser(e.target.value)}
                        placeholder="admin"
                        className="mt-1.5 w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-xs text-zinc-900 font-mono placeholder-zinc-400 focus:border-orange-500 focus:outline-none shadow-sm"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-zinc-700">Password</label>
                      <input
                        type="password"
                        value={basicPass}
                        onChange={(e) => setBasicPass(e.target.value)}
                        placeholder="••••••••"
                        className="mt-1.5 w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-xs text-zinc-900 font-mono placeholder-zinc-400 focus:border-orange-500 focus:outline-none shadow-sm"
                      />
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'body' && (
              <div className="flex h-full flex-col">
                <div className="flex items-center justify-between pb-2 text-[11px] text-zinc-500 font-mono font-bold">
                  <span>JSON Payload</span>
                  <button
                    onClick={() => {
                      sound.click();
                      try {
                        setBodyContent(JSON.stringify(JSON.parse(bodyContent), null, 2));
                      } catch {}
                    }}
                    className="text-orange-600 hover:underline font-semibold"
                  >
                    Format JSON
                  </button>
                </div>
                <textarea
                  value={bodyContent}
                  onChange={(e) => setBodyContent(e.target.value)}
                  placeholder='{\n  "key": "value"\n}'
                  rows={12}
                  className="w-full flex-1 rounded-2xl border border-zinc-200 bg-white p-4 text-xs text-zinc-800 font-mono placeholder-zinc-400 focus:border-orange-500 focus:outline-none shadow-sm resize-none leading-relaxed"
                  spellCheck={false}
                />
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Response Panel */}
        <div className="flex flex-1 flex-col overflow-hidden bg-white">
          {/* Response Status Bar */}
          <div className="flex items-center justify-between border-b border-zinc-200 bg-zinc-50/80 px-4 py-2.5">
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold text-zinc-800 font-mono uppercase tracking-wider">Response</span>
              {responseStatus !== null && (
                <div className="flex items-center gap-2">
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-[10px] font-mono font-bold border ${
                      responseStatus >= 200 && responseStatus < 300
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        : responseStatus >= 400
                        ? 'bg-rose-50 text-rose-700 border-rose-200'
                        : 'bg-amber-50 text-amber-700 border-amber-200'
                    }`}
                  >
                    {responseStatus} {responseStatusText}
                  </span>

                  {responseTime !== null && (
                    <span className="flex items-center gap-1 text-[11px] font-mono text-zinc-500 font-semibold">
                      <Clock className="h-3 w-3 text-zinc-400" />
                      <span>{responseTime} ms</span>
                    </span>
                  )}

                  {responseSize !== null && (
                    <span className="flex items-center gap-1 text-[11px] font-mono text-zinc-500 font-semibold">
                      <Database className="h-3 w-3 text-zinc-400" />
                      <span>{responseSize}</span>
                    </span>
                  )}
                </div>
              )}
            </div>

            {responseBody && (
              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-1 rounded-lg border border-zinc-200 bg-white px-2.5 py-1 text-[11px] font-semibold text-zinc-700 hover:bg-zinc-100 shadow-sm transition-colors"
                  title="Copy Response Body"
                >
                  {copied ? <Check className="h-3 w-3 text-emerald-600" /> : <Copy className="h-3 w-3" />}
                  <span>{copied ? 'Copied' : 'Copy'}</span>
                </button>
                <button
                  onClick={handleDownload}
                  className="flex items-center gap-1 rounded-lg border border-zinc-200 bg-white p-1 text-zinc-700 hover:bg-zinc-100 shadow-sm transition-colors"
                  title="Download JSON Response"
                >
                  <Download className="h-3.5 w-3.5" />
                </button>
              </div>
            )}
          </div>

          {/* Response Tabs & Body Output */}
          {responseStatus !== null ? (
            <div className="flex flex-1 flex-col overflow-hidden">
              <div className="flex border-b border-zinc-200 bg-zinc-50/50 px-4">
                <button
                  onClick={() => {
                    sound.toggle();
                    setResponseTab('body');
                  }}
                  className={`border-b-2 py-2 px-3 text-xs font-mono font-bold ${
                    responseTab === 'body'
                      ? 'border-orange-600 text-orange-600 bg-white'
                      : 'border-transparent text-zinc-500 hover:text-zinc-900'
                  }`}
                >
                  Body
                </button>
                <button
                  onClick={() => {
                    sound.toggle();
                    setResponseTab('headers');
                  }}
                  className={`border-b-2 py-2 px-3 text-xs font-mono font-bold ${
                    responseTab === 'headers'
                      ? 'border-orange-600 text-orange-600 bg-white'
                      : 'border-transparent text-zinc-500 hover:text-zinc-900'
                  }`}
                >
                  Headers ({Object.keys(responseHeaders).length})
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-4 font-mono text-xs bg-white">
                {responseTab === 'body' ? (
                  <pre className="text-zinc-800 leading-relaxed whitespace-pre-wrap select-text">
                    {responseBody}
                  </pre>
                ) : (
                  <div className="space-y-1.5">
                    {Object.entries(responseHeaders).map(([k, v]) => (
                      <div key={k} className="flex gap-2 text-xs">
                        <span className="font-bold text-orange-700">{k}:</span>
                        <span className="text-zinc-700 break-all">{v}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="flex flex-1 flex-col items-center justify-center p-8 text-center bg-[#fafafa]">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-orange-200 bg-orange-50 text-orange-600 shadow-sm">
                <Send className="h-6 w-6" />
              </div>
              <p className="mt-4 text-sm font-bold text-zinc-900">
                Ready to Test API Endpoint
              </p>
              <p className="mt-1 text-xs text-zinc-500 max-w-sm">
                Enter your URL above and click <strong className="text-orange-600">Send Request</strong> to inspect headers, status codes, and response payloads.
              </p>
              <div className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-emerald-50 border border-emerald-200 px-3 py-1 text-[11px] font-mono text-emerald-800 font-semibold shadow-2xs">
                <CheckCircle2 className="h-3 w-3" />
                <span>100% In-Browser Client Fetch</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
