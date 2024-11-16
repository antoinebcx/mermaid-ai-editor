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

  // Update anchor element after code changes
  useEffect(() => {
    if (selectedElement) {
      // Clear any existing timeout
      if (updateTimeoutRef.current) {
        window.clearTimeout(updateTimeoutRef.current);
      }

      // Set a small timeout to ensure the diagram has re-rendered
      updateTimeoutRef.current = window.setTimeout(() => {
        // Try to find the node in the new diagram
        const selector = `#mermaid-preview g[id*="${selectedElement.id}-"]`;
        const newNodeGroup = document.querySelector(selector);
        if (newNodeGroup) {
          setAnchorEl(newNodeGroup as HTMLElement);
        }
      }, 100); // Small delay to ensure rendering is complete
    }

    // Cleanup
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

      // Get the node ID from the group ID
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
    handleElementUpdate,
    handleClose
  };
};