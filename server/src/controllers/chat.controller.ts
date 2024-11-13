import { Request, Response, NextFunction } from 'express';
import { ChatService } from '../services/chat.service';
import { ApiError } from '../middleware/error.middleware';

export class ChatController {
  constructor(private chatService: ChatService) {}

  processMessage = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { message } = req.body;
      if (!message) {
        throw new ApiError(400, 'Message is required');
      }
      const response = await this.chatService.processMessage(message);
      res.json({ response });
    } catch (error) {
      next(error);
    }
  };
}