import Anthropic from '@anthropic-ai/sdk';
import { config } from '../config';

type ChatMessage = {
  role: 'user' | 'assistant';
  content: string;
};

export class ChatService {
  private anthropic: Anthropic;
  private readonly systemPrompt = `
    You build the most relevant and elegant Mermaid flow charts.
    You return only Mermaid code for the flow chart, nothing else.
  `.trim();

  constructor() {
    this.anthropic = new Anthropic({
      apiKey: config.ANTHROPIC_API_KEY,
    });
  }

  async generateResponse(userInput: string): Promise<string> {
    try {
      const userPrompt = `
        Build/adapt the most relevant and elegant Mermaid flow chart for this request.
        Answer best the request, in code.
        Return only the Mermaid code for the flow chart, nothing else.
        Request: ${userInput}
      `.trim();

      const messages = [
        {
          role: 'user' as const,
          content: userPrompt,
        },
      ];

      const response = await this.anthropic.messages.create({
        model: 'claude-3-5-sonnet-20241022',
        system: this.systemPrompt,
        max_tokens: 1024,
        messages,
      });

      const textBlock = response.content.find(block => block.type === 'text');
      if (!textBlock || !('text' in textBlock)) {
        throw new Error('No text content in response');
      }
      return textBlock.text;
    } catch (error) {
      console.error('Error generating response:', error);
      throw new Error('Failed to generate response from Claude');
    }
  }
}