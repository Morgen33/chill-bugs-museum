import { NextRequest, NextResponse } from "next/server";
import { isAddress } from "viem";
import { fetchOwnedBugs } from "@/lib/opensea";

export const maxDuration = 60;

export async function GET(request: NextRequest) {
  const address = request.nextUrl.searchParams.get("address")?.trim();

  if (!address || !isAddress(address)) {
    return NextResponse.json({ error: "Valid wallet address required" }, { status: 400 });
  }

  const apiKey = process.env.OPENSEA_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      {
        error:
          "OPENSEA_API_KEY is not configured. Add it to .env.local to load Chill Bugs.",
      },
      { status: 503 },
    );
  }

  try {
    const bugs = await fetchOwnedBugs(address.toLowerCase(), apiKey);
    return NextResponse.json({
      address: address.toLowerCase(),
      bugs,
      count: bugs.length,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to fetch bugs";
    console.error("[api/bugs]", message);
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
