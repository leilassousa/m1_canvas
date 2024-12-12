'use client';

import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface QuestionProps {
  question: {
    text: string;
    confidenceValue: number;
    knowledgeValue: number;
  };
  onConfidenceChange: (value: number) => void;
  onKnowledgeChange: (value: number) => void;
}

export function AssessmentQuestion({
  question,
  onConfidenceChange,
  onKnowledgeChange,
}: QuestionProps) {
  return (
    <div className="space-y-2">
      {/* Category and Preamble */}
      <div className="space-y-1">
        <h2 className="text-sm font-medium text-gray-900">Category</h2>
        <p className="text-sm text-gray-600">Preamble</p>
      </div>

      {/* Question */}
      <h3 className="text-xl font-medium text-gray-900 mb-4">Question</h3>

      <div className="grid grid-cols-[1fr,300px] gap-6">
        {/* Answer Input */}
        <Textarea 
          placeholder="Your answer here"
          className="min-h-[200px] resize-none border-gray-200"
        />

        {/* Monitor Section */}
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="text-center mb-4">
            <span className="text-sm font-medium">Monitor</span>
          </div>

          {/* Sliders Container */}
          <div className="flex justify-between space-x-8">
            {/* Confidence Slider */}
            <div className="flex flex-col items-center space-y-2">
              <div className="h-48 w-2 bg-gray-100 rounded-full relative">
                <div 
                  className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-4 bg-blue-500 rounded-full cursor-pointer"
                  style={{ 
                    bottom: `${question.confidenceValue}%`,
                  }}
                />
              </div>
              <span className="text-xs text-gray-600">Confidence</span>
            </div>

            {/* Knowledge Slider */}
            <div className="flex flex-col items-center space-y-2">
              <div className="h-48 w-2 bg-gray-100 rounded-full relative">
                <div 
                  className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-4 bg-red-500 rounded-full cursor-pointer"
                  style={{ 
                    bottom: `${question.knowledgeValue}%`,
                  }}
                />
              </div>
              <span className="text-xs text-gray-600">Knowledge</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}