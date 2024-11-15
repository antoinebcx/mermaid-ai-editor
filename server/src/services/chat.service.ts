import Anthropic from '@anthropic-ai/sdk';
import { config } from '../config';

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

  private appendInstructionsToLastUserMessage(
    messages: Array<{ role: 'user' | 'assistant'; content: string }>,
    instructions: string
  ): Array<{ role: 'user' | 'assistant'; content: string }> {
    return messages.map((message, index) => {
      if (message.role === 'user' && index === messages.length - 1) {
        return {
          ...message,
          content: `${message.content}\n\n${instructions}`,
        };
      }
      return message;
    });
  }

  async generateResponse(messages: Array<{ role: 'user' | 'assistant'; content: string }>): Promise<string> {
    try {
      const additionalInstructions = `
        Build/adapt the most relevant and elegant Mermaid flow chart for this request.
        Answer best the request, in code.
        Return only the Mermaid code for the flow chart, nothing else.
      `.trim();

      const updatedMessages = this.appendInstructionsToLastUserMessage(messages, additionalInstructions);

      console.log(updatedMessages)

      const response = await this.anthropic.messages.create({
        model: 'claude-3-5-sonnet-20241022',
        system: this.systemPrompt,
        max_tokens: 1024,
        messages: updatedMessages,
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