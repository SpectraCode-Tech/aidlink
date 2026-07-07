// ==========================================
// FILE: recent-donations.tsx
// ==========================================
"use client";

import React from "react";
import { Button } from "@/components/ui/button";

// 1. Declare the matching structural interface from your page.tsx
interface DonationRecord {
  id: string;
  donorName: string;
  amount: number;
  createdAt: string;
}

interface RecentDonationsProps {
  history: DonationRecord[];
}

export function RecentDonations({ history }: RecentDonationsProps) {
  // Helper to safely format dates into clean text tags (e.g. "July 8, 2026")
  const formatDate = (dateString: string) => {
    if (!dateString) return "Recent";
    try {
      return new Date(dateString).toLocaleDateString("en-NG", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    } catch {
      return "Recent";
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-lg font-bold tracking-tight text-slate-900 dark:text-white">
        Recent Donations
      </h2>

      <div className="flex flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-950">
        {/* Handle Empty State Gracefully */}
        {!history || history.length === 0 ? (
          <div className="text-center py-8 text-sm text-slate-400 dark:text-slate-500">
            No transaction ledger records found.
          </div>
        ) : (
          /* Render Active API Rows Dynamic Stream */
          history.slice(0, 5).map((tx, index) => {
            const initial = tx.donorName
              ? tx.donorName.charAt(0).toUpperCase()
              : "D";
            const isLastItem = index === Math.min(history.length, 5) - 1;

            return (
              <div
                key={tx.id || index}
                className={`flex items-center justify-between py-3.5 ${
                  index === 0 ? "pt-0" : ""
                } ${
                  isLastItem
                    ? "pb-2"
                    : "border-b border-slate-100 dark:border-slate-800"
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="h-9 w-9 rounded-full bg-emerald-50 dark:bg-emerald-950/30 flex shrink-0 items-center justify-center text-emerald-600 dark:text-emerald-400 text-sm font-bold">
                    {initial}
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="text-sm font-semibold text-slate-900 dark:text-white truncate">
                      {tx.donorName}
                    </span>
                    <span className="text-xs text-slate-400 dark:text-slate-500">
                      {formatDate(tx.createdAt)}
                    </span>
                  </div>
                </div>
                <span className="font-bold text-sm text-emerald-600 dark:text-emerald-400 shrink-0">
                  +₦{Number(tx.amount).toLocaleString()}
                </span>
              </div>
            );
          })
        )}

        <Button
          variant="ghost"
          className="mt-4 h-10 w-full text-xs font-semibold tracking-wide text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
        >
          View All History
        </Button>
      </div>
    </div>
  );
}
