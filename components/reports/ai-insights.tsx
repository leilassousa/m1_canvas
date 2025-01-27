'use client';

import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { ReportAgent, type ReportInsight } from '@/lib/agents/report-agent';
import { Badge } from '@/components/ui/badge';
import { ChevronDown, ChevronUp, Brain } from 'lucide-react';

interface AIInsightsProps {
  assessmentData: {
    answers: {
      category: string;
      confidence_value: number;
      knowledge_value: number;
      text: string;
    }[];
  };
}

export function AIInsights({ assessmentData }: AIInsightsProps) {
  const [insights, setInsights] = useState<ReportInsight[]>([]);
  const [recommendations, setRecommendations] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedCategories, setExpandedCategories] = useState<string[]>([]);

  useEffect(() => {
    async function generateInsights() {
      try {
        // Initialize agent with API key from environment
        const agent = new ReportAgent(process.env.NEXT_PUBLIC_OPENAI_API_KEY!);
        await agent.initialize();

        // Generate insights
        const generatedInsights = await agent.analyzeAssessment(assessmentData);
        setInsights(generatedInsights);

        // Generate overall recommendations
        const generatedRecommendations = await agent.generateRecommendations(generatedInsights);
        setRecommendations(generatedRecommendations);

      } catch (err) {
        console.error('Error generating insights:', err);
        setError('Failed to generate AI insights. Please try again later.');
      } finally {
        setLoading(false);
      }
    }

    generateInsights();
  }, [assessmentData]);

  const toggleCategory = (category: string) => {
    setExpandedCategories(prev =>
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-32 w-full" />
      </div>
    );
  }

  if (error) {
    return (
      <Card className="p-6 bg-destructive/10 text-destructive">
        <p>{error}</p>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-2">
        <Brain className="h-6 w-6 text-primary" />
        <h2 className="text-2xl font-semibold">AI Analysis</h2>
      </div>

      {/* Overall Recommendations */}
      <Card className="p-6">
        <h3 className="text-lg font-medium mb-4">Key Recommendations</h3>
        <ul className="space-y-2">
          {recommendations.map((rec, index) => (
            <li key={index} className="flex items-start gap-2">
              <span className="text-primary">•</span>
              <span>{rec}</span>
            </li>
          ))}
        </ul>
      </Card>

      {/* Category Insights */}
      <div className="space-y-4">
        {insights.map((insight) => (
          <Card key={insight.category} className="p-6">
            <button
              onClick={() => toggleCategory(insight.category)}
              className="w-full flex items-center justify-between"
            >
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-medium">{insight.category}</h3>
                <Badge variant="outline" className="text-xs">
                  {insight.strengths.length} strengths
                </Badge>
                <Badge variant="outline" className="text-xs">
                  {insight.weaknesses.length} areas for improvement
                </Badge>
              </div>
              {expandedCategories.includes(insight.category) ? (
                <ChevronUp className="h-5 w-5 text-gray-500" />
              ) : (
                <ChevronDown className="h-5 w-5 text-gray-500" />
              )}
            </button>

            {expandedCategories.includes(insight.category) && (
              <div className="mt-4 space-y-4">
                {/* Strengths */}
                <div>
                  <h4 className="font-medium text-green-600 mb-2">Strengths</h4>
                  <ul className="list-disc list-inside space-y-1">
                    {insight.strengths.map((strength, index) => (
                      <li key={index} className="text-sm">{strength}</li>
                    ))}
                  </ul>
                </div>

                {/* Weaknesses */}
                <div>
                  <h4 className="font-medium text-red-600 mb-2">Areas for Improvement</h4>
                  <ul className="list-disc list-inside space-y-1">
                    {insight.weaknesses.map((weakness, index) => (
                      <li key={index} className="text-sm">{weakness}</li>
                    ))}
                  </ul>
                </div>

                {/* Analysis */}
                <div>
                  <h4 className="font-medium text-gray-700 mb-2">Analysis</h4>
                  <div className="text-sm space-y-2">
                    <p>{insight.confidence_analysis}</p>
                    <p>{insight.knowledge_analysis}</p>
                  </div>
                </div>
              </div>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
} 