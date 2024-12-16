'use client';

import { Card } from "@/components/ui/card";

interface AnswerCategoryCardProps {
  category: string;
  answers: {
    text: string;
    category: string;
  }[];
}

// Define background colors for different categories
const categoryColors: Record<string, string> = {
  'Business Boosters': 'bg-blue-50',
  'Market Analysis': 'bg-green-50',
  'Financial Planning': 'bg-purple-50',
  'Operations': 'bg-orange-50',
  'Strategy': 'bg-pink-50',
  // Add more categories as needed
};

export function AnswerCategoryCard({ category, answers }: AnswerCategoryCardProps) {
  const bgColor = categoryColors[category] || 'bg-gray-50';

  return (
    <Card className={`p-6 ${bgColor} transition-colors`}>
      <h3 className="text-lg font-semibold mb-4">{category}</h3>
      <div className="space-y-3">
        {answers.map((answer, index) => (
          <div key={index} className="text-sm text-gray-600 leading-relaxed">
            {answer.text}
          </div>
        ))}
      </div>
    </Card>
  );
} 