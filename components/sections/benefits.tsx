'use client';

import { Lightbulb, Target, Users, Rocket } from 'lucide-react';

const benefits = [
  {
    icon: Lightbulb,
    title: 'Innovative Solutions',
    description: 'Custom strategies tailored to your unique business needs and goals.'
  },
  {
    icon: Target,
    title: 'Goal-Oriented',
    description: 'Focus on achieving measurable results and concrete business outcomes.'
  },
  {
    icon: Users,
    title: 'Expert Team',
    description: 'Access to experienced professionals across various domains.'
  },
  {
    icon: Rocket,
    title: 'Fast Implementation',
    description: 'Quick deployment of solutions to keep you ahead of the competition.'
  }
];

export function BenefitsSection() {
  return (
    <div className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Why Choose Us
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            We bring together the best practices and innovative approaches to help your business succeed.
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