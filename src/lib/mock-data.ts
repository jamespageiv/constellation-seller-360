// ============================================================
// Constellation Energy — Modern Sales Headless 360 PoC
// Mock Data Layer (mirrors Salesforce org objects)
// ============================================================

// ---------- ACCOUNTS ----------
export interface Account {
  id: string;
  name: string;
  type: "C&I" | "Mass Market" | "Broker";
  lob: "Power" | "Gas" | "Both";
  industry: string;
  annualEnergySpend: number;
  contractExpirationDate: string;
  walletShare: number;
  calpineFlag: boolean;
  parentAccountId?: string;
  phone: string;
  website: string;
  billingCity: string;
  billingState: string;
  renewalStatus?: "Active" | "At Risk" | "Expiring Soon";
}

export const accounts: Account[] = [
  {
    id: "001A1",
    name: "Acme Manufacturing Corp",
    type: "C&I",
    lob: "Both",
    industry: "Manufacturing",
    annualEnergySpend: 4200000,
    contractExpirationDate: "2026-09-30",
    walletShare: 65,
    calpineFlag: false,
    phone: "(312) 555-0100",
    website: "acmemfg.com",
    billingCity: "Chicago",
    billingState: "IL",
    renewalStatus: "Expiring Soon",
  },
  {
    id: "001A2",
    name: "Midwest Health Systems",
    type: "C&I",
    lob: "Power",
    industry: "Healthcare",
    annualEnergySpend: 8500000,
    contractExpirationDate: "2027-03-15",
    walletShare: 80,
    calpineFlag: false,
    phone: "(614) 555-0200",
    website: "midwesthealth.org",
    billingCity: "Columbus",
    billingState: "OH",
  },
  {
    id: "001A3",
    name: "TechVault Data Centers",
    type: "C&I",
    lob: "Power",
    industry: "Data Centers",
    annualEnergySpend: 15000000,
    contractExpirationDate: "2027-06-01",
    walletShare: 45,
    calpineFlag: false,
    phone: "(703) 555-0300",
    website: "techvaultdc.com",
    billingCity: "Ashburn",
    billingState: "VA",
  },
  {
    id: "001A4",
    name: "Great Lakes University",
    type: "C&I",
    lob: "Both",
    industry: "Higher Education",
    annualEnergySpend: 3100000,
    contractExpirationDate: "2026-12-31",
    walletShare: 90,
    calpineFlag: false,
    phone: "(734) 555-0400",
    website: "greatlakesu.edu",
    billingCity: "Ann Arbor",
    billingState: "MI",
  },
  {
    id: "001A5",
    name: "Federal Services Group",
    type: "C&I",
    lob: "Power",
    industry: "Government",
    annualEnergySpend: 6200000,
    contractExpirationDate: "2027-09-30",
    walletShare: 55,
    calpineFlag: false,
    phone: "(202) 555-0500",
    website: "fedservicesgroup.gov",
    billingCity: "Washington",
    billingState: "DC",
  },
  {
    id: "001A6",
    name: "RetailMax Holdings",
    type: "C&I",
    lob: "Both",
    industry: "Retail Chains",
    annualEnergySpend: 2800000,
    contractExpirationDate: "2026-08-15",
    walletShare: 70,
    calpineFlag: false,
    phone: "(469) 555-0600",
    website: "retailmax.com",
    billingCity: "Dallas",
    billingState: "TX",
    renewalStatus: "Expiring Soon",
  },
  {
    id: "001A7",
    name: "Summit Commercial RE",
    type: "C&I",
    lob: "Power",
    industry: "Commercial Real Estate",
    annualEnergySpend: 5400000,
    contractExpirationDate: "2027-01-31",
    walletShare: 60,
    calpineFlag: false,
    phone: "(212) 555-0700",
    website: "summitcre.com",
    billingCity: "New York",
    billingState: "NY",
  },
  {
    id: "001A8",
    name: "Pacific Manufacturing Ltd",
    type: "C&I",
    lob: "Gas",
    industry: "Manufacturing",
    annualEnergySpend: 1900000,
    contractExpirationDate: "2026-11-30",
    walletShare: 40,
    calpineFlag: true,
    phone: "(510) 555-0800",
    website: "pacificmfg.com",
    billingCity: "Oakland",
    billingState: "CA",
  },
  {
    id: "001A9",
    name: "Calpine Energy Solutions",
    type: "C&I",
    lob: "Power",
    industry: "Data Centers",
    annualEnergySpend: 12000000,
    contractExpirationDate: "2027-04-30",
    walletShare: 0,
    calpineFlag: true,
    phone: "(713) 555-0900",
    website: "calpineenergy.com",
    billingCity: "Houston",
    billingState: "TX",
  },
  {
    id: "001A10",
    name: "Northern Gas & Electric",
    type: "C&I",
    lob: "Both",
    industry: "Manufacturing",
    annualEnergySpend: 7500000,
    contractExpirationDate: "2027-02-28",
    walletShare: 0,
    calpineFlag: true,
    phone: "(412) 555-1000",
    website: "northernge.com",
    billingCity: "Pittsburgh",
    billingState: "PA",
  },
  {
    id: "001A11",
    name: "Calpine West Hospitals",
    type: "C&I",
    lob: "Power",
    industry: "Healthcare",
    annualEnergySpend: 9800000,
    contractExpirationDate: "2027-07-31",
    walletShare: 0,
    calpineFlag: true,
    phone: "(602) 555-1100",
    website: "calpinewesthealth.com",
    billingCity: "Phoenix",
    billingState: "AZ",
  },
  {
    id: "001B1",
    name: "Clearview SMB Solutions",
    type: "Mass Market",
    lob: "Power",
    industry: "Small Business",
    annualEnergySpend: 180000,
    contractExpirationDate: "2026-10-15",
    walletShare: 100,
    calpineFlag: false,
    phone: "(215) 555-2100",
    website: "clearviewsmb.com",
    billingCity: "Philadelphia",
    billingState: "PA",
  },
  {
    id: "001B2",
    name: "Metro Office Parks LLC",
    type: "Mass Market",
    lob: "Power",
    industry: "Commercial Real Estate",
    annualEnergySpend: 420000,
    contractExpirationDate: "2026-07-31",
    walletShare: 85,
    calpineFlag: false,
    phone: "(617) 555-2200",
    website: "metrooffice.com",
    billingCity: "Boston",
    billingState: "MA",
    renewalStatus: "Expiring Soon",
  },
  {
    id: "001C1",
    name: "Energy Brokers International",
    type: "Broker",
    lob: "Both",
    industry: "Energy Brokerage",
    annualEnergySpend: 0,
    contractExpirationDate: "",
    walletShare: 0,
    calpineFlag: false,
    phone: "(713) 555-3100",
    website: "ebi-brokers.com",
    billingCity: "Houston",
    billingState: "TX",
  },
  {
    id: "001C2",
    name: "Northeast Power Partners",
    type: "Broker",
    lob: "Power",
    industry: "Energy Brokerage",
    annualEnergySpend: 0,
    contractExpirationDate: "",
    walletShare: 0,
    calpineFlag: false,
    phone: "(860) 555-3200",
    website: "nepowerpartners.com",
    billingCity: "Hartford",
    billingState: "CT",
  },
];

