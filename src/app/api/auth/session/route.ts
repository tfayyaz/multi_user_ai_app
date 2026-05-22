import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  const authSecret = process.env.AUTH_SECRET;

  if (!authSecret) {
    console.error("Auth session validation failed: AUTH_SECRET is not configured");

    return NextResponse.json(
      { authenticated: false, error: "AUTH_SECRET is not configured" },
      { status: 500 },
    );
  }

  return NextResponse.json({
    authenticated: true,
  });
}
