import { Request, Response, NextFunction } from 'express';
import { ChatService } from '../services/chat.service';
import { ApiError } from '../middleware/error.middleware';

interface ChatRequest extends Request {
  body: {
    message: string;
  }
}

export class ChatController {
  constructor(private chatService: ChatService) {}

  processMessage = async (req: ChatRequest, res: Response, next: NextFunction) => {
    try {
      const { message } = req.body;
      
      if (!message || typeof message !== 'string') {
        throw new ApiError(400, 'Valid message is required');
      }

      if (message.trim().length === 0) {
        throw new ApiError(400, 'Message cannot be empty');
      }

      const response = await this.chatService.generateResponse(message);

      res.status(200).json({
        success: true,
        data: {
          response,
          timestamp: new Date().toISOString(),
        }
      });

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