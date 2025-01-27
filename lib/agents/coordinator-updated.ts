import { ChatOpenAI } from 'langchain/chat_models/openai';
import { AgentExecutor, createOpenAIToolsAgent } from 'langchain/agents';

export class AssessmentCoordinator {
  private executor: AgentExecutor;
  private tools: Tool[];

  constructor(apiKey: string) {
    const model = new ChatOpenAI({ 
      modelName: 'gpt-4-turbo-preview',
      temperature: 0.1,
      openAIApiKey: apiKey 
    });

    this.tools = [
      new BusinessGridTool(model),
      new MarketAnalysisTool(model),
      new BusinessModelTool(model),
      new ProblemSolutionTool(model)
    ];

    this.initializeAgent(model);
  }

  private async initializeAgent(model: ChatOpenAI) {
    const prompt = await pull('hwchase17/openai-tools-agent');
    const agent = await createOpenAIToolsAgent({
      llm: model,
      tools: this.tools,
      prompt
    });

    this.executor = new AgentExecutor({
      agent,
      tools: this.tools,
      maxIterations: 3
    });
  }

  async analyzeAssessment(data: AssessmentData) {
    const gridSummary = await this.tools[0].call(JSON.stringify({
      categories: data.categories,
      responses: data.responses
    }));

    const [problemAnalysis, marketAnalysis, businessAnalysis] = await Promise.all([
      this.tools[3].call(JSON.stringify({
        problem: data.problemSection,
        solution: data.solutionSection,
        market: data.marketSection
      })),
      this.tools[1].call(JSON.stringify({
        audience: data.audienceSection,
        competitors: data.competitorSection,
        channels: data.channelSection
      })),
      this.tools[2].call(JSON.stringify({
        revenue: data.revenueSection,
        costs: data.costSection,
        value: data.valueSection
      }))
    ]);

    return {
      gridSummaries: gridSummary,
      detailedAnalysis: {
        problem: problemAnalysis,
        market: marketAnalysis,
        business: businessAnalysis
      },
      metadata: this.generateMetadata(data)
    };
  }

  private generateMetadata(data: AssessmentData) {
    return {
      timestamp: new Date().toISOString(),
      confidence: this.calculateConfidence(data),
      completeness: this.calculateCompleteness(data)
    };
  }
}