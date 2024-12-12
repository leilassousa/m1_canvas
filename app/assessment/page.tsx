'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Slider } from '@/components/ui/slider';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import type { Database } from '@/types/supabase';

interface Question {
  id: number;
  text: string;
  category_id: number;
}

interface Category {
  id: number;
  name: string;
  description: string;
}

interface Answer {
  question_id: number;
  text: string;
  confidence: number;
  knowledge: number;
}

export default function AssessmentPage() {
  const router = useRouter();
  const supabase = createClientComponentClient<Database>();
  
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [answers, setAnswers] = useState<Record<number, Answer>>({});
  
  // Fetch questions and categories
  useEffect(() => {
    const fetchData = async () => {
      // First check auth status
      const { data: { session } } = await supabase.auth.getSession();
      console.log('Auth session:', session);

      if (!session) {
        console.log('No auth session found');
        router.push('/auth'); // Redirect to login
        return;
      }

      console.log('Starting data fetch...');
      
      try {
        // Questions query
        const { data: questionsData, error: questionsError } = await supabase
          .from('questions')
          .select('*');

        console.log('Questions response:', { questionsData, questionsError });

        // Categories query
        const { data: categoriesData, error: categoriesError } = await supabase
          .from('categories')
          .select('*');

        console.log('Categories response:', { categoriesData, categoriesError });

        if (questionsError) {
          throw new Error(`Questions fetch error: ${questionsError.message}`);
        }

        if (categoriesError) {
          throw new Error(`Categories fetch error: ${categoriesError.message}`);
        }

        if (!questionsData || questionsData.length === 0) {
          console.warn('No questions found in the database');
        }

        if (!categoriesData || categoriesData.length === 0) {
          console.warn('No categories found in the database');
        }

        setQuestions(questionsData || []);
        setCategories(categoriesData || []);

      } catch (error) {
        console.error('Error in fetchData:', error);
        // Handle error state here
      }
    };

    fetchData();
  }, [supabase]);

  const currentQuestion = questions[currentQuestionIndex];
  const currentCategory = currentQuestion 
    ? categories.find(c => c.id === currentQuestion.category_id)
    : null;

  const handleAnswerChange = (questionId: number, field: keyof Answer, value: string | number) => {
    console.log(`Updating ${field} for question ${questionId}:`, value);
    
    setAnswers(prev => ({
      ...prev,
      [questionId]: {
        ...prev[questionId],
        question_id: questionId,
        [field]: value
      }
    }));
  };

  const handleNavigation = (index: number) => {
    console.log('Navigating to question:', index);
    setCurrentQuestionIndex(index);
  };

  const handleGenerateReport = async () => {
    console.log('Generating report with answers:', answers);
    // Implement report generation logic
  };

  if (!currentQuestion || !currentCategory) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Column A: Question and Answer */}
          <div className="space-y-6">
            <div className="bg-card rounded-lg p-6">
              <h2 className="text-2xl font-bold mb-4">{currentCategory.name}</h2>
              {currentCategory.description && (
                <p className="text-muted-foreground mb-6">
                  {currentCategory.description}
                </p>
              )}
              
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">
                  Question {currentQuestionIndex + 1} of {questions.length}
                </h3>
                <p className="text-foreground">{currentQuestion.text}</p>
                
                <Textarea
                  placeholder="Enter your answer..."
                  value={answers[currentQuestion.id]?.text || ''}
                  onChange={(e) => handleAnswerChange(currentQuestion.id, 'text', e.target.value)}
                  className="min-h-[150px]"
                />
              </div>
            </div>
          </div>

          {/* Column B: Sliders */}
          <div className="space-y-6">
            <div className="bg-card rounded-lg p-6">
              <div className="flex justify-center gap-12">
                <div className="flex flex-col items-center">
                  <label className="text-sm font-medium mb-4 block">
                    Confidence Level (1-10)
                  </label>
                  <div className="flex flex-col items-center">
                    <span className="text-lg font-semibold mb-2">
                      {answers[currentQuestion.id]?.confidence || 5}
                    </span>
                    <Slider
                      min={1}
                      max={10}
                      step={1}
                      value={[answers[currentQuestion.id]?.confidence || 5]}
                      onValueChange={([value]) => 
                        handleAnswerChange(currentQuestion.id, 'confidence', value)
                      }
                      orientation="vertical"
                      className="h-[300px] py-4"
                    />
                  </div>
                </div>

                <div className="flex flex-col items-center">
                  <label className="text-sm font-medium mb-4 block">
                    Knowledge Level (1-10)
                  </label>
                  <div className="flex flex-col items-center">
                    <span className="text-lg font-semibold mb-2">
                      {answers[currentQuestion.id]?.knowledge || 5}
                    </span>
                    <Slider
                      min={1}
                      max={10}
                      step={1}
                      value={[answers[currentQuestion.id]?.knowledge || 5]}
                      onValueChange={([value]) => 
                        handleAnswerChange(currentQuestion.id, 'knowledge', value)
                      }
                      orientation="vertical"
                      className="h-[300px] py-4"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Controls */}
        <div className="flex justify-between mt-6">
          <Button
            onClick={() => handleNavigation(currentQuestionIndex - 1)}
            disabled={currentQuestionIndex === 0}
          >
            Previous
          </Button>

          {currentQuestionIndex === questions.length - 1 ? (
            <Button onClick={handleGenerateReport}>
              Generate Report
            </Button>
          ) : (
            <Button
              onClick={() => handleNavigation(currentQuestionIndex + 1)}
              disabled={currentQuestionIndex === questions.length - 1}
            >
              Next
            </Button>
          )}
        </div>

        {/* Question Navigation */}
        <div className="mt-6 flex flex-wrap gap-2">
          {questions.map((_, index) => (
            <Button
              key={index}
              variant={currentQuestionIndex === index ? "default" : "outline"}
              size="sm"
              onClick={() => handleNavigation(index)}
            >
              {index + 1}
            </Button>
          ))}
        </div>
      </main>
    </div>
  );
}