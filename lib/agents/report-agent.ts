import { ChatOpenAI } from '@langchain/openai';
import { PromptTemplate } from '@langchain/core/prompts';
import { StringOutputParser } from '@langchain/core/output_parsers';

// Define interfaces
interface AssessmentData {
  answers: {
    category: string;
    confidence_value: number;
    knowledge_value: number;
    text: string;
  }[];
}

interface ReportInsight {
  category: string;
  strengths: string[];
  weaknesses: string[];
  recommendations: string[];
  confidence_analysis: string;
  knowledge_analysis: string;
}

// Create prompt templates
const categoryAnalysisPrompt = new PromptTemplate({
  template: `Analyze the following assessment data for category {category}:

Answers: {answers}

Confidence Values: {confidence_values}
Knowledge Values: {knowledge_values}

Please analyze the data and provide insights in the following JSON format:

{
  "strengths": [
    "List key strengths based on high scores and positive responses"
  ],
  "weaknesses": [
    "List areas for improvement based on low scores and gaps"
  ],
  "recommendations": [
    "Provide specific recommendations for improvement"
  ],
  "confidence_analysis": "Analyze the correlation between confidence scores",
  "knowledge_analysis": "Analyze the knowledge level demonstrated"
}

Ensure the response is a valid JSON object with all the required fields.`,
  inputVariables: ['category', 'answers', 'confidence_values', 'knowledge_values'],
});

export class ReportAgent {
  private llm: ChatOpenAI;
  private parser: StringOutputParser;

  constructor(apiKey: string) {
    this.llm = new ChatOpenAI({
      temperature: 0.3,
      modelName: 'gpt-4',
      openAIApiKey: apiKey,
    });
    this.parser = new StringOutputParser();
  }

  async initialize() {
    // No initialization needed
  }

  async analyzeAssessment(data: AssessmentData): Promise<ReportInsight[]> {
    const insights: ReportInsight[] = [];
    
    // Group answers by category
    const categorizedAnswers = data.answers.reduce((acc, answer) => {
      if (!acc[answer.category]) {
        acc[answer.category] = [];
      }
      acc[answer.category].push(answer);
      return acc;
    }, {} as Record<string, typeof data.answers>);

    // Analyze each category
    for (const [category, answers] of Object.entries(categorizedAnswers)) {
      const confidence_values = answers.map(a => a.confidence_value);
      const knowledge_values = answers.map(a => a.knowledge_value);
      
      try {
        const chain = categoryAnalysisPrompt.pipe(this.llm).pipe(this.parser);
        
        const result = await chain.invoke({
          category,
          answers: answers.map(a => a.text).join('\n'),
          confidence_values: confidence_values.join(', '),
          knowledge_values: knowledge_values.join(', '),
        });

        const insight = JSON.parse(result);
        insights.push({
          category,
          ...insight,
        });
      } catch (error) {
        console.error(`Error analyzing category ${category}:`, error);
      }
    }

    return insights;
  }

  async generateRecommendations(insights: ReportInsight[]): Promise<string[]> {
    const recommendationsPrompt = new PromptTemplate({
      template: `Based on the following insights, provide 3-5 key recommendations for improvement:

{insights}

Focus on actionable steps that address the main weaknesses while leveraging existing strengths.

Format your response as a numbered list (1., 2., etc.) with one recommendation per line.`,
      inputVariables: ['insights'],
    });

    try {
      const chain = recommendationsPrompt.pipe(this.llm).pipe(this.parser);
      
      const result = await chain.invoke({
        insights: JSON.stringify(insights, null, 2),
      });
      
      // Extract recommendations from the response
      const recommendations = result
        .split('\n')
        .filter((line: string) => line.trim().length > 0)
        .map((line: string) => line.replace(/^\d+\.\s*/, '').trim());

      return recommendations;
    } catch (error) {
      console.error('Error generating recommendations:', error);
      return [];
    }
  }
}

// Export types
export type { AssessmentData, ReportInsight }; 