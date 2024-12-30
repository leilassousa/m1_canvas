'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FileQuestion, SlidersVertical, Bot, Share2 } from 'lucide-react';

const features = [
  {
    id: 'dashboard',
    icon: FileQuestion,
    title: 'Answer Simple Questions',
    description: 'Our tool guides you through each canvas section—Audience, Problem, Solution, Revenue, and more—prompting you with easy, intuitive questions.',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1950&q=80'
  },
  {
    id: 'mobile',
    icon: SlidersVertical,
    title: 'Track Confidence & Knowledge',
    description: 'We measure your comfort level after each question, so you know where you might need extra help or validation.',
    image: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1950&q=80'
  },
  {
    id: 'customization',
    icon: Bot,
    title: 'Get Personalized AI Insights',
    description: 'Once you’re done, our AI analyzes your answers and generates a clear, actionable report to help you fine-tune your strategy and next steps.',
    image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?ixlib=rb-4.0.3&auto=format&fit=crop&w=1950&q=80'
  },
  {
    id: 'security',
    icon: Share2,
    title: 'Download or Share',
    description: 'Download your one-page business canvas as a PDF or share it online to get feedback from partners, mentors, or investors.',
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
          How It Works
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            This is how our key features will work for you.
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