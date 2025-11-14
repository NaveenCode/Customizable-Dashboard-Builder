'use client';

import { useEffect } from 'react';
import useDashboardStore from '@/store/useDashboardStore';
import Navbar from '@/components/Navbar';
import DashboardLayout from '@/components/DashboardLayout';

export default function DashboardPage() {
  const loadDashboard = useDashboardStore((state) => state.loadDashboard);

  useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <DashboardLayout />
    </div>
  );
}
