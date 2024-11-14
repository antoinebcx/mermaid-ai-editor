import React, { useState, useEffect, useRef } from 'react';
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
  SaveOutlined,
} from '@mui/icons-material';
import mermaid from 'mermaid';
import ChatInput from './ChatInput';
import CodeEditor from './CodeEditor';
import { sendChatMessage } from '../api';

type TouchEvent = React.TouchEvent<HTMLDivElement>;

const NAVBAR_HEIGHT = 64;

const defaultDiagram = `graph TD
    A(Email) --> C[Process Message]
    B(SMS) --> C
    C --> D{Valid Order?}
    D -->|Yes| E[Create Order]
    D -->|No| F[Reject Request]
    E --> G(Send Confirmation)
    E --> H(Update Inventory)
    F --> I(Send Rejection Notice)`;

const DiagramContainer = styled(Box)(({ theme }) => ({
  width: '100%',
  height: '100%',
  position: 'relative',
  overflow: 'hidden',
  cursor: 'grab',
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
  const [error, setError] = useState('');
  const [zoom, setZoom] = useState(0.8);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [isChatLoading, setIsChatLoading] = useState(false);
  const [chatError, setChatError] = useState<string | null>(null);
  const [lastPosition, setLastPosition] = useState({ x: 0, y: 0 });
  const [touchDistance, setTouchDistance] = useState<number | null>(null);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const transformableRef = useRef<HTMLDivElement>(null);

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

  const handleZoomIn = () => setZoom(prev => Math.min(prev + 0.1, 2));
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 0.1, 0.5));
  const handleResetZoom = () => {
    setZoom(1);
    setPosition({ x: 0, y: 0 });
  };

  const handleMouseDown = (e: any) => {
    if (e.button !== 0) return;
    setIsDragging(true);
    setLastPosition({ x: e.clientX, y: e.clientY });
  };
  
  const handleMouseMove = (e: any) => {
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
      setZoom(prev => Math.min(Math.max(prev + delta, 0.5), 2));
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
      
      setZoom(prev => Math.min(Math.max(prev + scaleChange, 0.5), 2));
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
      
      // response is a Mermaid diagram, update the code
      // add validation here to ensure it's valid Mermaid syntax
      setCode(response);
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
            onChange={(e) => setCode(e.target.value)}
            placeholder="Enter Mermaid diagram code here..."
          />
          <ChatInput 
            onSend={(message) => handleChatMessage(message)}
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
              right: '20px',
              zIndex: 1000,
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              gap: '7px',
              padding: '7px',
              borderRadius: '8px',
              backgroundColor: theme.palette.background.paper,
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