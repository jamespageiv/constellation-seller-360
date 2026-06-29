"use client";

import { useState, useEffect } from "react";

interface SFCase {
  Id: string; Subject: string; Status: string; Priority: string; Type: string;
  BDSS_Queue__c: string; CreatedDate: string; Account?: { Name: string };
}

function formatDate(d: string): string {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export default function BrokerIntake() {
  const [cases, setCases] = useState<SFCase[]>([]);
  const [loading, setLoading] = useState(true);
  const [mode, setMode] = useState<"new" | "old">("new");
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    customerName: "", serviceAddress: "", utility: "", product: "Power",
    annualVolume: "", brokerMargin: "", usageNotes: "",
  });

  useEffect(() => {
    fetch("/api/cases").then(r => r.json()).then(data => {
      if (!data.error) setCases(data);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const brokerCases = cases.filter(c => c.Type === "Broker Intake" || c.Type === "Broker");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold text-navy">Broker Intake Portal</h1>
          <p className="text-sm text-slate-500 mt-0.5">Structured deal submission — no more email chaos</p>
        </div>
        <div className="flex items-center gap-1 bg-slate-100 rounded-lg p-1">
          <button onClick={() => setMode("new")} className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${mode === "new" ? "bg-white text-navy shadow-sm" : "text-slate-500"}`}>✨ New Way</button>
          <button onClick={() => setMode("old")} className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${mode === "old" ? "bg-white text-red-600 shadow-sm" : "text-slate-500"}`}>📧 Old Way</button>
        </div>
      </div>

      {mode === "old" ? (
        <div className="grid grid-cols-2 gap-6">
          <div className="bg-white rounded-xl border border-red-200 p-5 relative">
            <div className="absolute -top-3 left-4 bg-red-50 text-red-600 text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wide">Current State</div>
            <div className="space-y-3 mt-2">
              <div className="border border-slate-200 rounded-lg p-3 bg-slate-50">
                <div className="flex items-center gap-2 mb-2"><span className="text-sm">📧</span><span className="text-xs font-medium text-slate-600">From: broker@ebi-brokers.com</span></div>
                <p className="text-xs text-slate-500 italic">&quot;Hey team, got a deal for you. Client is some manufacturing company in Ohio, I think they use about 75,000 MWh. Can you price this up? They want power only. Attached is their latest bill somewhere. Need it by Friday. Thanks!&quot;</p>
                <div className="mt-2 flex gap-2">
                  <span className="text-[10px] bg-red-50 text-red-600 rounded px-1.5 py-0.5">Missing: Customer Name</span>
                  <span className="text-[10px] bg-red-50 text-red-600 rounded px-1.5 py-0.5">Missing: Utility</span>
                  <span className="text-[10px] bg-red-50 text-red-600 rounded px-1.5 py-0.5">Missing: Address</span>
                </div>
              </div>
              <div className="border border-slate-200 rounded-lg p-3 bg-slate-50">
                <div className="flex items-center gap-2 mb-2"><span className="text-sm">📧</span><span className="text-xs font-medium text-slate-600">RE: broker@ebi-brokers.com</span></div>
                <p className="text-xs text-slate-500 italic">&quot;Following up on this — did you get my email from last week? The client is getting antsy. Also, I forgot to mention they want gas too.&quot;</p>
              </div>
            </div>
            <div className="mt-4 bg-red-50 rounded-lg p-3">
              <p className="text-xs font-medium text-red-700">Result: 3 emails, 5 days, still missing data</p>
              <p className="text-[11px] text-red-600 mt-1">No case created · No opportunity linked · No SLA tracking</p>
            </div>
          </div>
          <div className="bg-white rounded-xl border border-teal/30 p-5 relative">
            <div className="absolute -top-3 left-4 bg-teal/10 text-teal-dark text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wide">Future State</div>
            <div className="space-y-2 mt-2 text-sm text-slate-600">
              <p>✅ Structured web form enforces required fields</p>
              <p>✅ Real-time validation (address lookup, UOM normalization)</p>
              <p>✅ Auto-creates Case + linked Opportunity + Offer record</p>
              <p>✅ Assigns to correct BDSS queue by territory</p>
              <p>✅ Broker gets confirmation with case number + estimated SLA</p>
              <p>✅ Full audit trail from intake to close</p>
            </div>
            <div className="mt-4 bg-teal/5 rounded-lg p-3">
              <p className="text-xs font-medium text-teal-dark">Result: 1 submission, all data captured, instant routing</p>
              <p className="text-[11px] text-teal mt-1">Case created · Opportunity linked · SLA clock started</p>
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-6">
          <div className="col-span-2">
            {!submitted ? (
              <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-slate-200 p-5 space-y-4">
                <h2 className="text-sm font-semibold text-navy">Submit New Deal</h2>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1">Customer Name <span className="text-red-500">*</span></label>
                    <input type="text" required value={formData.customerName} onChange={e => setFormData({...formData, customerName: e.target.value})} className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-navy focus:outline-none focus:ring-1 focus:ring-navy/20" placeholder="e.g., GlobalTech Industries" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1">Service Address <span className="text-red-500">*</span></label>
                    <input type="text" required value={formData.serviceAddress} onChange={e => setFormData({...formData, serviceAddress: e.target.value})} className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-navy focus:outline-none focus:ring-1 focus:ring-navy/20" placeholder="e.g., 1234 Industrial Blvd, Columbus, OH" />
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1">Utility <span className="text-red-500">*</span></label>
                    <select required value={formData.utility} onChange={e => setFormData({...formData, utility: e.target.value})} className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-navy focus:outline-none focus:ring-1 focus:ring-navy/20">
                      <option value="">Select utility...</option>
                      <option>ComEd (PJM)</option><option>AEP (PJM)</option><option>DTE (MISO)</option>
                      <option>ERCOT</option><option>Eversource (ISO-NE)</option><option>NYISO</option>
                      <option>CAISO</option><option>Nicor Gas</option><option>Columbia Gas</option><option>Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1">Product <span className="text-red-500">*</span></label>
                    <select value={formData.product} onChange={e => setFormData({...formData, product: e.target.value})} className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-navy focus:outline-none focus:ring-1 focus:ring-navy/20">
                      <option>Power</option><option>Gas</option><option>Both (Bundled)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1">Annual Volume <span className="text-red-500">*</span></label>
                    <input type="text" required value={formData.annualVolume} onChange={e => setFormData({...formData, annualVolume: e.target.value})} className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-navy focus:outline-none focus:ring-1 focus:ring-navy/20" placeholder="e.g., 75,000 MWh" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1">Broker Margin <span className="text-red-500">*</span></label>
                    <input type="text" required value={formData.brokerMargin} onChange={e => setFormData({...formData, brokerMargin: e.target.value})} className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-navy focus:outline-none focus:ring-1 focus:ring-navy/20" placeholder="e.g., $0.003/kWh" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1">Usage / Invoice Upload</label>
                    <div className="w-full rounded-lg border-2 border-dashed border-slate-200 px-3 py-3 text-center cursor-pointer hover:border-navy/30 transition-colors">
                      <p className="text-xs text-slate-400">Drop files here or click to upload</p>
                      <p className="text-[10px] text-slate-300 mt-0.5">PDF, XLS, CSV (max 10MB)</p>
                    </div>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">Notes</label>
                  <textarea value={formData.usageNotes} onChange={e => setFormData({...formData, usageNotes: e.target.value})} rows={3} className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-navy focus:outline-none focus:ring-1 focus:ring-navy/20" placeholder="Additional details about the deal..." />
                </div>
                <button type="submit" className="w-full text-center text-sm font-medium text-white bg-navy rounded-lg py-2.5 hover:bg-navy-dark transition-colors">Submit Deal Intake →</button>
              </form>
            ) : (
              <div className="bg-white rounded-xl border border-teal/30 p-8 text-center">
                <div className="w-16 h-16 bg-teal/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-teal" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h2 className="text-lg font-bold text-navy">Deal Submitted Successfully</h2>
                <p className="text-sm text-slate-500 mt-2">Case <span className="font-mono font-medium text-navy">#500C-2026-0892</span> has been created.</p>
                <div className="mt-4 bg-slate-50 rounded-lg p-4 text-left max-w-md mx-auto">
                  <div className="space-y-1.5 text-sm">
                    <div className="flex justify-between"><span className="text-slate-500">Opportunity:</span><span className="font-medium text-navy">Auto-generated</span></div>
                    <div className="flex justify-between"><span className="text-slate-500">Assigned To:</span><span className="font-medium">BDSS Team Alpha</span></div>
                    <div className="flex justify-between"><span className="text-slate-500">Estimated SLA:</span><span className="font-medium text-teal">24 hours</span></div>
                  </div>
                </div>
                <button onClick={() => { setSubmitted(false); setFormData({customerName: "", serviceAddress: "", utility: "", product: "Power", annualVolume: "", brokerMargin: "", usageNotes: ""}); }} className="mt-4 text-sm font-medium text-navy hover:text-navy-dark">Submit Another Deal →</button>
              </div>
            )}
          </div>

          <div className="space-y-4">
            <h2 className="text-sm font-semibold text-slate-700">Recent Broker Cases</h2>
            {loading ? (
              <div className="flex items-center gap-2 text-sm text-slate-400"><div className="w-4 h-4 border-2 border-navy border-t-transparent rounded-full animate-spin" /> Loading...</div>
            ) : (
              <div className="space-y-2">
                {(brokerCases.length > 0 ? brokerCases : cases).slice(0, 6).map((c) => {
                  const age = Math.ceil((Date.now() - new Date(c.CreatedDate).getTime()) / 864e5);
                  return (
                    <div key={c.Id} className="bg-white rounded-lg border border-slate-200 p-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="text-xs font-medium text-slate-800">{c.Subject}</p>
                          <p className="text-[11px] text-slate-500 mt-0.5">{c.Account?.Name || "—"} · Age: {age}d</p>
                        </div>
                        <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded ${
                          c.Status === "New" ? "bg-blue-50 text-blue-700" :
                          c.Status === "In Progress" || c.Status === "Working" ? "bg-amber-50 text-amber-700" :
                          "bg-green-50 text-green-700"
                        }`}>{c.Status}</span>
                      </div>
                      {c.BDSS_Queue__c && <p className="text-[10px] text-slate-400 mt-1">→ {c.BDSS_Queue__c}</p>}
                      {c.Status === "New" && <p className="text-[10px] text-red-500 mt-1">⚠ Unassigned — awaiting triage</p>}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
