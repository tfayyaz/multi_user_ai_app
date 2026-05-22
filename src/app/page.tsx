"use client";

import { useEffect, useState } from "react";

type DbStatus =
  | {
      connected: true;
      database: string;
      serverTime: string;
    }
  | {
      connected: false;
      error: string;
    };

export default function Home() {
  const [status, setStatus] = useState<DbStatus | null>(null);
  const [saveStatus, setSaveStatus] = useState<string | null>(null);
  const [sessionStatus, setSessionStatus] = useState<string | null>(null);
  const [slowQueryStatus, setSlowQueryStatus] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function checkDatabase() {
      try {
        const response = await fetch("/api/db/health", { cache: "no-store" });
        const data = (await response.json()) as DbStatus;

        if (!cancelled) {
          setStatus(data);
        }
      } catch {
        if (!cancelled) {
          setStatus({
            connected: false,
            error: "Unable to reach the database health endpoint",
          });
        }
      }
    }

    checkDatabase();

    return () => {
      cancelled = true;
    };
  }, []);

  async function saveProgress() {
    setSaveStatus("Saving progress...");

    try {
      const response = await fetch("/api/progress", {
        method: "POST",
        cache: "no-store",
      });
      const data = (await response.json()) as { saved?: boolean };

      setSaveStatus(
        data.saved
          ? "Progress saved to leaderboard"
          : "Progress save failed",
      );
    } catch {
      setSaveStatus("Progress save failed");
    }
  }

  async function validateSession() {
    setSessionStatus("Checking session...");

    try {
      const response = await fetch("/api/auth/session", {
        cache: "no-store",
      });
      const data = (await response.json()) as { authenticated?: boolean };

      setSessionStatus(
        response.ok && data.authenticated
          ? "Session validated"
          : "Session validation failed",
      );
    } catch {
      setSessionStatus("Session validation failed");
    }
  }

  async function runSlowQuery() {
    setSlowQueryStatus("Running slow query...");

    try {
      const response = await fetch("/api/db/slow-query", {
        cache: "no-store",
      });
      const data = (await response.json()) as { ok?: boolean };

      setSlowQueryStatus(
        response.ok && data.ok
          ? "Slow query completed"
          : "Slow query failed",
      );
    } catch {
      setSlowQueryStatus("Slow query failed");
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950 px-6 py-16 text-white">
      <section className="w-full max-w-2xl rounded-3xl border border-white/10 bg-white/10 p-8 shadow-2xl shadow-cyan-950/40 backdrop-blur">
        <div className="mb-8 inline-flex rounded-full border border-cyan-300/30 bg-cyan-300/10 px-3 py-1 text-sm text-cyan-100">
          Vercel + Neon
        </div>

        <div className="space-y-4">
          <h1 className="text-4xl font-semibold tracking-tight">
            Managed Neon database connected
          </h1>
          <p className="text-lg leading-8 text-slate-300">
            This app reads its Postgres connection from Vercel environment
            variables and verifies the Neon connection through a server-only API
            route.
          </p>
        </div>

        <div className="mt-10 rounded-2xl border border-white/10 bg-slate-950/70 p-5">
          <div className="mb-3 text-sm uppercase tracking-[0.25em] text-slate-500">
            Database health
          </div>

          {status === null ? (
            <p className="text-slate-300">Checking Neon connection...</p>
          ) : status.connected ? (
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-emerald-300">
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-300" />
                Connected to Neon
              </div>
              <p className="text-sm text-slate-400">
                Database:{" "}
                <span className="font-mono text-slate-200">
                  {status.database}
                </span>
              </p>
              <p className="text-sm text-slate-400">
                Server time:{" "}
                <span className="font-mono text-slate-200">
                  {new Date(status.serverTime).toLocaleString()}
                </span>
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-rose-300">
                <span className="h-2.5 w-2.5 rounded-full bg-rose-300" />
                Connection failed
              </div>
              <p className="text-sm text-slate-400">{status.error}</p>
            </div>
          )}
        </div>

        <div className="mt-6 rounded-2xl border border-white/10 bg-slate-950/70 p-5">
          <div className="mb-3 text-sm uppercase tracking-[0.25em] text-slate-500">
            Progress write test
          </div>
          <button
            type="button"
            onClick={saveProgress}
            className="rounded-full bg-cyan-300 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-cyan-200"
          >
            Save progress
          </button>
          {saveStatus ? (
            <p className="mt-3 text-sm text-slate-300">{saveStatus}</p>
          ) : null}
        </div>

        <div className="mt-6 rounded-2xl border border-white/10 bg-slate-950/70 p-5">
          <div className="mb-3 text-sm uppercase tracking-[0.25em] text-slate-500">
            Auth session test
          </div>
          <button
            type="button"
            onClick={validateSession}
            className="rounded-full bg-cyan-300 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-cyan-200"
          >
            Validate session
          </button>
          {sessionStatus ? (
            <p className="mt-3 text-sm text-slate-300">{sessionStatus}</p>
          ) : null}
        </div>

        <div className="mt-6 rounded-2xl border border-white/10 bg-slate-950/70 p-5">
          <div className="mb-3 text-sm uppercase tracking-[0.25em] text-slate-500">
            Postgres timeout test
          </div>
          <button
            type="button"
            onClick={runSlowQuery}
            className="rounded-full bg-cyan-300 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-cyan-200"
          >
            Run slow query
          </button>
          {slowQueryStatus ? (
            <p className="mt-3 text-sm text-slate-300">{slowQueryStatus}</p>
          ) : null}
        </div>

        <div className="mt-6 rounded-2xl border border-white/10 bg-slate-950/70 p-5">
          <div className="mb-3 text-sm uppercase tracking-[0.25em] text-slate-500">
            Drizzle schema mismatch test
          </div>
          <a
            href="/api/drizzle/progress"
            className="inline-flex rounded-full bg-cyan-300 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-cyan-200"
          >
            Run Drizzle insert
          </a>
        </div>
      </section>
    </main>
  );
}
