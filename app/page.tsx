import { HeroSection } from '@/components/sections/hero';
import { BenefitsSection } from '@/components/sections/benefits';
import { ProductDemoSection } from '@/components/sections/product-demo';

export default function Home() {
  return (
    <div className="min-h-screen">
      <HeroSection />
      <BenefitsSection />
      <ProductDemoSection />
    </div>
  );
}