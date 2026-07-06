"use client";

import React from 'react';
import { usePathname } from 'next/navigation';
import Sidebar from '@/components/dashboard/sidebar'; // Your Beneficiary Sidebar
import { AdminSidebar } from '../admin/admin-sidebar';
export function DynamicSidebar() {
  const pathname = usePathname();

  // Check if the current URL belongs to the admin section
  const isAdminRoute = pathname.startsWith('/admin');

  // Render the appropriate sidebar
  if (isAdminRoute) {
    return <AdminSidebar />;
  }

  return <Sidebar />;
}