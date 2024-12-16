'use client';

interface Answer {
  id: string;
  text: string;
  category: string;
  confidence_value: number;
  knowledge_value: number;
}

interface AnswersGridProps {
  answers: Answer[];
}

interface GroupedAnswers {
  [category: string]: Answer[];
}

export function AnswersGrid({ answers }: AnswersGridProps) {
  // Group answers by category
  const groupedAnswers: GroupedAnswers = answers.reduce((acc, answer) => {
    if (!acc[answer.category]) {
      acc[answer.category] = [];
    }
    acc[answer.category].push(answer);
    return acc;
  }, {} as GroupedAnswers);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Object.entries(groupedAnswers).map(([category, categoryAnswers]) => (
        <div key={category} className="bg-card rounded-lg p-6 shadow-sm">
          <h3 className="text-xl font-semibold mb-4">{category}</h3>
          <div className="space-y-4">
            {categoryAnswers.map((answer) => (
              <div key={answer.id} className="border-t pt-4">
                <p className="text-foreground">{answer.text}</p>
                <div className="flex justify-between mt-2 text-sm text-muted-foreground">
                  <span>Confidence: {answer.confidence_value}/10</span>
                  <span>Knowledge: {answer.knowledge_value}/10</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
} 