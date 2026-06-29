"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

interface SFAccount {
  Id: string; Name: string; Account_Type__c: string; LOB__c: string; Industry: string;
  Annual_Energy_Spend__c: number; Contract_Expiration_Date__c: string; Wallet_Share__c: number;
  Calpine_Flag__c: boolean; BillingCity: string; BillingState: string; Churn_Risk_Score__c: number;
}
interface SFContact {
  Id: string; FirstName: string; LastName: string; Title: string; Contact_Role__c: string;
  Email: string; Phone: string; Last_Touchpoint_Date__c: string;
}
interface SFOpportunity {
  Id: string; Name: string; StageName: string; LOB__c: string; Amount: number;
  CloseDate: string; Deal_Risk__c: string; Next_Step__c: string;
}
interface SFCase {
  Id: string; Subject: string; Status: string; Priority: string; Type: string;
  BDSS_Queue__c: string; CreatedDate: string;
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

const riskBadge: Record<string, string> = {
  High: "bg-red-50 text-red-700", Medium: "bg-amber-50 text-amber-700", Low: "bg-green-50 text-green-700",
};
const roleBadge: Record<string, string> = {
  "Decision Maker": "bg-navy/10 text-navy", Influencer: "bg-teal/10 text-teal-dark",
  "Billing Contact": "bg-slate-100 text-slate-600", Technical: "bg-purple-50 text-purple-700",
};

export default function Account360({ accountId }: { accountId: string }) {
  const [account, setAccount] = useState<SFAccount | null>(null);
  const [contacts, setContacts] = useState<SFContact[]>([]);
  const [opps, setOpps] = useState<SFOpportunity[]>([]);
  const [cases, setCases] = useState<SFCase[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/accounts/${accountId}`)
      .then(r => r.json())
      .then(data => {
        if (!data.error) {
          setAccount(data.account);
          setContacts(data.contacts || []);
          setOpps(data.opportunities || []);
          setCases(data.cases || []);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [accountId]);

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center h-64">
        <div className="flex items-center gap-3 text-sm text-slate-500">
          <div className="w-5 h-5 border-2 border-navy border-t-transparent rounded-full animate-spin" />
          Loading account from Salesforce...
        </div>
      </div>
    );
  }

  if (!account) {
    return (
      <div className="p-6">
        <p className="text-sm text-slate-500">Account not found.</p>
        <Link href="/accounts" className="text-sm text-navy hover:underline mt-2 inline-block">← Back to Accounts</Link>
      </div>
    );
  }

  const openOpps = opps.filter(o => o.StageName !== "Closed Won" && o.StageName !== "Closed Lost");
  const isExpiring = account.Contract_Expiration_Date__c && daysUntil(account.Contract_Expiration_Date__c) <= 90 && daysUntil(account.Contract_Expiration_Date__c) > 0;
  const churnRisk = account.Churn_Risk_Score__c || (isExpiring ? 65 : 20);

  return (
    <div className="p-6 space-y-6">
      {/* Account Header */}
      <div className="bg-white rounded-xl border border-slate-200 p-5">
        <div className="flex items-start justify-between">
          <div>
            <Link href="/accounts" className="text-xs text-slate-400 hover:text-navy mb-1 inline-block">← Accounts</Link>
            <div className="flex items-center gap-3">
              <h1 className="text-xl font-bold text-navy">{account.Name}</h1>
              <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                account.Account_Type__c === "C&I" ? "bg-navy/10 text-navy" :
                account.Account_Type__c === "Broker" ? "bg-teal/10 text-teal-dark" :
                "bg-slate-100 text-slate-600"
              }`}>{account.Account_Type__c || "—"}</span>
              <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                account.LOB__c === "Both" ? "bg-purple-50 text-purple-700" :
                account.LOB__c === "Power" ? "bg-blue-50 text-blue-700" :
                account.LOB__c === "Gas" ? "bg-orange-50 text-orange-700" :
                "bg-slate-100 text-slate-500"
              }`}>{account.LOB__c || "—"}</span>
              {account.Calpine_Flag__c && (
                <span className="text-xs bg-gold/10 text-gold-dark rounded-full px-2 py-0.5 font-medium">Calpine</span>
              )}
            </div>
            <p className="text-sm text-slate-500 mt-1">{account.Industry || "—"} · {account.BillingCity || "—"}{account.BillingState ? `, ${account.BillingState}` : ""}</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-slate-500">Annual Energy Spend</p>
            <p className="text-2xl font-bold text-navy">{formatCurrency(account.Annual_Energy_Spend__c)}</p>
            <p className="text-xs text-slate-400 mt-1">Wallet Share: {account.Wallet_Share__c || 0}%</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* LEFT COLUMN */}
        <div className="col-span-2 space-y-6">
          {/* Contacts */}
          <div className="bg-white rounded-xl border border-slate-200 p-4">
            <h2 className="text-sm font-semibold text-slate-700 mb-3">Relationship Map ({contacts.length})</h2>
            {contacts.length > 0 ? (
              <div className="grid grid-cols-2 gap-3">
                {contacts.map((c) => (
                  <div key={c.Id} className="border border-slate-100 rounded-lg p-3 hover:border-slate-300 transition-colors">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-sm font-medium text-slate-800">{c.FirstName} {c.LastName}</p>
                        <p className="text-xs text-slate-500">{c.Title || "—"}</p>
                      </div>
                      <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded ${roleBadge[c.Contact_Role__c] || "bg-slate-100 text-slate-500"}`}>
                        {c.Contact_Role__c || "—"}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 mt-2 text-[11px] text-slate-400">
                      <span>{c.Email || "—"}</span>
                      {c.Last_Touchpoint_Date__c && (
                        <><span>·</span><span>{formatDate(c.Last_Touchpoint_Date__c)}</span></>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-slate-400">No contacts found.</p>
            )}
          </div>

          {/* Open Opportunities */}
          <div className="bg-white rounded-xl border border-slate-200 p-4">
            <h2 className="text-sm font-semibold text-slate-700 mb-3">Open Opportunities ({openOpps.length})</h2>
            {openOpps.length > 0 ? (
              <div className="space-y-2">
                {openOpps.map((o) => (
                  <Link key={o.Id} href={`/pipeline/${o.Id}`} className="flex items-center justify-between border border-slate-100 rounded-lg p-3 hover:border-navy/30 transition-colors">
                    <div>
                      <p className="text-sm font-medium text-slate-800">{o.Name}</p>
                      <p className="text-xs text-slate-500">{o.StageName} · {o.LOB__c || "—"}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded ${riskBadge[o.Deal_Risk__c] || "bg-slate-100 text-slate-500"}`}>
                        {o.Deal_Risk__c || "—"} Risk
                      </span>
                      <span className="text-sm font-bold text-navy">{formatCurrency(o.Amount)}</span>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <p className="text-sm text-slate-400">No open opportunities.</p>
            )}
          </div>

          {/* Cases */}
          {cases.length > 0 && (
            <div className="bg-white rounded-xl border border-slate-200 p-4">
              <h2 className="text-sm font-semibold text-slate-700 mb-3">Cases ({cases.length})</h2>
              <div className="space-y-2">
                {cases.map((c) => {
                  const age = Math.ceil((Date.now() - new Date(c.CreatedDate).getTime()) / 864e5);
                  return (
                    <div key={c.Id} className="border border-slate-100 rounded-lg p-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="text-sm font-medium text-slate-800">{c.Subject}</p>
                          <p className="text-xs text-slate-500">{c.Type || "—"} · Age: {age}d</p>
                        </div>
                        <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded ${
                          c.Status === "New" ? "bg-blue-50 text-blue-700" :
                          c.Status === "In Progress" || c.Status === "Working" ? "bg-amber-50 text-amber-700" :
                          "bg-green-50 text-green-700"
                        }`}>{c.Status}</span>
                      </div>
                      {c.BDSS_Queue__c && <p className="text-[11px] text-slate-400 mt-1">Assigned: {c.BDSS_Queue__c}</p>}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* RIGHT COLUMN — AI Insights */}
        <div className="space-y-6">
          <div className="bg-gradient-to-br from-navy/5 to-navy/10 border border-navy/20 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-3">
              <svg className="w-4 h-4 text-navy" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
              </svg>
              <h3 className="text-sm font-bold text-navy">AI Insights</h3>
              <span className="text-[10px] bg-teal/10 text-teal-dark rounded-full px-2 py-0.5 font-medium">Agentforce</span>
            </div>
            <div className="space-y-3">
              <div className="bg-white/80 rounded-lg p-3">
                <p className="text-xs font-semibold text-navy">Next Best Action</p>
                <p className="text-[11px] text-slate-600 mt-1">
                  {isExpiring
                    ? "Contract expiring soon. Initiate renewal conversation with decision maker. Consider competitive pricing to retain."
                    : `Continue relationship building. Schedule quarterly review to expand wallet share from ${account.Wallet_Share__c || 0}%.`
                  }
                </p>
              </div>
              {(account.Wallet_Share__c || 0) < 80 && (
                <div className="bg-white/80 rounded-lg p-3">
                  <p className="text-xs font-semibold text-teal-dark">White Space Opportunity</p>
                  <p className="text-[11px] text-slate-600 mt-1">
                    Current wallet share is {account.Wallet_Share__c || 0}%. Potential to capture additional {100 - (account.Wallet_Share__c || 0)}% through {
                      account.LOB__c === "Power" ? "gas cross-sell" :
                      account.LOB__c === "Gas" ? "power cross-sell" :
                      "renewable energy add-on"
                    }.
                  </p>
                </div>
              )}
              <div className="bg-white/80 rounded-lg p-3">
                <p className="text-xs font-semibold text-slate-700">Churn Risk</p>
                <div className="flex items-center gap-2 mt-1">
                  <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full ${churnRisk > 50 ? "bg-amber-400" : "bg-green-400"}`} style={{ width: `${churnRisk}%` }} />
                  </div>
                  <span className={`text-[10px] font-medium ${churnRisk > 50 ? "text-amber-600" : "text-green-600"}`}>
                    {churnRisk > 50 ? "Medium" : "Low"}
                  </span>
                </div>
              </div>
              <button className="w-full text-center text-xs font-medium text-white bg-navy rounded-lg py-2 hover:bg-navy-dark transition-colors">
                Prepare for Meeting →
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
