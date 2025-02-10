'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

export function HeroSection() {
  console.log('Rendering HeroSection with local image');

  return (
    <div className="relative h-screen max-h-[800px] min-h-[600px] w-full overflow-hidden">
      {/* Background Image using Next/Image */}
      <div className="absolute inset-0">
        <Image
          src="/landing_page/plain_image.jpg"
          alt="Business assessment background"
          fill
          priority
          className="object-cover object-center"
          sizes="100vw"
          quality={100}
        />
        <div className="absolute inset-0 bg-black/70" />
      </div>

      {/* Content */}
      <div className="relative h-full w-full flex items-center">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl text-white">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
              Build Your Business Model in Minutes – Powered by AI
            </h1>
            <p className="text-lg md:text-xl mb-8 text-gray-100">
              Create a professional, structured business canvas with actionable insights for your business.
            </p>
            <Link href="/pricing">
              <Button 
                className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-2"
                size="lg"
              >
                Get Started
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}