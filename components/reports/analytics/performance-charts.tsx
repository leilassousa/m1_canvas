"use client";

import { Card } from "@/components/ui/card";
import { Answer, AnalyticsData } from "@/types/report-types";
import { calculateCategoryAverages } from "@/lib/utils/analytics";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface PerformanceChartsProps {
  answers: Answer[];
}

export const PerformanceCharts = ({ answers }: PerformanceChartsProps) => {
  const analyticsData = calculateCategoryAverages(answers);

  return (
    <div className="grid gap-6 md:grid-cols-2">
      {/* Confidence Levels Chart */}
      <Card className="p-6">
        <h3 className="mb-4 text-lg font-semibold">Confidence Levels by Category</h3>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={analyticsData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="category" 
                angle={-45}
                textAnchor="end"
                height={70}
                interval={0}
              />
              <YAxis domain={[0, 100]} />
              <Tooltip />
              <Bar
                dataKey="confidence_level"
                fill="#4F46E5"
                name="Confidence Level"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Knowledge Levels Chart */}
      <Card className="p-6">
        <h3 className="mb-4 text-lg font-semibold">Knowledge Levels by Category</h3>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={analyticsData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="category" 
                angle={-45}
                textAnchor="end"
                height={70}
                interval={0}
              />
              <YAxis domain={[0, 100]} />
              <Tooltip />
              <Bar
                dataKey="knowledge_level"
                fill="#10B981"
                name="Knowledge Level"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Analytics Summary */}
      <div className="md:col-span-2">
        <Card className="p-6">
          <h3 className="mb-4 text-lg font-semibold">Performance Summary</h3>
          <div className="grid gap-4 md:grid-cols-2">
            {analyticsData.map((data) => (
              <div
                key={data.category}
                className="rounded-lg border p-4"
              >
                <h4 className="font-medium text-gray-900">{data.category}</h4>
                <div className="mt-2 space-y-1 text-sm text-gray-600">
                  <p>Average Confidence: {data.confidence_level}%</p>
                  <p>Average Knowledge: {data.knowledge_level}%</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}; 