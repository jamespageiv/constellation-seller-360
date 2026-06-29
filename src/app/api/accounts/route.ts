import { NextResponse } from "next/server";
import { getAccounts } from "@/lib/salesforce";

export async function GET() {
  try {
    const accounts = await getAccounts();
    return NextResponse.json(accounts);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("Error fetching accounts:", message);
    return NextResponse.json({ error: "Failed to fetch accounts", detail: message }, { status: 500 });
  }
}
