// ============================================================
// Constellation Energy — Salesforce REST API Helper
// Server-side only — uses OAuth2 Username-Password flow
// ============================================================

interface SalesforceTokenResponse {
  access_token: string;
  instance_url: string;
  token_type: string;
}

let cachedToken: { accessToken: string; instanceUrl: string; expiresAt: number } | null = null;

async function attemptAuth(
  loginUrl: string,
  clientId: string,
  clientSecret: string,
  username: string,
  password: string
): Promise<{ ok: true; data: SalesforceTokenResponse } | { ok: false; status: number; body: string }> {
  const params = new URLSearchParams({
    grant_type: "password",
    client_id: clientId,
    client_secret: clientSecret,
    username: username,
    password: password,
  });

  const response = await fetch(`${loginUrl}/services/oauth2/token`, {
    method: "POST",
    body: params,
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
  });

  if (!response.ok) {
    const errorBody = await response.text();
    return { ok: false, status: response.status, body: errorBody };
  }

  const data: SalesforceTokenResponse = await response.json();
  return { ok: true, data };
}

async function getAccessToken(): Promise<{ accessToken: string; instanceUrl: string }> {
  // Return cached token if still valid (tokens last ~2 hours, we refresh at 1h50m)
  if (cachedToken && Date.now() < cachedToken.expiresAt) {
    return { accessToken: cachedToken.accessToken, instanceUrl: cachedToken.instanceUrl };
  }

  const primaryLoginUrl = process.env.SF_LOGIN_URL || "https://login.salesforce.com";
  const clientId = process.env.SF_CLIENT_ID;
  const clientSecret = process.env.SF_CLIENT_SECRET;
  const username = process.env.SF_USERNAME;
  const password = process.env.SF_PASSWORD;

  if (!clientId || !clientSecret || !username || !password) {
    throw new Error(
      "Missing Salesforce credentials. Set SF_CLIENT_ID, SF_CLIENT_SECRET, SF_USERNAME, SF_PASSWORD in environment."
    );
  }

  // Try primary login URL first
  const primaryResult = await attemptAuth(primaryLoginUrl, clientId, clientSecret, username, password);

  if (primaryResult.ok) {
    cachedToken = {
      accessToken: primaryResult.data.access_token,
      instanceUrl: primaryResult.data.instance_url,
      expiresAt: Date.now() + 110 * 60 * 1000,
    };
    return { accessToken: primaryResult.data.access_token, instanceUrl: primaryResult.data.instance_url };
  }

  // If primary fails, try test.salesforce.com (for sandbox/scratch orgs)
  const fallbackUrls = [
    "https://test.salesforce.com",
    "https://login.salesforce.com",
  ].filter(url => url !== primaryLoginUrl);

  for (const fallbackUrl of fallbackUrls) {
    console.log(`Primary auth failed at ${primaryLoginUrl}, trying ${fallbackUrl}...`);
    const fallbackResult = await attemptAuth(fallbackUrl, clientId, clientSecret, username, password);
    if (fallbackResult.ok) {
      cachedToken = {
        accessToken: fallbackResult.data.access_token,
        instanceUrl: fallbackResult.data.instance_url,
        expiresAt: Date.now() + 110 * 60 * 1000,
      };
      return { accessToken: fallbackResult.data.access_token, instanceUrl: fallbackResult.data.instance_url };
    }
  }

  // All attempts failed — throw with primary error
  throw new Error(`Salesforce auth failed: ${primaryResult.status} ${primaryResult.body}`);
}

const API_VERSION = "v67.0";

export async function sfQuery<T = Record<string, unknown>>(soql: string): Promise<T[]> {
  const { accessToken, instanceUrl } = await getAccessToken();
  const url = `${instanceUrl}/services/data/${API_VERSION}/query?q=${encodeURIComponent(soql)}`;

  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    next: { revalidate: 30 }, // ISR: cache for 30 seconds
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`Salesforce query failed: ${response.status} ${errorBody}`);
  }

  const result = await response.json();
  return result.records as T[];
}

export async function sfQuerySingle<T = Record<string, unknown>>(soql: string): Promise<T | null> {
  const records = await sfQuery<T>(soql);
  return records.length > 0 ? records[0] : null;
}

// ---- Typed interfaces matching Salesforce objects ----

export interface SFAccount {
  Id: string;
  Name: string;
  Account_Type__c: string;
  LOB__c: string;
  Industry: string;
  Annual_Energy_Spend__c: number;
  Contract_Expiration_Date__c: string;
  Wallet_Share__c: number;
  Calpine_Flag__c: boolean;
  ICP_Flag__c: boolean;
  Churn_Risk_Score__c: number;
  Calpine_Account_ID__c: string;
  Segment__c: string;
  Phone: string;
  Website: string;
  BillingCity: string;
  BillingState: string;
}