// ---------- CONTACTS ----------
export interface Contact {
  id: string;
  accountId: string;
  firstName: string;
  lastName: string;
  title: string;
  role: "Decision Maker" | "Influencer" | "Billing Contact" | "Technical";
  email: string;
  phone: string;
  lastContactDate: string;
  lastContactMethod: "Call" | "Email" | "Meeting" | "LinkedIn";
}

export const contacts: Contact[] = [
  { id: "003C1", accountId: "001A1", firstName: "Sarah", lastName: "Chen", title: "VP of Operations", role: "Decision Maker", email: "s.chen@acmemfg.com", phone: "(312) 555-0101", lastContactDate: "2026-06-25", lastContactMethod: "Call" },
  { id: "003C2", accountId: "001A1", firstName: "Marcus", lastName: "Rivera", title: "Facilities Director", role: "Influencer", email: "m.rivera@acmemfg.com", phone: "(312) 555-0102", lastContactDate: "2026-06-20", lastContactMethod: "Email" },
  { id: "003C3", accountId: "001A1", firstName: "Jane", lastName: "Park", title: "Accounts Payable Manager", role: "Billing Contact", email: "j.park@acmemfg.com", phone: "(312) 555-0103", lastContactDate: "2026-05-15", lastContactMethod: "Email" },
  { id: "003C4", accountId: "001A2", firstName: "Dr. Robert", lastName: "Williams", title: "CFO", role: "Decision Maker", email: "r.williams@midwesthealth.org", phone: "(614) 555-0201", lastContactDate: "2026-06-22", lastContactMethod: "Meeting" },
  { id: "003C5", accountId: "001A2", firstName: "Linda", lastName: "Okafor", title: "Director of Sustainability", role: "Influencer", email: "l.okafor@midwesthealth.org", phone: "(614) 555-0202", lastContactDate: "2026-06-18", lastContactMethod: "Call" },
  { id: "003C6", accountId: "001A3", firstName: "James", lastName: "Thornton", title: "CTO", role: "Decision Maker", email: "j.thornton@techvaultdc.com", phone: "(703) 555-0301", lastContactDate: "2026-06-27", lastContactMethod: "Meeting" },
  { id: "003C7", accountId: "001A3", firstName: "Priya", lastName: "Sharma", title: "VP Infrastructure", role: "Technical", email: "p.sharma@techvaultdc.com", phone: "(703) 555-0302", lastContactDate: "2026-06-24", lastContactMethod: "Call" },
  { id: "003C8", accountId: "001A6", firstName: "Tom", lastName: "Bradley", title: "VP Procurement", role: "Decision Maker", email: "t.bradley@retailmax.com", phone: "(469) 555-0601", lastContactDate: "2026-06-15", lastContactMethod: "Email" },
  { id: "003C9", accountId: "001A9", firstName: "Karen", lastName: "Mitchell", title: "Energy Manager", role: "Technical", email: "k.mitchell@calpineenergy.com", phone: "(713) 555-0901", lastContactDate: "2026-06-10", lastContactMethod: "LinkedIn" },
  { id: "003C10", accountId: "001A10", firstName: "David", lastName: "Foster", title: "COO", role: "Decision Maker", email: "d.foster@northernge.com", phone: "(412) 555-1001", lastContactDate: "2026-06-12", lastContactMethod: "Email" },
];

