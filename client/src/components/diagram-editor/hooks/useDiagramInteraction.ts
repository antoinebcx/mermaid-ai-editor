import { useCallback } from 'react';
import { DiagramInteractionProps, Position } from '../types';

export const useDiagramInteraction = ({
  setIsDragging,
  setLastPosition,
  setPosition,
  setTouchDistance,
  setZoom,
  isDragging,
  lastPosition,
  touchDistance
}: DiagramInteractionProps) => {
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (e.button !== 0) return;
    setIsDragging(true);
    setLastPosition({ x: e.clientX, y: e.clientY });
  }, [setIsDragging, setLastPosition]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDragging) return;
    
    const deltaX = e.clientX - lastPosition.x;
    const deltaY = e.clientY - lastPosition.y;
    
    setPosition((prev: Position) => ({
      x: prev.x + deltaX,
      y: prev.y + deltaY
    }));
    
    setLastPosition({ x: e.clientX, y: e.clientY });
  }, [isDragging, lastPosition.x, lastPosition.y, setLastPosition, setPosition]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, [setIsDragging]);

  const handleWheel = useCallback((e: React.WheelEvent<HTMLDivElement>) => {
    if (e.ctrlKey || Math.abs(e.deltaY) < 50) {
      e.preventDefault();
      const delta = -e.deltaY * 0.01;
      setZoom((prev: number) => Math.min(Math.max(prev + delta, 0.1), 4));
    }
  }, [setZoom]);

  const handleTouchStart = useCallback((e: React.TouchEvent<HTMLDivElement>) => {
    if (e.touches.length === 2) {
      e.preventDefault();
      const distance = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      setTouchDistance(distance);
    }
  }, [setTouchDistance]);
  
  const handleTouchMove = useCallback((e: React.TouchEvent<HTMLDivElement>) => {
    if (e.touches.length === 2 && touchDistance !== null) {
      e.preventDefault();
      const newDistance = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      const delta = newDistance - touchDistance;
      const scaleChange = delta > 0 ? 0.02 : -0.02;
      
      setZoom((prev: number) => Math.min(Math.max(prev + scaleChange, 0.1), 4));
      setTouchDistance(newDistance);
    }
  }, [touchDistance, setZoom, setTouchDistance]);

  const handleTouchEnd = useCallback(() => {
    setTouchDistance(null);
  }, [setTouchDistance]);

  return {
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    handleWheel,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
  };
};