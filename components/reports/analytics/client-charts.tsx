"use client";

import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

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
  category: string;
  confidence_value: number;
  knowledge_value: number;
}

interface ClientChartsProps {
  answers: Answer[];
}

export function ClientCharts({ answers }: ClientChartsProps) {
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

  const categories = Object.keys(categoryAverages);
  const confidenceAverages = categories.map(
    cat => categoryAverages[cat].confidenceSum / categoryAverages[cat].count
  );
  const knowledgeAverages = categories.map(
    cat => categoryAverages[cat].knowledgeSum / categoryAverages[cat].count
  );

  const data = {
    labels: categories,
    datasets: [
      {
        label: 'Average Confidence',
        data: confidenceAverages,
        backgroundColor: 'rgba(53, 162, 235, 0.5)',
      },
      {
        label: 'Average Knowledge',
        data: knowledgeAverages,
        backgroundColor: 'rgba(75, 192, 192, 0.5)',
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Average Confidence & Knowledge by Category',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 10,
      },
    },
  };

  return (
    <div className="w-full bg-card p-6 rounded-lg shadow-sm">
      <Bar options={options} data={data} />
    </div>
  );
} 