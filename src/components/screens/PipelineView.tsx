"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

interface SFOpportunity {
  Id: string; AccountId: string; Name: string; StageName: string; LOB__c: string;
  Utility__c: string; Amount: number; CloseDate: string; Deal_Risk__c: string;
  Next_Step__c: string; Probability: number;
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

const stageColors: Record<string, string> = {
  Prospecting: "bg-stage-prospecting", Qualification: "bg-stage-qualification",
  Proposal: "bg-stage-proposal", Negotiation: "bg-stage-negotiation",
  "Closed Won": "bg-stage-closed-won", "Closed Lost": "bg-stage-closed-lost",
};
const riskBadge: Record<string, string> = {
  High: "bg-red-50 text-red-700", Medium: "bg-amber-50 text-amber-700", Low: "bg-green-50 text-green-700",
};

export default function PipelineView() {
  const [opportunities, setOpportunities] = useState<SFOpportunity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/opportunities").then(r => r.json()).then(data => {
      if (!data.error) setOpportunities(data);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center h-64">
        <div className="flex items-center gap-3 text-sm text-slate-500">
          <div className="w-5 h-5 border-2 border-navy border-t-transparent rounded-full animate-spin" />
          Loading pipeline from Salesforce...
        </div>
      </div>
    );
  }

  const openOpps = opportunities.filter(o => o.StageName !== "Closed Won" && o.StageName !== "Closed Lost");
  const wonDeals = opportunities.filter(o => o.StageName === "Closed Won");
  const lostDeals = opportunities.filter(o => o.StageName === "Closed Lost");
  const totalPipeline = openOpps.reduce((s, o) => s + (o.Amount || 0), 0);
  const weightedPipeline = openOpps.reduce((s, o) => s + (o.Amount || 0) * ((o.Probability || 0) / 100), 0);

  const byStage = {
    Prospecting: openOpps.filter(o => o.StageName === "Prospecting"),
    Qualification: openOpps.filter(o => o.StageName === "Qualification"),
    Proposal: openOpps.filter(o => o.StageName === "Proposal"),
    Negotiation: openOpps.filter(o => o.StageName === "Negotiation"),
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-lg font-bold text-navy">Pipeline</h1>

      {/* Stats */}
      <div className="grid grid-cols-5 gap-4">
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Total Open</p>
          <p className="text-xl font-bold text-navy mt-1">{formatCurrency(totalPipeline)}</p>
          <p className="text-xs text-slate-400">{openOpps.length} deals</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Weighted</p>
          <p className="text-xl font-bold text-teal mt-1">{formatCurrency(weightedPipeline)}</p>
        </div>
        {(["Prospecting", "Qualification", "Proposal"] as const).map(stage => (
          <div key={stage} className="bg-white rounded-xl border border-slate-200 p-4">
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">{stage}</p>
            <p className="text-xl font-bold text-navy mt-1">{byStage[stage].length}</p>
            <p className="text-xs text-slate-400">{formatCurrency(byStage[stage].reduce((s, o) => s + (o.Amount || 0), 0))}</p>
          </div>
        ))}
      </div>

      {/* Active Deals Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="px-4 py-3 border-b border-slate-200">
          <h2 className="text-sm font-semibold text-slate-700">Active Deals</h2>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              <th className="text-left px-4 py-2.5 text-xs font-semibold text-slate-500 uppercase">Opportunity</th>
              <th className="text-left px-4 py-2.5 text-xs font-semibold text-slate-500 uppercase">Account</th>
              <th className="text-left px-4 py-2.5 text-xs font-semibold text-slate-500 uppercase">Stage</th>
              <th className="text-left px-4 py-2.5 text-xs font-semibold text-slate-500 uppercase">LOB</th>
              <th className="text-right px-4 py-2.5 text-xs font-semibold text-slate-500 uppercase">Amount</th>
              <th className="text-left px-4 py-2.5 text-xs font-semibold text-slate-500 uppercase">Close Date</th>
              <th className="text-center px-4 py-2.5 text-xs font-semibold text-slate-500 uppercase">Risk</th>
              <th className="text-left px-4 py-2.5 text-xs font-semibold text-slate-500 uppercase">Next Step</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {openOpps.sort((a, b) => new Date(a.CloseDate).getTime() - new Date(b.CloseDate).getTime()).map((opp) => (
              <tr key={opp.Id} className="hover:bg-slate-50 transition-colors">
                <td className="px-4 py-3">
                  <Link href={`/pipeline/${opp.Id}`} className="font-medium text-navy hover:text-navy-dark">{opp.Name}</Link>
                </td>
                <td className="px-4 py-3">
                  <Link href={`/accounts/${opp.AccountId}`} className="text-slate-600 hover:text-navy text-xs">{opp.Account?.Name || "—"}</Link>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1.5">
                    <div className={`w-2 h-2 rounded-full ${stageColors[opp.StageName] || "bg-slate-300"}`} />
                    <span className="text-xs text-slate-600">{opp.StageName}</span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                    opp.LOB__c === "Both" ? "bg-purple-50 text-purple-700" :
                    opp.LOB__c === "Power" ? "bg-blue-50 text-blue-700" :
                    opp.LOB__c === "Gas" ? "bg-orange-50 text-orange-700" :
                    "bg-slate-100 text-slate-500"
                  }`}>{opp.LOB__c || "—"}</span>
                </td>
                <td className="px-4 py-3 text-right font-medium text-navy">{formatCurrency(opp.Amount)}</td>
                <td className="px-4 py-3 text-xs text-slate-500">{formatDate(opp.CloseDate)}</td>
                <td className="px-4 py-3 text-center">
                  <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded ${riskBadge[opp.Deal_Risk__c] || "bg-slate-100 text-slate-500"}`}>
                    {opp.Deal_Risk__c || "—"}
                  </span>
                </td>
                <td className="px-4 py-3 text-xs text-slate-500 max-w-48 truncate">{opp.Next_Step__c || "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Win/Loss Section */}
      <div className="grid grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <h3 className="text-sm font-semibold text-green-700 mb-3">Closed Won ({wonDeals.length})</h3>
          <div className="space-y-2">
            {wonDeals.slice(0, 5).map((o) => (
              <div key={o.Id} className="flex items-center justify-between border border-green-100 rounded-lg p-3 bg-green-50/30">
                <div>
                  <p className="text-sm font-medium text-slate-800">{o.Name}</p>
                  <p className="text-xs text-slate-500">{o.Account?.Name || "—"} · {formatDate(o.CloseDate)}</p>
                </div>
                <span className="text-sm font-bold text-green-700">{formatCurrency(o.Amount)}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <h3 className="text-sm font-semibold text-red-700 mb-3">Closed Lost ({lostDeals.length})</h3>
          <div className="space-y-2">
            {lostDeals.slice(0, 5).map((o) => (
              <div key={o.Id} className="flex items-center justify-between border border-red-100 rounded-lg p-3 bg-red-50/30">
                <div>
                  <p className="text-sm font-medium text-slate-800">{o.Name}</p>
                  <p className="text-xs text-slate-500">{o.Account?.Name || "—"} · {formatDate(o.CloseDate)}</p>
                </div>
                <span className="text-sm font-bold text-red-700">{formatCurrency(o.Amount)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
