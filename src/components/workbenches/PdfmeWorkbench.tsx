import React, { useState, useRef } from 'react';
import {
  FileText,
  Copy,
  Check,
  ExternalLink,
  Plus,
  Trash2,
  Printer,
} from 'lucide-react';
import { sound } from '../../lib/soundFx';

type TemplateType = 'invoice' | 'certificate' | 'label';

interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  rate: number;
}

export const PdfmeWorkbench: React.FC = () => {
  const [templateType, setTemplateType] = useState<TemplateType>('invoice');
  const [useOfficialEmbed, setUseOfficialEmbed] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  // Form Fields
  const [docTitle, setDocTitle] = useState<string>('TAX INVOICE');
  const [docId, setDocId] = useState<string>('INV-2026-0842');
  const [docDate, setDocDate] = useState<string>('2026-08-29');
  const [senderName, setSenderName] = useState<string>('BuiltWhileBroke Labs Inc.');
  const [senderAddress, setSenderAddress] = useState<string>('San Francisco, CA • hi@builtwhilebroke.dev');
  const [recipientName, setRecipientName] = useState<string>('Acme Corporation');
  const [recipientAddress, setRecipientAddress] = useState<string>('100 Innovation Way, Suite 400\nAustin, TX 78701');
  const [accentColor, setAccentColor] = useState<string>('#f97316');

  // Certificate fields
  const [certRecipient, setCertRecipient] = useState<string>('Jane Doe');
  const [certCourse, setCertCourse] = useState<string>('Advanced Autonomous Systems Engineering');
  const [certIssuer, setCertIssuer] = useState<string>('Open Source Certification Board');

  // Invoice Items
  const [items, setItems] = useState<InvoiceItem[]>([
    { id: '1', description: 'WebAssembly Video Transcoding Engine Core', quantity: 1, rate: 2400 },
    { id: '2', description: 'Zero-Telemetry Client Database Storage Setup', quantity: 2, rate: 850 },
    { id: '3', description: 'Performance & 120 FPS Frame Budget Audit', quantity: 1, rate: 1200 },
  ]);

  const pdfPreviewRef = useRef<HTMLDivElement>(null);

  const calculateSubtotal = () =>
    items.reduce((sum, item) => sum + item.quantity * item.rate, 0);

  const subtotal = calculateSubtotal();
  const tax = subtotal * 0.08;
  const total = subtotal + tax;

  const addItem = () => {
    sound.pop();
    setItems([
      ...items,
      { id: String(Date.now()), description: 'New Service Item', quantity: 1, rate: 500 },
    ]);
  };

  const removeItem = (id: string) => {
    sound.click();
    setItems(items.filter((item) => item.id !== id));
  };

  const updateItem = (id: string, field: keyof InvoiceItem, val: string | number) => {
    setItems(
      items.map((item) => {
        if (item.id === id) {
          return { ...item, [field]: val };
        }
        return item;
      })
    );
  };

  const handleExportJson = () => {
    sound.click();
    const schema = {
      template: templateType,
      docId,
      docDate,
      sender: { name: senderName, address: senderAddress },
      recipient: { name: recipientName, address: recipientAddress },
      items,
      total,
      meta: { generator: 'pdfme v5 (BWB Studio)' },
    };
    navigator.clipboard.writeText(JSON.stringify(schema, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrintPdf = () => {
    sound.launch();
    window.print();
  };

  return (
    <div className="flex flex-col h-full w-full bg-black text-zinc-100 overflow-hidden">
      {/* Top Header */}
      <div className="shrink-0 flex items-center justify-between border-b border-white/[0.08] bg-zinc-950/80 px-6 py-3.5 backdrop-blur-xl">
        <div className="flex items-center gap-3">
          <div
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-zinc-900 font-mono font-bold text-xs shadow-sm"
            style={{ color: accentColor }}
          >
            <FileText className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <span>pdfme Visual PDF Generator & Designer</span>
              <span className="rounded bg-zinc-900 border border-white/10 px-1.5 py-0.2 text-[10px] font-mono text-orange-400">
                100% Client-Side
              </span>
            </h2>
            <p className="text-[11px] text-zinc-400">
              Visual drag-and-drop template designer & vector PDF generator.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <button
            onClick={handleExportJson}
            className="flex items-center gap-1.5 rounded-xl border border-white/10 bg-zinc-900 px-3 py-1.5 text-zinc-300 hover:text-white transition-colors"
          >
            {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
            <span>{copied ? 'Schema Copied!' : 'Export JSON Schema'}</span>
          </button>

          <button
            onClick={handlePrintPdf}
            className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 px-4 py-1.5 font-semibold text-white shadow-glow-sm hover:from-orange-400 hover:to-orange-500 transition-all active:scale-[0.98]"
          >
            <Printer className="h-3.5 w-3.5" />
            <span>Generate & Print PDF</span>
          </button>

          <button
            onClick={() => {
              sound.toggle();
              setUseOfficialEmbed(!useOfficialEmbed);
            }}
            className="flex items-center gap-1.5 rounded-xl border border-white/10 bg-zinc-900 px-3 py-1.5 text-zinc-400 hover:text-white transition-colors"
          >
            <ExternalLink className="h-3.5 w-3.5 text-orange-400" />
            <span className="hidden sm:inline">{useOfficialEmbed ? 'Studio Designer' : 'Embed Playground'}</span>
          </button>
        </div>
      </div>

      {/* Main Workspace Area */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {useOfficialEmbed ? (
          <div className="w-full h-full bg-black">
            <iframe
              src="https://pdfme.com"
              title="pdfme Official Playground"
              className="w-full h-full border-0"
              sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-downloads"
            />
          </div>
        ) : (
          <>
            {/* Left Controls & Schema Config Panel */}
            <div className="w-full lg:w-96 shrink-0 border-r border-white/[0.08] bg-zinc-950/60 p-5 overflow-y-auto space-y-5 text-xs">
              {/* Template Selector */}
              <div>
                <label className="block font-mono text-[11px] uppercase tracking-wider text-zinc-400 mb-2">
                  Document Template
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => {
                      sound.toggle();
                      setTemplateType('invoice');
                    }}
                    className={`rounded-xl px-3 py-2 text-xs font-semibold transition-all ${
                      templateType === 'invoice'
                        ? 'bg-orange-500 text-white shadow-glow-sm'
                        : 'border border-white/10 bg-zinc-900/60 text-zinc-400 hover:text-white'
                    }`}
                  >
                    Commercial Invoice
                  </button>
                  <button
                    onClick={() => {
                      sound.toggle();
                      setTemplateType('certificate');
                    }}
                    className={`rounded-xl px-3 py-2 text-xs font-semibold transition-all ${
                      templateType === 'certificate'
                        ? 'bg-orange-500 text-white shadow-glow-sm'
                        : 'border border-white/10 bg-zinc-900/60 text-zinc-400 hover:text-white'
                    }`}
                  >
                    Certificate
                  </button>
                </div>
              </div>

              {/* Accent Color Palette */}
              <div>
                <label className="block font-mono text-[11px] uppercase tracking-wider text-zinc-400 mb-2">
                  Brand Accent Color
                </label>
                <div className="flex items-center gap-2">
                  {['#f97316', '#3b82f6', '#10b981', '#8b5cf6', '#ef4444', '#18181b'].map((col) => (
                    <button
                      key={col}
                      onClick={() => setAccentColor(col)}
                      className={`h-7 w-7 rounded-full border transition-all ${
                        accentColor === col ? 'ring-2 ring-white scale-110' : 'opacity-70 hover:opacity-100'
                      }`}
                      style={{ backgroundColor: col, borderColor: 'rgba(255,255,255,0.2)' }}
                    />
                  ))}
                </div>
              </div>

              {/* Editable Fields based on template */}
              {templateType === 'invoice' ? (
                <>
                  <div className="space-y-3">
                    <div>
                      <label className="text-[11px] font-mono text-zinc-400">Header Title</label>
                      <input
                        type="text"
                        value={docTitle}
                        onChange={(e) => setDocTitle(e.target.value)}
                        className="mt-1 w-full rounded-xl border border-white/10 bg-zinc-900 px-3 py-2 text-white focus:border-orange-500 focus:outline-none"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-[11px] font-mono text-zinc-400">Invoice No.</label>
                        <input
                          type="text"
                          value={docId}
                          onChange={(e) => setDocId(e.target.value)}
                          className="mt-1 w-full rounded-xl border border-white/10 bg-zinc-900 px-3 py-2 text-white focus:border-orange-500 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] font-mono text-zinc-400">Date</label>
                        <input
                          type="text"
                          value={docDate}
                          onChange={(e) => setDocDate(e.target.value)}
                          className="mt-1 w-full rounded-xl border border-white/10 bg-zinc-900 px-3 py-2 text-white focus:border-orange-500 focus:outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-[11px] font-mono text-zinc-400">Sender / Issuer</label>
                      <input
                        type="text"
                        value={senderName}
                        onChange={(e) => setSenderName(e.target.value)}
                        className="mt-1 w-full rounded-xl border border-white/10 bg-zinc-900 px-3 py-2 text-white focus:border-orange-500 focus:outline-none"
                      />
                      <input
                        type="text"
                        value={senderAddress}
                        onChange={(e) => setSenderAddress(e.target.value)}
                        placeholder="Sender contact info"
                        className="mt-1.5 w-full rounded-xl border border-white/10 bg-zinc-900 px-3 py-1.5 text-[11px] text-zinc-300 focus:border-orange-500 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] font-mono text-zinc-400">Bill To Client</label>
                      <input
                        type="text"
                        value={recipientName}
                        onChange={(e) => setRecipientName(e.target.value)}
                        className="mt-1 w-full rounded-xl border border-white/10 bg-zinc-900 px-3 py-2 text-white focus:border-orange-500 focus:outline-none"
                      />
                      <textarea
                        rows={2}
                        value={recipientAddress}
                        onChange={(e) => setRecipientAddress(e.target.value)}
                        placeholder="Client Address"
                        className="mt-1.5 w-full rounded-xl border border-white/10 bg-zinc-900 px-3 py-1.5 text-[11px] text-zinc-300 focus:border-orange-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* Line Items Editor */}
                  <div className="pt-2 border-t border-white/[0.08]">
                    <div className="flex items-center justify-between mb-2">
                      <label className="font-mono text-[11px] uppercase tracking-wider text-zinc-400">
                        Line Items ({items.length})
                      </label>
                      <button
                        onClick={addItem}
                        className="flex items-center gap-1 text-[11px] text-orange-400 hover:text-orange-300 font-semibold"
                      >
                        <Plus className="h-3 w-3" />
                        <span>Add Row</span>
                      </button>
                    </div>

                    <div className="space-y-2">
                      {items.map((item) => (
                        <div
                          key={item.id}
                          className="rounded-xl border border-white/[0.06] bg-zinc-900/80 p-2.5 space-y-2"
                        >
                          <input
                            type="text"
                            value={item.description}
                            onChange={(e) => updateItem(item.id, 'description', e.target.value)}
                            placeholder="Description"
                            className="w-full rounded-lg border border-white/10 bg-black px-2 py-1 text-white text-[11px]"
                          />
                          <div className="flex items-center gap-2">
                            <div className="w-16">
                              <input
                                type="number"
                                value={item.quantity}
                                onChange={(e) => updateItem(item.id, 'quantity', Number(e.target.value))}
                                className="w-full rounded-lg border border-white/10 bg-black px-2 py-1 text-white text-[11px]"
                                placeholder="Qty"
                              />
                            </div>
                            <div className="flex-1">
                              <input
                                type="number"
                                value={item.rate}
                                onChange={(e) => updateItem(item.id, 'rate', Number(e.target.value))}
                                className="w-full rounded-lg border border-white/10 bg-black px-2 py-1 text-white text-[11px]"
                                placeholder="Rate ($)"
                              />
                            </div>
                            <button
                              onClick={() => removeItem(item.id)}
                              className="p-1 text-zinc-500 hover:text-red-400"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              ) : (
                <div className="space-y-3">
                  <div>
                    <label className="text-[11px] font-mono text-zinc-400">Recipient Name</label>
                    <input
                      type="text"
                      value={certRecipient}
                      onChange={(e) => setCertRecipient(e.target.value)}
                      className="mt-1 w-full rounded-xl border border-white/10 bg-zinc-900 px-3 py-2 text-white focus:border-orange-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-mono text-zinc-400">Awarded Course / Title</label>
                    <input
                      type="text"
                      value={certCourse}
                      onChange={(e) => setCertCourse(e.target.value)}
                      className="mt-1 w-full rounded-xl border border-white/10 bg-zinc-900 px-3 py-2 text-white focus:border-orange-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-mono text-zinc-400">Issuing Organization</label>
                    <input
                      type="text"
                      value={certIssuer}
                      onChange={(e) => setCertIssuer(e.target.value)}
                      className="mt-1 w-full rounded-xl border border-white/10 bg-zinc-900 px-3 py-2 text-white focus:border-orange-500 focus:outline-none"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Right Live Vector PDF Preview Canvas */}
            <div className="flex-1 bg-[#050507] p-6 lg:p-10 overflow-y-auto flex items-center justify-center">
              <div
                ref={pdfPreviewRef}
                className="w-full max-w-2xl bg-white text-zinc-900 rounded-lg shadow-2xl p-8 sm:p-12 min-h-[750px] flex flex-col justify-between select-text"
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                {templateType === 'invoice' ? (
                  <>
                    <div>
                      {/* Top Bar with Accent Bar */}
                      <div
                        className="h-2 w-full rounded-full mb-8"
                        style={{ backgroundColor: accentColor }}
                      />

                      <div className="flex justify-between items-start border-b border-zinc-200 pb-6">
                        <div>
                          <h1
                            className="text-2xl font-black tracking-tight uppercase"
                            style={{ color: accentColor }}
                          >
                            {docTitle}
                          </h1>
                          <p className="text-xs text-zinc-500 font-mono mt-1">
                            No. {docId} • Date: {docDate}
                          </p>
                        </div>
                        <div className="text-right text-xs">
                          <p className="font-bold text-zinc-900">{senderName}</p>
                          <p className="text-zinc-500 text-[11px] mt-0.5">{senderAddress}</p>
                        </div>
                      </div>

                      {/* Recipient Area */}
                      <div className="my-6 text-xs">
                        <span className="font-mono text-[10px] uppercase text-zinc-400 font-semibold">
                          Billed To
                        </span>
                        <h4 className="text-sm font-bold text-zinc-900 mt-0.5">{recipientName}</h4>
                        <p className="text-zinc-500 whitespace-pre-line text-[11px] mt-0.5">
                          {recipientAddress}
                        </p>
                      </div>

                      {/* Items Table */}
                      <table className="w-full text-left text-xs my-6">
                        <thead>
                          <tr className="border-b-2 border-zinc-900 text-[11px] uppercase font-mono font-bold text-zinc-700">
                            <th className="py-2">Description</th>
                            <th className="py-2 text-center w-16">Qty</th>
                            <th className="py-2 text-right w-24">Rate</th>
                            <th className="py-2 text-right w-24">Amount</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-200">
                          {items.map((item) => (
                            <tr key={item.id}>
                              <td className="py-2.5 font-medium text-zinc-800">{item.description}</td>
                              <td className="py-2.5 text-center font-mono text-zinc-600">{item.quantity}</td>
                              <td className="py-2.5 text-right font-mono text-zinc-600">${item.rate.toFixed(2)}</td>
                              <td className="py-2.5 text-right font-mono font-bold text-zinc-900">
                                ${(item.quantity * item.rate).toFixed(2)}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    {/* Totals & Signature Footer */}
                    <div>
                      <div className="border-t border-zinc-200 pt-4 flex justify-end">
                        <div className="w-64 space-y-1.5 text-xs">
                          <div className="flex justify-between text-zinc-600">
                            <span>Subtotal:</span>
                            <span className="font-mono font-semibold">${subtotal.toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between text-zinc-600">
                            <span>Estimated Tax (8%):</span>
                            <span className="font-mono font-semibold">${tax.toFixed(2)}</span>
                          </div>
                          <div
                            className="flex justify-between text-base font-black border-t-2 border-zinc-900 pt-2"
                            style={{ color: accentColor }}
                          >
                            <span>Total Due:</span>
                            <span className="font-mono">${total.toFixed(2)}</span>
                          </div>
                        </div>
                      </div>

                      <div className="mt-8 pt-4 border-t border-zinc-100 flex justify-between items-center text-[10px] text-zinc-400 font-mono">
                        <span>Generated with pdfme Vector Engine</span>
                        <span>Zero-telemetry client computation</span>
                      </div>
                    </div>
                  </>
                ) : (
                  /* Certificate Template */
                  <div className="flex-1 flex flex-col justify-between border-4 border-zinc-900 p-8 rounded-lg text-center relative overflow-hidden">
                    <div
                      className="absolute top-0 left-0 right-0 h-3"
                      style={{ backgroundColor: accentColor }}
                    />

                    <div className="space-y-4 pt-6">
                      <div className="font-mono text-xs uppercase tracking-widest text-zinc-500 font-bold">
                        Certificate of Excellence
                      </div>
                      <h1 className="text-3xl font-serif font-black text-zinc-900">
                        This is proudly presented to
                      </h1>
                      <div
                        className="text-4xl font-serif italic font-bold my-6"
                        style={{ color: accentColor }}
                      >
                        {certRecipient}
                      </div>
                      <p className="text-xs text-zinc-600 max-w-md mx-auto leading-relaxed">
                        For successfully mastering and demonstrating proficiency in
                      </p>
                      <h3 className="text-lg font-bold text-zinc-900 font-sans">
                        {certCourse}
                      </h3>
                    </div>

                    <div className="pt-10 flex justify-between items-end border-t border-zinc-200 mt-10 text-xs">
                      <div>
                        <div className="font-mono font-bold text-zinc-900">{docDate}</div>
                        <div className="text-[10px] text-zinc-400 font-mono">Date Issued</div>
                      </div>
                      <div>
                        <div className="font-serif italic font-bold text-zinc-900 text-sm">{certIssuer}</div>
                        <div className="text-[10px] text-zinc-400 font-mono">Authorized Signature</div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
