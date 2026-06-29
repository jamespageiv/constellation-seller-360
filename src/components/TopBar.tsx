"use client";

import { useState } from "react";

export default function TopBar() {
  const [aiOpen, setAiOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-20 flex h-14 items-center justify-between border-b border-slate-200 bg-white/80 backdrop-blur-sm px-6">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 rounded-full bg-teal/10 px-3 py-1">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-teal"></span>
            </span>
            <span className="text-xs font-medium text-teal-dark">Live Data</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Search */}
          <div className="relative">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
            </svg>
            <input
              type="text"
              placeholder="Search accounts, deals..."
              className="w-64 rounded-lg border border-slate-200 bg-slate-50 py-1.5 pl-9 pr-3 text-sm placeholder-slate-400 focus:border-navy focus:outline-none focus:ring-1 focus:ring-navy/20"
            />
          </div>

          {/* AI Assist button */}
          <button
            onClick={() => setAiOpen(!aiOpen)}
            className="flex items-center gap-2 rounded-lg bg-navy px-3 py-1.5 text-sm font-medium text-white hover:bg-navy-dark transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456z" />
            </svg>
            AI Assist
          </button>

          {/* Seller avatar */}
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-navy flex items-center justify-center text-white text-xs font-bold">
              JP
            </div>
          </div>
        </div>
      </header>

      {/* AI Assist Drawer */}
      {aiOpen && (
        <div className="fixed inset-y-0 right-0 z-40 w-96 bg-white border-l border-slate-200 shadow-xl flex flex-col">
          <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-navy" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456z" />
              </svg>
              <span className="text-sm font-semibold text-navy">AI Assist</span>
              <span className="text-[10px] bg-teal/10 text-teal-dark rounded-full px-2 py-0.5 font-medium">Agentforce</span>
            </div>
            <button onClick={() => setAiOpen(false)} className="text-slate-400 hover:text-slate-600">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            <div className="bg-slate-50 rounded-lg p-3 text-sm text-slate-600">
              <p className="font-medium text-navy mb-1">Welcome to AI Assist</p>
              <p>Ask me about your deals, accounts, or pipeline. I&apos;m powered by Agentforce and connected to your live Salesforce data.</p>
            </div>
            <div className="bg-navy/5 rounded-lg p-3 text-sm">
              <p className="text-slate-500 text-xs mb-2">Try asking:</p>
              <ul className="space-y-1.5">
                <li className="text-navy cursor-pointer hover:text-navy-dark">&quot;What&apos;s the status of the Acme renewal?&quot;</li>
                <li className="text-navy cursor-pointer hover:text-navy-dark">&quot;Which of my deals are most at risk?&quot;</li>
                <li className="text-navy cursor-pointer hover:text-navy-dark">&quot;Draft a renewal email for RetailMax&quot;</li>
                <li className="text-navy cursor-pointer hover:text-navy-dark">&quot;Score this lead for ICP fit&quot;</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-200 p-3">
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Ask about your data..."
                className="flex-1 rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-navy focus:outline-none focus:ring-1 focus:ring-navy/20"
              />
              <button className="rounded-lg bg-navy px-3 py-2 text-white hover:bg-navy-dark transition-colors">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
