'use client';

import { forwardRef } from 'react';
import { Bar } from 'react-chartjs-2';
import { Card } from '@/components/ui/card';

interface PrintableReportProps {
  assessment: {
    title: string;
    created_at: string;
  };
  answers: {
    id: string;
    text: string;
    category: string;
    confidence_value: number;
    knowledge_value: number;
  }[];
  categoryAverages: {
    confidenceData: any;
    knowledgeData: any;
    chartOptions: any;
  };
}

export const PrintableReport = forwardRef<HTMLDivElement, PrintableReportProps>(
  ({ assessment, answers, categoryAverages }, ref) => {
    const answersByCategory = answers.reduce((acc, answer) => {
      if (!acc[answer.category]) {
        acc[answer.category] = [];
      }
      acc[answer.category].push(answer);
      return acc;
    }, {} as Record<string, typeof answers>);

    return (
      <div ref={ref} className="p-8 bg-white">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Assessment Report</h1>
          <p className="text-gray-600 mt-2">
            {assessment.title} • Generated on {new Date().toLocaleDateString()}
          </p>
        </div>

        {/* Analytics */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-6">Performance Analytics</h2>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-medium mb-4">Confidence Levels</h3>
              <Bar options={categoryAverages.chartOptions} data={categoryAverages.confidenceData} />
            </div>
            <div>
              <h3 className="text-lg font-medium mb-4">Knowledge Levels</h3>
              <Bar options={categoryAverages.chartOptions} data={categoryAverages.knowledgeData} />
            </div>
          </div>
        </section>

        {/* Answers by Category */}
        <section>
          <h2 className="text-2xl font-semibold mb-6">Detailed Responses</h2>
          <div className="grid grid-cols-1 gap-6">
            {Object.entries(answersByCategory).map(([category, categoryAnswers]) => (
              <Card key={category} className="p-6">
                <h3 className="text-xl font-medium mb-4">{category}</h3>
                <div className="space-y-4">
                  {categoryAnswers.map((answer) => (
                    <div key={answer.id} className="text-sm text-gray-600">
                      {answer.text}
                    </div>
                  ))}
                </div>
              </Card>
            ))}
          </div>
        </section>
      </div>
    );
  }
);

PrintableReport.displayName = 'PrintableReport';