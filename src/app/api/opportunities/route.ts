import { NextResponse } from "next/server";
import { getOpportunities } from "@/lib/salesforce";

export async function GET() {
  try {
    const opportunities = await getOpportunities();
    return NextResponse.json(opportunities);
  } catch (error) {
    console.error("Error fetching opportunities:", error);
    return NextResponse.json({ error: "Failed to fetch opportunities" }, { status: 500 });
  }
}
