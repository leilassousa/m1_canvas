export type Answer = {
  id: string;
  created_at: string;
  updated_at: string;
  assessment_id: string;
  question_id: string;
  value: string;
  text: string;
  category: string;
  confidence_level: number;
  knowledge_level: number;
};

export type CategoryGroup = {
  category: string;
  answers: Answer[];
};

export type AnalyticsData = {
  category: string;
  confidence_level: number;
  knowledge_level: number;
};

export type AIAnalysis = {
  summary: string;
  recommendations: string[];
  strengths: string[];
  areas_for_improvement: string[];
}; 