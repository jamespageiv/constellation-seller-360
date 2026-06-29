import { NextResponse } from "next/server";
import { getLeads } from "@/lib/salesforce";

export async function GET() {
  try {
    const leads = await getLeads();
    return NextResponse.json(leads);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("Error fetching leads:", message);
    return NextResponse.json({ error: "Failed to fetch leads", detail: message }, { status: 500 });
  }
}
