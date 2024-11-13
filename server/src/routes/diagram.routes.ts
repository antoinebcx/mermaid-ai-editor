import { Router } from 'express';
import { DiagramController } from '../controllers/diagram.controller';
import { DiagramService } from '../services/diagram.service';

const router = Router();
const diagramController = new DiagramController(new DiagramService());

router.post('/', diagramController.createDiagram);
router.get('/', diagramController.getAllDiagrams);

export default router;