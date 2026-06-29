"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

interface SFAccount {
  Id: string;
  Name: string;
  Account_Type__c: string;
  LOB__c: string;
  Industry: string;
  Annual_Energy_Spend__c: number;
  Contract_Expiration_Date__c: string;
  Wallet_Share__c: number;
  Calpine_Flag__c: boolean;
  BillingCity: string;
  BillingState: string;
}

interface SFOpportunity {
  Id: string;
  AccountId: string;
  StageName: string;
}

function formatCurrency(amount: number): string {
  if (!amount) return "$0";
  if (amount >= 1000000) return `$${(amount / 1000000).toFixed(1)}M`;
  if (amount >= 1000) return `$${(amount / 1000).toFixed(0)}K`;
  return `$${amount.toLocaleString()}`;
}

function daysUntil(dateStr: string): number {
  if (!dateStr) return 999;
  const target = new Date(dateStr);
  const now = new Date();
  return Math.ceil((target.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
}

export default function AccountList() {
  const [accounts, setAccounts] = useState<SFAccount[]>([]);
  const [opportunities, setOpportunities] = useState<SFOpportunity[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "C&I" | "Mass Market" | "Broker" | "Calpine">("all");
  const [search, setSearch] = useState("");

  useEffect(() => {
    Promise.all([
      fetch("/api/accounts").then(r => r.json()),
      fetch("/api/opportunities").then(r => r.json()),
    ]).then(([accts, opps]) => {
      if (!accts.error) setAccounts(accts);
      if (!opps.error) setOpportunities(opps);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const filtered = accounts.filter((a) => {
    if (filter === "Calpine") return a.Calpine_Flag__c;
    if (filter !== "all" && a.Account_Type__c !== filter) return false;
    if (search && !a.Name.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center h-64">
        <div className="flex items-center gap-3 text-sm text-slate-500">
          <div className="w-5 h-5 border-2 border-navy border-t-transparent rounded-full animate-spin" />
          Loading accounts from Salesforce...
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-bold text-navy">Accounts</h1>
        <div className="flex items-center gap-3">
          <input
            type="text"
            placeholder="Search accounts..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-56 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm focus:border-navy focus:outline-none focus:ring-1 focus:ring-navy/20"
          />
        </div>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-1 bg-slate-100 rounded-lg p-1 w-fit">
        {(["all", "C&I", "Mass Market", "Broker", "Calpine"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
              filter === tab ? "bg-white text-navy shadow-sm" : "text-slate-500 hover:text-slate-700"
            }`}
          >
            {tab === "all" ? "All" : tab}
            {tab === "Calpine" && <span className="ml-1 text-gold">●</span>}
          </button>
        ))}
      </div>

      {/* Account Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Account</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Type</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">LOB</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Industry</th>
              <th className="text-right px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Annual Spend</th>
              <th className="text-right px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Open Deals</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Location</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filtered.map((acct) => {
              const openDeals = opportunities.filter(
                (o) => o.AccountId === acct.Id && o.StageName !== "Closed Won" && o.StageName !== "Closed Lost"
              ).length;
              const isExpiring = acct.Contract_Expiration_Date__c && daysUntil(acct.Contract_Expiration_Date__c) <= 90 && daysUntil(acct.Contract_Expiration_Date__c) > 0;

              return (
                <tr key={acct.Id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-3">
                    <Link href={`/accounts/${acct.Id}`} className="flex items-center gap-2">
                      <span className="font-medium text-navy hover:text-navy-dark">{acct.Name}</span>
                      {acct.Calpine_Flag__c && (
                        <span className="text-[10px] bg-gold/10 text-gold-dark rounded px-1.5 py-0.5 font-medium">Calpine</span>
                      )}
                      {isExpiring && (
                        <span className="text-[10px] bg-red-50 text-red-600 rounded px-1.5 py-0.5 font-medium">Expiring</span>
                      )}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-slate-600">{acct.Account_Type__c || "—"}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                      acct.LOB__c === "Both" ? "bg-purple-50 text-purple-700" :
                      acct.LOB__c === "Power" ? "bg-blue-50 text-blue-700" :
                      acct.LOB__c === "Gas" ? "bg-orange-50 text-orange-700" :
                      "bg-slate-100 text-slate-500"
                    }`}>
                      {acct.LOB__c || "—"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate-600">{acct.Industry || "—"}</td>
                  <td className="px-4 py-3 text-right font-medium">{formatCurrency(acct.Annual_Energy_Spend__c)}</td>
                  <td className="px-4 py-3 text-right">
                    {openDeals > 0 ? (
                      <span className="bg-navy/10 text-navy text-xs font-medium px-2 py-0.5 rounded-full">{openDeals}</span>
                    ) : (
                      <span className="text-slate-400">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-slate-500 text-xs">{acct.BillingCity || "—"}{acct.BillingState ? `, ${acct.BillingState}` : ""}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div className="text-center py-8 text-sm text-slate-400">No accounts found.</div>
        )}
      </div>
    </div>
  );
}
