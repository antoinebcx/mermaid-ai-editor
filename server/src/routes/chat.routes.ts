import { Router } from 'express';
import { ChatController } from '../controllers/chat.controller';
import { ChatService } from '../services/chat.service';

const router = Router();
const chatService = new ChatService();
const chatController = new ChatController(chatService);

router.post('/message', chatController.processMessage);

export default router;