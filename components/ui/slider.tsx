'use client';

import * as React from 'react';
import * as SliderPrimitive from '@radix-ui/react-slider';

import { cn } from '@/lib/utils';

const Slider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root>
>(({ className, ...props }, ref) => (
  <SliderPrimitive.Root
    ref={ref}
    className={cn(
      'relative flex touch-none select-none items-center',
      props.orientation === 'vertical' ? 'h-full flex-col' : 'w-full flex-row',
      className
    )}
    {...props}
  >
    <SliderPrimitive.Track
      className={cn(
        'relative grow rounded-full bg-gray-100 border border-gray-200',
        props.orientation === 'vertical' ? 'w-4' : 'h-4',
        'flex justify-center'
      )}
    >
      <SliderPrimitive.Range
        className={cn(
          'absolute rounded-full bg-orange-600',
          props.orientation === 'vertical' ? 'w-full' : 'h-full'
        )}
      />
    </SliderPrimitive.Track>
    <SliderPrimitive.Thumb
      className={cn(
        'block h-8 w-8 rounded-full border-3 border-orange-600',
        'bg-white shadow-md',
        props.orientation === 'vertical' ? '-translate-x-1/2 left-1/2' : '-translate-y-1/2',
        'hover:border-orange-500 hover:bg-orange-50',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2',
        'disabled:pointer-events-none disabled:opacity-50',
        'transition-all duration-100'
      )}
    />
  </SliderPrimitive.Root>
));

Slider.displayName = SliderPrimitive.Root.displayName;

export { Slider };
