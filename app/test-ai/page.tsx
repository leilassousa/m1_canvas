'use client';

import { useEffect, useState } from 'react';
import { ReportAgent, type ReportInsight } from '@/lib/agents/report-agent';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ChevronDown, ChevronUp, Brain, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function TestAIPage() {
  const [insights, setInsights] = useState<ReportInsight[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [expandedCategories, setExpandedCategories] = useState<string[]>([]);

  const runTest = async () => {
    setLoading(true);
    setError(null);
    setInsights([]);
    
    try {
      const apiKey = process.env.NEXT_PUBLIC_ANTHROPIC_API_KEY;
      
      if (!apiKey) {
        throw new Error('Anthropic API key not configured. Please add NEXT_PUBLIC_ANTHROPIC_API_KEY to your environment variables.');
      }

      console.log('Starting test analysis...'); // Debug log
      const agent = new ReportAgent(apiKey);
      const results = await agent.testWithSampleAssessment();
      console.log('Analysis complete:', results); // Debug log
      
      if (!results.length) {
        throw new Error('No insights were generated. Please check the console for detailed logs.');
      }

      setInsights(results);
    } catch (err) {
      console.error('Error running test:', err);
      setError(
        err instanceof Error 
          ? `Error: ${err.message}\n\nPlease check the browser console for more details.` 
          : 'An unexpected error occurred while testing'
      );
    } finally {
      setLoading(false);
    }
  };

  const toggleCategory = (category: string) => {
    setExpandedCategories(prev =>
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  return (
    <div className="container mx-auto py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">AI Analysis Test</h1>
        <Button 
          onClick={runTest}
          disabled={loading}
          className="flex items-center gap-2"
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Analyzing...
            </>
          ) : (
            <>
              <Brain className="h-4 w-4" />
              Run Test Analysis
            </>
          )}
        </Button>
      </div>

      {error && (
        <Card className="p-6 mb-8 bg-destructive/10 text-destructive">
          <p className="whitespace-pre-wrap">{error}</p>
        </Card>
      )}

      {loading && (
        <div className="flex flex-col items-center justify-center py-12 space-y-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-lg text-muted-foreground">Analyzing sample data...</p>
        </div>
      )}

      {!loading && insights.length > 0 && (
        <div className="space-y-6">
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

                  {/* Recommendations */}
                  <div>
                    <h4 className="font-medium text-blue-600 mb-2">Recommendations</h4>
                    <ul className="list-disc list-inside space-y-1">
                      {insight.recommendations.map((rec, index) => (
                        <li key={index} className="text-sm">{rec}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
} 