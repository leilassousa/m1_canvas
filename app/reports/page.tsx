'use client';

import { useEffect, useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { toast } from '@/components/ui/use-toast';
import { AnswersGrid } from "@/components/reports/answer-grid/answers-grid";
import { ClientCharts } from "@/components/reports/analytics/client-charts";
import type { Database } from '@/types/supabase';

interface Answer {
  id: string;
  text: string;
  category: string;
  confidence_value: number;
  knowledge_value: number;
}

export default function ReportPage() {
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClientComponentClient<Database>();

  useEffect(() => {
    async function fetchAnswers() {
      try {
        // Fetch answers from completed assessments
        const { data, error } = await supabase
          .from('answers')
          .select(`
            id,
            text,
            category,
            confidence_value,
            knowledge_value,
            assessments!inner(status)
          `)
          .eq('assessments.status', 'completed');

        if (error) throw error;
        setAnswers(data || []);
      } catch (error) {
        console.error('Error fetching answers:', error);
        toast({
          title: "Error",
          description: "Failed to load report data",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    }

    fetchAnswers();
  }, [supabase]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="mb-8 text-3xl font-bold">Assessment Report</h1>
      
      {/* Answers Grid Section */}
      <section className="mb-12">
        <h2 className="mb-6 text-2xl font-semibold">Answers by Category</h2>
        <AnswersGrid answers={answers} />
      </section>

      {/* Analytics Section */}
      <section className="mb-12">
        <h2 className="mb-6 text-2xl font-semibold">Performance Analytics</h2>
        <ClientCharts answers={answers} />
      </section>

      {/* AI Analysis Section - To be implemented */}
      <section className="mb-12">
        <h2 className="mb-6 text-2xl font-semibold">AI Analysis</h2>
        {/* TODO: Add AI analysis component */}
      </section>
    </div>
  );
} 