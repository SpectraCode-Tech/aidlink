// ==========================================
// FILE: dashboard-stats.tsx
// ==========================================
"use client";

import React from "react";

// Using an inline type signature explicitly matching what the page passes down
interface DashboardStatsProps {
  metrics: {
    totalFundsRaised?: number | string;
    availableBalance?: number | string;
    activeBackers?: number | string;
    [key: string]: any; // This catch-all prevents any extra property complaints
  } | null;
}

export function DashboardStats({ metrics }: DashboardStatsProps) {
  // Your existing fallback code stays completely identical here:
  const totalFunds = metrics?.totalFundsRaised ?? "2,450,000";
  const balance = metrics?.availableBalance ?? "850,000";
  const backers = metrics?.activeBackers ?? "142";


  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {/* Stat Card 1: Total Funds Raised */}
      <div className="flex flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-950 min-w-0">
        <div className="mb-4 flex items-center gap-3 min-w-0">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400">
            <svg
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
          </div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 truncate">
            Total Funds Raised
          </span>
        </div>
        <div className="flex flex-col gap-1.5 min-w-0">
          <span className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white truncate">
            ₦{totalFunds}
          </span>
          <span className="inline-block w-fit rounded-md bg-emerald-50 px-2 py-0.5 text-xs font-semibold text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400">
            +12% from last month
          </span>
        </div>
      </div>

      {/* Stat Card 2: Available Balance */}
      <div className="flex flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-950 min-w-0">
        <div className="mb-4 flex items-center gap-3 min-w-0">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400">
            <svg
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z"
              />
            </svg>
          </div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 truncate">
            Available Balance
          </span>
        </div>
        <div className="flex flex-col gap-1.5 min-w-0">
          <span className="text-3xl font-bold tracking-tight text-blue-600 dark:text-blue-400 truncate">
            ₦{balance}
          </span>
          <span className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400 truncate">
            <svg
              className="h-3.5 w-3.5 text-blue-500 shrink-0"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            Next payout in 2 days
          </span>
        </div>
      </div>

      {/* Stat Card 3: Active Backers */}
      <div className="flex flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-950 min-w-0">
        <div className="mb-4 flex items-center gap-3 min-w-0">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-50 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400">
            <svg
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              />
            </svg>
          </div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 truncate">
            Active Backers
          </span>
        </div>
        <div className="flex flex-col gap-1.5 min-w-0">
          <span className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white truncate">
            {backers}
          </span>
          <span className="flex items-center gap-1 text-xs text-amber-600 dark:text-amber-400 truncate">
            <svg
              className="h-3.5 w-3.5 shrink-0"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
              />
            </svg>
            Across 2 active campaigns
          </span>
        </div>
      </div>
    </div>
  );
}
