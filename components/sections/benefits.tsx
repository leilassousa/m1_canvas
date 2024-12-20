'use client';

import { Lightbulb, Target, Users, Rocket } from 'lucide-react';

const benefits = [
  {
    icon: Lightbulb,
    title: 'It is Visual and Intuitive',
    description: 'Making complex business concepts more accessible.'
  },
  {
    icon: Target,
    title: 'Helps Identify Gaps',
    description: 'without getting overwhelmed by details.'
  },
  {
    icon: Users,
    title: 'Flexibility',
    description: 'Test different ideas quickly, facilitate discussion with partners and team members.'
  },
  {
    icon: Rocket,
    title: 'People Friendly',
    description: 'Our minimalistic interface makes it easier for you to focus on what really matters.'
  }
];

export function BenefitsSection() {
  return (
    <div className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Use this tool if
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          You feel overwhelmed by business planning. Our assessment tool brings clarity and direction to busy entrepreneurs who want to work smarter, not harder.
          Here is why you should use it:
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