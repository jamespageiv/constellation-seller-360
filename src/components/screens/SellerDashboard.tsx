"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

interface SFOpportunity {
  Id: string; AccountId: string; Name: string; StageName: string; LOB__c: string;
  Utility__c: string; Amount: number; CloseDate: string; Deal_Risk__c: string;
  Next_Step__c: string; Probability: number;
  Account?: { Name: string; Calpine_Flag__c: boolean };
}

interface SFAccount {
  Id: string; Name: string; Account_Type__c: string; LOB__c: string; Industry: string;
  Annual_Energy_Spend__c: number; Contract_Expiration_Date__c: string; Wallet_Share__c: number;
  Calpine_Flag__c: boolean; BillingCity: string; BillingState: string;
}

interface SFLead {
  Id: string; Company: string; FirstName: string; LastName: string; Title: string;
  Industry: string; Segment__c: string; LOB__c: string; Propensity_Score__c: number;
  ICP_Match_Score__c: string; Recommended_Outreach__c: string; Calpine_White_Space__c: boolean;
}

interface DashboardData {
  totalPipeline: number; weightedPipeline: number; totalDeals: number; highRiskDeals: number;
  expiringAccounts: SFAccount[]; hotLeads: SFLead[]; calpineLeads: SFLead[];
  openOpps: SFOpportunity[]; byStage: Record<string, SFOpportunity[]>;
  accounts: SFAccount[]; opportunities: SFOpportunity[]; leads: SFLead[];
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

const stageColors: Record<string, string> = {
  Prospecting: "bg-stage-prospecting", Qualification: "bg-stage-qualification",
  Proposal: "bg-stage-proposal", Negotiation: "bg-stage-negotiation",
  "Closed Won": "bg-stage-closed-won", "Closed Lost": "bg-stage-closed-lost",
};
const riskBorder: Record<string, string> = {
  High: "border-l-risk-high", Medium: "border-l-risk-medium", Low: "border-l-risk-low",
};
const riskBadge: Record<string, string> = {
  High: "bg-red-50 text-red-700", Medium: "bg-amber-50 text-amber-700", Low: "bg-green-50 text-green-700",
};

export default function SellerDashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/dashboard")
      .then((r) => r.json())
      .then((d) => { if (!d.error) setData(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center h-64">
        <div className="flex items-center gap-3 text-sm text-slate-500">
          <div className="w-5 h-5 border-2 border-navy border-t-transparent rounded-full animate-spin" />
          Loading dashboard from Salesforce...
        </div>
      </div>
    );
  }

  const today = new Date();
  const greeting = today.getHours() < 12 ? "Good morning" : today.getHours() < 17 ? "Good afternoon" : "Good evening";
  const dateStr = today.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" });

  const totalPipeline = data?.totalPipeline || 0;
  const weightedPipeline = data?.weightedPipeline || 0;
  const totalDeals = data?.totalDeals || 0;
  const highRiskDeals = data?.highRiskDeals || 0;
  const byStage = data?.byStage || {};
  const expiringAccounts = data?.expiringAccounts || [];
  const calpineLeads = data?.calpineLeads || [];
  const hotLeads = data?.hotLeads || [];
  const negotiationDeals = byStage.Negotiation || [];

  return (
    <div className="p-6 space-y-6">
      {/* Greeting Bar */}
      <div className="bg-white rounded-xl border border-slate-200 p-5">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-xl font-bold text-navy">{greeting}, James</h1>
            <p className="text-sm text-slate-500 mt-0.5">{dateStr}</p>
          </div>
          <div className="bg-navy/5 rounded-lg px-4 py-2 text-sm text-navy">
            <span className="font-semibold">{highRiskDeals} deals requiring action</span> and{" "}
            <span className="font-semibold">{expiringAccounts.length} renewals due in 90 days</span>
          </div>
        </div>
      </div>

      {/* Pipeline Stats */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Total Pipeline</p>
          <p className="text-2xl font-bold text-navy mt-1">{formatCurrency(totalPipeline)}</p>
          <p className="text-xs text-slate-400 mt-1">{totalDeals} open deals</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Weighted Pipeline</p>
          <p className="text-2xl font-bold text-teal mt-1">{formatCurrency(weightedPipeline)}</p>
          <p className="text-xs text-slate-400 mt-1">Probability-weighted</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Deals in Negotiation</p>
          <p className="text-2xl font-bold text-stage-negotiation mt-1">{negotiationDeals.length}</p>
          <p className="text-xs text-slate-400 mt-1">{formatCurrency(negotiationDeals.reduce((s, o) => s + (o.Amount || 0), 0))}</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Calpine Opportunities</p>
          <p className="text-2xl font-bold text-gold mt-1">{calpineLeads.length}</p>
          <p className="text-xs text-slate-400 mt-1">White space leads</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Pipeline Kanban */}
        <div className="col-span-2 space-y-4">
          <h2 className="text-sm font-semibold text-slate-700 uppercase tracking-wide">My Pipeline at a Glance</h2>
          <div className="grid grid-cols-4 gap-3">
            {(["Prospecting", "Qualification", "Proposal", "Negotiation"] as const).map((stage) => {
              const stageDeals = byStage[stage] || [];
              return (
                <div key={stage} className="space-y-2">
                  <div className="flex items-center gap-2 mb-2">
                    <div className={`w-2 h-2 rounded-full ${stageColors[stage]}`} />
                    <span className="text-xs font-medium text-slate-600">{stage}</span>
                    <span className="text-xs text-slate-400">({stageDeals.length})</span>
                  </div>
                  {stageDeals.map((opp) => (
                    <Link
                      key={opp.Id}
                      href={`/pipeline/${opp.Id}`}
                      className={`block bg-white rounded-lg border border-slate-200 border-l-4 ${riskBorder[opp.Deal_Risk__c] || "border-l-slate-200"} p-3 hover:shadow-md transition-shadow`}
                    >
                      <p className="text-xs font-semibold text-slate-800 truncate">{opp.Account?.Name || "—"}</p>
                      <p className="text-[11px] text-slate-500 truncate mt-0.5">{opp.LOB__c || "—"} · {opp.Utility__c || "—"}</p>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-xs font-bold text-navy">{formatCurrency(opp.Amount)}</span>
                        <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded ${riskBadge[opp.Deal_Risk__c] || "bg-slate-100 text-slate-500"}`}>
                          {opp.Deal_Risk__c || "—"}
                        </span>
                      </div>
                      {opp.Account?.Calpine_Flag__c && (
                        <div className="mt-1.5 text-[10px] bg-gold/10 text-gold-dark rounded px-1.5 py-0.5 inline-block font-medium">
                          Calpine
                        </div>
                      )}
                    </Link>
                  ))}
                  {stageDeals.length === 0 && (
                    <div className="bg-slate-50 rounded-lg border border-dashed border-slate-200 p-3 text-center">
                      <p className="text-[11px] text-slate-400">No deals</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column — AI Actions & Calpine */}
        <div className="space-y-4">
          <h2 className="text-sm font-semibold text-slate-700 uppercase tracking-wide">Action Queue</h2>

          {/* AI-Generated Actions based on live data */}
          {highRiskDeals > 0 && (
            <div className="bg-white rounded-lg border border-slate-200 p-3 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-xs font-semibold text-navy">Address High-Risk Deals</p>
                  <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                    {highRiskDeals} deal{highRiskDeals > 1 ? "s are" : " is"} flagged as high risk. Review pricing, send follow-ups, and engage decision makers.
                  </p>
                </div>
                <span className="text-[10px] font-medium px-1.5 py-0.5 rounded ml-2 shrink-0 bg-red-50 text-red-700">High</span>
              </div>
              <Link href="/pipeline" className="mt-2 w-full block text-center text-xs font-medium text-white bg-navy rounded-md py-1.5 hover:bg-navy-dark transition-colors">
                Review Pipeline →
              </Link>
            </div>
          )}

          {expiringAccounts.length > 0 && (
            <div className="bg-white rounded-lg border border-slate-200 p-3 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-xs font-semibold text-navy">Upcoming Renewals</p>
                  <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                    {expiringAccounts.length} account{expiringAccounts.length > 1 ? "s have" : " has"} contracts expiring within 90 days. Initiate renewal conversations now.
                  </p>
                </div>
                <span className="text-[10px] font-medium px-1.5 py-0.5 rounded ml-2 shrink-0 bg-amber-50 text-amber-700">Medium</span>
              </div>
              <Link href="/accounts" className="mt-2 w-full block text-center text-xs font-medium text-white bg-navy rounded-md py-1.5 hover:bg-navy-dark transition-colors">
                View Accounts →
              </Link>
            </div>
          )}

          {hotLeads.length > 0 && (
            <div className="bg-white rounded-lg border border-slate-200 p-3 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-xs font-semibold text-navy">Hot Lead Outreach</p>
                  <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                    {hotLeads.length} lead{hotLeads.length > 1 ? "s" : ""} with high propensity scores ready for outreach. Strike while the iron is hot.
                  </p>
                </div>
                <span className="text-[10px] font-medium px-1.5 py-0.5 rounded ml-2 shrink-0 bg-red-50 text-red-700">High</span>
              </div>
              <Link href="/leads" className="mt-2 w-full block text-center text-xs font-medium text-white bg-navy rounded-md py-1.5 hover:bg-navy-dark transition-colors">
                View Leads →
              </Link>
            </div>
          )}

          {/* Calpine Banner */}
          {calpineLeads.length > 0 && (
            <div className="bg-gradient-to-br from-gold/10 to-gold/5 border border-gold/30 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <svg className="w-4 h-4 text-gold-dark" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
                </svg>
                <h3 className="text-xs font-bold text-gold-dark uppercase tracking-wide">Calpine Opportunity</h3>
              </div>
              <div className="space-y-2">
                {calpineLeads.slice(0, 3).map((lead) => (
                  <div key={lead.Id} className="bg-white/80 rounded-md p-2.5">
                    <p className="text-xs font-semibold text-slate-800">{lead.Company}</p>
                    <p className="text-[11px] text-slate-500">{lead.Industry || "—"} · {lead.LOB__c || "—"}</p>
                    <div className="flex items-center justify-between mt-1.5">
                      <span className="text-[10px] text-teal-dark font-medium">Score: {lead.Propensity_Score__c || 0}</span>
                      <Link href="/leads" className="text-[10px] font-medium text-navy hover:text-navy-dark">View Leads →</Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Expiring Contracts */}
      {expiringAccounts.length > 0 && (
        <div>
          <h2 className="text-sm font-semibold text-slate-700 uppercase tracking-wide mb-3">Contracts Expiring Soon</h2>
          <div className="bg-white rounded-xl border border-slate-200 divide-y divide-slate-100">
            {expiringAccounts.slice(0, 5).map((acct) => {
              const dLeft = daysUntil(acct.Contract_Expiration_Date__c);
              return (
                <Link key={acct.Id} href={`/accounts/${acct.Id}`} className="flex items-start gap-3 p-3 hover:bg-slate-50 transition-colors">
                  <span className="text-base mt-0.5">🔄</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-slate-800">{acct.Name}</p>
                    <p className="text-[11px] text-slate-500 mt-0.5">{acct.Industry || "—"} · {acct.LOB__c || "—"} · {formatCurrency(acct.Annual_Energy_Spend__c)}/yr</p>
                  </div>
                  <span className={`text-[11px] font-medium shrink-0 ${dLeft <= 30 ? "text-red-600" : "text-amber-600"}`}>
                    {dLeft}d left
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
