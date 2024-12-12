'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, BarChart, Users, Settings, Rocket } from 'lucide-react';
import { cn } from '@/lib/utils';

const slides = [
  {
    title: 'Welcome to SketchMyBiz',
    description: 'Transform your business ideas into reality with our powerful platform.',
    icon: Rocket,
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1950&q=80'
  },
  {
    title: 'Track Your Progress',
    description: 'Monitor your business metrics and growth with our intuitive dashboard.',
    icon: BarChart,
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=1950&q=80'
  },
  {
    title: 'Collaborate with Your Team',
    description: 'Invite team members and work together seamlessly on your projects.',
    icon: Users,
    image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1950&q=80'
  },
  {
    title: 'Customize Your Experience',
    description: 'Tailor the platform to your needs with powerful customization options.',
    icon: Settings,
    image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?ixlib=rb-4.0.3&auto=format&fit=crop&w=1950&q=80'
  }
];

export function OnboardingCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  return (
    <div className="relative h-[calc(100vh-4rem)] bg-white">
      <div className="absolute inset-0 flex">
        {/* Image Section */}
        <div className="w-1/2 relative overflow-hidden">
          {slides.map((slide, index) => (
            <div
              key={index}
              className={cn(
                'absolute inset-0 transition-opacity duration-500',
                currentSlide === index ? 'opacity-100' : 'opacity-0'
              )}
            >
              <div
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: `url(${slide.image})` }}
              >
                <div className="absolute inset-0 bg-black/20" />
              </div>
            </div>
          ))}
        </div>

        {/* Content Section */}
        <div className="w-1/2 flex flex-col justify-center px-16">
          <div className="max-w-lg">
            {slides.map((slide, index) => (
              <div
                key={index}
                className={cn(
                  'transition-all duration-500 space-y-6',
                  currentSlide === index ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                )}
                style={{ display: currentSlide === index ? 'block' : 'none' }}
              >
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-orange-100">
                  <slide.icon className="h-8 w-8 text-orange-600" />
                </div>
                <h2 className="text-4xl font-bold text-gray-900">{slide.title}</h2>
                <p className="text-xl text-gray-600">{slide.description}</p>
              </div>
            ))}

            {/* Navigation */}
            <div className="mt-12 flex items-center space-x-4">
              <Button
                variant="outline"
                size="icon"
                onClick={prevSlide}
                className="rounded-full"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <div className="flex-1 flex items-center justify-center space-x-2">
                {slides.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentSlide(index)}
                    className={cn(
                      'w-2 h-2 rounded-full transition-all',
                      currentSlide === index
                        ? 'bg-orange-600 w-4'
                        : 'bg-gray-300 hover:bg-gray-400'
                    )}
                  />
                ))}
              </div>
              <Button
                variant="outline"
                size="icon"
                onClick={nextSlide}
                className="rounded-full"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}