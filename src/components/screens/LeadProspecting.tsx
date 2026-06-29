"use client";

import { useState } from "react";
import {
  leads,
  calpineWhiteSpace,
  formatCurrency,
  formatDate,
} from "@/lib/mock-data";

const urgencyBadge: Record<string, string> = {
  Hot: "bg-red-50 text-red-700 border-red-200",
  Warm: "bg-amber-50 text-amber-700 border-amber-200",
  Cold: "bg-blue-50 text-blue-700 border-blue-200",
};

const icpBadge: Record<string, string> = {
  High: "bg-green-50 text-green-700",
  Medium: "bg-amber-50 text-amber-700",
  Low: "bg-slate-100 text-slate-500",
};

export default function LeadProspecting() {
  const [tab, setTab] = useState<"leads" | "calpine">("leads");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const sortedLeads = [...leads].sort((a, b) => b.propensityScore - a.propensityScore);

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold text-navy">AI-Powered Lead Prospecting Center</h1>
          <p className="text-sm text-slate-500 mt-0.5">Lead with Insight, Not Instinct</p>
        </div>
        <button className="flex items-center gap-2 rounded-lg bg-navy px-3 py-2 text-sm font-medium text-white hover:bg-navy-dark transition-colors">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
          </svg>
          Let Agentforce handle outreach
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-slate-100 rounded-lg p-1 w-fit">
        <button
          onClick={() => setTab("leads")}
          className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${
            tab === "leads" ? "bg-white text-navy shadow-sm" : "text-slate-500 hover:text-slate-700"
          }`}
        >
          Lead Score Board ({leads.length})
        </button>
        <button
          onClick={() => setTab("calpine")}
          className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${
            tab === "calpine" ? "bg-white text-navy shadow-sm" : "text-slate-500 hover:text-slate-700"
          }`}
        >
          Calpine White Space ({calpineWhiteSpace.length})
          <span className="ml-1 text-gold">●</span>
        </button>
      </div>

      {tab === "leads" ? (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Company</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Segment</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase">LOB</th>
                <th className="text-center px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Score</th>
                <th className="text-center px-4 py-3 text-xs font-semibold text-slate-500 uppercase">ICP</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Last Touch</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Action</th>
                <th className="text-center px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Urgency</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {sortedLeads.map((lead) => (
                <>
                  <tr
                    key={lead.id}
                    className="hover:bg-slate-50 transition-colors cursor-pointer"
                    onClick={() => setExpandedId(expandedId === lead.id ? null : lead.id)}
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-slate-800">{lead.company}</span>
                        {lead.calpineFlag && (
                          <span className="text-[10px] bg-gold/10 text-gold-dark rounded px-1.5 py-0.5 font-medium">Calpine</span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-500">{lead.firstName} {lead.lastName} · {lead.title}</p>
                    </td>
                    <td className="px-4 py-3 text-slate-600 text-xs">{lead.segment}</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                        lead.lob === "Both" ? "bg-purple-50 text-purple-700" :
                        lead.lob === "Power" ? "bg-blue-50 text-blue-700" :
                        "bg-orange-50 text-orange-700"
                      }`}>
                        {lead.lob}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <div className="w-12 h-2 bg-slate-100 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              lead.propensityScore >= 70 ? "bg-green-500" :
                              lead.propensityScore >= 40 ? "bg-amber-400" :
                              "bg-slate-300"
                            }`}
                            style={{ width: `${lead.propensityScore}%` }}
                          />
                        </div>
                        <span className="text-xs font-bold text-navy">{lead.propensityScore}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded ${icpBadge[lead.icpMatch]}`}>
                        {lead.icpMatch}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs text-slate-500">
                      <p>{lead.lastTouchpoint}</p>
                      <p className="text-[11px] text-slate-400">{formatDate(lead.lastTouchpointDate)}</p>
                    </td>
                    <td className="px-4 py-3 text-xs text-slate-600 max-w-48 truncate">{lead.recommendedAction}</td>
                    <td className="px-4 py-3 text-center">
                      <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full border ${urgencyBadge[lead.urgency]}`}>
                        {lead.urgency}
                      </span>
                    </td>
                  </tr>
                  {expandedId === lead.id && (
                    <tr key={`${lead.id}-detail`}>
                      <td colSpan={8} className="bg-navy/3 px-4 py-4">
                        <div className="grid grid-cols-3 gap-4">
                          <div className="bg-white rounded-lg p-3 border border-slate-100">
                            <p className="text-xs font-semibold text-navy mb-1">ICP Match Detail</p>
                            <p className="text-[11px] text-slate-600">
                              {lead.icpMatch === "High"
                                ? `Multi-site ${lead.industry} customer in deregulated market. Annual spend ${formatCurrency(lead.annualSpend)} falls in Constellation sweet spot. ${lead.calpineFlag ? "Existing Calpine relationship adds cross-sell upside." : "Strong fit for bundled energy solutions."}`
                                : lead.icpMatch === "Medium"
                                ? `Mid-market customer with ${formatCurrency(lead.annualSpend)} annual spend. Standard supply interest. ${lead.industry} aligns with secondary verticals.`
                                : `Small commercial customer under target spend threshold. ${lead.industry} outside core verticals.`
                              }
                            </p>
                          </div>
                          <div className="bg-white rounded-lg p-3 border border-slate-100">
                            <p className="text-xs font-semibold text-navy mb-1">Scoring Factors</p>
                            <div className="space-y-1.5 text-[11px] text-slate-600">
                              <div className="flex justify-between">
                                <span>Industry Alignment</span>
                                <span className="font-medium">{lead.propensityScore >= 70 ? "Strong" : lead.propensityScore >= 40 ? "Moderate" : "Weak"}</span>
                              </div>
                              <div className="flex justify-between">
                                <span>Spend Level</span>
                                <span className="font-medium">{formatCurrency(lead.annualSpend)}</span>
                              </div>
                              <div className="flex justify-between">
                                <span>Calpine Cross-Sell</span>
                                <span className="font-medium">{lead.calpineFlag ? "Yes" : "No"}</span>
                              </div>
                            </div>
                          </div>
                          <div className="bg-white rounded-lg p-3 border border-slate-100">
                            <p className="text-xs font-semibold text-navy mb-2">Recommended Products</p>
                            <div className="flex flex-wrap gap-1">
                              {lead.lob === "Power" || lead.lob === "Both" ? (
                                <span className="text-[10px] bg-blue-50 text-blue-700 rounded px-2 py-0.5">Fixed Power</span>
                              ) : null}
                              {lead.lob === "Gas" || lead.lob === "Both" ? (
                                <span className="text-[10px] bg-orange-50 text-orange-700 rounded px-2 py-0.5">Natural Gas</span>
                              ) : null}
                              {lead.propensityScore >= 70 && (
                                <span className="text-[10px] bg-green-50 text-green-700 rounded px-2 py-0.5">Renewables</span>
                              )}
                              {lead.annualSpend >= 5000000 && (
                                <span className="text-[10px] bg-purple-50 text-purple-700 rounded px-2 py-0.5">Total Energy Mgmt</span>
                              )}
                            </div>
                            <button className="mt-3 w-full text-center text-xs font-medium text-white bg-teal rounded-md py-1.5 hover:bg-teal-dark transition-colors">
                              Convert to Opportunity →
                            </button>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        /* Calpine White Space Tab */
        <div className="space-y-4">
          <div className="bg-gradient-to-r from-gold/10 to-gold/5 border border-gold/30 rounded-xl p-5">
            <h3 className="text-sm font-bold text-gold-dark">The $2–5B Calpine Cross-Sell Opportunity</h3>
            <p className="text-xs text-slate-600 mt-1">
              These Calpine accounts have no existing Constellation relationship. Sorted by propensity to convert.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {calpineWhiteSpace.map((cws) => (
              <div key={cws.id} className="bg-white rounded-xl border border-slate-200 p-5 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-semibold text-navy">{cws.calpineAccountName}</h3>
                      <span className="text-[10px] bg-gold/10 text-gold-dark rounded px-1.5 py-0.5 font-medium">Calpine Legacy</span>
                    </div>
                    <p className="text-sm text-slate-500 mt-0.5">{cws.industry} · {formatCurrency(cws.annualSpend)}/yr</p>
                    <p className="text-xs text-slate-400 mt-1">Currently: {cws.existingProduct}</p>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-3">
                      <div>
                        <p className="text-xs text-slate-500">ICP Score</p>
                        <p className="text-xl font-bold text-teal">{cws.icpScore}</p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-500">Propensity</p>
                        <p className="text-xl font-bold text-navy">{cws.propensityToConvert}%</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mt-3 bg-slate-50 rounded-lg p-3">
                  <p className="text-xs font-medium text-slate-700">Constellation Opportunity</p>
                  <p className="text-sm text-slate-600 mt-0.5">{cws.constellationOpportunity}</p>
                </div>
                <div className="mt-3 flex gap-2">
                  <button className="flex-1 text-center text-xs font-medium text-white bg-navy rounded-lg py-2 hover:bg-navy-dark transition-colors">
                    Start Deal →
                  </button>
                  <button className="text-xs font-medium text-navy border border-navy/30 rounded-lg px-4 py-2 hover:bg-navy/5 transition-colors">
                    View Account
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
