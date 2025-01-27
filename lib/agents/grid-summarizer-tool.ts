class BusinessGridTool extends Tool {
  name = 'business_grid_summary';
  description = 'Creates concise summaries for business canvas sections';

  private summarizePrompt = PromptTemplate.fromTemplate(`
    Analyze these business assessment responses and create a concise summary (30-50 words) for the business canvas:

    Category: {category}
    Responses: {responses}

    Focus on key insights and maintain actionable information.
    Consider confidence levels in the analysis.
    Format: Clear, direct statements about the core findings.
  `);

  async _call(input: string) {
    const { category, responses } = JSON.parse(input);
    
    const prompt = await this.summarizePrompt.format({
      category,
      responses: JSON.stringify(responses)
    });

    const result = await this.llm.predict(prompt);
    return result;
  }
}
