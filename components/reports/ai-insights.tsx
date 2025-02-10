'use client';

import { useEffect, useState, useMemo } from 'react';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { ReportAgent } from '@/lib/agents/report-agent';
import { Badge } from '@/components/ui/badge';
import { ChevronDown, ChevronUp, Brain, Loader2, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { toast } from '@/components/ui/use-toast';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface AIInsightsProps {
  assessmentData: {
    answers: {
      category: string;
      confidence_value: number;
      knowledge_value: number;
      text: string;
    }[];
  };
  assessmentId: string;
}

interface CategoryInsight {
  category: string;
  strengths: string[];
  weaknesses: string[];
  recommendations: string[];
  confidence_analysis: string;
  knowledge_analysis: string;
}

export function AIInsights({ assessmentData, assessmentId }: AIInsightsProps) {
  const [insights, setInsights] = useState<CategoryInsight[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [expandedCategories, setExpandedCategories] = useState<string[]>([]);
  const supabase = createClientComponentClient();

  const generateInsights = async () => {
    setGenerating(true);
    setError(null);
    
    try {
      const apiKey = process.env.NEXT_PUBLIC_ANTHROPIC_API_KEY;
      
      if (!apiKey) {
        throw new Error('Anthropic API key not configured');
      }

      // Get current user
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError) throw sessionError;
      if (!session?.user?.id) throw new Error('No authenticated user found');
      
      // Initialize agent and generate insights
      const agent = new ReportAgent(apiKey);
      const generatedInsights = await agent.analyzeAssessment(assessmentData);
      
      console.log('Generated new insights:', generatedInsights); // Debug log

      // First, delete any existing insights for this assessment
      const { error: deleteError } = await supabase
        .from('ai_insights')
        .delete()
        .eq('assessment_id', assessmentId)
        .eq('user_id', session.user.id);

      if (deleteError) {
        console.error('Error deleting old insights:', deleteError);
        throw new Error('Failed to clean up old insights');
      }
      
      // Then save the new insights
      const { error: saveError } = await supabase.from('ai_insights')
        .insert(
          generatedInsights.map(insight => ({
            assessment_id: assessmentId,
            user_id: session.user.id,
            category: insight.category,
            strengths: insight.strengths,
            weaknesses: insight.weaknesses,
            recommendations: insight.recommendations,
            confidence_analysis: insight.confidence_analysis,
            knowledge_analysis: insight.knowledge_analysis,
          }))
        );

      if (saveError) {
        console.error('Error saving insights:', saveError);
        throw new Error('Failed to save insights to database');
      }
      
      setInsights(generatedInsights);
      toast({
        title: "Success",
        description: "AI analysis generated and saved successfully",
      });
    } catch (err) {
      console.error('Error generating insights:', err);
      const errorMessage = err instanceof Error 
        ? err.message 
        : 'Failed to generate AI insights';
      setError(errorMessage);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setGenerating(false);
    }
  };

  // Load saved insights
  useEffect(() => {
    const loadInsights = async () => {
      try {
        // Get current user
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) throw sessionError;
        if (!session?.user?.id) throw new Error('No authenticated user found');

        const { data: savedInsights, error } = await supabase
          .from('ai_insights')
          .select('*')
          .eq('assessment_id', assessmentId)
          .eq('user_id', session.user.id)
          .order('category');  // Add ordering to ensure consistent order

        if (error) {
          console.error('Error fetching insights:', error);
          throw new Error('Failed to load saved insights');
        }

        if (savedInsights && savedInsights.length > 0) {
          console.log('Raw saved insights:', savedInsights); // Debug log
          
          // Create a Map to store unique insights by category
          const uniqueInsights = new Map();
          
          savedInsights.forEach(insight => {
            if (!uniqueInsights.has(insight.category)) {
              uniqueInsights.set(insight.category, {
                category: insight.category,
                strengths: insight.strengths as string[],
                weaknesses: insight.weaknesses as string[],
                recommendations: insight.recommendations as string[],
                confidence_analysis: insight.confidence_analysis,
                knowledge_analysis: insight.knowledge_analysis,
              });
            }
          });
          
          const formattedInsights = Array.from(uniqueInsights.values());
          console.log('Formatted unique insights:', formattedInsights); // Debug log
          
          setInsights(formattedInsights);
        } else {
          console.log('No saved insights found, generating new ones');
          // No saved insights, generate new ones
          await generateInsights();
        }
      } catch (err) {
        console.error('Error loading insights:', err);
        const errorMessage = err instanceof Error 
          ? err.message 
          : 'Failed to load AI insights';
        setError(errorMessage);
        toast({
          title: "Error",
          description: errorMessage,
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    if (assessmentId) {
      loadInsights();
    }
  }, [assessmentId, assessmentData, supabase]);

  const toggleCategory = (category: string) => {
    setExpandedCategories(prev =>
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  // Calculate category averages for charts
  const { confidenceData, knowledgeData, chartOptions } = useMemo(() => {
    // Calculate averages by category
    const categoryAverages = assessmentData.answers.reduce((acc, answer) => {
      if (!acc[answer.category]) {
        acc[answer.category] = {
          confidenceSum: 0,
          knowledgeSum: 0,
          count: 0,
        };
      }
      
      acc[answer.category].confidenceSum += answer.confidence_value;
      acc[answer.category].knowledgeSum += answer.knowledge_value;
      acc[answer.category].count += 1;
      
      return acc;
    }, {} as Record<string, { confidenceSum: number; knowledgeSum: number; count: number; }>);

    const categories = Object.keys(categoryAverages).sort();
    
    return {
      confidenceData: {
        labels: categories,
        datasets: [{
          label: 'Confidence Level',
          data: categories.map(cat => 
            +(categoryAverages[cat].confidenceSum / categoryAverages[cat].count).toFixed(1)
          ),
          backgroundColor: 'rgba(53, 162, 235, 0.7)',
          borderRadius: 4,
        }]
      },
      knowledgeData: {
        labels: categories,
        datasets: [{
          label: 'Knowledge Level',
          data: categories.map(cat => 
            +(categoryAverages[cat].knowledgeSum / categoryAverages[cat].count).toFixed(1)
          ),
          backgroundColor: 'rgba(75, 192, 192, 0.7)',
          borderRadius: 4,
        }]
      },
      chartOptions: {
        responsive: true,
        plugins: {
          legend: {
            display: false,
          },
          tooltip: {
            callbacks: {
              label: (context: any) => {
                return `${context.dataset.label}: ${context.parsed.y.toFixed(1)}/10`;
              },
            },
          },
        },
        scales: {
          y: {
            beginAtZero: true,
            max: 10,
            ticks: {
              stepSize: 1,
            },
          },
        },
      }
    };
  }, [assessmentData.answers]);

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Brain className="h-6 w-6 text-primary animate-pulse" />
          <h2 className="text-2xl font-semibold">Business Canvas Analysis</h2>
        </div>
        <Card className="p-6">
          <Skeleton className="h-8 w-48 mb-4" />
          <Skeleton className="h-24 w-full" />
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <Card className="p-6 bg-destructive/10">
        <div className="flex flex-col items-center gap-4">
          <p className="text-destructive">{error}</p>
          <Button 
            onClick={generateInsights} 
            disabled={generating}
            variant="outline"
            className="flex items-center gap-2"
          >
            {generating ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Retrying...
              </>
            ) : (
              <>
                <RefreshCw className="h-4 w-4" />
                Retry Analysis
              </>
            )}
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-12">
      {/* Performance Analytics Section */}
      <section>
        <h2 className="text-2xl font-semibold mb-6">Performance Analytics</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-card p-6 rounded-lg shadow-sm print-chart">
            <h3 className="text-lg font-semibold mb-4 text-center">Confidence Levels by Category</h3>
            <Bar options={chartOptions} data={confidenceData} />
          </div>
          <div className="bg-card p-6 rounded-lg shadow-sm print-chart">
            <h3 className="text-lg font-semibold mb-4 text-center">Knowledge Levels by Category</h3>
            <Bar options={chartOptions} data={knowledgeData} />
          </div>
        </div>
      </section>

      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Brain className="h-6 w-6 text-primary" />
          <h2 className="text-2xl font-semibold">Business Canvas Analysis</h2>
        </div>
        <Button
          onClick={generateInsights}
          disabled={generating}
          variant="outline"
          size="sm"
          className="flex items-center gap-2"
        >
          {generating ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Regenerating...
            </>
          ) : (
            <>
              <RefreshCw className="h-4 w-4" />
              Regenerate Analysis
            </>
          )}
        </Button>
      </div>

      {/* Category Insights */}
      <div className="space-y-4">
        {insights.map((insight, index) => (
          <Card key={`${insight.category}-${index}`} className="p-6">
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
                    {insight.strengths.map((strength, strengthIndex) => (
                      <li key={`${insight.category}-strength-${strengthIndex}`} className="text-sm">{strength}</li>
                    ))}
                  </ul>
                </div>

                {/* Weaknesses */}
                <div>
                  <h4 className="font-medium text-red-600 mb-2">Areas for Improvement</h4>
                  <ul className="list-disc list-inside space-y-1">
                    {insight.weaknesses.map((weakness, weaknessIndex) => (
                      <li key={`${insight.category}-weakness-${weaknessIndex}`} className="text-sm">{weakness}</li>
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
                    {insight.recommendations.map((rec, recIndex) => (
                      <li key={`${insight.category}-rec-${recIndex}`} className="text-sm">{rec}</li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
} 