// ---------- OPPORTUNITIES ----------
export interface Opportunity {
  id: string;
  accountId: string;
  name: string;
  stage: "Prospecting" | "Qualification" | "Proposal" | "Negotiation" | "Closed Won" | "Closed Lost";
  lob: "Power" | "Gas" | "Both";
  utility: string;
  contractTerm: string;
  estimatedAnnualVolume: string;
  offerId?: string;
  indicativePrice?: string;
  amount: number;
  closeDate: string;
  nextStep: string;
  riskScore: "High" | "Medium" | "Low";
  pricingSource?: string;
  probability: number;
  ownerId: string;
}

export const opportunities: Opportunity[] = [
  // Prospecting (5)
  { id: "006O1", accountId: "001A9", name: "Calpine Energy Solutions — Power Supply", stage: "Prospecting", lob: "Power", utility: "ERCOT", contractTerm: "36 months", estimatedAnnualVolume: "150,000 MWh", amount: 4500000, closeDate: "2027-01-15", nextStep: "Schedule executive energy review", riskScore: "Low", probability: 20, ownerId: "seller1" },
  { id: "006O2", accountId: "001A10", name: "Northern Gas — Cross-Sell Gas+Power", stage: "Prospecting", lob: "Both", utility: "PJM", contractTerm: "24 months", estimatedAnnualVolume: "85,000 MWh + 2M Therms", amount: 7200000, closeDate: "2027-02-28", nextStep: "Discovery call with COO", riskScore: "Low", probability: 15, ownerId: "seller1" },
  { id: "006O3", accountId: "001A11", name: "Calpine West Hospitals — Renewable Power", stage: "Prospecting", lob: "Power", utility: "CAISO", contractTerm: "60 months", estimatedAnnualVolume: "120,000 MWh", amount: 9200000, closeDate: "2027-03-31", nextStep: "Send ICP analysis to AE", riskScore: "Medium", probability: 10, ownerId: "seller1" },
  { id: "006O4", accountId: "001A3", name: "TechVault — Capacity Expansion", stage: "Prospecting", lob: "Power", utility: "PJM", contractTerm: "48 months", estimatedAnnualVolume: "200,000 MWh", amount: 12000000, closeDate: "2027-04-15", nextStep: "Qualify load profile requirements", riskScore: "Low", probability: 25, ownerId: "seller1" },
  { id: "006O5", accountId: "001A5", name: "Federal Services — New Campus Power", stage: "Prospecting", lob: "Power", utility: "PJM", contractTerm: "36 months", estimatedAnnualVolume: "45,000 MWh", amount: 2800000, closeDate: "2027-01-31", nextStep: "Submit RFP response", riskScore: "Medium", probability: 20, ownerId: "seller1" },
  // Qualification (4)
  { id: "006O6", accountId: "001A1", name: "Acme Manufacturing — Gas Renewal", stage: "Qualification", lob: "Gas", utility: "Nicor Gas", contractTerm: "24 months", estimatedAnnualVolume: "1.5M Therms", amount: 1800000, closeDate: "2026-09-15", nextStep: "Confirm volume with facilities team", riskScore: "Medium", probability: 40, ownerId: "seller1" },
  { id: "006O7", accountId: "001C1", name: "EBI Broker — Multi-Site Industrial", stage: "Qualification", lob: "Power", utility: "PJM", contractTerm: "36 months", estimatedAnnualVolume: "75,000 MWh", offerId: "OFR-2026-0142", amount: 3200000, closeDate: "2026-10-30", nextStep: "Await broker pricing comparison", riskScore: "High", probability: 30, ownerId: "seller1" },
  { id: "006O8", accountId: "001B2", name: "Metro Office Parks — Power Renewal", stage: "Qualification", lob: "Power", utility: "ISO-NE", contractTerm: "12 months", estimatedAnnualVolume: "5,000 MWh", amount: 380000, closeDate: "2026-08-15", nextStep: "Send rate comparison sheet", riskScore: "Low", probability: 50, ownerId: "seller1" },
  { id: "006O9", accountId: "001A4", name: "Great Lakes U — Bundled Solution", stage: "Qualification", lob: "Both", utility: "MISO", contractTerm: "36 months", estimatedAnnualVolume: "30,000 MWh + 800K Therms", amount: 2900000, closeDate: "2026-12-15", nextStep: "Present sustainability options", riskScore: "Low", probability: 45, ownerId: "seller1" },
  // Proposal (3)
  { id: "006O10", accountId: "001A6", name: "RetailMax — Multi-Utility Gas", stage: "Proposal", lob: "Gas", utility: "Multiple", contractTerm: "24 months", estimatedAnnualVolume: "3M Therms", offerId: "OFR-2026-0198", indicativePrice: "$0.48/Therm", amount: 1440000, closeDate: "2026-08-30", nextStep: "Review margin with pricing desk", riskScore: "Medium", probability: 55, pricingSource: "Quote Wizard", ownerId: "seller1" },
  { id: "006O11", accountId: "001A2", name: "Midwest Health — Power + Renewables", stage: "Proposal", lob: "Power", utility: "PJM", contractTerm: "60 months", estimatedAnnualVolume: "100,000 MWh", offerId: "OFR-2026-0205", indicativePrice: "$42.50/MWh", amount: 4250000, closeDate: "2026-09-30", nextStep: "Finalize green energy certificate options", riskScore: "Low", probability: 60, pricingSource: "REPS", ownerId: "seller1" },
  { id: "006O12", accountId: "001A7", name: "Summit CRE — Portfolio Power", stage: "Proposal", lob: "Power", utility: "NYISO", contractTerm: "36 months", estimatedAnnualVolume: "60,000 MWh", offerId: "OFR-2026-0210", indicativePrice: "$55.20/MWh", amount: 3312000, closeDate: "2026-10-15", nextStep: "Schedule pricing walkthrough", riskScore: "High", probability: 45, pricingSource: "REPS", ownerId: "seller1" },
  // Negotiation (2)
  { id: "006O13", accountId: "001A1", name: "Acme Manufacturing — Power Expansion", stage: "Negotiation", lob: "Power", utility: "PJM", contractTerm: "48 months", estimatedAnnualVolume: "50,000 MWh", offerId: "OFR-2026-0088", indicativePrice: "$38.75/MWh", amount: 1937500, closeDate: "2026-08-01", nextStep: "Generate contract draft — legal review pending", riskScore: "Low", probability: 80, pricingSource: "REPS", ownerId: "seller1" },
  { id: "006O14", accountId: "001B1", name: "Clearview SMB — Power Renewal", stage: "Negotiation", lob: "Power", utility: "PJM", contractTerm: "12 months", estimatedAnnualVolume: "2,500 MWh", offerId: "OFR-2026-0175", indicativePrice: "$41.00/MWh", amount: 102500, closeDate: "2026-07-31", nextStep: "Final rate lock — awaiting signature", riskScore: "Low", probability: 90, pricingSource: "REPS", ownerId: "seller1" },
  // Closed Won (3)
  { id: "006O15", accountId: "001A2", name: "Midwest Health — Gas Supply 2025", stage: "Closed Won", lob: "Gas", utility: "Columbia Gas", contractTerm: "24 months", estimatedAnnualVolume: "500K Therms", amount: 425000, closeDate: "2025-12-15", nextStep: "", riskScore: "Low", probability: 100, ownerId: "seller1" },
  { id: "006O16", accountId: "001A4", name: "Great Lakes U — Power 2025", stage: "Closed Won", lob: "Power", utility: "MISO", contractTerm: "36 months", estimatedAnnualVolume: "28,000 MWh", amount: 1120000, closeDate: "2025-11-01", nextStep: "", riskScore: "Low", probability: 100, ownerId: "seller1" },
  { id: "006O17", accountId: "001A5", name: "Federal Services — Base Load 2025", stage: "Closed Won", lob: "Power", utility: "PJM", contractTerm: "24 months", estimatedAnnualVolume: "40,000 MWh", amount: 1680000, closeDate: "2025-10-20", nextStep: "", riskScore: "Low", probability: 100, ownerId: "seller1" },
  // Closed Lost (3)
  { id: "006O18", accountId: "001A7", name: "Summit CRE — Gas 2025", stage: "Closed Lost", lob: "Gas", utility: "ConEd", contractTerm: "24 months", estimatedAnnualVolume: "1M Therms", amount: 480000, closeDate: "2025-09-30", nextStep: "", riskScore: "High", probability: 0, ownerId: "seller1" },
  { id: "006O19", accountId: "001A6", name: "RetailMax — Power 2025", stage: "Closed Lost", lob: "Power", utility: "ERCOT", contractTerm: "36 months", estimatedAnnualVolume: "35,000 MWh", amount: 1400000, closeDate: "2025-08-15", nextStep: "", riskScore: "High", probability: 0, ownerId: "seller1" },
  { id: "006O20", accountId: "001A8", name: "Pacific Mfg — Power (Calpine legacy)", stage: "Closed Lost", lob: "Power", utility: "CAISO", contractTerm: "24 months", estimatedAnnualVolume: "20,000 MWh", amount: 860000, closeDate: "2025-07-01", nextStep: "", riskScore: "High", probability: 0, ownerId: "seller1" },
];

