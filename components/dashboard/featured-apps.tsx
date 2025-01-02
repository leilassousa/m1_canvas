'use client';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowUpRight } from 'lucide-react';

const featuredApps = [
  {
    id: 1,
    name: 'Analytics Pro',
    description: 'Advanced data analytics suite',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=1950&q=80',
  },
];

export function FeaturedApps() {
  return (
    <Card className="p-6 bg-white">
      <h2 className="text-base font-semibold mb-4">Announcements</h2>

      <div className="space-y-4">
        {featuredApps.map((app) => (
          <div key={app.id} className="space-y-3">
            <div className="aspect-[16/9] relative rounded-lg overflow-hidden">
              <img
                src={app.image}
                alt={app.name}
                className="object-cover w-full h-full"
              />
            </div>
            <div>
              <h3 className="font-medium text-sm">{app.name}</h3>
              <p className="text-xs text-gray-600">{app.description}</p>
            </div>
            <Button variant="outline" size="sm" className="w-full text-xs">
              Learn More
              <ArrowUpRight className="ml-2 h-3 w-3" />
            </Button>
          </div>
        ))}
      </div>
    </Card>
  );
}