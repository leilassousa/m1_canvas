'use client';

import { useState } from 'react';
import { ReportsSection } from '@/components/dashboard/reports-section';
import { SystemUpdates } from '@/components/dashboard/system-updates';
import { FeaturedApps } from '@/components/dashboard/featured-apps';
import { DashboardNav } from '@/components/dashboard/dashboard-nav';
import { ContactForm } from '@/components/dashboard/contact-form';
import { ProtectedRoute } from '@/components/auth/protected-route';
import { useAuth } from '@/lib/auth/auth-context';

type TabType = 'reports' | 'account' | 'support';

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState<TabType>('reports');
  const { user, isAuthenticated } = useAuth();

  console.log('Dashboard Page State:', {
    activeTab,
    isAuthenticated,
    user
  });

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-[#FDF8F6] p-8">
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-[2fr,1fr] gap-6">
            {/* Column A - Main Content */}
            <div className="space-y-6">
              <DashboardNav activeTab={activeTab} onTabChange={setActiveTab} />
              
              <div className="bg-white rounded-lg p-6 shadow-sm">
                {activeTab === 'reports' && <ReportsSection />}
                {activeTab === 'account' && (
                  <div className="text-center py-8">
                    <h2 className="text-2xl font-semibold text-gray-700">Account Information</h2>
                    <p className="text-gray-500 mt-2">Coming soon...</p>
                  </div>
                )}
                {activeTab === 'support' && <ContactForm />}
              </div>
            </div>

            {/* Column B - Side Content */}
            <div className="space-y-8">
              <FeaturedApps />
              <SystemUpdates />
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}