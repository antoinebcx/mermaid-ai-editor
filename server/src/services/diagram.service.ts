// for later
import { Diagram } from '../types';

export class DiagramService {
  // this would be a database
  private diagrams: Diagram[] = [];

  async create(content: string): Promise<Diagram> {
    const diagram: Diagram = {
      id: Date.now().toString(),
      content,
      created_at: new Date(),
      updated_at: new Date()
    };
    this.diagrams.push(diagram);
    return diagram;
  }

  async getAll(): Promise<Diagram[]> {
    return this.diagrams;
  }
}