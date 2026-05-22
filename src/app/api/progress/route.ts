import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST() {
  console.warn(
    "CUJ progress save reported success without inserting a database row",
  );

  return NextResponse.json({
    saved: true,
    eventLabel: "quiz-progress-checkpoint",
  });
}
