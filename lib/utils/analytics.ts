"use client";

import { Answer, AnalyticsData } from "@/types/report-types";

export const calculateCategoryAverages = (answers: Answer[]): AnalyticsData[] => {
  const categoryMap = new Map<string, { 
    confidenceSum: number; 
    knowledgeSum: number; 
    count: number 
  }>();

  // Calculate sums and counts for each category
  answers.forEach((answer) => {
    const current = categoryMap.get(answer.category) || {
      confidenceSum: 0,
      knowledgeSum: 0,
      count: 0,
    };

    categoryMap.set(answer.category, {
      confidenceSum: current.confidenceSum + answer.confidence_level,
      knowledgeSum: current.knowledgeSum + answer.knowledge_level,
      count: current.count + 1,
    });
  });

  // Convert to array and calculate averages
  return Array.from(categoryMap.entries()).map(([category, data]) => ({
    category,
    confidence_level: Math.round(data.confidenceSum / data.count),
    knowledge_level: Math.round(data.knowledgeSum / data.count),
  }));
}; 