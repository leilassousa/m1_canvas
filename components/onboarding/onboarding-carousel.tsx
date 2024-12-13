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
    <div className="min-h-screen flex flex-col p-6 gap-6">
      <ProgressBar currentStep={currentSlide} totalSteps={MOCK_SLIDES.length} />
      
      <div className="flex-1 relative h-[600px] overflow-hidden">
        <div 
          className="absolute top-0 left-0 flex w-full h-full transition-transform duration-300 ease-in-out"
          style={{ transform: `translateX(-${(currentSlide - 1) * 100}%)` }}
        >
          {MOCK_SLIDES.map((slide) => (
            <div
              key={slide.id}
              className="w-full h-full flex-shrink-0"
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

      <button
        onClick={handleSkip}
        className="self-end px-4 py-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
      >
        Skip Onboarding
      </button>
    </div>
  );
};