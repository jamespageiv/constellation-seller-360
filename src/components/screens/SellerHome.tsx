"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";

// ---- Types ----
interface ChatMessage {
  id: string;
  role: "assistant" | "user";
  content: string;
  timestamp: Date;
  chips?: ActionChip[];
  cards?: DataCard[];
}

interface ActionChip {
  label: string;
  action: string;
  icon?: string;
}

interface DataCard {
  type: "pipeline" | "deal" | "account" | "lead" | "case" | "metric";
  title: string;
  subtitle?: string;
  value?: string;
  badge?: { label: string; color: string };
  link?: string;
  items?: { label: string; value: string; color?: string }[];
}

interface DashboardData {
  totalPipeline: number;
  weightedPipeline: number;
  totalDeals: number;
  highRiskDeals: number;
  expiringAccounts: SFAccount[];
  hotLeads: SFLead[];
  calpineLeads: SFLead[];
  openCases: SFCase[];
  openOpps: SFOpportunity[];
  byStage: Record<string, SFOpportunity[]>;
  accounts: SFAccount[];
  opportunities: SFOpportunity[];
  leads: SFLead[];
  cases: SFCase[];
}

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
  Name: string;
  StageName: string;
  LOB__c: string;
  Utility__c: string;
  Amount: number;
  CloseDate: string;
  Deal_Risk__c: string;
  Next_Step__c: string;
  Probability: number;
  Indicative_Price__c: number;
  Offer_ID__c: string;
  Account?: { Name: string; Calpine_Flag__c: boolean };
}

interface SFLead {
  Id: string;
  Company: string;
  FirstName: string;
  LastName: string;
  Title: string;
  Industry: string;
  Segment__c: string;
  LOB__c: string;
  Propensity_Score__c: number;
  ICP_Match_Score__c: string;
  Recommended_Outreach__c: string;
  Calpine_White_Space__c: boolean;
}

interface SFCase {
  Id: string;
  Subject: string;
  Status: string;
  Priority: string;
  Type: string;
  CreatedDate: string;
  Account?: { Name: string };
}

// ---- Helpers ----
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

function generateId(): string {
  return Math.random().toString(36).slice(2, 10);
}

