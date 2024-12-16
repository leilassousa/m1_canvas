'use client';

import { useEffect, useState, useMemo } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { toast } from '@/components/ui/use-toast';
import { AnswersGrid } from "@/components/reports/answer-grid/answers-grid";
import { ClientCharts } from "@/components/reports/analytics/client-charts";
import type { Database } from '@/types/supabase';
import { PrintableReport } from '@/components/reports/printable-report';
import { Button } from '@/components/ui/button';
import { Printer } from 'lucide-react';
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

interface Answer {
  id: string;
  text: string;
  category: string;
  confidence_value: number;
  knowledge_value: number;
  assessment_id: string;
}

export default function ReportPage() {
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClientComponentClient<Database>();

  // Calculate category averages for charts
  const { confidenceData, knowledgeData, chartOptions } = useMemo(() => {
    // Calculate averages by category
    const categoryAverages = answers.reduce((acc, answer) => {
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
  }, [answers]);

  const handlePrint = () => {
    // Add print-only class to body before printing
    document.body.classList.add('print-mode');
    
    // Print the document
    window.print();
    
    // Remove print-only class after printing
    document.body.classList.remove('print-mode');
    
    // Show success message
    toast({
      title: "Success",
      description: "Report downloaded successfully",
    });
  };

  useEffect(() => {
    async function fetchAnswers() {
      try {
        console.log('Fetching answers...'); // Debug log
        
        // First get the completed assessment IDs
        const { data: assessments, error: assessmentError } = await supabase
          .from('assessments')
          .select('id')
          .eq('status', 'completed');

        if (assessmentError) throw assessmentError;
        
        if (!assessments?.length) {
          console.log('No completed assessments found'); // Debug log
          setAnswers([]);
          return;
        }

        const assessmentIds = assessments.map(a => a.id);
        console.log('Found completed assessments:', assessmentIds); // Debug log

        // Then fetch answers for those assessments
        const { data, error } = await supabase
          .from('answers')
          .select(`
            id,
            text,
            category,
            confidence_value,
            knowledge_value,
            assessment_id
          `)
          .in('assessment_id', assessmentIds);

        if (error) throw error;
        
        console.log('Fetched answers:', data); // Debug log
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
      <div className="flex justify-between items-center mb-8 print:hidden">
        <h1 className="text-3xl font-bold">Assessment Report</h1>
        <Button 
          onClick={handlePrint}
          className="flex items-center gap-2"
        >
          <Printer className="h-4 w-4" />
          Download PDF
        </Button>
      </div>

      {/* Report content - visible both on screen and print */}
      <div className="print:block">
        {/* Title for print version */}
        <div className="hidden print:block mb-8">
          <h1 className="text-3xl font-bold text-center">Assessment Report</h1>
          <p className="text-center text-gray-500 mt-2">
            Generated on {new Date().toLocaleDateString()}
          </p>
        </div>

        {/* Answers Grid Section */}
        <section className="mb-12">
          <h2 className="mb-6 text-2xl font-semibold">Answers by Category</h2>
          <AnswersGrid answers={answers} />
        </section>

        {/* Analytics Section */}
        <section className="mb-12">
          <h2 className="mb-6 text-2xl font-semibold">Performance Analytics</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-card p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold mb-4 text-center">Confidence Levels by Category</h3>
              <Bar options={chartOptions} data={confidenceData} />
            </div>
            <div className="bg-card p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold mb-4 text-center">Knowledge Levels by Category</h3>
              <Bar options={chartOptions} data={knowledgeData} />
            </div>
          </div>
        </section>

        {/* AI Analysis Section - To be implemented */}
        <section className="mb-12">
          <h2 className="mb-6 text-2xl font-semibold">AI Analysis</h2>
          {/* TODO: Add AI analysis component */}
        </section>
      </div>
    </div>
  );
} 