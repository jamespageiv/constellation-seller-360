"use client";

import Link from "next/link";
import {
  getAccountById,
  getContactsByAccountId,
  getOpportunitiesByAccountId,
  getCasesByAccountId,
  getContractsByAccountId,
  getActivitiesByAccountId,
  formatCurrency,
  formatDate,
  daysUntil,
} from "@/lib/mock-data";

const riskBadge: Record<string, string> = {
  High: "bg-red-50 text-red-700",
  Medium: "bg-amber-50 text-amber-700",
  Low: "bg-green-50 text-green-700",
};

const roleBadge: Record<string, string> = {
  "Decision Maker": "bg-navy/10 text-navy",
  Influencer: "bg-teal/10 text-teal-dark",
  "Billing Contact": "bg-slate-100 text-slate-600",
  Technical: "bg-purple-50 text-purple-700",
};

export default function Account360({ accountId }: { accountId: string }) {
  const account = getAccountById(accountId);
  if (!account) {
    return (
      <div className="p-6">
        <p className="text-sm text-slate-500">Account not found.</p>
        <Link href="/accounts" className="text-sm text-navy hover:underline mt-2 inline-block">← Back to Accounts</Link>
      </div>
    );
  }

  const contacts = getContactsByAccountId(accountId);
  const opps = getOpportunitiesByAccountId(accountId);
  const openOpps = opps.filter(o => !o.stage.startsWith("Closed"));
  const cases_ = getCasesByAccountId(accountId);
  const contracts = getContractsByAccountId(accountId);
  const activities_ = getActivitiesByAccountId(accountId);

  return (
    <div className="p-6 space-y-6">
      {/* Account Header */}
      <div className="bg-white rounded-xl border border-slate-200 p-5">
        <div className="flex items-start justify-between">
          <div>
            <Link href="/accounts" className="text-xs text-slate-400 hover:text-navy mb-1 inline-block">← Accounts</Link>
            <div className="flex items-center gap-3">
              <h1 className="text-xl font-bold text-navy">{account.name}</h1>
              <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                account.type === "C&I" ? "bg-navy/10 text-navy" :
                account.type === "Broker" ? "bg-teal/10 text-teal-dark" :
                "bg-slate-100 text-slate-600"
              }`}>
                {account.type}
              </span>
              <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                account.lob === "Both" ? "bg-purple-50 text-purple-700" :
                account.lob === "Power" ? "bg-blue-50 text-blue-700" :
                "bg-orange-50 text-orange-700"
              }`}>
                {account.lob}
              </span>
              {account.calpineFlag && (
                <span className="text-xs bg-gold/10 text-gold-dark rounded-full px-2 py-0.5 font-medium">Calpine</span>
              )}
            </div>
            <p className="text-sm text-slate-500 mt-1">{account.industry} · {account.billingCity}, {account.billingState}</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-slate-500">Annual Energy Spend</p>
            <p className="text-2xl font-bold text-navy">{formatCurrency(account.annualEnergySpend)}</p>
            <p className="text-xs text-slate-400 mt-1">Wallet Share: {account.walletShare}%</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* LEFT COLUMN — Contacts + Opportunities + Cases */}
        <div className="col-span-2 space-y-6">
          {/* Relationship Map */}
          <div className="bg-white rounded-xl border border-slate-200 p-4">
            <h2 className="text-sm font-semibold text-slate-700 mb-3">Relationship Map</h2>
            <div className="grid grid-cols-2 gap-3">
              {contacts.map((c) => (
                <div key={c.id} className="border border-slate-100 rounded-lg p-3 hover:border-slate-300 transition-colors">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm font-medium text-slate-800">{c.firstName} {c.lastName}</p>
                      <p className="text-xs text-slate-500">{c.title}</p>
                    </div>
                    <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded ${roleBadge[c.role]}`}>
                      {c.role}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 mt-2 text-[11px] text-slate-400">
                    <span>{c.lastContactMethod}</span>
                    <span>·</span>
                    <span>{formatDate(c.lastContactDate)}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Energy Portfolio / Contracts */}
          <div className="bg-white rounded-xl border border-slate-200 p-4">
            <h2 className="text-sm font-semibold text-slate-700 mb-3">Energy Portfolio</h2>
            {contracts.length > 0 ? (
              <div className="space-y-2">
                {contracts.map((c) => (
                  <div key={c.id} className={`border rounded-lg p-3 ${c.status === "Expiring" ? "border-amber-200 bg-amber-50/30" : "border-slate-100"}`}>
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-sm font-medium text-slate-800">{c.product}</p>
                        <p className="text-xs text-slate-500">{c.utility} · {c.term}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold text-navy">{c.pricePerUnit}</p>
                        <p className="text-xs text-slate-400">{c.volume}</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-[11px] text-slate-400">
                        {formatDate(c.startDate)} — {formatDate(c.endDate)}
                      </span>
                      <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded ${
                        c.status === "Expiring" ? "bg-amber-100 text-amber-700" :
                        c.status === "Active" ? "bg-green-50 text-green-700" :
                        "bg-slate-100 text-slate-500"
                      }`}>
                        {c.status}
                        {c.status === "Expiring" && ` · ${daysUntil(c.endDate)}d`}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-slate-400">No active contracts.</p>
            )}
          </div>

          {/* Open Opportunities */}
          <div className="bg-white rounded-xl border border-slate-200 p-4">
            <h2 className="text-sm font-semibold text-slate-700 mb-3">Open Opportunities ({openOpps.length})</h2>
            {openOpps.length > 0 ? (
              <div className="space-y-2">
                {openOpps.map((o) => (
                  <Link
                    key={o.id}
                    href={`/pipeline/${o.id}`}
                    className="flex items-center justify-between border border-slate-100 rounded-lg p-3 hover:border-navy/30 transition-colors"
                  >
                    <div>
                      <p className="text-sm font-medium text-slate-800">{o.name}</p>
                      <p className="text-xs text-slate-500">{o.stage} · {o.lob}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded ${riskBadge[o.riskScore]}`}>
                        {o.riskScore} Risk
                      </span>
                      <span className="text-sm font-bold text-navy">{formatCurrency(o.amount)}</span>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <p className="text-sm text-slate-400">No open opportunities.</p>
            )}
          </div>

          {/* Cases */}
          {cases_.length > 0 && (
            <div className="bg-white rounded-xl border border-slate-200 p-4">
              <h2 className="text-sm font-semibold text-slate-700 mb-3">Open Cases</h2>
              <div className="space-y-2">
                {cases_.map((c) => (
                  <div key={c.id} className="border border-slate-100 rounded-lg p-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-sm font-medium text-slate-800">{c.subject}</p>
                        <p className="text-xs text-slate-500">{c.type} · Age: {c.age}d</p>
                      </div>
                      <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded ${
                        c.status === "New" ? "bg-blue-50 text-blue-700" :
                        c.status === "In Progress" ? "bg-amber-50 text-amber-700" :
                        "bg-green-50 text-green-700"
                      }`}>
                        {c.status}
                      </span>
                    </div>
                    {c.assignedBDSS && (
                      <p className="text-[11px] text-slate-400 mt-1">Assigned: {c.assignedBDSS}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* RIGHT COLUMN — AI Insight Panel + Activity */}
        <div className="space-y-6">
          {/* AI Insight Panel */}
          <div className="bg-gradient-to-br from-navy/5 to-navy/10 border border-navy/20 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-3">
              <svg className="w-4 h-4 text-navy" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456z" />
              </svg>
              <h3 className="text-sm font-bold text-navy">AI Insights</h3>
              <span className="text-[10px] bg-teal/10 text-teal-dark rounded-full px-2 py-0.5 font-medium">Agentforce</span>
            </div>

            <div className="space-y-3">
              <div className="bg-white/80 rounded-lg p-3">
                <p className="text-xs font-semibold text-navy">Next Best Action</p>
                <p className="text-[11px] text-slate-600 mt-1">
                  {account.renewalStatus === "Expiring Soon"
                    ? `Contract expiring soon. Initiate renewal conversation with decision maker. Consider competitive pricing to retain.`
                    : `Continue relationship building. Schedule quarterly review to expand wallet share from ${account.walletShare}%.`
                  }
                </p>
              </div>

              {account.walletShare < 80 && (
                <div className="bg-white/80 rounded-lg p-3">
                  <p className="text-xs font-semibold text-teal-dark">White Space Opportunity</p>
                  <p className="text-[11px] text-slate-600 mt-1">
                    Current wallet share is {account.walletShare}%. Potential to capture additional {100 - account.walletShare}% through {
                      account.lob === "Power" ? "gas cross-sell" :
                      account.lob === "Gas" ? "power cross-sell" :
                      "renewable energy add-on"
                    }.
                  </p>
                </div>
              )}

              <div className="bg-white/80 rounded-lg p-3">
                <p className="text-xs font-semibold text-slate-700">Churn Risk</p>
                <div className="flex items-center gap-2 mt-1">
                  <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        account.renewalStatus === "Expiring Soon" ? "bg-amber-400" : "bg-green-400"
                      }`}
                      style={{ width: account.renewalStatus === "Expiring Soon" ? "65%" : "20%" }}
                    />
                  </div>
                  <span className={`text-[10px] font-medium ${
                    account.renewalStatus === "Expiring Soon" ? "text-amber-600" : "text-green-600"
                  }`}>
                    {account.renewalStatus === "Expiring Soon" ? "Medium" : "Low"}
                  </span>
                </div>
              </div>

              <button className="w-full text-center text-xs font-medium text-white bg-navy rounded-lg py-2 hover:bg-navy-dark transition-colors">
                Prepare for Meeting →
              </button>
            </div>
          </div>

          {/* Activity Timeline */}
          <div className="bg-white rounded-xl border border-slate-200 p-4">
            <h2 className="text-sm font-semibold text-slate-700 mb-3">Activity Timeline</h2>
            {activities_.length > 0 ? (
              <div className="space-y-3">
                {activities_.map((act) => {
                  const typeIcon: Record<string, string> = { Call: "📞", Email: "✉️", Meeting: "📅", "Case Update": "📋", "Contract Signed": "✅" };
                  return (
                    <div key={act.id} className="flex gap-2">
                      <span className="text-sm mt-0.5">{typeIcon[act.type] || "📌"}</span>
                      <div>
                        <p className="text-xs font-medium text-slate-800">{act.subject}</p>
                        <p className="text-[11px] text-slate-400 mt-0.5">{formatDate(act.date)}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-sm text-slate-400">No recent activity.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
