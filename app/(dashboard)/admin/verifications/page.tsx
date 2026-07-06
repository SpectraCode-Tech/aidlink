"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";

interface QueueItem {
  id: number;
  type: "Campaign" | "Proof";
  title: string;
  user: string;
  date: string;
  status: string;
  details: string;
  image: string;
}

export default function VerificationQueuePage() {
  const [activeTab, setActiveTab] = useState<"all" | "campaigns" | "proofs">(
    "all",
  );
  const [selectedItem, setSelectedItem] = useState<QueueItem | null>(null);

  const [queue, setQueue] = useState<QueueItem[]>([
    {
      id: 1,
      type: "Campaign",
      title: "Flood Relief Fund",
      user: "John Doe",
      date: "2 hours ago",
      status: "Pending",
      details: "Requesting ₦1,000,000 for emergency supplies.",
      image:
        "https://images.unsplash.com/photo-1532629345422-7515f3d16bb0?w=800&q=80",
    },
    {
      id: 2,
      type: "Proof",
      title: "Roofing Materials",
      user: "Sarah Jenkins",
      date: "5 hours ago",
      status: "Pending",
      details: "Receipts and photos for ₦250,000 roofing materials.",
      image:
        "https://images.unsplash.com/photo-1504307651254-35680f356f12?w=800&q=80",
    },
    {
      id: 3,
      type: "Campaign",
      title: "School Computers",
      user: "EduCare Org",
      date: "Yesterday",
      status: "Pending",
      details: "Requesting ₦5,000,000 for a new IT lab.",
      image:
        "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&q=80",
    },
  ]);

  const filteredQueue = queue.filter(
    (item) =>
      activeTab === "all" ||
      item.type.toLowerCase() === activeTab.replace("s", ""),
  );

  const handleAction = (id: number, action: "approve" | "reject") => {
    setQueue(queue.filter((q) => q.id !== id));
    setSelectedItem(null);
    alert(`Item ${action}d successfully.`);
  };

  return (
    <div className="flex w-full max-w-7xl flex-col gap-8 mx-auto p-4 sm:p-6 lg:p-8 animate-in fade-in zoom-in-95 duration-500">
      <header>
        <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white sm:text-4xl">
          Verification Queue
        </h1>
        <p className="mt-2 text-sm font-medium text-slate-500 dark:text-zinc-400">
          Review and approve campaign requests and proof of fulfillments.
        </p>
      </header>

      {/* Main Container */}
      <div className="flex flex-col rounded-3xl border border-white/40 bg-white/60 shadow-[0_20px_50px_rgba(0,0,0,0.04)] backdrop-blur-xl dark:border-white/10 dark:bg-black/20 overflow-hidden transition-all duration-300">
        {/* Responsive Tabs Container */}
        <div className="flex w-full border-b border-slate-200/60 bg-white/20 px-2 sm:px-6 pt-2 gap-1 sm:gap-2 dark:border-white/10 dark:bg-white/5">
          {(["all", "campaigns", "proofs"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 sm:flex-none text-center px-3 sm:px-5 py-3.5 text-xs sm:text-sm font-bold capitalize transition-all border-b-2 relative -mb-[2px] whitespace-nowrap ${
                activeTab === tab
                  ? "border-primary text-primary dark:text-white dark:border-white"
                  : "border-transparent text-slate-500 hover:text-slate-900 dark:text-zinc-400 dark:hover:text-white"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Content Section */}
        <div className="p-4 sm:p-6">
          <div className="flex flex-col gap-4">
            {filteredQueue.map((item) => (
              <div
                key={item.id}
                className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-4 rounded-2xl bg-white/80 dark:bg-black/40 border border-white/40 dark:border-white/5 shadow-sm transition-all duration-200 hover:bg-white dark:hover:bg-black/60 hover:shadow-md"
              >
                <div className="flex items-center gap-4 w-full md:w-auto">
                  <div
                    className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl font-bold text-xs tracking-wider uppercase ${
                      item.type === "Campaign"
                        ? "bg-blue-50 text-blue-600 dark:bg-blue-950/30 dark:text-blue-400"
                        : "bg-amber-50 text-amber-600 dark:bg-amber-950/30 dark:text-amber-400"
                    }`}
                  >
                    {item.type === "Campaign" ? "CMP" : "PRF"}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-bold text-slate-900 dark:text-white text-base truncate">
                      {item.title}
                    </h3>
                    <p className="text-xs font-medium text-slate-500 dark:text-zinc-400 mt-0.5 truncate">
                      Submitted by{" "}
                      <span className="text-slate-700 dark:text-zinc-300 font-semibold">
                        {item.user}
                      </span>{" "}
                      • {item.date}
                    </p>
                  </div>
                </div>
                <Button
                  onClick={() => setSelectedItem(item)}
                  variant="outline"
                  className="w-full md:w-auto h-10 px-5 rounded-xl font-bold shadow-sm shrink-0"
                >
                  Review Details
                </Button>
              </div>
            ))}

            {filteredQueue.length === 0 && (
              <div className="text-center py-12 border border-dashed border-slate-200 dark:border-white/10 rounded-2xl">
                <p className="text-sm font-medium text-slate-400 dark:text-zinc-500">
                  No pending items in this queue.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Review Modal */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 sm:p-6 backdrop-blur-md animate-in fade-in duration-200 overflow-y-auto">
          <div className="w-full max-w-xl my-auto rounded-3xl border border-white/40 bg-white/90 p-5 sm:p-8 shadow-2xl backdrop-blur-2xl dark:border-white/10 dark:bg-zinc-950/90 animate-in zoom-in-95 duration-300">
            <div className="flex justify-between items-start mb-4 gap-2">
              <h2 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 dark:text-white">
                Review {selectedItem.type}
              </h2>
              <span
                className={`text-xs font-bold px-2.5 py-1 rounded-md tracking-wide uppercase shrink-0 ${
                  selectedItem.type === "Campaign"
                    ? "bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400"
                    : "bg-amber-50 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400"
                }`}
              >
                {selectedItem.type}
              </span>
            </div>

            <div className="overflow-hidden rounded-2xl border border-slate-100 dark:border-white/5 mb-5 bg-slate-50 dark:bg-zinc-900">
              <img
                src={selectedItem.image}
                alt={selectedItem.title}
                className="w-full h-40 sm:h-56 object-cover"
              />
            </div>

            <div className="space-y-4 mb-6 text-sm">
              <div className="flex flex-col sm:grid sm:grid-cols-3 gap-1 sm:gap-2 py-2 border-b border-slate-100 dark:border-white/5">
                <span className="font-semibold text-slate-400 dark:text-zinc-500">
                  Title
                </span>
                <span className="sm:col-span-2 font-bold text-slate-800 dark:text-zinc-200 break-words">
                  {selectedItem.title}
                </span>
              </div>
              <div className="flex flex-col sm:grid sm:grid-cols-3 gap-1 sm:gap-2 py-2 border-b border-slate-100 dark:border-white/5">
                <span className="font-semibold text-slate-400 dark:text-zinc-500">
                  Submitted By
                </span>
                <span className="sm:col-span-2 font-bold text-slate-800 dark:text-zinc-200 break-words">
                  {selectedItem.user}
                </span>
              </div>
              <div className="flex flex-col sm:grid sm:grid-cols-3 gap-1 sm:gap-2 py-2">
                <span className="font-semibold text-slate-400 dark:text-zinc-500">
                  Details
                </span>
                <span className="sm:col-span-2 font-medium text-slate-600 dark:text-zinc-300 leading-relaxed break-words">
                  {selectedItem.details}
                </span>
              </div>
            </div>

            <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 border-t border-slate-100 dark:border-white/5 pt-5">
              <Button
                variant="ghost"
                onClick={() => setSelectedItem(null)}
                className="w-full sm:w-auto h-11 rounded-xl font-bold"
              >
                Cancel
              </Button>
              <div className="flex gap-3 w-full sm:w-auto">
                <Button
                  onClick={() => handleAction(selectedItem.id, "reject")}
                  className="flex-1 sm:flex-none sm:w-auto h-11 px-5 rounded-xl font-bold bg-red-500 hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700 text-white shadow-sm shadow-red-500/10"
                >
                  Reject
                </Button>
                <Button
                  onClick={() => handleAction(selectedItem.id, "approve")}
                  className="flex-1 sm:flex-none sm:w-auto h-11 px-5 rounded-xl font-bold bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-700 dark:hover:bg-emerald-600 text-white shadow-sm shadow-emerald-600/10"
                >
                  Approve
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
