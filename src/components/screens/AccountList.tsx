"use client";

import Link from "next/link";
import { useState } from "react";
import {
  accounts,
  opportunities,
  formatCurrency,
} from "@/lib/mock-data";

export default function AccountList() {
  const [filter, setFilter] = useState<"all" | "C&I" | "Mass Market" | "Broker" | "Calpine">("all");
  const [search, setSearch] = useState("");

  const filtered = accounts.filter((a) => {
    if (filter === "Calpine") return a.calpineFlag;
    if (filter !== "all" && a.type !== filter) return false;
    if (search && !a.name.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

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
                (o) => o.accountId === acct.id && !o.stage.startsWith("Closed")
              ).length;

              return (
                <tr key={acct.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-3">
                    <Link href={`/accounts/${acct.id}`} className="flex items-center gap-2">
                      <span className="font-medium text-navy hover:text-navy-dark">{acct.name}</span>
                      {acct.calpineFlag && (
                        <span className="text-[10px] bg-gold/10 text-gold-dark rounded px-1.5 py-0.5 font-medium">Calpine</span>
                      )}
                      {acct.renewalStatus === "Expiring Soon" && (
                        <span className="text-[10px] bg-red-50 text-red-600 rounded px-1.5 py-0.5 font-medium">Expiring</span>
                      )}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-slate-600">{acct.type}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                      acct.lob === "Both" ? "bg-purple-50 text-purple-700" :
                      acct.lob === "Power" ? "bg-blue-50 text-blue-700" :
                      "bg-orange-50 text-orange-700"
                    }`}>
                      {acct.lob}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate-600">{acct.industry}</td>
                  <td className="px-4 py-3 text-right font-medium">{formatCurrency(acct.annualEnergySpend)}</td>
                  <td className="px-4 py-3 text-right">
                    {openDeals > 0 ? (
                      <span className="bg-navy/10 text-navy text-xs font-medium px-2 py-0.5 rounded-full">{openDeals}</span>
                    ) : (
                      <span className="text-slate-400">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-slate-500 text-xs">{acct.billingCity}, {acct.billingState}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
