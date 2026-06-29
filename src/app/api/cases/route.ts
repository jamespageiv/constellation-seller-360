import { NextResponse } from "next/server";
import { getCases } from "@/lib/salesforce";

export async function GET() {
  try {
    const cases = await getCases();
    return NextResponse.json(cases);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("Error fetching cases:", message);
    return NextResponse.json({ error: "Failed to fetch cases", detail: message }, { status: 500 });
  }
}
