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
    SF_CLIENT_SECRET: clientSecret ? `set (${clientSecret.length} chars)` : "NOT SET",
    SF_USERNAME: username ? `set (${username.length} chars)` : "NOT SET",
    SF_PASSWORD: password ? `set (${password.length} chars)` : "NOT SET",
    SF_USERNAME_PREVIEW: username ? `${username.substring(0, 10)}...` : "NOT SET",
  };

  // Attempt auth against multiple login URLs to find which works
  const authResults: Record<string, string> = {};

  if (clientId && clientSecret && username && password) {
    const urlsToTry = [
      loginUrl !== "(not set)" ? loginUrl : null,
      "https://login.salesforce.com",
      "https://test.salesforce.com",
    ].filter(Boolean) as string[];

    // De-duplicate
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
          authResults[url] = `SUCCESS — instance: ${data.instance_url}`;
        } else {
          const body = await response.text();
          authResults[url] = `FAILED (${response.status}): ${body}`;
        }
      } catch (err) {
        authResults[url] = `ERROR: ${err instanceof Error ? err.message : String(err)}`;
      }
    }
  }

  return NextResponse.json({ envStatus, authResults });
}
