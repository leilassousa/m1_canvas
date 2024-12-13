'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { MOCK_SLIDES } from './types';
import { ProgressBar } from './progress-bar';
import { CarouselNavigation } from './carousel-navigation';

export const OnboardingCarousel = () => {
  const [currentSlide, setCurrentSlide] = useState(1);
  const router = useRouter();

  const handlePrevious = () => {
    setCurrentSlide((prev) => Math.max(prev - 1, 1));
  };

  const handleNext = () => {
    setCurrentSlide((prev) => Math.min(prev + 1, MOCK_SLIDES.length));
  };

  const handleSkip = () => {
    router.push('/assessment');
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') handlePrevious();
      if (e.key === 'ArrowRight') handleNext();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center px-4 md:px-8 lg:px-12">
      {/* Top spacing */}
      <div className="w-full max-w-4xl pt-4 md:pt-6">
        <ProgressBar currentStep={currentSlide} totalSteps={MOCK_SLIDES.length} />
      </div>
      
      {/* Main carousel container */}
      <div className="w-full max-w-4xl flex-1 relative my-4 md:my-6 overflow-hidden">
        <div className="absolute inset-0">
          <div 
            className="relative h-full flex transition-transform duration-300 ease-in-out"
            style={{ transform: `translateX(-${(currentSlide - 1) * 100}%)` }}
          >
            {MOCK_SLIDES.map((slide) => (
              <div
                key={slide.id}
                className="w-full h-full flex-shrink-0 overflow-hidden"
                style={{ minWidth: '100%' }}
              >
                <div className="relative w-full h-full">
                  <Image
                    src={slide.imageUrl}
                    alt={slide.alt}
                    fill
                    className="object-contain"
                    priority
                  />
                </div>
              </div>
            ))}
          </div>

          <CarouselNavigation
            onPrevious={handlePrevious}
            onNext={handleNext}
            canGoPrevious={currentSlide > 1}
            canGoNext={currentSlide < MOCK_SLIDES.length}
          />
        </div>
      </div>

      {/* Bottom button container */}
      <div className="w-full max-w-4xl flex justify-center pb-4 md:pb-6">
        <button
          onClick={handleSkip}
          className="px-6 py-2.5 text-sm font-medium text-white bg-green-600 
                   square-full hover:bg-green-700 transition-colors duration-200
                   shadow-md hover:shadow-lg active:shadow-sm
                   transform hover:-translate-y-0.5 active:translate-y-0"
        >
          Finish Onboarding
        </button>
      </div>
    </div>
  );
};