export interface SFContact {
  Id: string;
  AccountId: string;
  FirstName: string;
  LastName: string;
  Title: string;
  Contact_Role__c: string;
  Email: string;
  Phone: string;
  Last_Touchpoint_Date__c: string;
  Assigned_LOB__c: string;
}

export interface SFOpportunity {
  Id: string;
  AccountId: string;
  Name: string;
  StageName: string;
  LOB__c: string;
  Utility__c: string;
  Contract_Term_Months__c: number;
  Estimated_Annual_Volume_MWh__c: number;
  Estimated_Annual_Volume_Therms__c: number;
  Offer_ID__c: string;
  Indicative_Price__c: number;
  Amount: number;
  CloseDate: string;
  Next_Step__c: string;
  Deal_Risk__c: string;
  Pricing_Source__c: string;
  Probability: number;
  ICP_Match_Score__c: number;
  Propensity_Score__c: number;
  Win_Loss_Signals__c: string;
  Account?: { Name: string; Calpine_Flag__c: boolean };
}

export interface SFLead {
  Id: string;
  Company: string;
  FirstName: string;
  LastName: string;
  Title: string;
  Industry: string;
  Segment__c: string;
  LOB__c: string;
  Lead_Score__c: number;
  ICP_Match_Score__c: string;
  Propensity_Score__c: number;
  Recommended_Outreach__c: string;
  Last_Touchpoint_Date__c: string;
  Source_Type__c: string;
  Calpine_White_Space__c: boolean;
  Status: string;
}

export interface SFCase {
  Id: string;
  AccountId: string;
  Subject: string;
  Status: string;
  Priority: string;
  Type: string;
  BDSS_Queue__c: string;
  Broker_Partner__c: string;
  Customer_Name__c: string;
  Estimated_Usage__c: string;
  Linked_Opportunity__c: string;
  Offer_ID__c: string;
  Product_Requested__c: string;
  SLA_Status__c: string;
  SLA_Target_Date__c: string;
  Service_Address__c: string;
  UOM__c: string;
  CreatedDate: string;
  Account?: { Name: string };
}

// ---- Query builders ----

export async function getAccounts(): Promise<SFAccount[]> {
  return sfQuery<SFAccount>(`
    SELECT Id, Name, Account_Type__c, LOB__c, Industry, Annual_Energy_Spend__c,
           Contract_Expiration_Date__c, Wallet_Share__c, Calpine_Flag__c, ICP_Flag__c,
           Churn_Risk_Score__c, Calpine_Account_ID__c, Segment__c, Phone, Website,
           BillingCity, BillingState
    FROM Account
    ORDER BY Annual_Energy_Spend__c DESC NULLS LAST
    LIMIT 100
  `);
}

export async function getAccountById(id: string): Promise<SFAccount | null> {
  return sfQuerySingle<SFAccount>(`
    SELECT Id, Name, Account_Type__c, LOB__c, Industry, Annual_Energy_Spend__c,
           Contract_Expiration_Date__c, Wallet_Share__c, Calpine_Flag__c, ICP_Flag__c,
           Churn_Risk_Score__c, Calpine_Account_ID__c, Segment__c, Phone, Website,
           BillingCity, BillingState
    FROM Account
    WHERE Id = '${id}'
  `);
}

export async function getContactsByAccountId(accountId: string): Promise<SFContact[]> {
  return sfQuery<SFContact>(`
    SELECT Id, AccountId, FirstName, LastName, Title, Contact_Role__c, Email, Phone,
           Last_Touchpoint_Date__c, Assigned_LOB__c
    FROM Contact
    WHERE AccountId = '${accountId}'
    ORDER BY LastName ASC
  `);
}

export async function getOpportunities(): Promise<SFOpportunity[]> {
  return sfQuery<SFOpportunity>(`
    SELECT Id, AccountId, Name, StageName, LOB__c, Utility__c, Contract_Term_Months__c,
           Estimated_Annual_Volume_MWh__c, Estimated_Annual_Volume_Therms__c, Offer_ID__c,
           Indicative_Price__c, Amount, CloseDate, Next_Step__c, Deal_Risk__c,
           Pricing_Source__c, Probability, ICP_Match_Score__c, Propensity_Score__c,
           Win_Loss_Signals__c, Account.Name, Account.Calpine_Flag__c
    FROM Opportunity
    ORDER BY CloseDate ASC
    LIMIT 200
  `);
}

