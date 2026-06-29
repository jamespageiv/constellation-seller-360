"use client";

import Link from "next/link";
import {
  opportunities,
  getAccountById,
  activities,
  cases as allCases,
  formatCurrency,
  formatDate,
  daysUntil,
} from "@/lib/mock-data";

const stageOrder = ["Prospecting", "Qualification", "Proposal", "Negotiation", "Closed Won"];

const riskBadge: Record<string, string> = {
  High: "bg-red-50 text-red-700 border-red-200",
  Medium: "bg-amber-50 text-amber-700 border-amber-200",
  Low: "bg-green-50 text-green-700 border-green-200",
};

export default function OpportunityDetail({ opportunityId }: { opportunityId: string }) {
  const opp = opportunities.find((o) => o.id === opportunityId);
  if (!opp) {
    return (
      <div className="p-6">
        <p className="text-sm text-slate-500">Opportunity not found.</p>
        <Link href="/pipeline" className="text-sm text-navy hover:underline mt-2 inline-block">← Back to Pipeline</Link>
      </div>
    );
  }

  const account = getAccountById(opp.accountId);
  const relatedActivities = activities.filter(
    (a) => a.opportunityId === opp.id || a.accountId === opp.accountId
  );
  const relatedCases = allCases.filter(
    (c) => c.opportunityId === opp.id || c.accountId === opp.accountId
  );
  const currentStageIdx = stageOrder.indexOf(opp.stage);
  const daysToClose = daysUntil(opp.closeDate);

  // Guided selling checklist based on stage
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
      { question: "Indicative pricing received?", done: !!opp.indicativePrice },
      { question: "Proposal presented to customer?", done: true },
      { question: "Margin review completed?", done: false },
      { question: "Legal terms shared?", done: false },
    ],
    Negotiation: [
      { question: "Final pricing locked?", done: true },
      { question: "Legal review completed?", done: opp.nextStep.includes("legal") ? false : true },
      { question: "Contract draft generated?", done: false },
      { question: "Customer signature obtained?", done: false },
    ],
  };

  const checklist = guidedSelling[opp.stage] || [];

  return (
    <div className="p-6 space-y-6">
      {/* Deal Header */}
      <div className="bg-white rounded-xl border border-slate-200 p-5">
        <Link href="/pipeline" className="text-xs text-slate-400 hover:text-navy mb-2 inline-block">← Pipeline</Link>
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-xl font-bold text-navy">{opp.name}</h1>
            <p className="text-sm text-slate-500 mt-0.5">
              <Link href={`/accounts/${opp.accountId}`} className="hover:text-navy">{account?.name}</Link>
              {" · "}{opp.lob} · {opp.utility}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className={`text-xs font-medium px-2.5 py-1 rounded-full border ${riskBadge[opp.riskScore]}`}>
              {opp.riskScore} Risk
            </span>
            <div className="text-right">
              <p className="text-2xl font-bold text-navy">{formatCurrency(opp.amount)}</p>
              <p className="text-xs text-slate-400">{opp.contractTerm} · {opp.estimatedAnnualVolume}</p>
            </div>
          </div>
        </div>

        {/* Stage Progress Bar */}
        <div className="mt-5">
          <div className="flex items-center gap-1">
            {stageOrder.map((stage, idx) => (
              <div key={stage} className="flex-1 flex flex-col items-center">
                <div
                  className={`w-full h-2 rounded-full ${
                    idx <= currentStageIdx ? "bg-navy" :
                    "bg-slate-100"
                  }`}
                />
                <span className={`text-[10px] mt-1 ${idx === currentStageIdx ? "font-bold text-navy" : "text-slate-400"}`}>
                  {stage}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-4 gap-4 mt-4">
          <div>
            <p className="text-xs text-slate-500">Close Date</p>
            <p className="text-sm font-medium">{formatDate(opp.closeDate)}</p>
            <p className={`text-[10px] ${daysToClose <= 30 ? "text-red-600" : daysToClose <= 60 ? "text-amber-600" : "text-slate-400"}`}>
              {daysToClose > 0 ? `${daysToClose} days` : "Overdue"}
            </p>
          </div>
          <div>
            <p className="text-xs text-slate-500">Probability</p>
            <p className="text-sm font-medium">{opp.probability}%</p>
          </div>
          <div>
            <p className="text-xs text-slate-500">Next Step</p>
            <p className="text-sm font-medium text-navy">{opp.nextStep || "—"}</p>
          </div>
          {opp.offerId && (
            <div>
              <p className="text-xs text-slate-500">Offer ID</p>
              <p className="text-sm font-mono font-medium">{opp.offerId}</p>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* LEFT — Guided Selling + Pricing + Activity */}
        <div className="col-span-2 space-y-6">
          {/* Guided Selling Panel */}
          <div className="bg-gradient-to-br from-navy/5 to-navy/10 border border-navy/20 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-3">
              <svg className="w-4 h-4 text-navy" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
              </svg>
              <h3 className="text-sm font-bold text-navy">Guided Selling — {opp.stage}</h3>
              <span className="text-[10px] bg-teal/10 text-teal-dark rounded-full px-2 py-0.5 font-medium">Agentforce</span>
            </div>
            <div className="space-y-2">
              {checklist.map((item, idx) => (
                <div key={idx} className="flex items-center gap-2 bg-white/80 rounded-lg p-2.5">
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                    item.done ? "border-teal bg-teal" : "border-slate-300"
                  }`}>
                    {item.done && (
                      <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                      </svg>
                    )}
                  </div>
                  <span className={`text-sm ${item.done ? "text-slate-400 line-through" : "text-slate-700"}`}>
                    {item.question}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Pricing Panel */}
          {opp.indicativePrice && (
            <div className="bg-white rounded-xl border border-slate-200 p-4">
              <h3 className="text-sm font-semibold text-slate-700 mb-3">Pricing</h3>
              <div className="grid grid-cols-4 gap-4">
                <div>
                  <p className="text-xs text-slate-500">Offer ID</p>
                  <p className="text-sm font-mono font-medium">{opp.offerId}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">Product</p>
                  <p className="text-sm font-medium">{opp.lob}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">Indicative Price</p>
                  <p className="text-lg font-bold text-teal">{opp.indicativePrice}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">Source</p>
                  <p className="text-sm font-medium">{opp.pricingSource}</p>
                </div>
              </div>
              <div className="mt-3 flex gap-2">
                <button className="text-xs font-medium text-white bg-navy rounded-lg px-4 py-2 hover:bg-navy-dark transition-colors">
                  Request Updated Pricing
                </button>
                {opp.stage === "Negotiation" && (
                  <button className="text-xs font-medium text-navy border border-navy/30 rounded-lg px-4 py-2 hover:bg-navy/5 transition-colors">
                    Generate Contract →
                  </button>
                )}
              </div>
            </div>
          )}

          {!opp.indicativePrice && (
            <div className="bg-white rounded-xl border border-slate-200 p-4">
              <h3 className="text-sm font-semibold text-slate-700 mb-2">Pricing</h3>
              <p className="text-sm text-slate-400 mb-3">No indicative pricing yet for this deal.</p>
              <button className="text-xs font-medium text-white bg-navy rounded-lg px-4 py-2 hover:bg-navy-dark transition-colors">
                Request Pricing →
              </button>
            </div>
          )}

          {/* Activity Timeline */}
          <div className="bg-white rounded-xl border border-slate-200 p-4">
            <h3 className="text-sm font-semibold text-slate-700 mb-3">Activity Timeline</h3>
            {relatedActivities.length > 0 ? (
              <div className="space-y-3">
                {relatedActivities.map((act) => {
                  const typeIcon: Record<string, string> = { Call: "📞", Email: "✉️", Meeting: "📅", "Case Update": "📋", "Contract Signed": "✅" };
                  return (
                    <div key={act.id} className="flex gap-3 border-l-2 border-slate-100 pl-3">
                      <span className="text-sm">{typeIcon[act.type] || "📌"}</span>
                      <div>
                        <p className="text-sm font-medium text-slate-800">{act.subject}</p>
                        <p className="text-xs text-slate-500 mt-0.5">{act.description}</p>
                        <p className="text-[11px] text-slate-400 mt-1">{formatDate(act.date)}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-sm text-slate-400">No activity recorded.</p>
            )}
          </div>
        </div>

        {/* RIGHT — AI Call Summary + Related Cases */}
        <div className="space-y-6">
          {/* AI Call Summary */}
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
              <p><strong className="text-navy">Risk Flags:</strong> {opp.riskScore === "High" ? "Customer mentioned competing bids from NextEra." : "No significant risk flags detected."}</p>
            </div>
          </div>

          {/* Related Cases */}
          {relatedCases.length > 0 && (
            <div className="bg-white rounded-xl border border-slate-200 p-4">
              <h3 className="text-sm font-semibold text-slate-700 mb-3">Related Cases</h3>
              <div className="space-y-2">
                {relatedCases.map((c) => (
                  <div key={c.id} className="border border-slate-100 rounded-lg p-3">
                    <p className="text-xs font-medium text-slate-800">{c.subject}</p>
                    <div className="flex items-center justify-between mt-1.5">
                      <span className="text-[11px] text-slate-500">{c.type} · Age: {c.age}d</span>
                      <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded ${
                        c.status === "New" ? "bg-blue-50 text-blue-700" :
                        c.status === "In Progress" ? "bg-amber-50 text-amber-700" :
                        "bg-green-50 text-green-700"
                      }`}>
                        {c.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Quick Actions */}
          <div className="bg-white rounded-xl border border-slate-200 p-4">
            <h3 className="text-sm font-semibold text-slate-700 mb-3">Quick Actions</h3>
            <div className="space-y-2">
              <button className="w-full text-left text-xs font-medium text-navy bg-navy/5 rounded-lg px-3 py-2 hover:bg-navy/10 transition-colors">
                📧 Draft follow-up email
              </button>
              <button className="w-full text-left text-xs font-medium text-navy bg-navy/5 rounded-lg px-3 py-2 hover:bg-navy/10 transition-colors">
                📞 Log a call
              </button>
              <button className="w-full text-left text-xs font-medium text-navy bg-navy/5 rounded-lg px-3 py-2 hover:bg-navy/10 transition-colors">
                📋 Create task
              </button>
              {opp.stage === "Negotiation" && (
                <button className="w-full text-center text-xs font-medium text-white bg-teal rounded-lg px-3 py-2 hover:bg-teal-dark transition-colors">
                  ✅ Generate Contract Draft
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
