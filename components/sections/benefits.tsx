'use client';

import { Lightbulb, Clock, Users, Wallet } from 'lucide-react';

const benefits = [
  {
    icon: Lightbulb,
    title: 'AI-Powered Insights',
    description: 'Get personalized recommendations and actionable insights to strengthen your business model.'
  },
  {
    icon: Clock,
    title: 'Save Time & Effort',
    description: 'Create a professional business canvas in minutes, not hours.'
  },
  {
    icon: Users,
    title: 'Collaborate with Ease',
    description: 'Share your canvas with your team or investors and collaborate in real-time.'
  },
  {
    icon: Wallet,
    title: 'Affordable & Accessible',
    description: 'No expensive consultants or complex software – just simple, affordable pricing.'
  }
];

export function BenefitsSection() {
  return (
    <div className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Why Choose Our Business Canvas Builder?
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Transform your business idea into a structured, actionable plan with our AI-powered platform.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {benefits.map((benefit, index) => (
            <div 
              key={index}
              className="p-6 text-center group hover:bg-orange-50 rounded-lg transition-colors duration-300"
            >
              <div className="inline-flex items-center justify-center w-12 h-12 mb-4 rounded-full bg-orange-100 text-orange-600 group-hover:bg-orange-200">
                <benefit.icon className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {benefit.title}
              </h3>
              <p className="text-gray-600">
                {benefit.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}