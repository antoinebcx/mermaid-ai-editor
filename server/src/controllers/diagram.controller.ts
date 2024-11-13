// for later
import { Request, Response, NextFunction } from 'express';
import { DiagramService } from '../services/diagram.service';
import { ApiError } from '../middleware/error.middleware';

export class DiagramController {
  constructor(private diagramService: DiagramService) {}

  createDiagram = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { diagram } = req.body;
      if (!diagram) {
        throw new ApiError(400, 'Diagram content is required');
      }
      const result = await this.diagramService.create(diagram);
      res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  };

  getAllDiagrams = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const diagrams = await this.diagramService.getAll();
      res.json(diagrams);
    } catch (error) {
      next(error);
    }
  };
}