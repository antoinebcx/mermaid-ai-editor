import React, { useState, useEffect } from 'react';
import {
  Box,
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Alert,
  Tooltip,
  useTheme,
  styled,
} from '@mui/material';
import {
  ZoomInOutlined,
  ZoomOutOutlined,
  CenterFocusStrongOutlined,
  SaveOutlined,
  LightMode,
  DarkMode,
} from '@mui/icons-material';
import mermaid from 'mermaid';

const defaultDiagram = `graph TD
    A[Email] --> B[Process]
    B --> C[Order]
    D[SMS] --> B`;

const Editor = styled('textarea')(({ theme }) => ({
  width: '100%',
  height: '100%',
  padding: theme.spacing(2),
  fontFamily: theme.typography.fontFamily,
  fontSize: '0.875rem',
  border: 'none',
  resize: 'none',
  backgroundColor: theme.palette.mode === 'light' ? theme.palette.grey[50] : theme.palette.grey[900],
  color: theme.palette.text.primary,
  '&:focus': {
    outline: 'none',
  },
}));

interface MermaidEditorProps {
  onToggleTheme: () => void;
}

const MermaidEditor: React.FC<MermaidEditorProps> = ({ onToggleTheme }) => {
  const theme = useTheme();
  const [code, setCode] = useState(defaultDiagram);
  const [error, setError] = useState('');
  const [zoom, setZoom] = useState(1);

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
        svgElement.style.transform = `scale(${zoom})`;
        svgElement.style.transformOrigin = 'center';
        svgElement.style.transition = 'transform 0.2s';

        const nodes = svgElement.querySelectorAll('.node');
        nodes.forEach((node) => {
          makeDraggable(node as SVGElement);
        });
      }

      setError('');
    } catch (err: any) {
      setError(err.message);
    }
  };

  const makeDraggable = (element: SVGElement) => {
    let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
    let currentTransform = { x: 0, y: 0 };  // track current position
    
    const dragMouseDown = (e: MouseEvent) => {
      e.preventDefault();
      pos3 = e.clientX;
      pos4 = e.clientY;
      document.onmouseup = closeDragElement;
      document.onmousemove = elementDrag;
    };

    const elementDrag = (e: MouseEvent) => {
      e.preventDefault();
      pos1 = pos3 - e.clientX;
      pos2 = pos4 - e.clientY;
      pos3 = e.clientX;
      pos4 = e.clientY;

      // update tracked position
      currentTransform.x -= pos1;
      currentTransform.y -= pos2;
      
      // use tracked position
      element.style.transform = `translate(${currentTransform.x}px, ${currentTransform.y}px)`;
    };

    const closeDragElement = () => {
      document.onmouseup = null;
      document.onmousemove = null;
    };

    element.onmousedown = dragMouseDown as any;
    element.style.cursor = 'move';
  };

  const handleZoomIn = () => setZoom(prev => Math.min(prev + 0.1, 2));
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 0.1, 0.5));
  const handleResetZoom = () => setZoom(1);

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

  return (
    <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <AppBar 
        position="static" 
        elevation={0}
        sx={{ 
          backgroundColor: theme.palette.mode === 'light' ? 'white' : undefined,
          color: theme.palette.mode === 'light' ? 'text.primary' : undefined
        }}
      >
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Mermaid board
          </Typography>
          <IconButton 
            color={theme.palette.mode === 'light' ? 'default' : 'inherit'}
            onClick={onToggleTheme}
            sx={{ ml: 2 }}
          >
            {theme.palette.mode === 'dark' ? <LightMode /> : <DarkMode />}
          </IconButton>
        </Toolbar>
      </AppBar>

      {error && (
        <Alert severity="error" sx={{ m: 2 }}>
          {error}
        </Alert>
      )}

      <Box sx={{ 
        display: 'flex', 
        flexGrow: 1, 
        position: 'relative',
        flexDirection: { xs: 'column', md: 'row' }
      }}>
        <Box
          sx={{
            width: { xs: '100%', md: '50%' },
            height: { xs: '50vh', md: 'auto' },
            ...(theme.breakpoints.up('md') ? {
              borderRight: 0.25,
              borderBottom: 0,
            } : {
              borderRight: 0,
              borderBottom: 0.25,
            }),
            borderColor: 'divider',
          }}
        >
          <Editor
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="Enter Mermaid diagram code here..."
            sx={{padding: '30px'}}
          />
        </Box>
        <Box
          sx={{
            width: { xs: '100%', md: '50%' },
            p: 2,
            bgcolor: 'background.paper',
            overflow: 'auto',
            position: 'relative',
            height: { xs: '50vh', md: 'auto' },
          }}
        >
          <Box
            id="mermaid-preview"
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              height: '100%',
            }}
          />
          
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
              backgroundColor: theme.palette.mode === 'light' 
                ? 'rgba(255, 255, 255, 0.8)' 
                : 'rgba(0, 0, 0, 0.8)',
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
            <Tooltip title="Reset Zoom">
              <IconButton onClick={handleResetZoom} size="small">
                <CenterFocusStrongOutlined />
              </IconButton>
            </Tooltip>
            <Typography variant="body2" sx={{ minWidth: '45px', textAlign: 'center' }}>
              {Math.round(zoom * 100)}%
            </Typography>
            <Tooltip title="Save Diagram">
              <IconButton onClick={handleSave} size="small">
                <SaveOutlined />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default MermaidEditor;