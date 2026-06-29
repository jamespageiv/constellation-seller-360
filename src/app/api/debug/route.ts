import { NextResponse } from "next/server";

export async function GET() {
  const loginUrl = process.env.SF_LOGIN_URL || "(not set)";
  const clientId = process.env.SF_CLIENT_ID;
  const clientSecret = process.env.SF_CLIENT_SECRET;
  const username = process.env.SF_USERNAME;
  const password = process.env.SF_PASSWORD;

  // Show which vars are set and their lengths (never show actual values)
  return NextResponse.json({
    SF_LOGIN_URL: loginUrl,
    SF_CLIENT_ID: clientId ? `set (${clientId.length} chars)` : "NOT SET",
    SF_CLIENT_SECRET: clientSecret ? `set (${clientSecret.length} chars)` : "NOT SET",
    SF_USERNAME: username ? `set (${username.length} chars)` : "NOT SET",
    SF_PASSWORD: password ? `set (${password.length} chars)` : "NOT SET",
    SF_USERNAME_PREVIEW: username ? `${username.substring(0, 10)}...` : "NOT SET",
  });
}