// ---------- LEADS ----------
export interface Lead {
  id: string;
  company: string;
  firstName: string;
  lastName: string;
  title: string;
  industry: string;
  segment: "C&I" | "Mass Market" | "Calpine White Space";
  lob: "Power" | "Gas" | "Both";
  annualSpend: number;
  propensityScore: number;
  icpMatch: "High" | "Medium" | "Low";
  recommendedAction: string;
  lastTouchpoint: string;
  lastTouchpointDate: string;
  source: "Inbound — Broker" | "Outbound — SDR" | "Calpine White Space" | "Web Inquiry" | "Event";
  calpineFlag: boolean;
  urgency: "Hot" | "Warm" | "Cold";
}

export const leads: Lead[] = [
  { id: "00Q1", company: "Dynamo Industrial Group", firstName: "Alex", lastName: "Rodriguez", title: "VP Operations", industry: "Manufacturing", segment: "C&I", lob: "Both", annualSpend: 5200000, propensityScore: 88, icpMatch: "High", recommendedAction: "Schedule executive energy review with Senior AE", lastTouchpoint: "SDR Call", lastTouchpointDate: "2026-06-27", source: "Outbound — SDR", calpineFlag: false, urgency: "Hot" },
  { id: "00Q2", company: "Suncoast Medical Center", firstName: "Patricia", lastName: "Nguyen", title: "CFO", industry: "Healthcare", segment: "C&I", lob: "Power", annualSpend: 7800000, propensityScore: 82, icpMatch: "High", recommendedAction: "Schedule executive energy review with Senior AE", lastTouchpoint: "Email Response", lastTouchpointDate: "2026-06-25", source: "Web Inquiry", calpineFlag: false, urgency: "Hot" },
  { id: "00Q3", company: "Calpine — Ridgeline Foods", firstName: "Brian", lastName: "Walsh", title: "Plant Manager", industry: "Food Processing", segment: "Calpine White Space", lob: "Gas", annualSpend: 3100000, propensityScore: 78, icpMatch: "High", recommendedAction: "Initiate cross-sell outreach — leverage Calpine relationship", lastTouchpoint: "Calpine Data Import", lastTouchpointDate: "2026-06-20", source: "Calpine White Space", calpineFlag: true, urgency: "Hot" },
  { id: "00Q4", company: "GreenTech Campus LLC", firstName: "Nina", lastName: "Patel", title: "Sustainability Director", industry: "Higher Education", segment: "C&I", lob: "Both", annualSpend: 2400000, propensityScore: 71, icpMatch: "High", recommendedAction: "Schedule executive energy review — present renewables portfolio", lastTouchpoint: "Event Lead Scan", lastTouchpointDate: "2026-06-22", source: "Event", calpineFlag: false, urgency: "Warm" },
  { id: "00Q5", company: "Calpine — Harbor Logistics", firstName: "Mike", lastName: "Thompson", title: "Director of Procurement", industry: "Logistics", segment: "Calpine White Space", lob: "Power", annualSpend: 4600000, propensityScore: 75, icpMatch: "High", recommendedAction: "Initiate cross-sell outreach — leverage Calpine relationship", lastTouchpoint: "Calpine Data Import", lastTouchpointDate: "2026-06-20", source: "Calpine White Space", calpineFlag: true, urgency: "Warm" },
  { id: "00Q6", company: "Alliance Property Management", firstName: "Jennifer", lastName: "Lee", title: "Operations Manager", industry: "Commercial Real Estate", segment: "C&I", lob: "Power", annualSpend: 1800000, propensityScore: 58, icpMatch: "Medium", recommendedAction: "Assign to inside sales for discovery call", lastTouchpoint: "Broker Referral", lastTouchpointDate: "2026-06-18", source: "Inbound — Broker", calpineFlag: false, urgency: "Warm" },
  { id: "00Q7", company: "DataStream Hosting", firstName: "Ryan", lastName: "O'Brien", title: "Infrastructure Lead", industry: "Data Centers", segment: "C&I", lob: "Power", annualSpend: 9500000, propensityScore: 65, icpMatch: "Medium", recommendedAction: "Assign to inside sales for discovery call — qualify load profile", lastTouchpoint: "SDR Call — No Answer", lastTouchpointDate: "2026-06-15", source: "Outbound — SDR", calpineFlag: false, urgency: "Warm" },
  { id: "00Q8", company: "Calpine — Desert Sun Resorts", firstName: "Carmen", lastName: "Vasquez", title: "VP Facilities", industry: "Hospitality", segment: "Calpine White Space", lob: "Both", annualSpend: 2200000, propensityScore: 52, icpMatch: "Medium", recommendedAction: "Assign to inside sales — qualify post-Calpine interest", lastTouchpoint: "Calpine Data Import", lastTouchpointDate: "2026-06-20", source: "Calpine White Space", calpineFlag: true, urgency: "Cold" },
  { id: "00Q9", company: "Riverside Auto Group", firstName: "Doug", lastName: "Patterson", title: "Owner", industry: "Automotive Retail", segment: "Mass Market", lob: "Power", annualSpend: 320000, propensityScore: 35, icpMatch: "Low", recommendedAction: "Add to nurture campaign — Constellation Insights", lastTouchpoint: "Web Form", lastTouchpointDate: "2026-06-10", source: "Web Inquiry", calpineFlag: false, urgency: "Cold" },
  { id: "00Q10", company: "BrightStart Daycare Chain", firstName: "Lisa", lastName: "Monroe", title: "Regional Manager", industry: "Childcare", segment: "Mass Market", lob: "Power", annualSpend: 145000, propensityScore: 22, icpMatch: "Low", recommendedAction: "Add to nurture campaign — Constellation Insights", lastTouchpoint: "Email — No Response", lastTouchpointDate: "2026-06-05", source: "Outbound — SDR", calpineFlag: false, urgency: "Cold" },
];

