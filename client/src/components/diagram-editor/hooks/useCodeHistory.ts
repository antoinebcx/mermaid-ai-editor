import { useState, useRef, useCallback } from 'react';
import { CodeHistory } from '../types';
import { DEFAULT_DIAGRAM, MAX_HISTORY_LENGTH } from '../constants';

export const useCodeHistory = () => {
  const [code, setCode] = useState<string>(DEFAULT_DIAGRAM);
  const [codeHistory, setCodeHistory] = useState<CodeHistory>({
    currentIndex: 0,
    history: [DEFAULT_DIAGRAM],
  });
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const updateCode = useCallback((newCode: string) => {
    setCode(newCode);

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      setCodeHistory(current => {
        const newHistory = [
          ...current.history.slice(0, current.currentIndex + 1),
          newCode,
        ].slice(-MAX_HISTORY_LENGTH);
        
        return {
          history: newHistory,
          currentIndex: newHistory.length - 1,
        };
      });
    }, 250);
  }, []);

  const handleUndo = useCallback(() => {
    if (codeHistory.currentIndex > 0) {
      const newIndex = codeHistory.currentIndex - 1;
      const previousCode = codeHistory.history[newIndex];
      setCode(previousCode);
      setCodeHistory(current => ({
        ...current,
        currentIndex: newIndex,
      }));
    }
  }, [codeHistory.currentIndex, codeHistory.history]);

  const handleRedo = useCallback(() => {
    if (codeHistory.currentIndex < codeHistory.history.length - 1) {
      const newIndex = codeHistory.currentIndex + 1;
      const nextCode = codeHistory.history[newIndex];
      setCode(nextCode);
      setCodeHistory(current => ({
        ...current,
        currentIndex: newIndex,
      }));
    }
  }, [codeHistory.currentIndex, codeHistory.history]);

  const canUndo = codeHistory.currentIndex > 0;
  const canRedo = codeHistory.currentIndex < codeHistory.history.length - 1;

  return {
    code,
    updateCode,
    handleUndo,
    handleRedo,
    canUndo,
    canRedo,
  };
};