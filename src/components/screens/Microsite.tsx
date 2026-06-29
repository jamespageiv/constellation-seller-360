"use client";

import Link from "next/link";

// Road Map data — 0-18 month initiatives
const roadmapPhases = [
  {
    phase: "0–6 Months",
    color: "navy",
    items: [
      { name: "Unified Lead Capture", capability: "Sales Cloud Lead Management, Web-to-Lead, Email-to-Lead", product: "Sales Cloud" },
      { name: "Lead Assignment & Routing", capability: "Assignment Rules, Flow Builder, Agentforce SDR Agent", product: "Agentforce" },
      { name: "Next Best Action", capability: "Agentforce — Next Best Action Agent, Einstein Recommendations", product: "Agentforce" },
      { name: "Ideal Customer Profile", capability: "Data Cloud — Segmentation, Propensity Scoring", product: "Data Cloud" },
      { name: "Deduplication & Data Hygiene", capability: "Data Cloud — Identity Resolution, Duplicate Management", product: "Data Cloud" },
      { name: "Joint Sales Process Assessment", capability: "Sales Cloud — Opportunity Stages, Action Plans", product: "Sales Cloud" },
      { name: "Unified Customer & Account Hierarchy", capability: "Account Hierarchy (native), Data Cloud Customer 360", product: "Data Cloud" },
      { name: "Broker Portal Standardization", capability: "Experience Cloud — Broker Portal, Partner Management", product: "Experience Cloud" },
    ],
  },
  {
    phase: "6–12 Months",
    color: "teal",
    items: [
      { name: "White Space Analysis", capability: "Data Cloud — Segmentation + Einstein Analytics", product: "Data Cloud" },
      { name: "Opportunity Scoring", capability: "Einstein Opportunity Scoring, Data Cloud propensity models", product: "Sales Cloud" },
      { name: "Call Summary & Notes", capability: "Einstein Conversation Insights, Call Transcripts", product: "Sales Cloud" },
      { name: "Guided Solution Selling", capability: "Agentforce — Virtual SME Agent, Action Plans", product: "Agentforce" },
      { name: "Real-Time Indicative Pricing", capability: "Quote Management + MuleSoft REPS/QW integration", product: "Sales Cloud" },
      { name: "Interactive Sales Dashboards", capability: "Tableau + CRM Analytics, Einstein Analytics", product: "Sales Cloud" },
      { name: "Deal Scoring", capability: "Einstein Deal Insights, Data Cloud scoring models", product: "Data Cloud" },
    ],
  },
  {
    phase: "12–18 Months",
    color: "gold",
    items: [
      { name: "Churn & Risk Scoring", capability: "Data Cloud — Einstein Churn Models, Propensity to Renew", product: "Data Cloud" },
      { name: "Unified GTM Operating Model (Calpine)", capability: "Data Cloud — Multi-Org Harmonization, Zero Copy", product: "Data Cloud" },
      { name: "Agentic Sales Strategy", capability: "Agentforce — Sales Development Agent, Prospecting Center", product: "Agentforce" },
      { name: "Customer Profile Enrichment Agent", capability: "Agentforce + Data Cloud — External Data Enrichment", product: "Agentforce" },
      { name: "Call Transcription & Sentiment", capability: "Einstein Conversation Insights — Sentiment, Themes", product: "Sales Cloud" },
    ],
  },
];

const productColors: Record<string, string> = {
  "Sales Cloud": "bg-blue-100 text-blue-800",
  "Agentforce": "bg-purple-100 text-purple-800",
  "Data Cloud": "bg-teal/10 text-teal-dark",
  "Experience Cloud": "bg-orange-100 text-orange-800",
};

