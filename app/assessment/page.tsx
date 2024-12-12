'use client';

import { AssessmentQuestion } from '@/components/assessment/assessment-question';
import { AssessmentNavigation } from '@/components/assessment/assessment-navigation';
import { useState } from 'react';

export default function AssessmentPage() {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  // This would come from your database
  const mockAssessment = {
    categories: [
      {
        id: 1,
        name: 'Business Strategy',
        preamble: 'Evaluate your current business strategy and planning processes.',
        questions: [
          {
            id: 1,
            text: 'How well defined is your business strategy?',
            confidenceValue: 50,
            knowledgeValue: 30,
          },
          // Add more questions as needed
        ],
      },
    ],
  };

  const currentCategory = mockAssessment.categories[0];
  const currentQuestion = currentCategory.questions[currentQuestionIndex];

  const handleNext = () => {
    if (currentQuestionIndex < currentCategory.questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-8 bg-[#FDF8F6]">
      <AssessmentQuestion
        question={currentQuestion}
        onConfidenceChange={(value) => console.log('Confidence:', value)}
        onKnowledgeChange={(value) => console.log('Knowledge:', value)}
      />

      <AssessmentNavigation
        onPrevious={handlePrevious}
        onNext={handleNext}
        showPrevious={currentQuestionIndex > 0}
        showNext={currentQuestionIndex < currentCategory.questions.length - 1}
      />
    </div>
  );
}