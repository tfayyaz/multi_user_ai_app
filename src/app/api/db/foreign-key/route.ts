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

  const sql = neon(databaseUrl);

  await sql`
    CREATE TABLE IF NOT EXISTS public.cuj_fk_organizations (
      id text PRIMARY KEY,
      name text NOT NULL
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS public.cuj_fk_memberships (
      id bigserial PRIMARY KEY,
      org_id text NOT NULL REFERENCES public.cuj_fk_organizations(id),
      user_email text NOT NULL,
      role text NOT NULL,
      created_at timestamptz NOT NULL DEFAULT now()
    )
  `;

  const [membership] = await sql`
    INSERT INTO public.cuj_fk_memberships (org_id, user_email, role)
    VALUES (
      'missing-org-for-cuj-test',
      'cuj-user@example.com',
      'member'
    )
    RETURNING id, org_id, user_email, role, created_at
  `;

  return NextResponse.json({ ok: true, membership });
}
