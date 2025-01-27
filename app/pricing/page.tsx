import { Metadata } from 'next';
import { PricingCards } from '@/components/pricing/pricing-cards';

export const metadata: Metadata = {
  title: 'Pricing - SketchMyBiz',
  description: 'Choose the perfect plan for your business needs',
};

export default function PricingPage() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
          Simple, transparent pricing
        </h1>
        <p className="mt-6 text-lg leading-8 text-gray-600">
          Choose the plan that best fits your needs. All plans include a 14-day free trial.
        </p>
      </div>
      
      <PricingCards />
    </div>
  );
} 