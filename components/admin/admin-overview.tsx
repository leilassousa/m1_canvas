'use client';

import { Card } from '@/components/ui/card';
import { FolderTree, HelpCircle, Users } from 'lucide-react';

const stats = [
  {
    label: 'Total Categories',
    value: '12',
    icon: FolderTree,
    change: '+2 this week',
  },
  {
    label: 'Total Questions',
    value: '48',
    icon: HelpCircle,
    change: '+5 this week',
  },
  {
    label: 'Active Users',
    value: '156',
    icon: Users,
    change: '+12 this week',
  },
];

export function AdminOverview() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat) => (
          <Card key={stat.label} className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-orange-50 rounded-lg">
                <stat.icon className="h-6 w-6 text-orange-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
                <p className="text-sm text-gray-500">{stat.change}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}