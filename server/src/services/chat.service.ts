import Anthropic from '@anthropic-ai/sdk';
import { Response } from 'express';
import { config } from '../config';

export class ChatService {
  private anthropic: Anthropic;
  private readonly systemPrompt = `
    You build the most relevant and elegant Mermaid diagrams and flow charts.
    You return only Mermaid code for the diagram, nothing else.
  `.trim();

  constructor() {
    this.anthropic = new Anthropic({
      apiKey: config.ANTHROPIC_API_KEY,
    });
  }

  private appendInstructionsToLastUserMessage(
    messages: Array<{ role: 'user' | 'assistant'; content: string }>,
    instructions: string
  ) {
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

  async streamResponse(
    messages: Array<{ role: 'user' | 'assistant'; content: string }>, 
    res: Response
  ): Promise<void> {
    try {
      const additionalInstructions = `
        Build/adapt the most relevant and elegant Mermaid diagram for this request.
        Answer best the request, in code.
        Focus on the diagram structure and relevance of the components.
        Don’t add colors/style if not asked to.
        Return only the Mermaid code for the diagram, nothing else.
      `.trim();

      const updatedMessages = this.appendInstructionsToLastUserMessage(
        messages,
        additionalInstructions
      );

      res.writeHead(200, {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      });

      let accumulatedText = '';

      const stream = await this.anthropic.messages.stream({
        messages: updatedMessages,
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 1024,
        system: this.systemPrompt,
      });

      stream
        .on('text', (text) => {
          accumulatedText += text;
          res.write(`data: ${JSON.stringify({ type: 'content', text })}\n\n`);
        })
        .on('error', (error) => {
          console.error('Stream error:', error);
          res.write(`data: ${JSON.stringify({ type: 'error', error: error.message })}\n\n`);
          res.end();
        })
        .on('end', () => {
          res.write(`data: ${JSON.stringify({ type: 'done', text: accumulatedText })}\n\n`);
          res.end();
        });

    } catch (error) {
      console.error('Error in stream response:', error);
      res.write(`data: ${JSON.stringify({ type: 'error', error: 'Failed to generate response' })}\n\n`);
      res.end();
    }
  }
}