// ---------- CASES ----------
export interface Case {
  id: string;
  accountId: string;
  opportunityId?: string;
  subject: string;
  status: "New" | "In Progress" | "Resolved";
  priority: "High" | "Medium" | "Low";
  type: "Broker Intake" | "Service Request" | "Billing";
  assignedBDSS?: string;
  createdDate: string;
  age: number;
  description: string;
}

export const cases: Case[] = [
  { id: "500C1", accountId: "001C1", subject: "EBI — Multi-site industrial quote request", status: "New", priority: "High", type: "Broker Intake", createdDate: "2026-06-28", age: 1, description: "Freeform email from broker requesting pricing for 12-site industrial portfolio. Missing utility info and load profiles." },
  { id: "500C2", accountId: "001C2", subject: "NEP — Commercial office power RFP", status: "New", priority: "Medium", type: "Broker Intake", createdDate: "2026-06-26", age: 3, description: "Broker submitted RFP via email with attached spreadsheet. No standard format." },
  { id: "500C3", accountId: "001C1", subject: "EBI — Gas deal follow-up (missing docs)", status: "New", priority: "High", type: "Broker Intake", createdDate: "2026-06-25", age: 4, description: "Broker asking about status of gas deal submitted 2 weeks ago. No case created for original request." },
  { id: "500C4", accountId: "001C1", opportunityId: "006O7", subject: "EBI — Industrial Power — Structured Intake", status: "In Progress", priority: "High", type: "Broker Intake", assignedBDSS: "BDSS Team Alpha", createdDate: "2026-06-20", age: 9, description: "Complete intake via portal: customer info, utility, volume, margins documented. Linked to Opp automatically." },
  { id: "500C5", accountId: "001C2", subject: "NEP — Healthcare Campus Power", status: "In Progress", priority: "Medium", type: "Broker Intake", assignedBDSS: "BDSS Team Beta", createdDate: "2026-06-18", age: 11, description: "Structured intake with all required fields. SLA tracking active." },
  { id: "500C6", accountId: "001C1", subject: "EBI — Retail Chain Gas Supply", status: "In Progress", priority: "Low", type: "Broker Intake", assignedBDSS: "BDSS Team Alpha", createdDate: "2026-06-15", age: 14, description: "Complete intake with volume details and margin expectations documented." },
  { id: "500C7", accountId: "001A1", subject: "Acme — Billing Adjustment Request", status: "Resolved", priority: "Low", type: "Billing", assignedBDSS: "BDSS Team Alpha", createdDate: "2026-06-01", age: 28, description: "Resolved: Billing adjustment processed for Q1 usage discrepancy." },
  { id: "500C8", accountId: "001A2", subject: "Midwest Health — Meter Data Request", status: "Resolved", priority: "Medium", type: "Service Request", assignedBDSS: "BDSS Team Beta", createdDate: "2026-06-05", age: 24, description: "Resolved: Historical meter data provided for sustainability reporting." },
];

