import { useState, useCallback, useEffect, useRef } from 'react';
import { MermaidElement } from '../types';
import { findNodeDefinition, updateNodeText, updateNodeShape } from '../utils/mermaidUtils';

interface UseMermaidInteractionProps {
  code: string;
  updateCode: (newCode: string) => void;
}

export const useMermaidInteraction = ({ code, updateCode }: UseMermaidInteractionProps) => {
  const [selectedElement, setSelectedElement] = useState<MermaidElement | null>(null);
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const updateTimeoutRef = useRef<number>();

  useEffect(() => {
    if (selectedElement) {
      if (updateTimeoutRef.current) {
        window.clearTimeout(updateTimeoutRef.current);
      }

      updateTimeoutRef.current = window.setTimeout(() => {
        const selector = `#mermaid-preview g[id*="${selectedElement.id}-"]`;
        const newNodeGroup = document.querySelector(selector);
        if (newNodeGroup) {
          setAnchorEl(newNodeGroup as HTMLElement);
        }
      }, 100);
    }

    return () => {
      if (updateTimeoutRef.current) {
        window.clearTimeout(updateTimeoutRef.current);
      }
    };
  }, [code, selectedElement]);

  const handleDiagramClick = useCallback((e: React.MouseEvent<HTMLElement>) => {
    try {
      const target = e.target as HTMLElement;
      if (target.tagName.toLowerCase() === 'svg') return;

      const nodeGroup = target.closest('g.node');
      if (!nodeGroup) return;

      const nodeMatch = nodeGroup.id.match(/flowchart-([^-]+)/);
      const nodeId = nodeMatch?.[1];
      if (!nodeId) return;

      const elementData = findNodeDefinition(code, nodeId);
      if (elementData) {
        setSelectedElement({
          id: nodeId,
          ...elementData
        });
        setAnchorEl(nodeGroup as HTMLElement);
      }
    } catch (error) {
      console.error('Error handling click:', error);
    }
  }, [code]);

  const handleDoubleClick = (e: React.MouseEvent<HTMLElement>) => {
    const target = e.target as HTMLElement;
  
    const nodeGroup = target.closest('g.node');
    if (!nodeGroup) {
      console.log('No node group found');
      return;
    }
  
    const nodeMatch = nodeGroup.id.match(/flowchart-([^-]+)/);
    const nodeId = nodeMatch?.[1];
    if (!nodeId) {
      console.log('No node ID found');
      return;
    }
  
    const foreignObject = nodeGroup.querySelector('foreignObject');
    if (!foreignObject) {
      console.log('No foreignObject found for this node');
      return;
    }
  
    const textElement = foreignObject.querySelector('div > span > p');
    if (!textElement) {
      console.log('No text element found for this node');
      return;
    }
  
    const boundingBox = textElement.getBoundingClientRect();
  
    const input = document.createElement('input');
    input.type = 'text';
    input.value = textElement.textContent || '';
    input.style.position = 'absolute';
    input.style.top = `${boundingBox.top + window.scrollY - 2.5}px`;
    input.style.left = `${boundingBox.left + window.scrollX - 10}px`;
    input.style.width = `${boundingBox.width + 20}px`;
    input.style.height = `${boundingBox.height + 5}px`;
    input.style.fontSize = window.getComputedStyle(textElement).fontSize;
    input.style.border = '1px solid #ccc';
    input.style.background = 'white';
    input.style.zIndex = '1000';

    const originalFontSize = parseFloat(window.getComputedStyle(textElement).fontSize);
    input.style.fontSize = `${originalFontSize * 0.85}px`;
  
    document.body.appendChild(input);
    input.focus();
  
    input.onblur = () => {
      const newText = input.value.trim();
      document.body.removeChild(input);
  
      if (newText !== textElement.textContent) {
        updateCode(updateNodeText(code, nodeId, newText));
      }
    };
  
    input.onkeydown = (keyEvent) => {
      if (keyEvent.key === 'Enter') {
        input.blur();
      }
    };
  };   

  const handleElementUpdate = useCallback((updates: Partial<MermaidElement>) => {
    if (!selectedElement) return;

    let newCode = code;
    
    if (updates.text !== undefined) {
      newCode = updateNodeText(code, selectedElement.id, updates.text);
    }
    
    if (updates.type !== undefined) {
      newCode = updateNodeShape(newCode, selectedElement.id, updates.type);
    }

    updateCode(newCode);
    
    setSelectedElement((prev) => prev ? {
      ...prev,
      ...updates
    } : null);
  }, [selectedElement, code, updateCode]);

  const handleClose = useCallback(() => {
    setSelectedElement(null);
    setAnchorEl(null);
    if (updateTimeoutRef.current) {
      window.clearTimeout(updateTimeoutRef.current);
    }
  }, []);

  return {
    selectedElement,
    anchorEl,
    handleDiagramClick,
    handleDoubleClick,
    handleElementUpdate,
    handleClose
  };
};