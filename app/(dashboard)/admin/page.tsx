"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AdminHeader } from "@/components/admin/admin-header";
import { AdminStats } from "@/components/admin/admin-stats";
import { VerificationQueue } from "@/components/admin/verification-queue";
import { RecentActivity } from "@/components/admin/recent-activity";
import { RefreshCw } from "lucide-react";

export default function AdminDashboardPage() {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("auth_token");
    if (!token) {
      router.push("/login");
      return;
    }

    try {
      // Decode and verify the user role is ADMIN
      const base64Url = token.split(".")[1];
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
      const jsonPayload = JSON.parse(window.atob(base64));

      if (jsonPayload?.role?.toUpperCase() === "ADMIN") {
        setIsAuthorized(true);
      } else {
        // Kick out unauthorized roles back to home
        router.push("/");
      }
    } catch (err) {
      router.push("/login");
    }
  }, [router]);

  if (!isAuthorized) {
    return (
      <div className="flex min-h-[60vh] w-full flex-col items-center justify-center gap-3 p-4">
        <RefreshCw className="h-6 w-6 animate-spin text-primary" />
        <p className="text-sm font-medium text-slate-500 text-center">
          Verifying administrative access...
        </p>
      </div>
    );
  }

  return (
    <div className="flex w-full max-w-7xl flex-col gap-6 sm:gap-8 mx-auto p-4 sm:p-6 lg:p-8 animate-in fade-in zoom-in-95 duration-500 pb-12">
      <AdminHeader />
      <AdminStats />

      {/* Asymmetric grid: Adapts column weight natively to prevent awkward design gaps */}
      <div className="grid grid-cols-1 gap-6 sm:gap-8 lg:grid-cols-3 items-start">
        <div className="lg:col-span-2 w-full min-w-0">
          <VerificationQueue />
        </div>
        <div className="w-full min-w-0">
          <RecentActivity />
        </div>
      </div>
    </div>
  );
}
