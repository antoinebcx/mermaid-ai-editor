import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Box,
  Alert,
  Tooltip,
  Typography,
  IconButton,
  useTheme,
  styled,
} from '@mui/material';
import {
  ZoomInOutlined,
  ZoomOutOutlined,
  CenterFocusStrongOutlined,
  UndoOutlined,
  RedoOutlined,
  SaveOutlined,
} from '@mui/icons-material';
import mermaid from 'mermaid';
import ChatInput from './ChatInput';
import CodeEditor from './CodeEditor';
import { sendChatMessage } from '../api';

type TouchEvent = React.TouchEvent<HTMLDivElement>;

const NAVBAR_HEIGHT = 64;
const MAX_HISTORY_LENGTH = 100;

const defaultDiagram = `graph TD
    A(Email) --> C[Process Message]
    B(SMS) --> C
    C --> D{Valid Order?}
    D -->|Yes| E[Create Order]
    D -->|No| F[Reject Request]
    E --> G(Send Confirmation)
    E --> H(Update Inventory)
    F --> I(Send Rejection Notice)`;

interface CodeHistory {
  currentIndex: number;
  history: string[];
}

const DiagramContainer = styled(Box)(({ theme }) => ({
  width: '100%',
  height: '100%',
  position: 'relative',
  overflow: 'hidden',
  '&:active': {
    cursor: 'grabbing',
  },
  backgroundColor: theme.palette.mode === 'light' ? theme.palette.grey[50] : theme.palette.grey[900],
}));

const TransformableArea = styled(Box)({
  position: 'absolute',
  top: '50%',
  left: '50%',
  transformOrigin: 'center center',
});

