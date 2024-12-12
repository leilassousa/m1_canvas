'use client';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronRight } from 'lucide-react';

const reports = [
  {
    id: 1,
    name: 'BizCanvas Report',
    lastUpdated: '2024-01-15',
  },
  // Add more reports as needed
];

export function ReportsSection() {
  return (
    <Card className="p-6 bg-white h-[600px]">
      <div className="space-y-4">
        {reports.map((report) => (
          <div
            key={report.id}
            className="flex items-center justify-between py-3 border-b last:border-0"
          >
            <span className="text-sm font-medium text-gray-900">
              {report.name}
            </span>
            <Button variant="ghost" size="sm" className="text-gray-600">
              View
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>
    </Card>
  );
}