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

  // Sort categories alphabetically
  const categories = Object.keys(categoryAverages).sort();
  
  const confidenceData = {
    labels: categories,
    datasets: [{
      label: 'Confidence Level',
      data: categories.map(cat => 
        +(categoryAverages[cat].confidenceSum / categoryAverages[cat].count).toFixed(1)
      ),
      backgroundColor: 'rgba(53, 162, 235, 0.7)',
      borderRadius: 4,
    }]
  };

  const knowledgeData = {
    labels: categories,
    datasets: [{
      label: 'Knowledge Level',
      data: categories.map(cat => 
        +(categoryAverages[cat].knowledgeSum / categoryAverages[cat].count).toFixed(1)
      ),
      backgroundColor: 'rgba(75, 192, 192, 0.7)',
      borderRadius: 4,
    }]
  };

  const chartOptions = {
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
  };

  return (
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
  );
} 