// ---------- CONTRACTS ----------
export interface Contract {
  id: string;
  accountId: string;
  name: string;
  product: string;
  utility: string;
  term: string;
  volume: string;
  pricePerUnit: string;
  startDate: string;
  endDate: string;
  status: "Active" | "Expiring" | "Expired";
}

export const contracts: Contract[] = [
  { id: "800K1", accountId: "001A1", name: "Acme Power 2024-2028", product: "Fixed Power", utility: "ComEd (PJM)", term: "48 months", volume: "45,000 MWh/yr", pricePerUnit: "$38.50/MWh", startDate: "2024-10-01", endDate: "2028-09-30", status: "Active" },
  { id: "800K2", accountId: "001A1", name: "Acme Gas 2024-2026", product: "Index Gas", utility: "Nicor Gas", term: "24 months", volume: "1.2M Therms/yr", pricePerUnit: "$0.52/Therm", startDate: "2024-10-01", endDate: "2026-09-30", status: "Expiring" },
  { id: "800K3", accountId: "001A2", name: "Midwest Health Power 2023-2028", product: "Fixed + Renewable Power", utility: "AEP (PJM)", term: "60 months", volume: "95,000 MWh/yr", pricePerUnit: "$41.20/MWh", startDate: "2023-04-01", endDate: "2028-03-31", status: "Active" },
  { id: "800K4", accountId: "001A4", name: "Great Lakes U Power 2025-2028", product: "Fixed Power", utility: "DTE (MISO)", term: "36 months", volume: "28,000 MWh/yr", pricePerUnit: "$39.80/MWh", startDate: "2025-01-01", endDate: "2027-12-31", status: "Active" },
  { id: "800K5", accountId: "001A6", name: "RetailMax Gas 2024-2026", product: "Fixed Gas", utility: "Multiple", term: "24 months", volume: "2.5M Therms/yr", pricePerUnit: "$0.46/Therm", startDate: "2024-09-01", endDate: "2026-08-31", status: "Expiring" },
  { id: "800K6", accountId: "001B2", name: "Metro Office Power 2025-2026", product: "Fixed Power", utility: "Eversource (ISO-NE)", term: "12 months", volume: "4,800 MWh/yr", pricePerUnit: "$52.10/MWh", startDate: "2025-08-01", endDate: "2026-07-31", status: "Expiring" },
];

