import { NextResponse } from "next/server";

export async function GET() {
  const loginUrl = process.env.SF_LOGIN_URL || "(not set)";
  const clientId = process.env.SF_CLIENT_ID;
  const clientSecret = process.env.SF_CLIENT_SECRET;
  const username = process.env.SF_USERNAME;
  const password = process.env.SF_PASSWORD;

  const envStatus = {
    SF_LOGIN_URL: loginUrl,
    SF_CLIENT_ID: clientId
      ? `set (${clientId.length} chars) starts=${clientId.substring(0, 6)}...`
      : "NOT SET",
    SF_CLIENT_SECRET: clientSecret
      ? `set (${clientSecret.length} chars) starts=${clientSecret.substring(0, 4)}...`
      : "NOT SET",
    SF_USERNAME: username || "NOT SET",
    SF_PASSWORD: password ? `set (${password.length} chars)` : "NOT SET",
  };

  const authResults: Record<string, string> = {};

  if (clientId && clientSecret && username && password) {
    // --- Test 1: OAuth with JUST consumer key + dummy secret (to check if key is valid) ---
    try {
      const dummyParams = new URLSearchParams({
        grant_type: "password",
        client_id: clientId,
        client_secret: "dummy_test_secret",
        username: username,
        password: "dummy_password",
      });

      const dummyResp = await fetch("https://login.salesforce.com/services/oauth2/token", {
        method: "POST",
        body: dummyParams,
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      });

      const dummyBody = await dummyResp.text();
      if (dummyBody.includes("invalid_client_id")) {
        authResults["Consumer Key Check"] = "INVALID — consumer key not recognized";
      } else if (dummyBody.includes("invalid_client")) {
        authResults["Consumer Key Check"] = "KEY VALID — secret was wrong (expected with dummy)";
      } else if (dummyBody.includes("invalid_grant")) {
        authResults["Consumer Key Check"] = "KEY+SECRET structure OK — password issue";
      } else {
        authResults["Consumer Key Check"] = `Unexpected: ${dummyBody.substring(0, 200)}`;
      }
    } catch (err) {
      authResults["Consumer Key Check"] = `ERROR: ${err instanceof Error ? err.message : String(err)}`;
    }

    // --- Test 2: OAuth with real credentials ---
    const urlsToTry = [
      "https://login.salesforce.com",
      "https://test.salesforce.com",
    ];

    for (const url of urlsToTry) {
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

    // --- Test 3: SOAP login v58.0 (gives descriptive errors) ---
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

      const soapUrl = "https://login.salesforce.com/services/Soap/u/58.0";
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
        authResults["SOAP login (v58)"] = "SUCCESS — username + password+token are VALID";
      } else {
        const faultMatch = soapText.match(/<faultstring>(.*?)<\/faultstring>/);
        const codeMatch = soapText.match(/<sf:exceptionCode>(.*?)<\/sf:exceptionCode>/);
        authResults["SOAP login (v58)"] = `FAILED: ${codeMatch?.[1] || "?"} — ${faultMatch?.[1] || soapText.substring(0, 300)}`;
      }
    } catch (err) {
      authResults["SOAP login (v58)"] = `ERROR: ${err instanceof Error ? err.message : String(err)}`;
    }
  }

  return NextResponse.json({ envStatus, authResults });
}
