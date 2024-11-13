import { ChatMessage, ChatResponse } from '../types';

export class ChatService {
  async processMessage(message: string): Promise<string> {
    // here, integrate with AI service
    // for now, just return a simple diagram
    return `graph TD\n    A[User Input] --> B[Process]\n    B --> C[Response]\n    C --> D[Display]`;
  }
}