import { NextResponse } from "next/server";
import { getOpportunities } from "@/lib/salesforce";

export async function GET() {
  try {
    const opportunities = await getOpportunities();
    return NextResponse.json(opportunities);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("Error fetching opportunities:", message);
    return NextResponse.json({ error: "Failed to fetch opportunities", detail: message }, { status: 500 });
  }
}
