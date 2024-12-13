import { ChevronLeft, ChevronRight } from 'lucide-react';

interface CarouselNavigationProps {
  onPrevious: () => void;
  onNext: () => void;
  canGoPrevious: boolean;
  canGoNext: boolean;
}

export const CarouselNavigation = ({
  onPrevious,
  onNext,
  canGoPrevious,
  canGoNext,
}: CarouselNavigationProps) => {
  return (
    <>
      <button
        onClick={onPrevious}
        disabled={!canGoPrevious}
        className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/80 shadow-lg hover:bg-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        aria-label="Previous slide"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>
      <button
        onClick={onNext}
        disabled={!canGoNext}
        className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/80 shadow-lg hover:bg-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        aria-label="Next slide"
      >
        <ChevronRight className="w-6 h-6" />
      </button>
    </>
  );
}; 