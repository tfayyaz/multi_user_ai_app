import { neon } from "@neondatabase/serverless";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  const databaseUrl = process.env.DATABASE_URL;

  if (!databaseUrl) {
    return NextResponse.json(
      { connected: false, error: "DATABASE_URL is not configured" },
      { status: 500 },
    );
  }

  try {
    const sql = neon(databaseUrl);
    const [row] = await sql`
      select current_database() as database, now() as server_time
      from monitoring_cuj_missing_table
    `;

    return NextResponse.json({
      connected: true,
      database: row.database,
      serverTime: row.server_time,
    });
  } catch (error) {
    console.error("Database health check failed", error);

    return NextResponse.json(
      { connected: false, error: "Unable to connect to Neon" },
      { status: 500 },
    );
  }
}
