'use client';

import { Card } from "@/components/ui/card";

interface Answer {
  id: string;
  text: string;
  category: string;
}

interface AnswersGridProps {
  answers: Answer[];
}

export function AnswersGrid({ answers }: AnswersGridProps) {
  // Group answers by category
  const answersByCategory = answers.reduce((acc, answer) => {
    if (!acc[answer.category]) {
      acc[answer.category] = [];
    }
    acc[answer.category].push(answer);
    return acc;
  }, {} as Record<string, typeof answers>);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Object.entries(answersByCategory).map(([category, categoryAnswers]) => (
        <Card key={category} className="p-6 bg-card">
          <h3 className="text-lg font-semibold mb-4">{category}</h3>
          <div className="space-y-3">
            {categoryAnswers.map((answer) => (
              <div key={answer.id} className="text-sm text-gray-600 leading-relaxed">
                {answer.text}
              </div>
            ))}
          </div>
        </Card>
      ))}
    </div>
  );
} 