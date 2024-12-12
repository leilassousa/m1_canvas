'use client';

import { useState, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { Database } from '@/types/supabase';

type Question = Database['public']['Tables']['questions']['Row'];
type Answer = Database['public']['Tables']['answers']['Row'];
type Category = Database['public']['Tables']['categories']['Row'];
type Preamble = Database['public']['Tables']['preambles']['Row'];

interface AssessmentState {
  currentQuestionIndex: number;
  answers: Map<number, {
    text: string;
    knowledgeValue: number;
    confidenceValue: number;
  }>;
}

export function useAssessment(assessmentId: string) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [preambles, setPreambles] = useState<Preamble[]>([]);
  const [state, setState] = useState<AssessmentState>({
    currentQuestionIndex: 0,
    answers: new Map(),
  });

  const supabase = createClient();

  // Fetch assessment data
  const loadAssessment = useCallback(async () => {
    try {
      setLoading(true);
      
      // Fetch questions
      const { data: questionsData, error: questionsError } = await supabase
        .from('questions')
        .select('*')
        .eq('is_active', true)
        .order('category_id', { ascending: true });

      if (questionsError) throw questionsError;

      // Fetch categories
      const { data: categoriesData, error: categoriesError } = await supabase
        .from('categories')
        .select('*');

      if (categoriesError) throw categoriesError;

      // Fetch preambles
      const { data: preamblesData, error: preamblesError } = await supabase
        .from('preambles')
        .select('*');

      if (preamblesError) throw preamblesError;

      // Fetch existing answers if any
      const { data: answersData, error: answersError } = await supabase
        .from('answers')
        .select('*')
        .eq('assessment_id', assessmentId);

      if (answersError) throw answersError;

      // Initialize answers map with existing data
      const answersMap = new Map(
        answersData?.map(answer => [
          answer.question_id,
          {
            text: answer.text || '',
            knowledgeValue: answer.value || 0,
            confidenceValue: 0, // You might want to add this to your schema
          }
        ])
      );

      setQuestions(questionsData);
      setCategories(categoriesData);
      setPreambles(preamblesData);
      setState(prev => ({
        ...prev,
        answers: answersMap,
      }));

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load assessment');
    } finally {
      setLoading(false);
    }
  }, [assessmentId]);

  // Save answer
  const saveAnswer = useCallback(async (
    questionId: number,
    answer: {
      text: string;
      knowledgeValue: number;
      confidenceValue: number;
    }
  ) => {
    try {
      const { error } = await supabase
        .from('answers')
        .upsert({
          assessment_id: assessmentId,
          question_id: questionId,
          text: answer.text,
          value: answer.knowledgeValue,
          category: questions.find(q => q.id === questionId)?.category_id.toString() || '',
        });

      if (error) throw error;

      setState(prev => ({
        ...prev,
        answers: new Map(prev.answers.set(questionId, answer)),
      }));

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save answer');
    }
  }, [assessmentId, questions]);

  // Navigation
  const nextQuestion = useCallback(() => {
    setState(prev => ({
      ...prev,
      currentQuestionIndex: Math.min(prev.currentQuestionIndex + 1, questions.length - 1),
    }));
  }, [questions.length]);

  const previousQuestion = useCallback(() => {
    setState(prev => ({
      ...prev,
      currentQuestionIndex: Math.max(prev.currentQuestionIndex - 1, 0),
    }));
  }, []);

  return {
    loading,
    error,
    questions,
    categories,
    preambles,
    currentQuestion: questions[state.currentQuestionIndex],
    currentAnswer: state.answers.get(questions[state.currentQuestionIndex]?.id),
    hasNext: state.currentQuestionIndex < questions.length - 1,
    hasPrevious: state.currentQuestionIndex > 0,
    loadAssessment,
    saveAnswer,
    nextQuestion,
    previousQuestion,
  };
} 