export default function Microsite() {
  return (
    <div className="min-h-screen bg-white">
      {/* Sticky Nav */}
      <nav className="sticky top-0 z-50 bg-navy/95 backdrop-blur-sm border-b border-white/10">
        <div className="max-w-6xl mx-auto px-6 flex items-center justify-between h-14">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-gold">
              <svg className="w-4 h-4 text-navy" fill="currentColor" viewBox="0 0 24 24">
                <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
              </svg>
            </div>
            <span className="text-white text-sm font-bold tracking-wide">CONSTELLATION ENERGY</span>
          </div>
          <div className="flex items-center gap-6">
            <a href="#vision" className="text-white/70 text-xs hover:text-white transition-colors">Vision</a>
            <a href="#roadmap" className="text-white/70 text-xs hover:text-white transition-colors">Road Map</a>
            <a href="#architecture" className="text-white/70 text-xs hover:text-white transition-colors">Architecture</a>
            <a href="#calpine" className="text-white/70 text-xs hover:text-white transition-colors">Calpine</a>
            <a href="#partnership" className="text-white/70 text-xs hover:text-white transition-colors">Partnership</a>
            <Link
              href="/"
              className="bg-gold text-navy text-xs font-bold rounded-lg px-4 py-1.5 hover:bg-gold-light transition-colors"
            >
              Launch Demo →
            </Link>
          </div>
        </div>
      </nav>

      {/* ======================================
          SECTION 1: HERO
          ====================================== */}
      <section className="relative bg-navy overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-navy via-navy-dark to-navy opacity-90" />
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-20 left-20 w-96 h-96 bg-teal rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-20 w-80 h-80 bg-gold rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-5xl mx-auto px-6 py-28 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white leading-tight">
            Your Modern Sales Vision.
            <br />
            <span className="text-gold">Powered by Salesforce.</span>
          </h1>
          <p className="mt-6 text-lg text-white/70 max-w-2xl mx-auto leading-relaxed">
            You&apos;re building the right thing. Here&apos;s what it looks like when it&apos;s built on
            the world&apos;s most powerful sales platform — and what it unlocks for the Calpine opportunity.
          </p>
          <div className="mt-10 flex items-center justify-center gap-4">
            <Link
              href="/"
              className="bg-gold text-navy font-bold rounded-lg px-8 py-3 text-sm hover:bg-gold-light transition-colors shadow-lg shadow-gold/20"
            >
              See the Demo →
            </Link>
            <a
              href="#vision"
              className="text-white/70 border border-white/20 rounded-lg px-6 py-3 text-sm hover:bg-white/5 transition-colors"
            >
              Learn More
            </a>
          </div>
        </div>
      </section>

      {/* ======================================
          SECTION 2: THE VISION
          ====================================== */}
      <section id="vision" className="py-20 bg-slate-50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-navy">The Vision — What You&apos;re Building Toward</h2>
            <p className="mt-3 text-slate-500 max-w-2xl mx-auto">
              Constellation&apos;s Modern Sales initiative maps directly to Salesforce Headless 360 capabilities. Every goal has a native solution.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-6">
            {[
              {
                value: "$500M",
                label: "Incremental Sales Lift",
                description: "Lead capture, AI prospecting, guided selling — all powered by Agentforce and Sales Cloud. No custom AI infrastructure needed.",
                link: "/leads",
                linkText: "See Lead Prospecting →",
                color: "navy",
              },
              {
                value: "$2–5B",
                label: "Calpine Cross-Sell",
                description: "Unified customer data, white space analysis, and harmonized GTM — enabled by Data Cloud identity resolution and zero-copy architecture.",
                link: "/leads",
                linkText: "See White Space →",
                color: "teal",
              },
              {
                value: "$10–25M",
                label: "Cost Savings",
                description: "Broker intake automation, contact center AI, operational efficiency — replacing email chaos with structured workflows and Agentforce agents.",
                link: "/broker",
                linkText: "See Broker Portal →",
                color: "gold",
              },
            ].map((col) => (
              <div key={col.value} className="bg-white rounded-2xl border border-slate-200 p-6 hover:shadow-lg transition-shadow">
                <p className={`text-3xl font-bold ${
                  col.color === "navy" ? "text-navy" :
                  col.color === "teal" ? "text-teal" : "text-gold-dark"
                }`}>
                  {col.value}
                </p>
                <p className="text-sm font-semibold text-slate-800 mt-1">{col.label}</p>
                <p className="text-sm text-slate-500 mt-3 leading-relaxed">{col.description}</p>
                <Link href={col.link} className="inline-block mt-4 text-sm font-medium text-navy hover:text-navy-dark">
                  {col.linkText}
                </Link>
              </div>
            ))}
          </div>

          <p className="text-center text-sm text-slate-400 mt-8">
            This is Constellation&apos;s vision. We&apos;re here to help you execute it.
          </p>
        </div>
      </section>

      {/* ======================================
          SECTION 3: THE ROAD MAP
          ====================================== */}
      <section id="roadmap" className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-navy">The Road Map — Native in Salesforce</h2>
            <p className="mt-3 text-slate-500 max-w-2xl mx-auto">
              Every item on your road map is native in Salesforce. Here&apos;s the proof.
            </p>
          </div>

          <div className="space-y-8">
            {roadmapPhases.map((phase) => (
              <div key={phase.phase}>
                <div className="flex items-center gap-3 mb-4">
                  <div className={`w-3 h-3 rounded-full ${
                    phase.color === "navy" ? "bg-navy" :
                    phase.color === "teal" ? "bg-teal" : "bg-gold"
                  }`} />
                  <h3 className={`text-lg font-bold ${
                    phase.color === "navy" ? "text-navy" :
                    phase.color === "teal" ? "text-teal-dark" : "text-gold-dark"
                  }`}>
                    {phase.phase}
                  </h3>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {phase.items.map((item) => (
                    <div
                      key={item.name}
                      className="group bg-slate-50 rounded-xl p-4 border border-slate-100 hover:border-navy/20 hover:shadow-md transition-all cursor-default"
                    >
                      <p className="text-sm font-semibold text-slate-800">{item.name}</p>
                      <span className={`inline-block mt-2 text-[10px] font-medium px-2 py-0.5 rounded-full ${productColors[item.product] || "bg-slate-100 text-slate-600"}`}>
                        {item.product}
                      </span>
                      <p className="text-[11px] text-slate-400 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        {item.capability}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ======================================
          SECTION 4: HEADLESS 360 ARCHITECTURE
          ====================================== */}
      <section id="architecture" className="py-20 bg-slate-50">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-navy">Headless 360 — The Architecture</h2>
            <p className="mt-3 text-lg text-slate-500">Your React App. Our Backend. No Trade-Offs.</p>
          </div>

          {/* Architecture Diagram */}
          <div className="bg-white rounded-2xl border border-slate-200 p-8 space-y-6">
            {/* Seller Experience Layer */}
            <div className="bg-navy/5 border-2 border-navy/20 rounded-xl p-5 text-center">
              <p className="text-xs font-bold text-navy uppercase tracking-widest mb-1">Seller Experience Layer</p>
              <p className="text-lg font-bold text-navy">React Application — Hosted on Heroku</p>
              <p className="text-sm text-slate-500 mt-1">Custom UI designed around BDM & BDSS workflows</p>
              <div className="flex items-center justify-center gap-4 mt-3 text-xs text-slate-500">
                <span className="bg-white border border-slate-200 rounded-lg px-3 py-1">Account 360</span>
                <span className="bg-white border border-slate-200 rounded-lg px-3 py-1">Pipeline</span>
                <span className="bg-white border border-slate-200 rounded-lg px-3 py-1">Quoting</span>
                <span className="bg-white border border-slate-200 rounded-lg px-3 py-1">AI Assist</span>
              </div>
              <p className="text-[10px] text-navy/50 mt-2 font-medium">Labeled &quot;Your UI&quot;</p>
            </div>

            {/* Connection Layer */}
            <div className="flex items-center justify-center gap-4">
              <div className="h-px flex-1 bg-slate-200" />
              <div className="flex items-center gap-2 bg-teal/10 rounded-full px-4 py-2">
                <svg className="w-4 h-4 text-teal-dark" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 21L3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5" />
                </svg>
                <span className="text-xs font-bold text-teal-dark">OAuth 2.0 · REST · Composite API · MCP</span>
              </div>
              <div className="h-px flex-1 bg-slate-200" />
            </div>

            {/* Salesforce Backend */}
            <div className="bg-navy rounded-xl p-6 text-white">
              <p className="text-xs font-bold uppercase tracking-widest text-white/60 mb-1">Salesforce Sales Cloud</p>
              <p className="text-lg font-bold">Headless Backend</p>
              <div className="grid grid-cols-3 gap-4 mt-4">
                <div className="bg-white/10 rounded-lg p-3">
                  <p className="text-xs font-bold text-gold mb-2">Data Layer</p>
                  <div className="space-y-1 text-[11px] text-white/70">
                    <p>Accounts & Contacts</p>
                    <p>Opportunities & Leads</p>
                    <p>Cases & Contracts</p>
                    <p>Service Locations</p>
                  </div>
                </div>
                <div className="bg-white/10 rounded-lg p-3">
                  <p className="text-xs font-bold text-teal mb-2">Logic Layer</p>
                  <div className="space-y-1 text-[11px] text-white/70">
                    <p>Validation & Sharing Rules</p>
                    <p>Flows & Apex</p>
                    <p>Assignment Rules</p>
                    <p>Quote Management</p>
                  </div>
                </div>
                <div className="bg-white/10 rounded-lg p-3">
                  <p className="text-xs font-bold text-white mb-2">AI Layer</p>
                  <div className="space-y-1 text-[11px] text-white/70">
                    <p>Agentforce Agents</p>
                    <p>Einstein Scoring</p>
                    <p>Prompt Builder</p>
                    <p>BYO LLM Support</p>
                  </div>
                </div>
              </div>
              <p className="text-[10px] text-white/40 mt-3 text-center font-medium">Labeled &quot;The Backend&quot;</p>
            </div>

            {/* Downstream systems */}
            <div className="flex items-center justify-center gap-4">
              <div className="h-px flex-1 bg-slate-200" />
              <span className="text-xs text-slate-400">MuleSoft / API Integrations</span>
              <div className="h-px flex-1 bg-slate-200" />
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-center">
              <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Existing Constellation Systems</p>
              <div className="flex items-center justify-center gap-3 text-xs text-slate-400">
                <span className="bg-white border border-slate-200 rounded-lg px-3 py-1">REPS</span>
                <span className="bg-white border border-slate-200 rounded-lg px-3 py-1">Quote Wizard</span>
                <span className="bg-white border border-slate-200 rounded-lg px-3 py-1">Genesis</span>
                <span className="bg-white border border-slate-200 rounded-lg px-3 py-1">NGenue</span>
                <span className="bg-white border border-slate-200 rounded-lg px-3 py-1">Amazon Connect</span>
              </div>
            </div>
          </div>

          {/* Callout Cards */}
          <div className="grid grid-cols-3 gap-4 mt-8">
            <div className="bg-white rounded-xl border border-slate-200 p-5">
              <p className="text-sm font-bold text-navy">Keep building your React app</p>
              <p className="text-xs text-slate-500 mt-2">We just power it better. Your UI stays yours — Salesforce provides the data, logic, and AI underneath.</p>
            </div>
            <div className="bg-white rounded-xl border border-slate-200 p-5">
              <p className="text-sm font-bold text-navy">All your AI, governance, and data</p>
              <p className="text-xs text-slate-500 mt-2">Managed in one platform. FLS, Sharing Rules, RBAC — enterprise-grade security is the default, not an add-on.</p>
            </div>
            <div className="bg-white rounded-xl border border-slate-200 p-5">
              <p className="text-sm font-bold text-navy">Calpine-ready from day one</p>
              <p className="text-xs text-slate-500 mt-2">Data Cloud harmonizes both orgs without migration. Zero copy architecture preserves both systems while unifying the view.</p>
            </div>
          </div>

          <div className="text-center mt-6">
            <Link href="/" className="text-sm font-medium text-navy hover:text-navy-dark">
              See how it&apos;s wired →
            </Link>
          </div>
        </div>
      </section>

      {/* ======================================
          SECTION 5: THE CALPINE OPPORTUNITY
          ====================================== */}
      <section id="calpine" className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-navy">The $2–5B Opportunity Requires Unified Data.</h2>
            <p className="mt-2 text-lg text-gold-dark font-semibold">Salesforce Is the Unifier.</p>
          </div>

          <div className="bg-slate-50 rounded-2xl border border-slate-200 p-8">
            <p className="text-sm text-slate-600 leading-relaxed max-w-3xl mx-auto text-center">
              The Calpine integration is the single largest near-term growth lever Constellation has.
              To capture it, sellers need to see both customer books as one — identify white space, act on it,
              and manage the combined relationship without friction. That requires Data Cloud, not custom ETL.
            </p>

            {/* Visual: Side by Side → Merged */}
            <div className="mt-8 grid grid-cols-3 gap-4 items-center">
              <div className="bg-navy/5 border border-navy/20 rounded-xl p-4 text-center">
                <p className="text-xs font-bold text-navy uppercase tracking-wide mb-2">Constellation Accounts</p>
                <div className="space-y-1.5">
                  <div className="bg-white rounded p-2 text-xs text-slate-600">Acme Manufacturing Corp</div>
                  <div className="bg-white rounded p-2 text-xs text-slate-600">Midwest Health Systems</div>
                  <div className="bg-white rounded p-2 text-xs text-slate-600">TechVault Data Centers</div>
                  <div className="bg-white rounded p-2 text-xs text-slate-400">+ 12 more</div>
                </div>
              </div>

              <div className="flex flex-col items-center gap-2">
                <div className="bg-teal/10 rounded-full p-3">
                  <svg className="w-6 h-6 text-teal-dark" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                  </svg>
                </div>
                <p className="text-xs font-bold text-teal-dark">Data Cloud</p>
                <p className="text-[10px] text-slate-400">Identity Resolution</p>
                <p className="text-[10px] text-slate-400">+ Zero Copy</p>
              </div>

              <div className="bg-gold/5 border border-gold/30 rounded-xl p-4 text-center">
                <p className="text-xs font-bold text-gold-dark uppercase tracking-wide mb-2">Calpine Accounts</p>
                <div className="space-y-1.5">
                  <div className="bg-white rounded p-2 text-xs text-slate-600">Calpine Energy Solutions</div>
                  <div className="bg-white rounded p-2 text-xs text-slate-600">Northern Gas & Electric</div>
                  <div className="bg-white rounded p-2 text-xs text-slate-600">Calpine West Hospitals</div>
                  <div className="bg-white rounded p-2 text-xs text-slate-400">+ thousands more</div>
                </div>
              </div>
            </div>

            <div className="mt-6 text-center">
              <div className="inline-flex items-center gap-2 bg-teal/10 rounded-full px-4 py-2">
                <svg className="w-4 h-4 text-teal-dark" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 13.5L12 21m0 0l-7.5-7.5M12 21V3" />
                </svg>
                <span className="text-sm font-bold text-teal-dark">Merged View in React UI</span>
              </div>
            </div>

            <div className="mt-4 text-center">
              <Link href="/leads" className="text-sm font-medium text-navy hover:text-navy-dark">
                See white space in the demo →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ======================================
          SECTION 6: WHAT GETS BUILT TOGETHER
          ====================================== */}
      <section id="partnership" className="py-20 bg-slate-50">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-navy">What Gets Built Together</h2>
            <p className="mt-3 text-slate-500">
              You&apos;re already on this journey. We want to help you go faster.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-6">
            {[
              {
                phase: "Phase 1",
                timeline: "0–6 Months",
                title: "Foundation",
                items: [
                  "Data cleanup & integration fixes",
                  "Agentforce quick wins",
                  "Broker portal MVP",
                  "Calpine data model foundation",
                  "CoE standup support",
                ],
              },
              {
                phase: "Phase 2",
                timeline: "6–12 Months",
                title: "Acceleration",
                items: [
                  "Full headless React UI",
                  "Advanced AI agents",
                  "Pricing visibility (REPS/QW)",
                  "Sales dashboards",
                  "Einstein scoring models",
                ],
              },
              {
                phase: "Phase 3",
                timeline: "12–18 Months",
                title: "Scale",
                items: [
                  "Calpine GTM unification",
                  "Autonomous sales agents",
                  "Full Modern Sales vision",
                  "Multi-org harmonization",
                  "Enterprise-wide rollout",
                ],
              },
            ].map((p) => (
              <div key={p.phase} className="bg-white rounded-2xl border border-slate-200 p-6">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-bold text-navy bg-navy/10 rounded px-2 py-0.5">{p.phase}</span>
                  <span className="text-xs text-slate-400">{p.timeline}</span>
                </div>
                <h3 className="text-lg font-bold text-navy mt-2">{p.title}</h3>
                <ul className="mt-3 space-y-2">
                  {p.items.map((item) => (
                    <li key={item} className="flex items-start gap-2 text-sm text-slate-600">
                      <span className="text-teal mt-0.5">✓</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="text-center mt-8">
            <a
              href="mailto:constellation-team@salesforce.com"
              className="bg-navy text-white font-bold rounded-lg px-8 py-3 text-sm hover:bg-navy-dark transition-colors inline-block"
            >
              Let&apos;s talk →
            </a>
          </div>
        </div>
      </section>

      {/* ======================================
          SECTION 7: FOOTER CTA
          ====================================== */}
      <section className="py-20 bg-navy">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-white">
            Ready to see Salesforce as your backend?
          </h2>
          <p className="mt-3 text-lg text-white/60">The demo is live.</p>
          <div className="mt-8 flex items-center justify-center gap-4">
            <Link
              href="/"
              className="bg-gold text-navy font-bold rounded-lg px-8 py-3 text-sm hover:bg-gold-light transition-colors shadow-lg shadow-gold/20"
            >
              Launch the Demo App →
            </Link>
          </div>
          <p className="mt-6 text-sm text-white/40">
            Have questions? Reach out to your Salesforce team.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-navy-dark py-8">
        <div className="max-w-6xl mx-auto px-6 flex items-center justify-between">
          <p className="text-xs text-white/30">
            Constellation Energy — Modern Sales Headless 360 Proof of Concept
          </p>
          <p className="text-xs text-white/30">
            Built with Salesforce · {new Date().getFullYear()}
          </p>
        </div>
      </footer>
    </div>
  );
}
