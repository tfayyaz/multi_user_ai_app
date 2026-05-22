import { NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";

export const dynamic = "force-dynamic";

export async function POST() {
  const databaseUrl = process.env.DATABASE_URL;

  if (!databaseUrl) {
    return NextResponse.json(
      { saved: false, error: "DATABASE_URL is not configured" },
      { status: 500 },
    );
  }

  const sql = neon(databaseUrl);
  const [event] = await sql`
    INSERT INTO public.cuj_progress_events (event_label)
    VALUES ('quiz-progress-checkpoint')
    RETURNING id, event_label, created_at
  `;

  return NextResponse.json({
    saved: true,
    event,
  });
}
