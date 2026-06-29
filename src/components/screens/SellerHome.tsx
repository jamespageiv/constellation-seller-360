"use client";

import Link from "next/link";
import {
  opportunities,
  accounts,
  aiActions,
  activities,
  calpineWhiteSpace,
  formatCurrency,
  formatDate,
  getPipelineSummary,
  getAccountById,
} from "@/lib/mock-data";

const stageColors: Record<string, string> = {
  Prospecting: "bg-stage-prospecting",
  Qualification: "bg-stage-qualification",
  Proposal: "bg-stage-proposal",
  Negotiation: "bg-stage-negotiation",
  "Closed Won": "bg-stage-closed-won",
  "Closed Lost": "bg-stage-closed-lost",
};

const riskBorder: Record<string, string> = {
  High: "border-l-risk-high",
  Medium: "border-l-risk-medium",
  Low: "border-l-risk-low",
};

const riskBadge: Record<string, string> = {
  High: "bg-red-50 text-red-700",
  Medium: "bg-amber-50 text-amber-700",
  Low: "bg-green-50 text-green-700",
};

export default function SellerHome() {
  const { byStage, totalPipeline, weightedPipeline, totalDeals } = getPipelineSummary();
  const today = new Date();
  const greeting = today.getHours() < 12 ? "Good morning" : today.getHours() < 17 ? "Good afternoon" : "Good evening";
  const dateStr = today.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" });

  const renewalCount = accounts.filter(a => a.renewalStatus === "Expiring Soon").length;
  const highRiskDeals = opportunities.filter(o => o.riskScore === "High" && !o.stage.startsWith("Closed")).length;

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
            <span className="font-semibold">{renewalCount} renewals due in 90 days</span>
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
          <p className="text-2xl font-bold text-stage-negotiation mt-1">{byStage.Negotiation.length}</p>
          <p className="text-xs text-slate-400 mt-1">{formatCurrency(byStage.Negotiation.reduce((s, o) => s + o.amount, 0))}</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Calpine Opportunities</p>
          <p className="text-2xl font-bold text-gold mt-1">{calpineWhiteSpace.length}</p>
          <p className="text-xs text-slate-400 mt-1">{formatCurrency(calpineWhiteSpace.reduce((s, c) => s + c.annualSpend, 0))} potential</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Pipeline Kanban */}
        <div className="col-span-2 space-y-4">
          <h2 className="text-sm font-semibold text-slate-700 uppercase tracking-wide">My Pipeline at a Glance</h2>
          <div className="grid grid-cols-4 gap-3">
            {(["Prospecting", "Qualification", "Proposal", "Negotiation"] as const).map((stage) => (
              <div key={stage} className="space-y-2">
                <div className="flex items-center gap-2 mb-2">
                  <div className={`w-2 h-2 rounded-full ${stageColors[stage]}`} />
                  <span className="text-xs font-medium text-slate-600">{stage}</span>
                  <span className="text-xs text-slate-400">({byStage[stage].length})</span>
                </div>
                {byStage[stage].map((opp) => {
                  const acct = getAccountById(opp.accountId);
                  return (
                    <Link
                      key={opp.id}
                      href={`/pipeline/${opp.id}`}
                      className={`block bg-white rounded-lg border border-slate-200 border-l-4 ${riskBorder[opp.riskScore]} p-3 hover:shadow-md transition-shadow`}
                    >
                      <p className="text-xs font-semibold text-slate-800 truncate">{acct?.name}</p>
                      <p className="text-[11px] text-slate-500 truncate mt-0.5">{opp.lob} · {opp.utility}</p>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-xs font-bold text-navy">{formatCurrency(opp.amount)}</span>
                        <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded ${riskBadge[opp.riskScore]}`}>
                          {opp.riskScore}
                        </span>
                      </div>
                      {acct?.calpineFlag && (
                        <div className="mt-1.5 text-[10px] bg-gold/10 text-gold-dark rounded px-1.5 py-0.5 inline-block font-medium">
                          Calpine
                        </div>
                      )}
                    </Link>
                  );
                })}
              </div>
            ))}
          </div>
        </div>

        {/* Action Queue */}
        <div className="space-y-4">
          <h2 className="text-sm font-semibold text-slate-700 uppercase tracking-wide">Action Queue</h2>
          <div className="space-y-2">
            {aiActions
              .filter(a => a.type === "next-best-action")
              .map((action) => (
                <div
                  key={action.id}
                  className="bg-white rounded-lg border border-slate-200 p-3 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="text-xs font-semibold text-navy">{action.title}</p>
                      <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">{action.description}</p>
                    </div>
                    <span
                      className={`text-[10px] font-medium px-1.5 py-0.5 rounded ml-2 shrink-0 ${
                        action.urgency === "High" ? "bg-red-50 text-red-700" : action.urgency === "Medium" ? "bg-amber-50 text-amber-700" : "bg-green-50 text-green-700"
                      }`}
                    >
                      {action.urgency}
                    </span>
                  </div>
                  <button className="mt-2 w-full text-center text-xs font-medium text-white bg-navy rounded-md py-1.5 hover:bg-navy-dark transition-colors">
                    Execute →
                  </button>
                </div>
              ))}
          </div>

          {/* Calpine Banner */}
          <div className="bg-gradient-to-br from-gold/10 to-gold/5 border border-gold/30 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <svg className="w-4 h-4 text-gold-dark" fill="currentColor" viewBox="0 0 24 24">
                <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
              </svg>
              <h3 className="text-xs font-bold text-gold-dark uppercase tracking-wide">Calpine Opportunity</h3>
            </div>
            <div className="space-y-2">
              {calpineWhiteSpace.slice(0, 3).map((cws) => (
                <div key={cws.id} className="bg-white/80 rounded-md p-2.5">
                  <p className="text-xs font-semibold text-slate-800">{cws.calpineAccountName}</p>
                  <p className="text-[11px] text-slate-500">{cws.industry} · {formatCurrency(cws.annualSpend)}/yr</p>
                  <div className="flex items-center justify-between mt-1.5">
                    <span className="text-[10px] text-teal-dark font-medium">ICP: {cws.icpScore}/100</span>
                    <button className="text-[10px] font-medium text-navy hover:text-navy-dark">Start Deal →</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity Feed */}
      <div>
        <h2 className="text-sm font-semibold text-slate-700 uppercase tracking-wide mb-3">Recent Activity</h2>
        <div className="bg-white rounded-xl border border-slate-200 divide-y divide-slate-100">
          {activities.slice(0, 5).map((act) => {
            const acct = getAccountById(act.accountId);
            const typeIcon: Record<string, string> = {
              Call: "📞",
              Email: "✉️",
              Meeting: "📅",
              "Case Update": "📋",
              "Contract Signed": "✅",
            };
            return (
              <div key={act.id} className="flex items-start gap-3 p-3">
                <span className="text-base mt-0.5">{typeIcon[act.type] || "📌"}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-slate-800">{act.subject}</p>
                  <p className="text-[11px] text-slate-500 mt-0.5">{acct?.name}</p>
                </div>
                <span className="text-[11px] text-slate-400 shrink-0">{formatDate(act.date)}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
