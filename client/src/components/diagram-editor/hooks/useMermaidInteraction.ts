import { useState, useCallback } from 'react';
import { MermaidElement, ElementType } from '../types';

// Standard Mermaid node patterns
const NODE_PATTERNS = {
  default: {
    start: '[',
    end: ']',
    type: 'default' as ElementType
  },
  participant: {
    start: '(',
    end: ')',
    type: 'participant' as ElementType
  },
  decision: {
    start: '{',
    end: '}',
    type: 'decision' as ElementType
  },
  note: {
    start: '>',
    end: ']',
    type: 'note' as ElementType
  }
};

function findNodeDefinition(code: string, nodeId: string): { text: string; type: ElementType } | null {
  try {
    // Split into lines and clean
    const lines = code.split('\n').map(line => line.trim());
    
    // Find line containing node definition
    for (const line of lines) {
      const nodeStart = line.indexOf(nodeId);
      if (nodeStart === -1) continue;

      // Look at character after node ID
      const afterId = line.slice(nodeStart + nodeId.length).trim();
      if (!afterId) continue;

      // Check each node pattern
      for (const [key, pattern] of Object.entries(NODE_PATTERNS)) {
        if (afterId.startsWith(pattern.start)) {
          // Find closing bracket
          const closePos = afterId.indexOf(pattern.end);
          if (closePos === -1) continue;

          // Extract text between brackets
          const text = afterId.slice(1, closePos).trim();
          return { text, type: pattern.type };
        }
      }
    }
    return null;
  } catch (error) {
    console.error('Error parsing node:', error);
    return null;
  }
}

const parseMermaidElement = (element: HTMLElement, code: string): MermaidElement | null => {
  try {
    // Get node group
    const nodeGroup = element.closest('g.node');
    if (!nodeGroup) return null;

    // Get node ID from the group
    const nodeId = nodeGroup.id?.replace('flowchart-', '').split('-')[0];
    if (!nodeId) return null;

    // Find node definition
    const definition = findNodeDefinition(code, nodeId);
    if (!definition) {
      console.log('No definition found for node:', nodeId);
      return null;
    }

    // Build element data
    return {
      id: nodeId,
      text: definition.text,
      type: definition.type,
      color: '' // Add color handling if needed
    };
  } catch (error) {
    console.error('Error parsing element:', error);
    return null;
  }
};

const updateMermaidCode = (code: string, elementId: string, updates: MermaidElement): string => {
  try {
    const lines = code.split('\n');
    
    // Find the line containing the node definition
    const lineIndex = lines.findIndex(line => {
      const trimmed = line.trim();
      return trimmed.includes(elementId) && 
             Object.values(NODE_PATTERNS).some(pattern => 
               trimmed.includes(`${elementId}${pattern.start}`));
    });

    if (lineIndex === -1) return code;

    // Get the pattern for the updated type
    const pattern = Object.values(NODE_PATTERNS).find(p => p.type === updates.type);
    if (!pattern) return code;

    const line = lines[lineIndex];
    const indent = line.match(/^\s*/)?.[0] || '';

    // Find the start of the node definition
    const nodeStart = line.indexOf(elementId);
    const beforeNode = line.slice(0, nodeStart);
    const afterNode = line.slice(nodeStart);
    const relationshipPart = afterNode.match(/[\]})>](.+)$/)?.[1] || '';

    // Construct the new node definition
    const newNodePart = `${elementId}${pattern.start}${updates.text}${pattern.end}`;
    const color = updates.color ? `:::${updates.color}` : '';
    
    // Put it all together
    lines[lineIndex] = `${indent}${beforeNode}${newNodePart}${color}${relationshipPart}`;

    return lines.join('\n');
  } catch (error) {
    console.error('Error updating code:', error);
    return code;
  }
};

interface UseMermaidInteractionProps {
  code: string;
  updateCode: (newCode: string) => void;
}

export const useMermaidInteraction = ({ code, updateCode }: UseMermaidInteractionProps) => {
  const [selectedElement, setSelectedElement] = useState<MermaidElement | null>(null);
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  const handleDiagramClick = useCallback((e: React.MouseEvent<HTMLElement>) => {
    try {
      const target = e.target as HTMLElement;
      if (target.tagName.toLowerCase() === 'svg') return;

      const nodeGroup = target.closest('g.node');
      if (nodeGroup) {
        const elementData = parseMermaidElement(nodeGroup as HTMLElement, code);
        if (elementData) {
          console.log('Selected node:', elementData);
          setSelectedElement(elementData);
          setAnchorEl(nodeGroup as HTMLElement);
        }
      }
    } catch (error) {
      console.error('Error handling click:', error);
    }
  }, [code]);

  const handleElementUpdate = useCallback((updates: Partial<MermaidElement>) => {
    if (!selectedElement) return;

    const updatedElement = {
      ...selectedElement,
      ...updates
    };

    const newCode = updateMermaidCode(code, selectedElement.id, updatedElement as MermaidElement);
    updateCode(newCode);
    setSelectedElement(updatedElement as MermaidElement);
  }, [selectedElement, code, updateCode]);

  const handleClose = useCallback(() => {
    setSelectedElement(null);
    setAnchorEl(null);
  }, []);

  return {
    selectedElement,
    anchorEl,
    handleDiagramClick,
    handleElementUpdate,
    handleClose
  };
};