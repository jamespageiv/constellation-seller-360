"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

interface SFOpportunity {
  Id: string; AccountId: string; Name: string; StageName: string; LOB__c: string;
  Utility__c: string; Contract_Term_Months__c: number; Estimated_Annual_Volume_MWh__c: number;
  Estimated_Annual_Volume_Therms__c: number; Offer_ID__c: string; Indicative_Price__c: number;
  Amount: number; CloseDate: string; Next_Step__c: string; Deal_Risk__c: string;
  Pricing_Source__c: string; Probability: number;
  Account?: { Name: string; Calpine_Flag__c: boolean };
}

function formatCurrency(n: number): string {
  if (!n) return "$0";
  if (n >= 1e6) return `$${(n / 1e6).toFixed(1)}M`;
  if (n >= 1e3) return `$${(n / 1e3).toFixed(0)}K`;
  return `$${n.toLocaleString()}`;
}
function formatDate(d: string): string {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}
function daysUntil(d: string): number {
  if (!d) return 999;
  return Math.ceil((new Date(d).getTime() - Date.now()) / 864e5);
}

const stageOrder = ["Prospecting", "Qualification", "Proposal", "Negotiation", "Closed Won"];
const riskBadge: Record<string, string> = {
  High: "bg-red-50 text-red-700 border-red-200", Medium: "bg-amber-50 text-amber-700 border-amber-200",
  Low: "bg-green-50 text-green-700 border-green-200",
};

