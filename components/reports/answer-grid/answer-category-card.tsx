import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CategoryGroup } from "@/types/report-types";

interface AnswerCategoryCardProps {
  categoryGroup: CategoryGroup;
}

export const AnswerCategoryCard = ({ categoryGroup }: AnswerCategoryCardProps) => {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-gray-900">
          {categoryGroup.category}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {categoryGroup.answers.map((answer) => (
            <div
              key={answer.id}
              className="rounded-lg bg-gray-50 p-3 transition-colors hover:bg-gray-100"
            >
              <p className="text-sm text-gray-700">{answer.text}</p>
              <div className="mt-2 flex items-center justify-between text-xs text-gray-500">
                <span>
                  Confidence: {answer.confidence_level}% | Knowledge:{" "}
                  {answer.knowledge_level}%
                </span>
                <span>
                  {new Date(answer.created_at).toLocaleDateString()}
                </span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}; 