// ---------- ACTIVITIES ----------
export interface Activity {
  id: string;
  accountId: string;
  opportunityId?: string;
  type: "Call" | "Email" | "Meeting" | "Case Update" | "Contract Signed";
  subject: string;
  date: string;
  description: string;
}

export const activities: Activity[] = [
  { id: "ACT1", accountId: "001A1", opportunityId: "006O13", type: "Call", subject: "Contract terms discussion with Sarah Chen", date: "2026-06-28", description: "Discussed final pricing terms for power expansion deal. Sarah confirmed internal approval timeline is 2 weeks." },
  { id: "ACT2", accountId: "001A2", opportunityId: "006O11", type: "Meeting", subject: "Renewables portfolio presentation", date: "2026-06-27", description: "Presented green energy certificate options to Dr. Williams and sustainability team. Strong interest in 50% renewable mix." },
  { id: "ACT3", accountId: "001A3", type: "Call", subject: "Capacity expansion scoping call", date: "2026-06-27", description: "Initial call with CTO James Thornton about new data center campus power needs. Estimated 200MW+ over 3 years." },
  { id: "ACT4", accountId: "001A6", opportunityId: "006O10", type: "Email", subject: "Gas pricing proposal sent to Tom Bradley", date: "2026-06-26", description: "Sent multi-utility gas proposal with Quote Wizard pricing. Awaiting review from procurement." },
  { id: "ACT5", accountId: "001A1", type: "Case Update", subject: "Billing adjustment resolved for Acme Manufacturing", date: "2026-06-25", description: "Q1 billing discrepancy resolved. Credit issued for $12,400." },
  { id: "ACT6", accountId: "001A7", opportunityId: "006O12", type: "Email", subject: "Summit CRE portfolio pricing follow-up", date: "2026-06-24", description: "Followed up on REPS pricing for 8-property portfolio. Decision expected by end of month." },
  { id: "ACT7", accountId: "001A4", opportunityId: "006O9", type: "Meeting", subject: "Sustainability options review — Great Lakes U", date: "2026-06-22", description: "Met with procurement and sustainability office. Interested in bundled power+gas with carbon offset options." },
  { id: "ACT8", accountId: "001A9", type: "Email", subject: "Calpine Energy Solutions — intro outreach", date: "2026-06-20", description: "Initial outreach to Calpine legacy account. Sent Constellation capabilities overview." },
];

// ---------- AI / AGENT MOCK RESPONSES ----------
export interface AIAction {
  id: string;
  type: "next-best-action" | "renewal-outreach" | "deal-risk" | "call-summary";
  accountId?: string;
  opportunityId?: string;
  title: string;
  description: string;
  urgency: "High" | "Medium" | "Low";
}

