'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Slider } from '@/components/ui/slider';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { toast } from '@/components/ui/use-toast';
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
  confidence_value: number;
  knowledge_value: number;
}

export default function AssessmentPage() {
  const router = useRouter();
  const supabase = createClientComponentClient<Database>();
  
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [answers, setAnswers] = useState<Record<number, Answer>>({});
  const [assessmentId, setAssessmentId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  
  // Fetch questions and categories
  useEffect(() => {
    const initializeAssessment = async () => {
      try {
        // First check auth status
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError || !session) {
          router.push('/auth');
          return;
        }

        // Create a new assessment if we don't have one
        if (!assessmentId) {
          const { data: assessment, error: assessmentError } = await supabase
            .from('assessments')
            .insert({
              status: 'draft',
              title: `Assessment ${new Date().toLocaleDateString()}`,
              user_id: session.user.id
            })
            .select()
            .single();

          if (assessmentError) {
            console.error('Assessment creation error:', assessmentError);
            throw assessmentError;
          }
          
          console.log('Created new assessment:', assessment);
          setAssessmentId(assessment.id);
        }

        // Fetch questions and categories
        const { data: questionsData, error: questionsError } = await supabase
          .from('questions')
          .select('*');

        const { data: categoriesData, error: categoriesError } = await supabase
          .from('categories')
          .select('*');

        if (questionsError) throw questionsError;
        if (categoriesError) throw categoriesError;

        setQuestions(questionsData || []);
        setCategories(categoriesData || []);

      } catch (error) {
        console.error('Error in initialization:', error);
        toast({
          title: "Error",
          description: error instanceof Error ? error.message : "Failed to load assessment. Please try again.",
          variant: "destructive",
        });
      }
    };

    initializeAssessment();
  }, [supabase, router, assessmentId]);

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

  const saveCurrentAnswer = async () => {
    if (!currentQuestion || !assessmentId) return;

    const currentAnswer = answers[currentQuestion.id];
    if (!currentAnswer) {
      toast({
        title: "Warning",
        description: "Please provide an answer before proceeding.",
        variant: "destructive",
      });
      return;
    }

    setIsSaving(true);
    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError || !user) {
        throw new Error('Authentication required');
      }

      console.log('Saving answer:', {
        user_id: user.id,
        assessment_id: assessmentId,
        question_id: currentQuestion.id,
        text: currentAnswer.text || '',
        category: currentCategory?.name || '',
        confidence_value: currentAnswer.confidence_value,
        knowledge_value: currentAnswer.knowledge_value,
      });

      const { data: savedAnswer, error: saveError } = await supabase
        .from('answers')
        .insert({
          user_id: user.id,
          assessment_id: assessmentId,
          question_id: currentQuestion.id,
          text: currentAnswer.text || '',
          category: currentCategory?.name || '',
          confidence_value: currentAnswer.confidence_value,
          knowledge_value: currentAnswer.knowledge_value,
        })
        .select()
        .single();

      if (saveError) {
        console.error('Save error details:', saveError);
        throw saveError;
      }

      console.log('Answer saved successfully:', savedAnswer);
      toast({
        title: "Success",
        description: "Answer saved successfully!",
      });

    } catch (error) {
      console.error('Error saving answer:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to save answer. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleNavigation = async (index: number) => {
    // Save current answer before navigation
    await saveCurrentAnswer();
    setCurrentQuestionIndex(index);
  };

  const handleGenerateReport = async () => {
    if (!assessmentId) return;

    try {
      // Save the final answer first
      await saveCurrentAnswer();

      // Update assessment status to completed
      const { data: updatedAssessment, error: updateError } = await supabase
        .from('assessments')
        .update({ status: 'completed' })
        .eq('id', assessmentId)
        .select()
        .single();

      if (updateError) {
        console.error('Error completing assessment:', updateError);
        throw updateError;
      }

      console.log('Assessment completed:', updatedAssessment);
      
      // Redirect to the report page
      router.push(`/reports/${assessmentId}`);

    } catch (error) {
      console.error('Error generating report:', error);
      toast({
        title: "Error",
        description: "Failed to complete assessment. Please try again.",
        variant: "destructive",
      });
    }
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

                <Button 
                  onClick={saveCurrentAnswer}
                  disabled={isSaving}
                  className="w-full"
                >
                  {isSaving ? 'Saving...' : 'Save Answer'}
                </Button>
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
                      {answers[currentQuestion.id]?.confidence_value || 5}
                    </span>
                    <Slider
                      min={1}
                      max={10}
                      step={1}
                      value={[answers[currentQuestion.id]?.confidence_value || 5]}
                      onValueChange={([value]) => 
                        handleAnswerChange(currentQuestion.id, 'confidence_value', value)
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
                      {answers[currentQuestion.id]?.knowledge_value || 5}
                    </span>
                    <Slider
                      min={1}
                      max={10}
                      step={1}
                      value={[answers[currentQuestion.id]?.knowledge_value || 5]}
                      onValueChange={([value]) => 
                        handleAnswerChange(currentQuestion.id, 'knowledge_value', value)
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
            disabled={currentQuestionIndex === 0 || isSaving}
          >
            Previous
          </Button>

          {currentQuestionIndex === questions.length - 1 ? (
            <Button 
              onClick={handleGenerateReport}
              disabled={isSaving}
              className="bg-primary hover:bg-primary/90"
            >
              Complete & Generate Report
            </Button>
          ) : (
            <Button
              onClick={() => handleNavigation(currentQuestionIndex + 1)}
              disabled={currentQuestionIndex === questions.length - 1 || isSaving}
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
              disabled={isSaving}
            >
              {index + 1}
            </Button>
          ))}
        </div>
      </main>
    </div>
  );
}