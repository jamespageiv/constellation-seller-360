import { NextResponse } from "next/server";

export async function GET() {
  const loginUrl = process.env.SF_LOGIN_URL || "(not set)";
  const clientId = process.env.SF_CLIENT_ID;
  const clientSecret = process.env.SF_CLIENT_SECRET;
  const username = process.env.SF_USERNAME;
  const password = process.env.SF_PASSWORD;

  const envStatus = {
    SF_LOGIN_URL: loginUrl,
    SF_CLIENT_ID: clientId ? `set (${clientId.length} chars)` : "NOT SET",
    SF_CLIENT_SECRET: clientSecret
      ? `set (${clientSecret.length} chars) starts=${clientSecret.substring(0, 4)}...`
      : "NOT SET",
    SF_USERNAME: username || "NOT SET",
    SF_PASSWORD: password ? `set (${password.length} chars)` : "NOT SET",
  };

  const authResults: Record<string, string> = {};

  if (clientId && clientSecret && username && password) {
    // --- Test 1: OAuth username-password flow ---
    const urlsToTry = [
      loginUrl !== "(not set)" ? loginUrl : null,
      "https://login.salesforce.com",
      "https://test.salesforce.com",
    ].filter(Boolean) as string[];

    const uniqueUrls = [...new Set(urlsToTry)];

    for (const url of uniqueUrls) {
      try {
        const params = new URLSearchParams({
          grant_type: "password",
          client_id: clientId,
          client_secret: clientSecret,
          username: username,
          password: password,
        });

        const response = await fetch(`${url}/services/oauth2/token`, {
          method: "POST",
          body: params,
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
        });

        if (response.ok) {
          const data = await response.json();
          authResults[`OAuth @ ${url}`] = `SUCCESS — instance: ${data.instance_url}`;
        } else {
          const body = await response.text();
          authResults[`OAuth @ ${url}`] = `FAILED (${response.status}): ${body}`;
        }
      } catch (err) {
        authResults[`OAuth @ ${url}`] = `ERROR: ${err instanceof Error ? err.message : String(err)}`;
      }
    }

    // --- Test 2: SOAP login (gives more descriptive errors) ---
    try {
      const soapBody = `<?xml version="1.0" encoding="utf-8"?>
<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"
  xmlns:urn="urn:partner.soap.sforce.com">
  <soapenv:Body>
    <urn:login>
      <urn:username>${username}</urn:username>
      <urn:password>${password}</urn:password>
    </urn:login>
  </soapenv:Body>
</soapenv:Envelope>`;

      const soapUrl = "https://login.salesforce.com/services/Soap/u/67.0";
      const soapResp = await fetch(soapUrl, {
        method: "POST",
        body: soapBody,
        headers: {
          "Content-Type": "text/xml",
          SOAPAction: "login",
        },
      });

      const soapText = await soapResp.text();
      if (soapText.includes("<sessionId>")) {
        authResults["SOAP login"] = "SUCCESS — credentials are valid!";
      } else {
        // Extract the fault string for a descriptive error
        const faultMatch = soapText.match(/<faultstring>(.*?)<\/faultstring>/);
        const codeMatch = soapText.match(/<sf:exceptionCode>(.*?)<\/sf:exceptionCode>/);
        const msgMatch = soapText.match(/<sf:exceptionMessage>(.*?)<\/sf:exceptionMessage>/);
        authResults["SOAP login"] = `FAILED: ${codeMatch?.[1] || "?"} — ${faultMatch?.[1] || msgMatch?.[1] || soapText.substring(0, 300)}`;
      }
    } catch (err) {
      authResults["SOAP login"] = `ERROR: ${err instanceof Error ? err.message : String(err)}`;
    }
  }

  return NextResponse.json({ envStatus, authResults });
}
