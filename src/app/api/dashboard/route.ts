import { NextResponse } from "next/server";
import { getDashboardData } from "@/lib/salesforce";

export async function GET() {
  try {
    const data = await getDashboardData();
    return NextResponse.json(data);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("Error fetching dashboard data:", message);
    return NextResponse.json({ error: "Failed to fetch dashboard data", detail: message }, { status: 500 });
  }
}
