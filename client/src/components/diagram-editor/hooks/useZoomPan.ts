import { useState, useCallback } from 'react';
import { Position, UseZoomPanReturn } from '../types';

export const useZoomPan = (): UseZoomPanReturn => {
  const [zoom, setZoom] = useState(1);
  const [position, setPosition] = useState<Position>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [lastPosition, setLastPosition] = useState<Position>({ x: 0, y: 0 });
  const [touchDistance, setTouchDistance] = useState<number | null>(null);

  const handleZoomIn = useCallback(() => 
    setZoom(prev => Math.min(prev + 0.1, 4)), []
  );

  const handleZoomOut = useCallback(() => 
    setZoom(prev => Math.max(prev - 0.1, 0.1)), []
  );

  const handleResetZoom = useCallback(() => {
    setZoom(1);
    setPosition({ x: 0, y: 0 });
  }, []);

  const getTransformStyle = useCallback(() => ({
    transform: `translate(calc(-50% + ${position.x}px), calc(-50% + ${position.y}px)) scale(${zoom})`
  }), [position.x, position.y, zoom]);

  return {
    zoom,
    position,
    isDragging,
    lastPosition,
    touchDistance,
    setZoom,
    setPosition,
    setIsDragging,
    setLastPosition,
    setTouchDistance,
    handleZoomIn,
    handleZoomOut,
    handleResetZoom,
    getTransformStyle,
  };
};