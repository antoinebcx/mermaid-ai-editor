import { Router } from 'express';
import { ChatController } from '../controllers/chat.controller';
import { ChatService } from '../services/chat.service';

const router = Router();
const chatController = new ChatController(new ChatService());

router.post('/', chatController.processMessage);

export default router;