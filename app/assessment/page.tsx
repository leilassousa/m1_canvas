'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Slider } from '@/components/ui/slider';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { toast } from '@/components/ui/use-toast';
import type { Database } from '@/types/supabase';
import { debounce } from 'lodash';

interface Question {
  id: number;
  text: string;
  category_id: number;
}

interface Category {
  id: number;
  name: string;
  description: string;
  preamble_id: number;
}

interface Preamble {
  id: number;
  content: string;
  category_id: number;
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
  const [preambles, setPreambles] = useState<Preamble[]>([]);
  const [answers, setAnswers] = useState<Record<number, Answer>>({});
  const [assessmentId, setAssessmentId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  
  // Initialize auto-save function
  const debouncedSave = debounce(async (answer: Answer) => {
    if (!assessmentId) return;
    
    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError || !user) {
        throw new Error('Authentication required');
      }

      console.log('Auto-saving answer:', {
        user_id: user.id,
        assessment_id: assessmentId,
        question_id: answer.question_id,
        text: answer.text || '',
        category: currentCategory?.name || '',
        confidence_value: answer.confidence_value,
        knowledge_value: answer.knowledge_value,
      });

      const { error: saveError } = await supabase
        .from('answers')
        .upsert({
          user_id: user.id,
          assessment_id: assessmentId,
          question_id: answer.question_id,
          text: answer.text || '',
          category: currentCategory?.name || '',
          confidence_value: answer.confidence_value,
          knowledge_value: answer.knowledge_value,
        });

      if (saveError) throw saveError;

      console.log('Answer auto-saved successfully');
    } catch (error) {
      console.error('Error auto-saving answer:', error);
      toast({
        title: "Auto-save Error",
        description: error instanceof Error ? error.message : "Failed to save answer automatically.",
        variant: "destructive",
      });
    }
  }, 1000);

  // Fetch questions, categories, and preambles
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

          if (assessmentError) throw assessmentError;
          
          console.log('Created new assessment:', assessment);
          setAssessmentId(assessment.id);
        }

        // Fetch questions, categories, and preambles
        const [
          { data: questionsData, error: questionsError },
          { data: categoriesData, error: categoriesError },
          { data: preamblesData, error: preamblesError }
        ] = await Promise.all([
          supabase.from('questions').select('*'),
          supabase.from('categories').select('*'),
          supabase.from('preambles').select('*')
        ]);

        if (questionsError) throw questionsError;
        if (categoriesError) throw categoriesError;
        if (preamblesError) throw preamblesError;

        setQuestions(questionsData || []);
        setCategories(categoriesData || []);
        setPreambles(preamblesData || []);

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
  const currentPreamble = currentCategory
    ? preambles.find(p => p.category_id === currentCategory.id)
    : null;

  const handleAnswerChange = (questionId: number, field: keyof Answer, value: string | number) => {
    console.log(`Updating ${field} for question ${questionId}:`, value);
    
    const updatedAnswer = {
      ...answers[questionId],
      question_id: questionId,
      confidence_value: answers[questionId]?.confidence_value || 5,
      knowledge_value: answers[questionId]?.knowledge_value || 5,
      text: answers[questionId]?.text || '',
      [field]: value
    };

    setAnswers(prev => ({
      ...prev,
      [questionId]: updatedAnswer
    }));

    // Trigger auto-save
    debouncedSave(updatedAnswer);
  };

  const handleNavigation = async (index: number) => {
    // Ensure current answer has values before navigation
    if (currentQuestion) {
      const currentAnswer = answers[currentQuestion.id] || {
        question_id: currentQuestion.id,
        confidence_value: 5,
        knowledge_value: 5,
        text: ''
      };
      
      // Save current state before navigation
      await debouncedSave(currentAnswer);
    }
    
    setCurrentQuestionIndex(index);
  };

  const handleGenerateReport = async () => {
    if (!assessmentId) return;

    try {
      // Update assessment status to completed
      const { data: updatedAssessment, error: updateError } = await supabase
        .from('assessments')
        .update({ status: 'completed' })
        .eq('id', assessmentId)
        .select()
        .single();

      if (updateError) throw updateError;

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
        <div className="grid grid-cols-1 gap-6">
          {/* Category and Preamble Section */}
          <div className="space-y-6">
            <div className="bg-card rounded-lg p-6">
              {/* Category Header */}
              <div className="border-b pb-4 mb-6">
                <h2 className="text-2xl font-bold mb-2">{currentCategory.name}</h2>
                {currentCategory.description && (
                  <p className="text-muted-foreground">
                    {currentCategory.description}
                  </p>
                )}
              </div>

              {/* Preamble Section */}
              {currentPreamble && (
                <div className="bg-muted p-4 rounded-md mb-6">
                  <p className="text-sm text-muted-foreground">{currentPreamble.content}</p>
                </div>
              )}

              {/* Question Section */}
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-2">
                    Question {currentQuestionIndex + 1} of {questions.length}
                  </h3>
                  <p className="text-foreground mb-4">{currentQuestion.text}</p>
                  
                  <Textarea
                    placeholder="Enter your answer..."
                    value={answers[currentQuestion.id]?.text || ''}
                    onChange={(e) => handleAnswerChange(currentQuestion.id, 'text', e.target.value)}
                    className="min-h-[150px]"
                  />
                </div>

                {/* Sliders Section */}
                <div className="grid grid-cols-2 gap-6 mt-6">
                  <div className="space-y-4">
                    <label className="text-sm font-medium block">
                      Confidence Level (1-10)
                    </label>
                    <div className="flex items-center gap-4">
                      <Slider
                        min={1}
                        max={10}
                        step={1}
                        value={[answers[currentQuestion.id]?.confidence_value || 5]}
                        onValueChange={([value]) => 
                          handleAnswerChange(currentQuestion.id, 'confidence_value', value)
                        }
                        className="w-full"
                      />
                      <span className="text-sm font-semibold w-8">
                        {answers[currentQuestion.id]?.confidence_value || 5}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <label className="text-sm font-medium block">
                      Knowledge Level (1-10)
                    </label>
                    <div className="flex items-center gap-4">
                      <Slider
                        min={1}
                        max={10}
                        step={1}
                        value={[answers[currentQuestion.id]?.knowledge_value || 5]}
                        onValueChange={([value]) => 
                          handleAnswerChange(currentQuestion.id, 'knowledge_value', value)
                        }
                        className="w-full"
                      />
                      <span className="text-sm font-semibold w-8">
                        {answers[currentQuestion.id]?.knowledge_value || 5}
                      </span>
                    </div>
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
            <Button 
              onClick={handleGenerateReport}
              className="bg-primary hover:bg-primary/90"
            >
              Complete & Generate Report
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