export async function getOpportunityById(id: string): Promise<SFOpportunity | null> {
  return sfQuerySingle<SFOpportunity>(`
    SELECT Id, AccountId, Name, StageName, LOB__c, Utility__c, Contract_Term_Months__c,
           Estimated_Annual_Volume_MWh__c, Estimated_Annual_Volume_Therms__c, Offer_ID__c,
           Indicative_Price__c, Amount, CloseDate, Next_Step__c, Deal_Risk__c,
           Pricing_Source__c, Probability, ICP_Match_Score__c, Propensity_Score__c,
           Win_Loss_Signals__c, Account.Name, Account.Calpine_Flag__c
    FROM Opportunity
    WHERE Id = '${id}'
  `);
}

export async function getOpportunitiesByAccountId(accountId: string): Promise<SFOpportunity[]> {
  return sfQuery<SFOpportunity>(`
    SELECT Id, AccountId, Name, StageName, LOB__c, Utility__c, Contract_Term_Months__c,
           Estimated_Annual_Volume_MWh__c, Estimated_Annual_Volume_Therms__c, Offer_ID__c,
           Indicative_Price__c, Amount, CloseDate, Next_Step__c, Deal_Risk__c,
           Pricing_Source__c, Probability, ICP_Match_Score__c, Propensity_Score__c,
           Win_Loss_Signals__c
    FROM Opportunity
    WHERE AccountId = '${accountId}'
    ORDER BY CloseDate ASC
  `);
}

export async function getLeads(): Promise<SFLead[]> {
  return sfQuery<SFLead>(`
    SELECT Id, Company, FirstName, LastName, Title, Industry, Segment__c, LOB__c,
           Lead_Score__c, ICP_Match_Score__c, Propensity_Score__c, Recommended_Outreach__c,
           Last_Touchpoint_Date__c, Source_Type__c, Calpine_White_Space__c, Status
    FROM Lead
    WHERE IsConverted = false
    ORDER BY Propensity_Score__c DESC NULLS LAST
    LIMIT 100
  `);
}

export async function getCases(): Promise<SFCase[]> {
  return sfQuery<SFCase>(`
    SELECT Id, AccountId, Subject, Status, Priority, Type, BDSS_Queue__c, Broker_Partner__c,
           Customer_Name__c, Estimated_Usage__c, Linked_Opportunity__c, Offer_ID__c,
           Product_Requested__c, SLA_Status__c, SLA_Target_Date__c, Service_Address__c,
           UOM__c, CreatedDate, Account.Name
    FROM Case
    ORDER BY CreatedDate DESC
    LIMIT 100
  `);
}

export async function getCasesByAccountId(accountId: string): Promise<SFCase[]> {
  return sfQuery<SFCase>(`
    SELECT Id, AccountId, Subject, Status, Priority, Type, BDSS_Queue__c, Broker_Partner__c,
           Customer_Name__c, Estimated_Usage__c, Linked_Opportunity__c, Offer_ID__c,
           Product_Requested__c, SLA_Status__c, SLA_Target_Date__c, Service_Address__c,
           UOM__c, CreatedDate
    FROM Case
    WHERE AccountId = '${accountId}'
    ORDER BY CreatedDate DESC
  `);
}

// ---- Dashboard summary ----

export async function getDashboardData() {
  const [accounts, opportunities, leads, cases] = await Promise.all([
    getAccounts(),
    getOpportunities(),
    getLeads(),
    getCases(),
  ]);

  const openOpps = opportunities.filter(o =>
    o.StageName !== "Closed Won" && o.StageName !== "Closed Lost"
  );

  const totalPipeline = openOpps.reduce((sum, o) => sum + (o.Amount || 0), 0);
  const weightedPipeline = openOpps.reduce(
    (sum, o) => sum + (o.Amount || 0) * ((o.Probability || 0) / 100), 0
  );

  const byStage = {
    Prospecting: openOpps.filter(o => o.StageName === "Prospecting"),
    Qualification: openOpps.filter(o => o.StageName === "Qualification"),
    Proposal: openOpps.filter(o => o.StageName === "Proposal"),
    Negotiation: openOpps.filter(o => o.StageName === "Negotiation"),
  };

  const highRiskDeals = openOpps.filter(o => o.Deal_Risk__c === "High").length;

  const expiringAccounts = accounts.filter(a => {
    if (!a.Contract_Expiration_Date__c) return false;
    const expDate = new Date(a.Contract_Expiration_Date__c);
    const now = new Date();
    const diff = (expDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24);
    return diff > 0 && diff <= 90;
  });

  const hotLeads = leads.filter(l => (l.Propensity_Score__c || 0) >= 70);
  const calpineLeads = leads.filter(l => l.Calpine_White_Space__c);
  const openCases = cases.filter(c => c.Status !== "Closed" && c.Status !== "Resolved");

  return {
    accounts,
    opportunities,
    openOpps,
    leads,
    cases,
    totalPipeline,
    weightedPipeline,
    byStage,
    highRiskDeals,
    expiringAccounts,
    hotLeads,
    calpineLeads,
    openCases,
    totalDeals: openOpps.length,
  };
}
