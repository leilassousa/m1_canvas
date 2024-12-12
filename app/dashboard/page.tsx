'use client';

import { DashboardHeader } from '@/components/dashboard/dashboard-header';
import { ReportsSection } from '@/components/dashboard/reports-section';
import { SystemUpdates } from '@/components/dashboard/system-updates';
import { FeaturedApps } from '@/components/dashboard/featured-apps';

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-[#FDF8F6] p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <DashboardHeader />
        
        <div className="grid grid-cols-1 lg:grid-cols-[2fr,1fr] gap-8">
          <ReportsSection />
          <div className="space-y-8">
            <FeaturedApps />
            <SystemUpdates />
          </div>
        </div>
      </div>
    </div>
  );
}