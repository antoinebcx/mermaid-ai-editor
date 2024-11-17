import { Request, Response, NextFunction } from 'express';
import { ChatService } from '../services/chat.service';
import { ApiError } from '../middleware/error.middleware';

interface ChatRequest extends Request {
  body: {
    messages: Array<{
      role: 'user' | 'assistant';
      content: string;
    }>;
  }
}

export class ChatController {
  constructor(private chatService: ChatService) {}

  processMessage = async (req: ChatRequest, res: Response, next: NextFunction) => {
    try {
      const { messages } = req.body;
      
      if (!messages || !Array.isArray(messages)) {
        throw new ApiError(400, 'Valid messages array is required');
      }

      await this.chatService.streamResponse(messages, res);
      
    } catch (error) {
      if (error instanceof ApiError) {
        next(error);
      } else {
        console.error('Chat processing error:', error);
        next(new ApiError(500, 'An error occurred while processing your message'));
      }
    }
  };
}