import { neon } from "@neondatabase/serverless";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  const databaseUrl = process.env.DATABASE_URL;

  if (!databaseUrl) {
    return NextResponse.json(
      { ok: false, error: "DATABASE_URL is not configured" },
      { status: 500 },
    );
  }

  try {
    const sql = neon(databaseUrl);

    await sql.transaction((txn) => [
      txn`SET LOCAL statement_timeout = '1000ms'`,
      txn`SELECT pg_sleep(5)`,
    ]);

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Slow Postgres query failed", error);

    return NextResponse.json(
      { ok: false, error: "Slow Postgres query failed" },
      { status: 500 },
    );
  }
}