export default function OpportunityDetail({ opportunityId }: { opportunityId: string }) {
  const [opp, setOpp] = useState<SFOpportunity | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/opportunities/${opportunityId}`)
      .then(r => r.json())
      .then(data => {
        if (!data.error) setOpp(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [opportunityId]);

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center h-64">
        <div className="flex items-center gap-3 text-sm text-slate-500">
          <div className="w-5 h-5 border-2 border-navy border-t-transparent rounded-full animate-spin" />
          Loading opportunity from Salesforce...
        </div>
      </div>
    );
  }

  if (!opp) {
    return (
      <div className="p-6">
        <p className="text-sm text-slate-500">Opportunity not found.</p>
        <Link href="/pipeline" className="text-sm text-navy hover:underline mt-2 inline-block">← Back to Pipeline</Link>
      </div>
    );
  }

  const currentStageIdx = stageOrder.indexOf(opp.StageName);
  const daysToClose = daysUntil(opp.CloseDate);

  const volume = opp.Estimated_Annual_Volume_MWh__c
    ? `${opp.Estimated_Annual_Volume_MWh__c.toLocaleString()} MWh`
    : opp.Estimated_Annual_Volume_Therms__c
    ? `${opp.Estimated_Annual_Volume_Therms__c.toLocaleString()} Therms`
    : "—";

  const term = opp.Contract_Term_Months__c ? `${opp.Contract_Term_Months__c} months` : "—";

  // Guided selling checklist
  const guidedSelling: Record<string, { question: string; done: boolean }[]> = {
    Prospecting: [
      { question: "Load profile qualified?", done: false },
      { question: "Decision maker identified?", done: false },
      { question: "Budget confirmed?", done: false },
    ],
    Qualification: [
      { question: "Utility and volume confirmed?", done: true },
      { question: "Contract expiration verified?", done: true },
      { question: "Competitive landscape assessed?", done: false },
      { question: "Pricing request submitted?", done: false },
    ],
    Proposal: [
      { question: "Indicative pricing received?", done: !!opp.Indicative_Price__c },
      { question: "Proposal presented to customer?", done: true },
      { question: "Margin review completed?", done: false },
      { question: "Legal terms shared?", done: false },
    ],
    Negotiation: [
      { question: "Final pricing locked?", done: true },
      { question: "Legal review completed?", done: !(opp.Next_Step__c || "").toLowerCase().includes("legal") },
      { question: "Contract draft generated?", done: false },
      { question: "Customer signature obtained?", done: false },
    ],
  };
  const checklist = guidedSelling[opp.StageName] || [];

  return (
    <div className="p-6 space-y-6">
      {/* Deal Header */}
      <div className="bg-white rounded-xl border border-slate-200 p-5">
        <Link href="/pipeline" className="text-xs text-slate-400 hover:text-navy mb-2 inline-block">← Pipeline</Link>
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-xl font-bold text-navy">{opp.Name}</h1>
            <p className="text-sm text-slate-500 mt-0.5">
              <Link href={`/accounts/${opp.AccountId}`} className="hover:text-navy">{opp.Account?.Name || "—"}</Link>
              {" · "}{opp.LOB__c || "—"} · {opp.Utility__c || "—"}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className={`text-xs font-medium px-2.5 py-1 rounded-full border ${riskBadge[opp.Deal_Risk__c] || "bg-slate-100 text-slate-500 border-slate-200"}`}>
              {opp.Deal_Risk__c || "—"} Risk
            </span>
            <div className="text-right">
              <p className="text-2xl font-bold text-navy">{formatCurrency(opp.Amount)}</p>
              <p className="text-xs text-slate-400">{term} · {volume}</p>
            </div>
          </div>
        </div>

        {/* Stage Progress */}
        <div className="mt-5">
          <div className="flex items-center gap-1">
            {stageOrder.map((stage, idx) => (
              <div key={stage} className="flex-1 flex flex-col items-center">
                <div className={`w-full h-2 rounded-full ${idx <= currentStageIdx ? "bg-navy" : "bg-slate-100"}`} />
                <span className={`text-[10px] mt-1 ${idx === currentStageIdx ? "font-bold text-navy" : "text-slate-400"}`}>{stage}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-4 gap-4 mt-4">
          <div>
            <p className="text-xs text-slate-500">Close Date</p>
            <p className="text-sm font-medium">{formatDate(opp.CloseDate)}</p>
            <p className={`text-[10px] ${daysToClose <= 30 ? "text-red-600" : daysToClose <= 60 ? "text-amber-600" : "text-slate-400"}`}>
              {daysToClose > 0 ? `${daysToClose} days` : "Overdue"}
            </p>
          </div>
          <div>
            <p className="text-xs text-slate-500">Probability</p>
            <p className="text-sm font-medium">{opp.Probability || 0}%</p>
          </div>
          <div>
            <p className="text-xs text-slate-500">Next Step</p>
            <p className="text-sm font-medium text-navy">{opp.Next_Step__c || "—"}</p>
          </div>
          {opp.Offer_ID__c && (
            <div>
              <p className="text-xs text-slate-500">Offer ID</p>
              <p className="text-sm font-mono font-medium">{opp.Offer_ID__c}</p>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2 space-y-6">
          {/* Guided Selling */}
          <div className="bg-gradient-to-br from-navy/5 to-navy/10 border border-navy/20 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-3">
              <svg className="w-4 h-4 text-navy" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
              </svg>
              <h3 className="text-sm font-bold text-navy">Guided Selling — {opp.StageName}</h3>
              <span className="text-[10px] bg-teal/10 text-teal-dark rounded-full px-2 py-0.5 font-medium">Agentforce</span>
            </div>
            <div className="space-y-2">
              {checklist.map((item, idx) => (
                <div key={idx} className="flex items-center gap-2 bg-white/80 rounded-lg p-2.5">
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${item.done ? "border-teal bg-teal" : "border-slate-300"}`}>
                    {item.done && (
                      <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                      </svg>
                    )}
                  </div>
                  <span className={`text-sm ${item.done ? "text-slate-400 line-through" : "text-slate-700"}`}>{item.question}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Pricing */}
          <div className="bg-white rounded-xl border border-slate-200 p-4">
            <h3 className="text-sm font-semibold text-slate-700 mb-3">Pricing</h3>
            {opp.Indicative_Price__c ? (
              <>
                <div className="grid grid-cols-4 gap-4">
                  <div><p className="text-xs text-slate-500">Offer ID</p><p className="text-sm font-mono font-medium">{opp.Offer_ID__c || "—"}</p></div>
                  <div><p className="text-xs text-slate-500">Product</p><p className="text-sm font-medium">{opp.LOB__c || "—"}</p></div>
                  <div><p className="text-xs text-slate-500">Indicative Price</p><p className="text-lg font-bold text-teal">${opp.Indicative_Price__c}</p></div>
                  <div><p className="text-xs text-slate-500">Source</p><p className="text-sm font-medium">{opp.Pricing_Source__c || "—"}</p></div>
                </div>
                <div className="mt-3 flex gap-2">
                  <button className="text-xs font-medium text-white bg-navy rounded-lg px-4 py-2 hover:bg-navy-dark transition-colors">Request Updated Pricing</button>
                  {opp.StageName === "Negotiation" && (
                    <button className="text-xs font-medium text-navy border border-navy/30 rounded-lg px-4 py-2 hover:bg-navy/5 transition-colors">Generate Contract →</button>
                  )}
                </div>
              </>
            ) : (
              <>
                <p className="text-sm text-slate-400 mb-3">No indicative pricing yet for this deal.</p>
                <button className="text-xs font-medium text-white bg-navy rounded-lg px-4 py-2 hover:bg-navy-dark transition-colors">Request Pricing →</button>
              </>
            )}
          </div>
        </div>

        {/* Right — Quick Actions */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-slate-200 p-4">
            <div className="flex items-center gap-2 mb-3">
              <svg className="w-4 h-4 text-navy" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
              </svg>
              <h3 className="text-sm font-bold text-navy">AI Call Summary</h3>
            </div>
            <div className="bg-slate-50 rounded-lg p-3 text-xs text-slate-600 space-y-2">
              <p><strong className="text-navy">Key Topics:</strong> Pricing terms, contract timeline, sustainability requirements</p>
              <p><strong className="text-navy">Action Items:</strong></p>
              <div className="pl-3 space-y-1">
                <p>• Send revised pricing by EOW</p>
                <p>• Coordinate with legal on contract template</p>
                <p>• Schedule follow-up with sustainability team</p>
              </div>
              <p><strong className="text-navy">Risk Flags:</strong> {opp.Deal_Risk__c === "High" ? "Customer mentioned competing bids." : "No significant risk flags detected."}</p>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 p-4">
            <h3 className="text-sm font-semibold text-slate-700 mb-3">Quick Actions</h3>
            <div className="space-y-2">
              <button className="w-full text-left text-xs font-medium text-navy bg-navy/5 rounded-lg px-3 py-2 hover:bg-navy/10 transition-colors">📧 Draft follow-up email</button>
              <button className="w-full text-left text-xs font-medium text-navy bg-navy/5 rounded-lg px-3 py-2 hover:bg-navy/10 transition-colors">📞 Log a call</button>
              <button className="w-full text-left text-xs font-medium text-navy bg-navy/5 rounded-lg px-3 py-2 hover:bg-navy/10 transition-colors">📋 Create task</button>
              {opp.StageName === "Negotiation" && (
                <button className="w-full text-center text-xs font-medium text-white bg-teal rounded-lg px-3 py-2 hover:bg-teal-dark transition-colors">✅ Generate Contract Draft</button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
