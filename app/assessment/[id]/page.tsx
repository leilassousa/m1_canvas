'use client';

import { useEffect } from 'react';
import { useAssessment } from '@/lib/hooks/useAssessment';
import { AssessmentQuestion } from '@/components/assessment/assessment-question';
import { AssessmentNavigation } from '@/components/assessment/assessment-navigation';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

interface QuestionProps {
  id: number;
  text: string;
  category_id: number;
  is_active: boolean;
  question: string;
}

interface PageProps {
  params: {
    id: string;
  }
}

const handleAnswer = (answer: string) => {
  console.log('Answer submitted:', answer);
  // Add your answer handling logic here
}

export default function AssessmentPage({ params }: PageProps) {
  console.log('Assessment ID:', params.id);
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Assessment</h1>
      {/* Add your assessment content here */}
    </div>
  )
} 