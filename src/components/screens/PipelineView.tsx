"use client";

import Link from "next/link";
import {
  opportunities,
  getAccountById,
  formatCurrency,
  formatDate,
  getPipelineSummary,
} from "@/lib/mock-data";

const stageColors: Record<string, string> = {
  Prospecting: "bg-stage-prospecting",
  Qualification: "bg-stage-qualification",
  Proposal: "bg-stage-proposal",
  Negotiation: "bg-stage-negotiation",
  "Closed Won": "bg-stage-closed-won",
  "Closed Lost": "bg-stage-closed-lost",
};

const riskBadge: Record<string, string> = {
  High: "bg-red-50 text-red-700",
  Medium: "bg-amber-50 text-amber-700",
  Low: "bg-green-50 text-green-700",
};

export default function PipelineView() {
  const { byStage, totalPipeline, weightedPipeline, totalDeals } = getPipelineSummary();
  const wonDeals = opportunities.filter(o => o.stage === "Closed Won");
  const lostDeals = opportunities.filter(o => o.stage === "Closed Lost");

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-lg font-bold text-navy">Pipeline</h1>

      {/* Stats */}
      <div className="grid grid-cols-5 gap-4">
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Total Open</p>
          <p className="text-xl font-bold text-navy mt-1">{formatCurrency(totalPipeline)}</p>
          <p className="text-xs text-slate-400">{totalDeals} deals</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Weighted</p>
          <p className="text-xl font-bold text-teal mt-1">{formatCurrency(weightedPipeline)}</p>
        </div>
        {(["Prospecting", "Qualification", "Proposal"] as const).map(stage => (
          <div key={stage} className="bg-white rounded-xl border border-slate-200 p-4">
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">{stage}</p>
            <p className="text-xl font-bold text-navy mt-1">{byStage[stage].length}</p>
            <p className="text-xs text-slate-400">{formatCurrency(byStage[stage].reduce((s, o) => s + o.amount, 0))}</p>
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
            {opportunities
              .filter(o => !o.stage.startsWith("Closed"))
              .sort((a, b) => new Date(a.closeDate).getTime() - new Date(b.closeDate).getTime())
              .map((opp) => {
                const acct = getAccountById(opp.accountId);
                return (
                  <tr key={opp.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3">
                      <Link href={`/pipeline/${opp.id}`} className="font-medium text-navy hover:text-navy-dark">
                        {opp.name}
                      </Link>
                    </td>
                    <td className="px-4 py-3">
                      <Link href={`/accounts/${opp.accountId}`} className="text-slate-600 hover:text-navy text-xs">
                        {acct?.name}
                      </Link>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5">
                        <div className={`w-2 h-2 rounded-full ${stageColors[opp.stage]}`} />
                        <span className="text-xs text-slate-600">{opp.stage}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                        opp.lob === "Both" ? "bg-purple-50 text-purple-700" :
                        opp.lob === "Power" ? "bg-blue-50 text-blue-700" :
                        "bg-orange-50 text-orange-700"
                      }`}>
                        {opp.lob}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right font-medium text-navy">{formatCurrency(opp.amount)}</td>
                    <td className="px-4 py-3 text-xs text-slate-500">{formatDate(opp.closeDate)}</td>
                    <td className="px-4 py-3 text-center">
                      <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded ${riskBadge[opp.riskScore]}`}>
                        {opp.riskScore}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs text-slate-500 max-w-48 truncate">{opp.nextStep}</td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>

      {/* Win/Loss Section */}
      <div className="grid grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <h3 className="text-sm font-semibold text-green-700 mb-3">Closed Won ({wonDeals.length})</h3>
          <div className="space-y-2">
            {wonDeals.map((o) => {
              const acct = getAccountById(o.accountId);
              return (
                <div key={o.id} className="flex items-center justify-between border border-green-100 rounded-lg p-3 bg-green-50/30">
                  <div>
                    <p className="text-sm font-medium text-slate-800">{o.name}</p>
                    <p className="text-xs text-slate-500">{acct?.name} · {formatDate(o.closeDate)}</p>
                  </div>
                  <span className="text-sm font-bold text-green-700">{formatCurrency(o.amount)}</span>
                </div>
              );
            })}
          </div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <h3 className="text-sm font-semibold text-red-700 mb-3">Closed Lost ({lostDeals.length})</h3>
          <div className="space-y-2">
            {lostDeals.map((o) => {
              const acct = getAccountById(o.accountId);
              return (
                <div key={o.id} className="flex items-center justify-between border border-red-100 rounded-lg p-3 bg-red-50/30">
                  <div>
                    <p className="text-sm font-medium text-slate-800">{o.name}</p>
                    <p className="text-xs text-slate-500">{acct?.name} · {formatDate(o.closeDate)}</p>
                  </div>
                  <span className="text-sm font-bold text-red-700">{formatCurrency(o.amount)}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
