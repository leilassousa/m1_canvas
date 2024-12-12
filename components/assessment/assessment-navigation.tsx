'use client';

import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface NavigationProps {
  onPrevious: () => void;
  onNext: () => void;
  showPrevious: boolean;
  showNext: boolean;
}

export function AssessmentNavigation({
  onPrevious,
  onNext,
  showPrevious,
  showNext,
}: NavigationProps) {
  return (
    <div className="flex justify-between items-center pt-6">
      <Button
        variant="secondary"
        onClick={onPrevious}
        disabled={!showPrevious}
        className="bg-gray-100 hover:bg-gray-200 text-gray-700"
      >
        <ChevronLeft className="h-4 w-4 mr-1" />
        previous
      </Button>

      <Button
        onClick={onNext}
        disabled={!showNext}
        className="bg-gray-100 hover:bg-gray-200 text-gray-700"
      >
        next
        <ChevronRight className="h-4 w-4 ml-1" />
      </Button>
    </div>
  );
}