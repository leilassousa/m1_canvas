'use client';

import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Settings } from 'lucide-react';

const updates = [
  {
    id: 1,
    version: 'System Update v2.1.0',
    description: 'Major performance improvements and bug fixes',
    date: 'Today',
    isNew: true,
  },
  {
    id: 2,
    version: 'New Analytics Dashboard',
    description: 'Enhanced data visualization tools and real-time metrics',
    date: 'Yesterday',
    isNew: false,
  },
];

export function SystemUpdates() {
  return (
    <Card className="p-6 bg-white">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Settings className="h-4 w-4" />
          <h2 className="text-base font-semibold">System Updates</h2>
        </div>
        <Badge variant="secondary" className="text-xs">4 Updates</Badge>
      </div>

      <div className="space-y-4">
        {updates.map((update) => (
          <div key={update.id} className="space-y-1">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-medium">{update.version}</h3>
              {update.isNew && (
                <Badge className="bg-orange-500 text-[10px] px-1.5 py-0.5">New</Badge>
              )}
            </div>
            <p className="text-xs text-gray-600">{update.description}</p>
            <p className="text-[10px] text-gray-400">{update.date}</p>
          </div>
        ))}
      </div>
    </Card>
  );
}