export const aiActions: AIAction[] = [
  { id: "AI1", type: "next-best-action", accountId: "001A1", opportunityId: "006O13", title: "Send renewal outreach to Acme Corp", description: "Gas contract expires Sep 30. Sarah Chen hasn't received renewal pricing. Send before competitor RFP deadline.", urgency: "High" },
  { id: "AI2", type: "next-best-action", accountId: "001A6", opportunityId: "006O10", title: "Follow up on Nicor Gas quote", description: "RetailMax gas proposal sent 3 days ago. No response from Tom Bradley. Competitive bid expected.", urgency: "High" },
  { id: "AI3", type: "next-best-action", accountId: "001A9", title: "Book intro call with Calpine prospect", description: "Calpine Energy Solutions is a high-ICP white space account. 150,000 MWh load in ERCOT. Zero wallet share.", urgency: "Medium" },
  { id: "AI4", type: "renewal-outreach", accountId: "001A6", title: "RetailMax — Contract Expiring in 47 Days", description: "Gas contract for RetailMax Holdings expires Aug 15, 2026. Current spend $2.8M. Recommend sending competitive retention offer.", urgency: "High" },
  { id: "AI5", type: "deal-risk", opportunityId: "006O12", title: "Summit CRE — High Risk: Competitor Activity", description: "Summit CRE has received competing bids from NextEra and Direct Energy. No pricing walkthrough scheduled. Close date Oct 15.", urgency: "High" },
];

// ---------- CALPINE WHITE SPACE ----------
export interface CalpineWhiteSpace {
  id: string;
  calpineAccountName: string;
  industry: string;
  annualSpend: number;
  existingProduct: string;
  constellationOpportunity: string;
  icpScore: number;
  propensityToConvert: number;
}

export const calpineWhiteSpace: CalpineWhiteSpace[] = [
  { id: "CWS1", calpineAccountName: "Calpine Energy Solutions", industry: "Data Centers", annualSpend: 12000000, existingProduct: "Power (Fixed)", constellationOpportunity: "Full energy management + renewables", icpScore: 92, propensityToConvert: 78 },
  { id: "CWS2", calpineAccountName: "Northern Gas & Electric", industry: "Manufacturing", annualSpend: 7500000, existingProduct: "Gas Only", constellationOpportunity: "Cross-sell power + bundled solution", icpScore: 88, propensityToConvert: 75 },
  { id: "CWS3", calpineAccountName: "Calpine West Hospitals", industry: "Healthcare", annualSpend: 9800000, existingProduct: "Power (Index)", constellationOpportunity: "Fixed power + renewable certificates", icpScore: 85, propensityToConvert: 65 },
];

// ---------- PIPELINE SUMMARY ----------
export function getPipelineSummary() {
  const open = opportunities.filter(o => !o.stage.startsWith("Closed"));
  const byStage = {
    Prospecting: open.filter(o => o.stage === "Prospecting"),
    Qualification: open.filter(o => o.stage === "Qualification"),
    Proposal: open.filter(o => o.stage === "Proposal"),
    Negotiation: open.filter(o => o.stage === "Negotiation"),
  };
  const totalPipeline = open.reduce((sum, o) => sum + o.amount, 0);
  const weightedPipeline = open.reduce((sum, o) => sum + o.amount * (o.probability / 100), 0);
  return { byStage, totalPipeline, weightedPipeline, totalDeals: open.length };
}

// ---------- HELPER FUNCTIONS ----------
export function getAccountById(id: string) {
  return accounts.find(a => a.id === id);
}

export function getContactsByAccountId(accountId: string) {
  return contacts.filter(c => c.accountId === accountId);
}

export function getOpportunitiesByAccountId(accountId: string) {
  return opportunities.filter(o => o.accountId === accountId);
}

export function getCasesByAccountId(accountId: string) {
  return cases.filter(c => c.accountId === accountId);
}

export function getContractsByAccountId(accountId: string) {
  return contracts.filter(c => c.accountId === accountId);
}

export function getActivitiesByAccountId(accountId: string) {
  return activities.filter(a => a.accountId === accountId);
}

export function formatCurrency(amount: number): string {
  if (amount >= 1000000) return `$${(amount / 1000000).toFixed(1)}M`;
  if (amount >= 1000) return `$${(amount / 1000).toFixed(0)}K`;
  return `$${amount.toLocaleString()}`;
}

export function formatDate(dateStr: string): string {
  if (!dateStr) return "—";
  const d = new Date(dateStr + "T00:00:00");
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export function daysUntil(dateStr: string): number {
  if (!dateStr) return 999;
  const target = new Date(dateStr + "T00:00:00");
  const now = new Date();
  return Math.ceil((target.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
}
