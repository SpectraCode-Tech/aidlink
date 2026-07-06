"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { RefreshCw, AlertTriangle } from "lucide-react";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { DashboardStats } from "@/components/dashboard/dashboard-stats";
import PrimaryCampaignCard from "@/components/dashboard/primary-campaign-card";
import { RecentDonations } from "@/components/dashboard/recent-donations";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "https://aidlink-jhur.onrender.com";

interface CampaignData {
  title: string;
  description: string;
  image: string;
  category: string;
  raised: number;
  target: number;
}

interface StatMetrics {
  totalRaised: number;
  campaignCount: number;
  disbursedAmount: number;
}

interface DonationRecord {
  id: string;
  donorName: string;
  amount: number;
  createdAt: string;
}

export default function BeneficiaryDashboard() {
  const router = useRouter();
  const [userName, setUserName] = useState("");
  const [activeCampaign, setActiveCampaign] = useState<CampaignData | null>(
    null,
  );
  const [stats, setStats] = useState<StatMetrics | null>(null);
  const [donations, setDonations] = useState<DonationRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

useEffect(() => {
  const fetchDashboardState = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const token = localStorage.getItem("auth_token");
      if (!token) {
        router.push("/login");
        return;
      }

      const headers = { Authorization: `Bearer ${token}` };

      // 1. Fetch Core Profile & Campaign (Crucial for page rendering)
      try {
        const [profileRes, requestsRes] = await Promise.all([
          axios.get(`${API_BASE_URL}/auth/me`, { headers }),
          axios.get(`${API_BASE_URL}/requests?limit=1`, { headers }),
        ]);

        if (profileRes.data?.user) {
          setUserName(
            profileRes.data.user.name || profileRes.data.user.username,
          );
        }

        if (requestsRes.data && requestsRes.data.length > 0) {
          const latestRequest = requestsRes.data[0];
          setActiveCampaign({
            title: latestRequest.title,
            description: latestRequest.description,
            image: latestRequest.invoiceUrl,
            category: latestRequest.category,
            raised: latestRequest.raisedAmount || 0,
            target: latestRequest.targetAmount || 0,
          });
        }
      } catch (coreErr: any) {
        console.error("Critical core data failed to load:", coreErr);
        throw new Error(
          "We had trouble loading your profile. Please try refreshing the page.",
        );
      }

      // 2. Fetch Dashboard Statistics safely (Fails gracefully if route returns 404)
      try {
        const statsRes = await axios.get(
          `${API_BASE_URL}/requests/stats/summary`,
          { headers },
        );
        if (statsRes.data) {
          setStats({
            totalRaised: statsRes.data.totalRaised || 0,
            campaignCount: statsRes.data.campaignCount || 0,
            disbursedAmount: statsRes.data.disbursedAmount || 0,
          });
        }
      } catch (statsErr) {
        console.warn(
          "Stats endpoint is not ready or returned an error:",
          statsErr,
        );
        // Leaves state as null so <DashboardStats /> component can render empty states safely
      }

      // 3. Fetch Recent Donations safely (Fails gracefully if route returns 404)
      try {
        const donationsRes = await axios.get(
          `${API_BASE_URL}/payments/donations/recent`,
          { headers },
        );
        if (donationsRes.data) {
          setDonations(donationsRes.data);
        }
      } catch (donationsErr) {
        console.warn(
          "Recent donations endpoint is not ready or returned an error:",
          donationsErr,
        );
        // Leaves array empty so <RecentDonations /> displays an empty state message instead of a crash
      }
    } catch (err: any) {
      console.error("Dashboard fetch failure:", err);
      setError(
        err.message ||
          "We had trouble loading your dashboard. Please try refreshing the page.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  fetchDashboardState();
}, [router]);

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] w-full flex-col items-center justify-center gap-3">
        <RefreshCw className="h-6 w-6 animate-spin text-primary" />
        <p className="text-sm font-medium text-text-body/70">
          Loading your information...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto flex max-w-md flex-col items-center rounded-2xl border border-red-200 bg-red-50 p-6 text-center dark:border-red-900/30 dark:bg-red-950/10">
        <AlertTriangle className="h-8 w-8 text-red-500" />
        <h3 className="mt-3 text-base font-bold text-red-800 dark:text-red-400">
          Something went wrong
        </h3>
        <p className="mt-1 text-sm text-red-600 dark:text-red-400/80">
          {error}
        </p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 rounded-xl bg-red-600 px-4 py-2 text-sm font-bold text-white transition-all hover:bg-red-700"
        >
          Try again
        </button>
      </div>
    );
  }

  return (
    <div className="flex w-full max-w-7xl flex-col gap-8 mx-auto animate-in fade-in zoom-in-95 duration-500">
      <DashboardHeader userName={userName} />

      <DashboardStats metrics={stats} />

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <PrimaryCampaignCard campaignData={activeCampaign} />
        <RecentDonations history={donations} />
      </div>
    </div>
  );
}
