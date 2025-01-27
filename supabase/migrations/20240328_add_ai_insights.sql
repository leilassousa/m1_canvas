-- Create AI insights table
CREATE TABLE ai_insights (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  assessment_id UUID NOT NULL REFERENCES assessments(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  category TEXT NOT NULL,
  strengths JSONB NOT NULL DEFAULT '[]',
  weaknesses JSONB NOT NULL DEFAULT '[]',
  recommendations JSONB NOT NULL DEFAULT '[]',
  confidence_analysis TEXT,
  knowledge_analysis TEXT
);

-- Enable RLS
ALTER TABLE ai_insights ENABLE ROW LEVEL SECURITY;

-- Create policy for users to read their own insights
CREATE POLICY "Users can view their own insights"
  ON ai_insights
  FOR SELECT
  USING (auth.uid() = user_id);

-- Create policy for users to insert their own insights
CREATE POLICY "Users can insert their own insights"
  ON ai_insights
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Create policy for users to update their own insights
CREATE POLICY "Users can update their own insights"
  ON ai_insights
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Create policy for users to delete their own insights
CREATE POLICY "Users can delete their own insights"
  ON ai_insights
  FOR DELETE
  USING (auth.uid() = user_id);

-- Create index for faster lookups
CREATE INDEX ai_insights_assessment_id_idx ON ai_insights(assessment_id);
CREATE INDEX ai_insights_user_id_idx ON ai_insights(user_id); 