// ---- Component ----
export default function SellerHome() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [dashData, setDashData] = useState<DashboardData | null>(null);
  const [dataLoaded, setDataLoaded] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = useCallback(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  // Load dashboard data from API
  useEffect(() => {
    fetch("/api/dashboard")
      .then((r) => r.json())
      .then((data) => {
        if (!data.error) {
          setDashData(data);
        }
        setDataLoaded(true);
      })
      .catch(() => setDataLoaded(true));
  }, []);

  // Generate morning briefing when data loads
  useEffect(() => {
    if (!dataLoaded || messages.length > 0) return;

    const today = new Date();
    const greeting =
      today.getHours() < 12
        ? "Good morning"
        : today.getHours() < 17
        ? "Good afternoon"
        : "Good evening";
    const dateStr = today.toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    });

    if (dashData) {
      const negotiationDeals = dashData.byStage?.Negotiation || [];
      const proposalDeals = dashData.byStage?.Proposal || [];
      const expiringCount = dashData.expiringAccounts?.length || 0;
      const hotLeadCount = dashData.hotLeads?.length || 0;
      const calpineCount = dashData.calpineLeads?.length || 0;
      const openCaseCount = dashData.openCases?.length || 0;

      const briefing: ChatMessage = {
        id: generateId(),
        role: "assistant",
        content: `${greeting}, James! 👋 Here's your daily briefing for **${dateStr}**:

**📊 Pipeline Summary**
You have **${dashData.totalDeals} open deals** worth **${formatCurrency(dashData.totalPipeline)}** total (${formatCurrency(dashData.weightedPipeline)} weighted).${
          dashData.highRiskDeals > 0
            ? ` **${dashData.highRiskDeals} deals** are flagged as high risk.`
            : ""
        }

**⚡ Deals Needing Attention**
${negotiationDeals.length > 0 ? `• **${negotiationDeals.length} deals in Negotiation** — close to the finish line` : ""}${
          proposalDeals.length > 0
            ? `\n• **${proposalDeals.length} proposals** out — follow up on pricing responses`
            : ""
        }${
          expiringCount > 0
            ? `\n• **${expiringCount} accounts** with contracts expiring within 90 days`
            : ""
        }

**🎯 Lead Activity**
${
  hotLeadCount > 0
    ? `• **${hotLeadCount} hot leads** with high propensity scores ready for outreach`
    : "• No hot leads requiring immediate action"
}${
          calpineCount > 0
            ? `\n• **${calpineCount} Calpine white space leads** — cross-sell opportunities`
            : ""
        }

${openCaseCount > 0 ? `**📋 Open Cases:** ${openCaseCount} cases need attention\n` : ""}
What would you like to focus on today?`,
        timestamp: new Date(),
        chips: [
          { label: "Show my pipeline", action: "pipeline", icon: "📊" },
          { label: "High-risk deals", action: "risk", icon: "⚠️" },
          { label: "Expiring renewals", action: "renewals", icon: "🔄" },
          { label: "Hot leads", action: "leads", icon: "🎯" },
          { label: "Calpine opportunities", action: "calpine", icon: "⭐" },
          { label: "Open cases", action: "cases", icon: "📋" },
        ],
      };

      setMessages([briefing]);
    } else {
      // Fallback when API isn't configured
      const fallbackBriefing: ChatMessage = {
        id: generateId(),
        role: "assistant",
        content: `${greeting}, James! 👋 Welcome to your **Seller Dashboard** for **${dateStr}**.

I'm your AI-powered sales assistant. I pull data directly from Salesforce to help you stay on top of your pipeline, track leads, and close deals faster.

⚠️ **Live data connection is being set up.** Once your Salesforce environment variables are configured, I'll show you real-time pipeline metrics, deal alerts, and intelligent recommendations right here.

In the meantime, you can explore the app using the navigation on the left.`,
        timestamp: new Date(),
        chips: [
          { label: "View Accounts", action: "nav:accounts", icon: "🏢" },
          { label: "View Pipeline", action: "nav:pipeline", icon: "📊" },
          { label: "View Leads", action: "nav:leads", icon: "🎯" },
          { label: "Broker Portal", action: "nav:broker", icon: "📋" },
        ],
      };
      setMessages([fallbackBriefing]);
    }
  }, [dataLoaded, dashData, messages.length]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  // ---- Response Generator ----
  function generateResponse(userMessage: string): ChatMessage {
    const lower = userMessage.toLowerCase();

    // Pipeline overview
    if (lower.includes("pipeline") || lower.includes("deals") || lower.includes("opportunities")) {
      if (!dashData) return fallbackResponse();
      const opps = dashData.openOpps || [];
      const stages = dashData.byStage || {};
      return {
        id: generateId(),
        role: "assistant",
        content: `Here's your current **pipeline overview**:

**Total Open Pipeline:** ${formatCurrency(dashData.totalPipeline)} across ${dashData.totalDeals} deals
**Weighted Pipeline:** ${formatCurrency(dashData.weightedPipeline)}

**Stage Breakdown:**
• Prospecting: ${stages.Prospecting?.length || 0} deals
• Qualification: ${stages.Qualification?.length || 0} deals
• Proposal: ${stages.Proposal?.length || 0} deals
• Negotiation: ${stages.Negotiation?.length || 0} deals

${dashData.highRiskDeals > 0 ? `⚠️ **${dashData.highRiskDeals} deals** are flagged as high risk and need attention.` : "✅ No high-risk deals detected."}`,
        timestamp: new Date(),
        cards: opps.slice(0, 5).map((o) => ({
          type: "deal" as const,
          title: o.Name,
          subtitle: `${o.Account?.Name || "—"} · ${o.LOB__c || "—"} · ${o.Utility__c || "—"}`,
          value: formatCurrency(o.Amount),
          badge: {
            label: o.StageName,
            color:
              o.StageName === "Negotiation"
                ? "bg-purple-100 text-purple-700"
                : o.StageName === "Proposal"
                ? "bg-blue-100 text-blue-700"
                : "bg-slate-100 text-slate-700",
          },
          link: `/pipeline/${o.Id}`,
        })),
        chips: [
          { label: "High-risk deals", action: "risk", icon: "⚠️" },
          { label: "Deals closing this month", action: "closing-soon", icon: "📅" },
          { label: "Calpine opportunities", action: "calpine", icon: "⭐" },
        ],
      };
    }

    // High risk deals
    if (lower.includes("risk") || lower.includes("at risk") || lower.includes("high risk")) {
      if (!dashData) return fallbackResponse();
      const riskDeals = (dashData.openOpps || []).filter(
        (o) => o.Deal_Risk__c === "High"
      );
      if (riskDeals.length === 0) {
        return {
          id: generateId(),
          role: "assistant",
          content:
            "Great news! ✅ You have **no high-risk deals** in your pipeline right now. Keep up the momentum!",
          timestamp: new Date(),
          chips: [
            { label: "Show my pipeline", action: "pipeline", icon: "📊" },
            { label: "Hot leads", action: "leads", icon: "🎯" },
          ],
        };
      }
      return {
        id: generateId(),
        role: "assistant",
        content: `⚠️ You have **${riskDeals.length} high-risk deals** that need attention:`,
        timestamp: new Date(),
        cards: riskDeals.map((o) => ({
          type: "deal" as const,
          title: o.Name,
          subtitle: `${o.Account?.Name || "—"} · Closes ${o.CloseDate || "TBD"}`,
          value: formatCurrency(o.Amount),
          badge: { label: "High Risk", color: "bg-red-100 text-red-700" },
          link: `/pipeline/${o.Id}`,
          items: [
            { label: "Next Step", value: o.Next_Step__c || "Not specified" },
            {
              label: "Days to Close",
              value: `${daysUntil(o.CloseDate)}d`,
              color: daysUntil(o.CloseDate) <= 30 ? "text-red-600" : "text-slate-600",
            },
          ],
        })),
        chips: [
          { label: "Draft follow-up email", action: "draft-email", icon: "✉️" },
          { label: "Show my pipeline", action: "pipeline", icon: "📊" },
        ],
      };
    }

    // Renewals / expiring
    if (lower.includes("renewal") || lower.includes("expir")) {
      if (!dashData) return fallbackResponse();
      const expiring = dashData.expiringAccounts || [];
      if (expiring.length === 0) {
        return {
          id: generateId(),
          role: "assistant",
          content:
            "No accounts with contracts expiring in the next 90 days. 👍",
          timestamp: new Date(),
          chips: [
            { label: "Show my pipeline", action: "pipeline", icon: "📊" },
            { label: "Hot leads", action: "leads", icon: "🎯" },
          ],
        };
      }
      return {
        id: generateId(),
        role: "assistant",
        content: `🔄 **${expiring.length} accounts** have contracts expiring within the next 90 days. These are your renewal priorities:`,
        timestamp: new Date(),
        cards: expiring.map((a) => ({
          type: "account" as const,
          title: a.Name,
          subtitle: `${a.Industry || "—"} · ${a.BillingCity || "—"}, ${a.BillingState || "—"}`,
          value: formatCurrency(a.Annual_Energy_Spend__c),
          badge: {
            label: `${daysUntil(a.Contract_Expiration_Date__c)}d left`,
            color: daysUntil(a.Contract_Expiration_Date__c) <= 30 ? "bg-red-100 text-red-700" : "bg-amber-100 text-amber-700",
          },
          link: `/accounts/${a.Id}`,
          items: [
            { label: "Wallet Share", value: `${a.Wallet_Share__c || 0}%` },
            { label: "LOB", value: a.LOB__c || "—" },
          ],
        })),
        chips: [
          { label: "Prepare renewal outreach", action: "renewal-outreach", icon: "📧" },
          { label: "Show my pipeline", action: "pipeline", icon: "📊" },
        ],
      };
    }

    // Leads / hot leads
    if (lower.includes("lead") || lower.includes("prospect")) {
      if (!dashData) return fallbackResponse();
      const hot = dashData.hotLeads || [];
      const allLeads = dashData.leads || [];
      return {
        id: generateId(),
        role: "assistant",
        content: `🎯 You have **${allLeads.length} active leads** in your pipeline. ${
          hot.length > 0
            ? `**${hot.length}** are scored as high-propensity and ready for outreach:`
            : "No high-propensity leads right now."
        }`,
        timestamp: new Date(),
        cards: (hot.length > 0 ? hot : allLeads).slice(0, 5).map((l) => ({
          type: "lead" as const,
          title: l.Company,
          subtitle: `${l.FirstName || ""} ${l.LastName || ""} · ${l.Title || "—"}`,
          value: `Score: ${l.Propensity_Score__c || 0}`,
          badge: {
            label: l.ICP_Match_Score__c || "—",
            color:
              l.ICP_Match_Score__c === "High"
                ? "bg-green-100 text-green-700"
                : l.ICP_Match_Score__c === "Medium"
                ? "bg-amber-100 text-amber-700"
                : "bg-slate-100 text-slate-500",
          },
          items: [
            { label: "Segment", value: l.Segment__c || "—" },
            { label: "LOB", value: l.LOB__c || "—" },
            { label: "Action", value: l.Recommended_Outreach__c || "Contact" },
          ],
        })),
        chips: [
          { label: "Calpine white space", action: "calpine", icon: "⭐" },
          { label: "Show my pipeline", action: "pipeline", icon: "📊" },
        ],
      };
    }

    // Calpine
    if (lower.includes("calpine") || lower.includes("white space") || lower.includes("cross-sell")) {
      if (!dashData) return fallbackResponse();
      const calpine = dashData.calpineLeads || [];
      const calpineAccts = (dashData.accounts || []).filter((a) => a.Calpine_Flag__c);
      return {
        id: generateId(),
        role: "assistant",
        content: `⭐ **Calpine Cross-Sell Opportunity**

You have **${calpine.length} Calpine white space leads** and **${calpineAccts.length} Calpine-flagged accounts** in your book. These represent significant cross-sell potential from the Calpine acquisition.`,
        timestamp: new Date(),
        cards: [
          ...calpine.slice(0, 3).map((l) => ({
            type: "lead" as const,
            title: l.Company,
            subtitle: `${l.Industry || "—"} · ${l.LOB__c || "—"}`,
            value: `Score: ${l.Propensity_Score__c || 0}`,
            badge: { label: "Calpine", color: "bg-yellow-100 text-yellow-800" },
            items: [
              { label: "Action", value: l.Recommended_Outreach__c || "Initiate outreach" },
            ],
          })),
          ...calpineAccts.slice(0, 2).map((a) => ({
            type: "account" as const,
            title: a.Name,
            subtitle: `${a.Industry || "—"} · ${a.BillingCity || "—"}, ${a.BillingState || "—"}`,
            value: formatCurrency(a.Annual_Energy_Spend__c),
            badge: { label: "Calpine Account", color: "bg-yellow-100 text-yellow-800" },
            link: `/accounts/${a.Id}`,
          })),
        ],
        chips: [
          { label: "Start Calpine outreach", action: "calpine-outreach", icon: "📧" },
          { label: "Show my pipeline", action: "pipeline", icon: "📊" },
        ],
      };
    }

    // Cases
    if (lower.includes("case") || lower.includes("broker") || lower.includes("intake")) {
      if (!dashData) return fallbackResponse();
      const open = dashData.openCases || [];
      return {
        id: generateId(),
        role: "assistant",
        content: `📋 You have **${open.length} open cases**. Here are the most recent:`,
        timestamp: new Date(),
        cards: open.slice(0, 5).map((c) => ({
          type: "case" as const,
          title: c.Subject,
          subtitle: `${c.Account?.Name || "—"} · ${c.Type || "—"}`,
          badge: {
            label: c.Status,
            color:
              c.Status === "New"
                ? "bg-blue-100 text-blue-700"
                : c.Status === "In Progress"
                ? "bg-amber-100 text-amber-700"
                : "bg-green-100 text-green-700",
          },
          items: [
            { label: "Priority", value: c.Priority || "—", color: c.Priority === "High" ? "text-red-600" : "" },
          ],
        })),
        chips: [
          { label: "Go to Broker Portal", action: "nav:broker", icon: "📋" },
          { label: "Show my pipeline", action: "pipeline", icon: "📊" },
        ],
      };
    }

    // Closing soon
    if (lower.includes("closing") || lower.includes("close this month") || lower.includes("closing soon")) {
      if (!dashData) return fallbackResponse();
      const thirtyDays = (dashData.openOpps || []).filter(
        (o) => daysUntil(o.CloseDate) <= 30 && daysUntil(o.CloseDate) > 0
      );
      return {
        id: generateId(),
        role: "assistant",
        content: `📅 **${thirtyDays.length} deals** are set to close in the next 30 days:`,
        timestamp: new Date(),
        cards: thirtyDays.map((o) => ({
          type: "deal" as const,
          title: o.Name,
          subtitle: `${o.Account?.Name || "—"} · ${o.StageName}`,
          value: formatCurrency(o.Amount),
          badge: {
            label: `${daysUntil(o.CloseDate)}d left`,
            color: daysUntil(o.CloseDate) <= 7 ? "bg-red-100 text-red-700" : "bg-amber-100 text-amber-700",
          },
          link: `/pipeline/${o.Id}`,
          items: [
            { label: "Next Step", value: o.Next_Step__c || "Not specified" },
          ],
        })),
        chips: [
          { label: "Show full pipeline", action: "pipeline", icon: "📊" },
          { label: "High-risk deals", action: "risk", icon: "⚠️" },
        ],
      };
    }

    // Accounts
    if (lower.includes("account") || lower.includes("customer") || lower.includes("client")) {
      if (!dashData) return fallbackResponse();
      const accts = dashData.accounts || [];
      return {
        id: generateId(),
        role: "assistant",
        content: `🏢 You have **${accts.length} accounts** in your book. Here are your top accounts by annual energy spend:`,
        timestamp: new Date(),
        cards: accts.slice(0, 5).map((a) => ({
          type: "account" as const,
          title: a.Name,
          subtitle: `${a.Industry || "—"} · ${a.BillingCity || "—"}, ${a.BillingState || "—"}`,
          value: formatCurrency(a.Annual_Energy_Spend__c),
          badge: {
            label: a.Account_Type__c || "—",
            color: "bg-navy/10 text-navy",
          },
          link: `/accounts/${a.Id}`,
          items: [
            { label: "Wallet Share", value: `${a.Wallet_Share__c || 0}%` },
            { label: "LOB", value: a.LOB__c || "—" },
          ],
        })),
        chips: [
          { label: "Expiring renewals", action: "renewals", icon: "🔄" },
          { label: "Show my pipeline", action: "pipeline", icon: "📊" },
        ],
      };
    }

    // Draft email simulation
    if (lower.includes("email") || lower.includes("draft") || lower.includes("outreach")) {
      return {
        id: generateId(),
        role: "assistant",
        content: `✉️ I've prepared a draft outreach template for you:

---

**Subject:** Constellation Energy — Partnership & Pricing Discussion

Hi [Contact Name],

I hope this message finds you well. I'm reaching out from Constellation Energy regarding your upcoming energy needs.

Based on our analysis, we see an opportunity to provide competitive pricing and a tailored energy solution for your organization. I'd love to schedule a 15-minute call to discuss:

• Your current energy usage and contract timeline
• How Constellation can deliver value through our integrated portfolio
• Customized pricing options for your specific requirements

Would you have availability this week or next for a brief conversation?

Best regards,
James Page
Senior Account Executive, Constellation Energy

---

*This is a simulated draft. In production, Agentforce would generate personalized emails based on the contact's profile and account context.*`,
        timestamp: new Date(),
        chips: [
          { label: "Show my pipeline", action: "pipeline", icon: "📊" },
          { label: "Hot leads", action: "leads", icon: "🎯" },
        ],
      };
    }

    // Help / what can you do
    if (lower.includes("help") || lower.includes("what can you") || lower.includes("how do i")) {
      return {
        id: generateId(),
        role: "assistant",
        content: `I'm your **Constellation AI Sales Assistant**, powered by Agentforce. Here's what I can help you with:

• **📊 Pipeline Management** — "Show my pipeline", "High-risk deals", "Deals closing this month"
• **🏢 Account Insights** — "Show my accounts", "Expiring renewals"
• **🎯 Lead Intelligence** — "Hot leads", "Calpine opportunities"
• **📋 Case Management** — "Open cases", "Broker intakes"
• **✉️ Outreach** — "Draft follow-up email", "Prepare renewal outreach"

Just type naturally — I understand context and can help you navigate your entire sales workflow!`,
        timestamp: new Date(),
        chips: [
          { label: "Show my pipeline", action: "pipeline", icon: "📊" },
          { label: "Hot leads", action: "leads", icon: "🎯" },
          { label: "Expiring renewals", action: "renewals", icon: "🔄" },
        ],
      };
    }

    // Greeting
    if (lower.includes("hello") || lower.includes("hi") || lower.includes("hey") || lower.includes("good morning") || lower.includes("good afternoon")) {
      return {
        id: generateId(),
        role: "assistant",
        content: `Hey there! 👋 What would you like to work on today? I can help with pipeline review, lead prioritization, account insights, or anything else in your sales workflow.`,
        timestamp: new Date(),
        chips: [
          { label: "Show my pipeline", action: "pipeline", icon: "📊" },
          { label: "Hot leads", action: "leads", icon: "🎯" },
          { label: "What can you do?", action: "help", icon: "❓" },
        ],
      };
    }

    // Default / catch-all
    return {
      id: generateId(),
      role: "assistant",
      content: `I understand you're asking about "${userMessage}". Let me help guide you to the right information.

I can assist with **pipeline management**, **account insights**, **lead intelligence**, **case tracking**, and **outreach preparation**. Try asking me something like:

• "Show my pipeline"
• "Which deals are at risk?"
• "What accounts have expiring contracts?"
• "Show me hot leads"`,
      timestamp: new Date(),
      chips: [
        { label: "Show my pipeline", action: "pipeline", icon: "📊" },
        { label: "Hot leads", action: "leads", icon: "🎯" },
        { label: "What can you do?", action: "help", icon: "❓" },
      ],
    };
  }

  function fallbackResponse(): ChatMessage {
    return {
      id: generateId(),
      role: "assistant",
      content:
        "I'm still connecting to your Salesforce org. Once the environment is configured with your credentials, I'll be able to pull live data for you. In the meantime, you can explore using the navigation on the left.",
      timestamp: new Date(),
      chips: [
        { label: "View Accounts", action: "nav:accounts", icon: "🏢" },
        { label: "View Pipeline", action: "nav:pipeline", icon: "📊" },
      ],
    };
  }

  // ---- Handlers ----
  function handleSend(text?: string) {
    const message = text || input.trim();
    if (!message) return;

    const userMsg: ChatMessage = {
      id: generateId(),
      role: "user",
      content: message,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    // Simulate typing delay
    setTimeout(() => {
      const response = generateResponse(message);
      setMessages((prev) => [...prev, response]);
      setIsTyping(false);
    }, 800 + Math.random() * 600);
  }

  function handleChipClick(action: string) {
    // Navigation chips
    if (action.startsWith("nav:")) {
      return; // handled by Link in render
    }

    const chipLabels: Record<string, string> = {
      pipeline: "Show my pipeline",
      risk: "Show high-risk deals",
      renewals: "Which accounts have expiring contracts?",
      leads: "Show me hot leads",
      calpine: "Show Calpine opportunities",
      cases: "Show open cases",
      "closing-soon": "Which deals are closing this month?",
      "draft-email": "Draft a follow-up email",
      "renewal-outreach": "Prepare renewal outreach",
      "calpine-outreach": "Start Calpine outreach",
      help: "What can you do?",
    };

    handleSend(chipLabels[action] || action);
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  // ---- Render ----
  return (
    <div className="flex flex-col h-[calc(100vh-64px)]">
      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto px-6 py-4">
        <div className="max-w-3xl mx-auto space-y-6">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-[85%] ${
                  msg.role === "user"
                    ? "bg-navy text-white rounded-2xl rounded-br-md px-4 py-3"
                    : "space-y-3"
                }`}
              >
                {msg.role === "assistant" && (
                  <div className="flex items-start gap-3">
                    <div className="shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-navy to-teal flex items-center justify-center mt-0.5">
                      <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
                      </svg>
                    </div>
                    <div className="flex-1 space-y-3">
                      <div className="bg-white rounded-2xl rounded-tl-md border border-slate-200 px-4 py-3">
                        <div
                          className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap"
                          dangerouslySetInnerHTML={{
                            __html: msg.content
                              .replace(/\*\*(.*?)\*\*/g, '<strong class="text-navy font-semibold">$1</strong>')
                              .replace(/\n/g, "<br />"),
                          }}
                        />
                      </div>

                      {/* Data Cards */}
                      {msg.cards && msg.cards.length > 0 && (
                        <div className="space-y-2">
                          {msg.cards.map((card, idx) => (
                            <div key={idx} className="bg-white rounded-xl border border-slate-200 p-3 hover:shadow-md transition-shadow">
                              {card.link ? (
                                <Link href={card.link} className="block">
                                  <CardContent card={card} />
                                </Link>
                              ) : (
                                <CardContent card={card} />
                              )}
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Action Chips */}
                      {msg.chips && msg.chips.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {msg.chips.map((chip, idx) =>
                            chip.action.startsWith("nav:") ? (
                              <Link
                                key={idx}
                                href={`/${chip.action.replace("nav:", "")}`}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-navy/20 bg-white text-xs font-medium text-navy hover:bg-navy/5 hover:border-navy/40 transition-colors"
                              >
                                {chip.icon && <span>{chip.icon}</span>}
                                {chip.label}
                              </Link>
                            ) : (
                              <button
                                key={idx}
                                onClick={() => handleChipClick(chip.action)}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-navy/20 bg-white text-xs font-medium text-navy hover:bg-navy/5 hover:border-navy/40 transition-colors"
                              >
                                {chip.icon && <span>{chip.icon}</span>}
                                {chip.label}
                              </button>
                            )
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {msg.role === "user" && (
                  <p className="text-sm leading-relaxed">{msg.content}</p>
                )}
              </div>
            </div>
          ))}

          {/* Typing indicator */}
          {isTyping && (
            <div className="flex justify-start">
              <div className="flex items-start gap-3">
                <div className="shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-navy to-teal flex items-center justify-center mt-0.5">
                  <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
                  </svg>
                </div>
                <div className="bg-white rounded-2xl rounded-tl-md border border-slate-200 px-4 py-3">
                  <div className="flex gap-1.5">
                    <div className="w-2 h-2 bg-slate-300 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                    <div className="w-2 h-2 bg-slate-300 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                    <div className="w-2 h-2 bg-slate-300 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                  </div>
                </div>
              </div>
            </div>
          )}

          <div ref={chatEndRef} />
        </div>
      </div>

      {/* Input Bar */}
      <div className="border-t border-slate-200 bg-white px-6 py-4">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center gap-3 bg-slate-50 rounded-2xl border border-slate-200 px-4 py-2 focus-within:border-navy/40 focus-within:ring-2 focus-within:ring-navy/10 transition-all">
            <svg className="w-5 h-5 text-slate-400 shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
            </svg>
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask about your pipeline, leads, accounts, or cases..."
              className="flex-1 bg-transparent text-sm text-slate-700 placeholder-slate-400 focus:outline-none"
            />
            <button
              onClick={() => handleSend()}
              disabled={!input.trim() || isTyping}
              className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                input.trim() && !isTyping
                  ? "bg-navy text-white hover:bg-navy-dark"
                  : "bg-slate-200 text-slate-400"
              }`}
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 10.5L12 3m0 0l7.5 7.5M12 3v18" />
              </svg>
            </button>
          </div>
          <p className="text-center text-[10px] text-slate-400 mt-2">
            Powered by Constellation AI · Agentforce · Pulling live data from Salesforce
          </p>
        </div>
      </div>
    </div>
  );
}

// ---- Card Sub-Component ----
function CardContent({ card }: { card: DataCard }) {
  return (
    <div>
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-slate-800 truncate">{card.title}</p>
          {card.subtitle && <p className="text-xs text-slate-500 mt-0.5 truncate">{card.subtitle}</p>}
        </div>
        <div className="flex items-center gap-2 shrink-0 ml-3">
          {card.badge && (
            <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${card.badge.color}`}>
              {card.badge.label}
            </span>
          )}
          {card.value && <span className="text-sm font-bold text-navy">{card.value}</span>}
        </div>
      </div>
      {card.items && card.items.length > 0 && (
        <div className="flex gap-4 mt-2 pt-2 border-t border-slate-100">
          {card.items.map((item, idx) => (
            <div key={idx} className="text-[11px]">
              <span className="text-slate-400">{item.label}: </span>
              <span className={`font-medium ${item.color || "text-slate-600"}`}>{item.value}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
