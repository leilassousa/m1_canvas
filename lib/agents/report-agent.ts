import { Anthropic } from '@anthropic-ai/sdk';

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

export class ReportAgent {
  private client: Anthropic;

  constructor(apiKey: string) {
    this.client = new Anthropic({
      apiKey: apiKey,
      dangerouslyAllowBrowser: true // Enable browser usage
    });
  }

  private formatPrompt(
    category: string,
    answers: string[],
    confidence_values: number[],
    knowledge_values: number[]
  ): string {
    return `You are analyzing a business canvas category. Here's the data:

Category: ${category}

Responses:
${answers.map(a => `- ${a}`).join('\n')}

Metrics:
- Confidence Scores: ${confidence_values.join(', ')}
- Knowledge Scores: ${knowledge_values.join(', ')}

Based on this data, provide a structured analysis in the following JSON format:

{
  "strengths": [
    "List specific strengths identified from the responses and high scores"
  ],
  "weaknesses": [
    "List specific areas for improvement based on responses and low scores"
  ],
  "recommendations": [
    "Provide actionable recommendations for improvement"
  ],
  "confidence_analysis": "Provide a brief analysis of the confidence scores and what they indicate",
  "knowledge_analysis": "Provide a brief analysis of the knowledge scores and their implications"
}

Remember to:
1. Base strengths on high scores (7-10) and positive response content
2. Base weaknesses on lower scores (1-6) and gaps in responses
3. Make recommendations specific and actionable
4. Keep analysis concise but insightful

Return only valid JSON without any additional text or formatting.`;
  }

  private async generateCompletion(prompt: string): Promise<string> {
    try {
      const response = await this.client.messages.create({
        model: "claude-3-opus-20240229",
        max_tokens: 1000,
        temperature: 0.3,
        system: "You are a business analysis expert. Your task is to analyze business canvas data and provide insights in valid JSON format. Focus on being specific, actionable, and data-driven in your analysis.",
        messages: [
          {
            role: "user",
            content: prompt
          }
        ]
      });

      const textContent = response.content.find(
        (c) => c.type === 'text'
      );

      if (!textContent || typeof textContent.text !== 'string') {
        throw new Error('No valid text response received from Claude');
      }

      // Ensure we have valid JSON
      try {
        JSON.parse(textContent.text);
        return textContent.text;
      } catch (e) {
        console.error('Invalid JSON received:', textContent.text);
        throw new Error('Response was not in valid JSON format');
      }
    } catch (error) {
      console.error('Error generating completion:', error);
      throw error;
    }
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
        console.log(`Analyzing category: ${category}`); // Debug log
        console.log('Answers:', answers.map(a => a.text)); // Debug log
        console.log('Confidence values:', confidence_values); // Debug log
        console.log('Knowledge values:', knowledge_values); // Debug log

        const prompt = this.formatPrompt(
          category,
          answers.map(a => a.text),
          confidence_values,
          knowledge_values
        );

        console.log('Generated prompt:', prompt); // Debug log

        const result = await this.generateCompletion(prompt);
        console.log('Raw result:', result); // Debug log

        const insight = JSON.parse(result);
        insights.push({
          category,
          ...insight,
        });
      } catch (error) {
        console.error(`Error analyzing category ${category}:`, error);
        // Add a placeholder insight for failed categories
        insights.push({
          category,
          strengths: [],
          weaknesses: ['Analysis failed - please try again'],
          recommendations: ['Please retry the analysis'],
          confidence_analysis: 'Analysis failed',
          knowledge_analysis: 'Analysis failed',
        });
      }
    }

    return insights;
  }

  async generateRecommendations(insights: ReportInsight[]): Promise<string[]> {
    const prompt = `Based on the following insights, provide 3-5 key recommendations for improvement:

${JSON.stringify(insights, null, 2)}

Focus on actionable steps that address the main weaknesses while leveraging existing strengths.

Format your response as a numbered list (1., 2., etc.) with one recommendation per line.`;

    try {
      const result = await this.generateCompletion(prompt);
      
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

  async testWithSampleAssessment(): Promise<ReportInsight[]> {
    const sampleData: AssessmentData = {
      answers: [
        {
          category: "Value Proposition",
          confidence_value: 8,
          knowledge_value: 7,
          text: "Our product offers AI-powered business analytics that simplifies complex data into actionable insights. We focus on making enterprise-level analytics accessible to small and medium businesses."
        },
        {
          category: "Value Proposition",
          confidence_value: 7,
          knowledge_value: 8,
          text: "We differentiate through our user-friendly interface and automated report generation, saving businesses up to 20 hours per month on data analysis."
        },
        {
          category: "Customer Segments",
          confidence_value: 9,
          knowledge_value: 8,
          text: "Primary target: Small to medium-sized businesses (10-200 employees) in the retail and e-commerce sectors who need data analytics but can't afford enterprise solutions."
        },
        {
          category: "Customer Segments",
          confidence_value: 6,
          knowledge_value: 5,
          text: "Secondary market: Startups in the tech sector who need to make data-driven decisions but lack dedicated data teams."
        },
        {
          category: "Revenue Streams",
          confidence_value: 7,
          knowledge_value: 6,
          text: "Subscription-based model with three tiers: Basic ($49/month), Professional ($149/month), and Enterprise ($499/month). Additional revenue from custom integration services."
        },
        {
          category: "Revenue Streams",
          confidence_value: 5,
          knowledge_value: 4,
          text: "Considering implementing usage-based pricing for specific features and data processing volumes."
        },
        {
          category: "Key Resources",
          confidence_value: 8,
          knowledge_value: 7,
          text: "Core AI/ML team of 5 engineers, cloud infrastructure on AWS, proprietary data processing algorithms, and established partnerships with data providers."
        },
        {
          category: "Key Resources",
          confidence_value: 6,
          knowledge_value: 6,
          text: "Customer success team of 3 people, marketing team of 2, and ongoing development of automated onboarding systems."
        }
      ]
    };

    console.log('Starting sample assessment analysis...'); // Debug log
    const insights = await this.analyzeAssessment(sampleData);
    console.log('Generated insights:', JSON.stringify(insights, null, 2)); // Debug log

    return insights;
  }
}

// Export types
export type { AssessmentData, ReportInsight }; 