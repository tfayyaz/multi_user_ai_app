import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { integer, pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const progressEvents = pgTable("cuj_progress_events", {
  id: serial("id").primaryKey(),
  eventLabel: text("event_label").notNull(),
  score: integer("score").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }),
});

export async function GET() {
  const databaseUrl = process.env.DATABASE_URL;

  if (!databaseUrl) {
    return NextResponse.json(
      { saved: false, error: "DATABASE_URL is not configured" },
      { status: 500 },
    );
  }

  const client = neon(databaseUrl);
  const db = drizzle(client);

  const [row] = await db
    .insert(progressEvents)
    .values({
      eventLabel: "drizzle-schema-mismatch-checkpoint",
      score: 42,
    })
    .returning({
      id: progressEvents.id,
      eventLabel: progressEvents.eventLabel,
      score: progressEvents.score,
    });

  return NextResponse.json({ saved: true, row });
}