const MermaidEditor = () => {
  const theme = useTheme();
  const [code, setCode] = useState<string>(defaultDiagram);
  const [codeHistory, setCodeHistory] = useState<CodeHistory>({
    currentIndex: 0,
    history: [defaultDiagram],
  });
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [error, setError] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [isChatLoading, setIsChatLoading] = useState(false);
  const [chatError, setChatError] = useState<string | null>(null);
  const [lastPosition, setLastPosition] = useState({ x: 0, y: 0 });
  const [touchDistance, setTouchDistance] = useState<number | null>(null);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const transformableRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    mermaid.initialize({
      startOnLoad: true,
      theme: theme.palette.mode === 'dark' ? 'dark' : 'default',
      securityLevel: 'loose',
      flowchart: {
        htmlLabels: true,
        useMaxWidth: true,
        curve: 'basis',
      },
    });
  }, [theme.palette.mode]);

  useEffect(() => {
    const timer = setTimeout(() => {
      renderDiagram();
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    renderDiagram();
  }, [code, zoom, theme.palette.mode]);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey) {
        if (e.key === 'z') {
          e.preventDefault();
          if (e.shiftKey) {
            handleRedo();
          } else {
            handleUndo();
          }
        } else if (e.key === 'y') {
          e.preventDefault();
          handleRedo();
        }
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [codeHistory.currentIndex, codeHistory.history]);

  const renderDiagram = async () => {
    try {
      const element = document.getElementById('mermaid-preview');
      if (!element) return;

      element.innerHTML = '';
      const { svg } = await mermaid.render('mermaid-diagram', code);
      element.innerHTML = svg;

      const svgElement = element.querySelector('svg');
      if (svgElement) {
        svgElement.style.transform = 'none';
        svgElement.style.maxWidth = '100%';
        svgElement.style.maxHeight = '100%';
      }

      setError('');
    } catch (err: any) {
      setError(err.message);
    }
  };

  const updateCode = (newCode: string) => {
    // immediate update
    setCode(newCode);

    // debounced history update
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
    }, 500);
  };

  const canUndo = codeHistory.currentIndex > 0;
  const canRedo = codeHistory.currentIndex < codeHistory.history.length - 1;

  const handleUndo = () => {
    if (!canUndo) return;
    const newIndex = codeHistory.currentIndex - 1;
    const previousCode = codeHistory.history[newIndex];
    setCode(previousCode);
    setCodeHistory(current => ({
      ...current,
      currentIndex: newIndex,
    }));
  };

  const handleRedo = () => {
    if (!canRedo) return;
    const newIndex = codeHistory.currentIndex + 1;
    const nextCode = codeHistory.history[newIndex];
    setCode(nextCode);
    setCodeHistory(current => ({
      ...current,
      currentIndex: newIndex,
    }));
  };

  const handleZoomIn = () => setZoom(prev => Math.min(prev + 0.1, 4));
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 0.1, 0.1));
  const handleResetZoom = () => {
    setZoom(1);
    setPosition({ x: 0, y: 0 });
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return;
    setIsDragging(true);
    setLastPosition({ x: e.clientX, y: e.clientY });
  };
  
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    
    const deltaX = e.clientX - lastPosition.x;
    const deltaY = e.clientY - lastPosition.y;
    
    setPosition(prev => ({
      x: prev.x + deltaX,
      y: prev.y + deltaY
    }));
    
    setLastPosition({ x: e.clientX, y: e.clientY });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    if (e.ctrlKey || Math.abs(e.deltaY) < 50) {
      e.preventDefault();
      const delta = -e.deltaY * 0.01;
      setZoom(prev => Math.min(Math.max(prev + delta, 0.1), 4));
    }
  };

  const handleTouchStart = (e: TouchEvent) => {
    if (e.touches.length === 2) {
      e.preventDefault();
      const distance = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      setTouchDistance(distance);
    }
  };
  
  const handleTouchMove = (e: TouchEvent) => {
    if (e.touches.length === 2 && touchDistance !== null) {
      e.preventDefault();
      const newDistance = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      const delta = newDistance - touchDistance;
      const scaleChange = delta > 0 ? 0.02 : -0.02;
      
      setZoom(prev => Math.min(Math.max(prev + scaleChange, 0.1), 4));
      setTouchDistance(newDistance);
    }
  };

  const handleSave = async () => {
    try {
      await fetch('http://localhost:3001/api/diagrams', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ diagram: code }),
      });
    } catch (err) {
      console.error('Failed to save diagram:', err);
    }
  };

  const handleChatMessage = async (message: string) => {
    setIsChatLoading(true);
    setChatError(null);
    
    try {
      const response = await sendChatMessage(message);
      const cleanedResponse = response.replace(/^```mermaid\n?|\n?```$/g, '').trim();
      updateCode(cleanedResponse);
    } catch (error) {
      console.error('Chat error:', error);
      setChatError('Failed to process chat message. Please try again.');
    } finally {
      setIsChatLoading(false);
    }
  };

  const getTransformStyle = () => ({
    transform: `translate(calc(-50% + ${position.x}px), calc(-50% + ${position.y}px)) scale(${zoom})`,
  });

  return (
    <>
      {error && (
        <Alert severity="error" sx={{ m: 2 }}>
          {error}
        </Alert>
      )}

      {chatError && (
        <Alert severity="error" sx={{ m: 2 }}>
          {chatError}
        </Alert>
      )}

      <Box sx={{ 
        display: 'flex', 
        flexGrow: 1,
        height: `calc(100vh - ${NAVBAR_HEIGHT}px)`,
        position: 'relative',
        flexDirection: { xs: 'column', md: 'row' },
        margin: 0,
        padding: 0,
        overflow: 'hidden'
      }}>
        <Box
          sx={{
            width: { xs: '100%', md: '50%' },
            height: { xs: '50vh', md: '100%' },
            position: 'relative',
          }}
        >
          <CodeEditor
            value={code}
            onChange={(e) => updateCode(e.target.value)}
            placeholder="Enter Mermaid diagram code here..."
          />
          <ChatInput 
            onSend={handleChatMessage}
            isLoading={isChatLoading}
            currentDiagram={code}
          />
        </Box>

        <DiagramContainer
          ref={containerRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onWheel={handleWheel}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={() => setTouchDistance(null)}
          sx={{
            width: { xs: '100%', md: '50%' },
            height: { xs: '50vh', md: '100%' },
          }}
        >
          <TransformableArea
            ref={transformableRef}
            style={getTransformStyle()}
          >
            <Box
              id="mermaid-preview"
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            />
          </TransformableArea>

          <Box
            sx={{
              position: 'absolute',
              bottom: '20px',
              left: '20px',
              zIndex: 1000,
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              gap: '7px',
              padding: '7px',
              borderRadius: '8px',
            }}
          >
            <Tooltip title="Undo (Ctrl/⌘+Z)">
              <span>
                <IconButton onClick={handleUndo} size="small" disabled={!canUndo}>
                  <UndoOutlined />
                </IconButton>
              </span>
            </Tooltip>
            <Tooltip title="Redo (Ctrl/⌘+Shift+Z or Ctrl/⌘+Y)">
              <span>
                <IconButton onClick={handleRedo} size="small" disabled={!canRedo}>
                  <RedoOutlined />
                </IconButton>
              </span>
            </Tooltip>
          </Box>
          
          <Box
            sx={{
              position: 'absolute',
              bottom: '20px',
              right: '20px',
              zIndex: 1000,
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              gap: '7px',
              padding: '7px',
              borderRadius: '8px',
            }}
          >
            <Tooltip title="Zoom In">
              <IconButton onClick={handleZoomIn} size="small">
                <ZoomInOutlined />
              </IconButton>
            </Tooltip>
            <Tooltip title="Zoom Out">
              <IconButton onClick={handleZoomOut} size="small">
                <ZoomOutOutlined />
              </IconButton>
            </Tooltip>
            <Tooltip title="Reset View">
              <IconButton onClick={handleResetZoom} size="small">
                <CenterFocusStrongOutlined />
              </IconButton>
            </Tooltip>
            <Typography variant="body2" sx={{ minWidth: '45px', textAlign: 'center' }}>
              {Math.round(zoom * 100)}%
            </Typography>
            {/* <Tooltip title="Save Diagram">
              <IconButton onClick={handleSave} size="small">
                <SaveOutlined />
              </IconButton>
            </Tooltip> */}
          </Box>
        </DiagramContainer>
      </Box>
    </>
  );
};

export default MermaidEditor;