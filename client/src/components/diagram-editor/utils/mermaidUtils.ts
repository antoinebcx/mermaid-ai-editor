import { ElementType, MermaidElement } from '../types';

type NodeShape = {
  start: string;
  end: string;
  type: ElementType;
  atomicMarkers?: boolean;
};

const NODE_SHAPES: Record<ElementType, NodeShape> = {
  default: {
    start: '[',
    end: ']',
    type: 'default',
  },
  participant: {
    start: '(',
    end: ')',
    type: 'participant',
  },
  decision: {
    start: '{',
    end: '}',
    type: 'decision',
  },
  note: {
    start: '>',
    end: ']',
    type: 'note',
  },
  action: {
    start: '((',
    end: '))',
    type: 'action',
    atomicMarkers: true
  },
  loop: {
    start: '[[',
    end: ']]',
    type: 'loop',
    atomicMarkers: true
  }
};

function findNodeInLine(line: string, nodeId: string): { text: string; type: ElementType; startPos: number; endPos: number } | null {
  const nodeStart = line.indexOf(nodeId);
  if (nodeStart === -1) return null;

  const startPos = nodeStart + nodeId.length;
  const restOfLine = line.slice(startPos);
  
  for (const shape of Object.values(NODE_SHAPES)) {
    if (!shape.atomicMarkers) continue;
    
    if (restOfLine.startsWith(shape.start)) {
      const endPos = restOfLine.indexOf(shape.end);
      if (endPos !== -1) {
        return {
          type: shape.type,
          text: restOfLine.slice(shape.start.length, endPos),
          startPos,
          endPos: startPos + endPos + shape.end.length
        };
      }
    }
  }

  for (const shape of Object.values(NODE_SHAPES)) {
    if (shape.atomicMarkers) continue;
    
    if (restOfLine.startsWith(shape.start)) {
      const endPos = restOfLine.indexOf(shape.end);
      if (endPos !== -1) {
        return {
          type: shape.type,
          text: restOfLine.slice(shape.start.length, endPos),
          startPos,
          endPos: startPos + endPos + shape.end.length
        };
      }
    }
  }

  return null;
}

export function findNodeDefinition(code: string, nodeId: string): { text: string; type: ElementType } | null {
  const lines = code.split('\n');
  
  for (const line of lines) {
    const node = findNodeInLine(line, nodeId);
    if (node) {
      return {
        text: node.text,
        type: node.type
      };
    }
  }
  
  return null;
}

export function updateNodeShape(code: string, nodeId: string, newType: ElementType): string {
  const lines = code.split('\n');
  const shape = NODE_SHAPES[newType];
  if (!shape) return code;

  for (let i = 0; i < lines.length; i++) {
    const node = findNodeInLine(lines[i], nodeId);
    if (!node) continue;

    const line = lines[i];
    const beforeNode = line.slice(0, node.startPos);
    const afterNode = line.slice(node.endPos);
    
    lines[i] = beforeNode + shape.start + node.text + shape.end + afterNode;
    return lines.join('\n');
  }

  return code;
}

export function updateNodeText(code: string, nodeId: string, newText: string): string {
  const lines = code.split('\n');

  for (let i = 0; i < lines.length; i++) {
    const node = findNodeInLine(lines[i], nodeId);
    if (!node) continue;

    const line = lines[i];
    const shape = Object.values(NODE_SHAPES).find(s => s.type === node.type);
    if (!shape) continue;

    const beforeNode = line.slice(0, node.startPos);
    const afterNode = line.slice(node.endPos);
    
    lines[i] = beforeNode + shape.start + newText + shape.end + afterNode;
    return lines.join('\n');
  }

  return code;
}