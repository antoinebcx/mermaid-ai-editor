// Chat types
export interface ChatMessage {
    sender: 'user' | 'assistant';
    content: string;
}
  
export interface APIMessage {
    role: 'user' | 'assistant';
    content: string;
}
  
// Code history types
export interface CodeHistory {
    currentIndex: number;
    history: string[];
}
  
// Diagram interaction types
export interface Position {
    x: number;
    y: number;
}
  
export interface ZoomPanState {
    zoom: number;
    position: Position;
    isDragging: boolean;
    lastPosition: Position;
    touchDistance: number | null;
}
  
export interface UseZoomPanReturn extends ZoomPanState {
    setIsDragging: (value: boolean) => void;
    setLastPosition: (value: Position) => void;
    setPosition: (value: Position | ((prev: Position) => Position)) => void;
    setTouchDistance: (value: number | null) => void;
    setZoom: (value: number | ((prev: number) => number)) => void;
    handleZoomIn: () => void;
    handleZoomOut: () => void;
    handleResetZoom: () => void;
    getTransformStyle: () => { transform: string };
}
  
export interface DiagramInteractionProps {
    setIsDragging: (value: boolean) => void;
    setLastPosition: (value: Position) => void;
    setPosition: (value: Position | ((prev: Position) => Position)) => void;
    setTouchDistance: (value: number | null) => void;
    setZoom: (value: number | ((prev: number) => number)) => void;
    isDragging: boolean;
    lastPosition: Position;
    touchDistance: number | null;
}

// Diagram elements
export type ElementType = 'default' | 'participant' | 'decision' | 'note' | 'action' | 'loop';

export interface MermaidElement {
  id: string;
  text: string;
  type: ElementType;
}