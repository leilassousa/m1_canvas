'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Monitor, Smartphone, Settings, Shield } from 'lucide-react';

const features = [
  {
    id: 'dashboard',
    icon: Monitor,
    title: 'Intuitive Dashboard',
    description: 'Get a bird\'s eye view of your business performance with our comprehensive dashboard.',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1950&q=80'
  },
  {
    id: 'mobile',
    icon: Smartphone,
    title: 'Mobile Ready',
    description: 'Access your business data on the go with our fully responsive mobile application.',
    image: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1950&q=80'
  },
  {
    id: 'customization',
    icon: Settings,
    title: 'Easy Customization',
    description: 'Tailor the platform to your needs with our powerful customization options.',
    image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?ixlib=rb-4.0.3&auto=format&fit=crop&w=1950&q=80'
  },
  {
    id: 'security',
    icon: Shield,
    title: 'Enterprise Security',
    description: 'Rest easy knowing your data is protected by enterprise-grade security measures.',
    image: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?ixlib=rb-4.0.3&auto=format&fit=crop&w=1950&q=80'
  }
];

export function ProductDemoSection() {
  const [activeTab, setActiveTab] = useState('dashboard');

  return (
    <div className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Experience the Power
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            See how our platform can transform your business operations with these key features
          </p>
        </div>

        <div className="max-w-6xl mx-auto">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
            <TabsList className="grid grid-cols-2 lg:grid-cols-4 gap-4 bg-transparent h-auto p-0">
              {features.map((feature) => (
                <TabsTrigger
                  key={feature.id}
                  value={feature.id}
                  className={`
                    flex flex-col items-center p-4 space-y-2 rounded-lg border-2 
                    data-[state=active]:border-orange-600 data-[state=active]:bg-white
                    hover:border-orange-400 transition-all
                  `}
                >
                  <feature.icon className="h-6 w-6 text-orange-600" />
                  <span className="font-medium">{feature.title}</span>
                </TabsTrigger>
              ))}
            </TabsList>

            {features.map((feature) => (
              <TabsContent key={feature.id} value={feature.id} className="mt-8">
                <div className="grid md:grid-cols-2 gap-8 items-center">
                  <div className="space-y-4">
                    <h3 className="text-2xl font-bold text-gray-900">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600">
                      {feature.description}
                    </p>
                    <Button className="bg-orange-600 hover:bg-orange-700 text-white">
                      Learn More
                    </Button>
                  </div>
                  <div className="rounded-lg overflow-hidden shadow-xl">
                    <img
                      src={feature.image}
                      alt={feature.title}
                      className="w-full h-[300px] object-cover"
                    />
                  </div>
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </div>
    </div>
  );
}