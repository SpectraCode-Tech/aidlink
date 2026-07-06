"use client";

import React from "react";
import Image from "next/image";

interface CampaignProps {
  campaignData?: {
    title: string;
    description: string;
    image: string;
    category: string;
    raised: number;
    target: number;
  } | null;
}

export default function PrimaryCampaignCard({ campaignData }: CampaignProps) {
  // Safe Fallback Guard: Prevents runtime crash if data hasn't loaded or is missing
  if (!campaignData) {
    return (
      <div className="flex w-full items-center justify-center rounded-2xl border border-white/50 bg-white/40 backdrop-blur-xl p-8 text-center text-sm font-medium text-text-muted shadow-xl">
        <p>No active campaign details found at this time.</p>
      </div>
    );
  }

  // Fallback calculations to protect against NaN/0 issues
  const targetAmount = campaignData.target || 1;
  const raisedAmount = campaignData.raised || 0;
  const completionPercentage = Math.min(
    (raisedAmount / targetAmount) * 100,
    100,
  );

  return (
    <div className="flex flex-col sm:flex-row w-full gap-6 rounded-2xl border border-white/50 bg-white/40 backdrop-blur-xl p-5 shadow-xl transition-all duration-300 hover:shadow-2xl hover:border-white/80">
      {/* Container with relative styling required for layout='fill' Next.js images */}
      <div className="relative h-48 w-full sm:w-1/3 shrink-0 overflow-hidden rounded-xl bg-surface-dim shadow-inner">
        <Image
          src={campaignData.image || "/placeholder-campaign.jpg"}
          alt={campaignData.title || "Campaign cover image"}
          fill
          sizes="(max-width: 640px) 100vw, 33vw"
          priority
          className="object-cover transition-transform duration-500 hover:scale-105"
        />
        {campaignData.category && (
          <div className="absolute left-3 top-3 rounded-md bg-white/80 backdrop-blur-md px-2.5 py-1 text-xs font-semibold uppercase tracking-wider text-primary-700 shadow-sm">
            {campaignData.category}
          </div>
        )}
      </div>

      <div className="flex flex-col justify-between flex-1 py-1">
        <div>
          <h3 className="font-bold text-xl tracking-tight text-text-heading mb-2 line-clamp-1">
            {campaignData.title || "Untitled Campaign"}
          </h3>
          <p className="text-sm leading-relaxed text-text-muted line-clamp-2 mb-4">
            {campaignData.description ||
              "No description provided for this campaign."}
          </p>
        </div>

        <div>
          <div className="flex justify-between items-end text-xs font-medium mb-2">
            <span className="text-text-muted">
              Raised{" "}
              <strong className="text-sm font-bold text-text-heading">
                ${raisedAmount.toLocaleString()}
              </strong>
            </span>
            <span className="text-text-muted">
              Target: ${targetAmount.toLocaleString()}
            </span>
          </div>

          <div className="h-2 w-full rounded-full bg-black/5 overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-primary-500 to-primary-600 transition-all duration-500 ease-out"
              style={{ width: `${completionPercentage}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
