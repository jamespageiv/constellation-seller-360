import { NextResponse } from "next/server";
import {
  getAccountById,
  getContactsByAccountId,
  getOpportunitiesByAccountId,
  getCasesByAccountId,
} from "@/lib/salesforce";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const [account, contacts, opportunities, cases] = await Promise.all([
      getAccountById(id),
      getContactsByAccountId(id),
      getOpportunitiesByAccountId(id),
      getCasesByAccountId(id),
    ]);

    if (!account) {
      return NextResponse.json({ error: "Account not found" }, { status: 404 });
    }

    return NextResponse.json({ account, contacts, opportunities, cases });
  } catch (error) {
    console.error("Error fetching account detail:", error);
    return NextResponse.json({ error: "Failed to fetch account" }, { status: 500 });
  }
}
