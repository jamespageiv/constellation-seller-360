"use client";

import { useState, useEffect } from "react";

interface SFLead {
  Id: string; Company: string; FirstName: string; LastName: string; Title: string;
  Industry: string; Segment__c: string; LOB__c: string; Lead_Score__c: number;
  ICP_Match_Score__c: string; Propensity_Score__c: number; Recommended_Outreach__c: string;
  Last_Touchpoint_Date__c: string; Source_Type__c: string; Calpine_White_Space__c: boolean; Status: string;
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

const urgencyBadge: Record<string, string> = {
  Hot: "bg-red-50 text-red-700 border-red-200",
  Warm: "bg-amber-50 text-amber-700 border-amber-200",
  Cold: "bg-blue-50 text-blue-700 border-blue-200",
};
const icpBadge: Record<string, string> = {
  High: "bg-green-50 text-green-700", Medium: "bg-amber-50 text-amber-700", Low: "bg-slate-100 text-slate-500",
};

function getUrgency(lead: SFLead): "Hot" | "Warm" | "Cold" {
  if ((lead.Propensity_Score__c || 0) >= 70) return "Hot";
  if ((lead.Propensity_Score__c || 0) >= 40) return "Warm";
  return "Cold";
}

export default function LeadProspecting() {
  const [leads, setLeads] = useState<SFLead[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<"leads" | "calpine">("leads");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/leads").then(r => r.json()).then(data => {
      if (!data.error) setLeads(data);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center h-64">
        <div className="flex items-center gap-3 text-sm text-slate-500">
          <div className="w-5 h-5 border-2 border-navy border-t-transparent rounded-full animate-spin" />
          Loading leads from Salesforce...
        </div>
      </div>
    );
  }

  const sortedLeads = [...leads].sort((a, b) => (b.Propensity_Score__c || 0) - (a.Propensity_Score__c || 0));
  const calpineLeads = sortedLeads.filter(l => l.Calpine_White_Space__c);
  const displayLeads = tab === "calpine" ? calpineLeads : sortedLeads;

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
          Calpine White Space ({calpineLeads.length})
          <span className="ml-1 text-gold">●</span>
        </button>
      </div>

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
            {displayLeads.map((lead) => {
              const urgency = getUrgency(lead);
              return (
                <tr
                  key={lead.Id}
                  className="hover:bg-slate-50 transition-colors cursor-pointer"
                  onClick={() => setExpandedId(expandedId === lead.Id ? null : lead.Id)}
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-slate-800">{lead.Company}</span>
                      {lead.Calpine_White_Space__c && (
                        <span className="text-[10px] bg-gold/10 text-gold-dark rounded px-1.5 py-0.5 font-medium">Calpine</span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-500">{lead.FirstName} {lead.LastName} · {lead.Title || "—"}</p>
                  </td>
                  <td className="px-4 py-3 text-slate-600 text-xs">{lead.Segment__c || "—"}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                      lead.LOB__c === "Both" ? "bg-purple-50 text-purple-700" :
                      lead.LOB__c === "Power" ? "bg-blue-50 text-blue-700" :
                      lead.LOB__c === "Gas" ? "bg-orange-50 text-orange-700" :
                      "bg-slate-100 text-slate-500"
                    }`}>{lead.LOB__c || "—"}</span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <div className="flex items-center justify-center gap-1.5">
                      <div className="w-12 h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${
                            (lead.Propensity_Score__c || 0) >= 70 ? "bg-green-500" :
                            (lead.Propensity_Score__c || 0) >= 40 ? "bg-amber-400" :
                            "bg-slate-300"
                          }`}
                          style={{ width: `${lead.Propensity_Score__c || 0}%` }}
                        />
                      </div>
                      <span className="text-xs font-bold text-navy">{lead.Propensity_Score__c || 0}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded ${icpBadge[lead.ICP_Match_Score__c] || "bg-slate-100 text-slate-500"}`}>
                      {lead.ICP_Match_Score__c || "—"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs text-slate-500">
                    <p>{lead.Source_Type__c || "—"}</p>
                    <p className="text-[11px] text-slate-400">{formatDate(lead.Last_Touchpoint_Date__c)}</p>
                  </td>
                  <td className="px-4 py-3 text-xs text-slate-600 max-w-48 truncate">{lead.Recommended_Outreach__c || "—"}</td>
                  <td className="px-4 py-3 text-center">
                    <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full border ${urgencyBadge[urgency]}`}>
                      {urgency}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {displayLeads.length === 0 && (
          <div className="text-center py-8 text-sm text-slate-400">No leads found.</div>
        )}
      </div>
    </div>
  );
}
