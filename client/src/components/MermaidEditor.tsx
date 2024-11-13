import React, { useState, useEffect } from 'react';
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

const defaultDiagram = `graph TD
    A(Email) --> C[Process]
    B(SMS) --> C
    C --> D(Order)
    `;

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

const MermaidEditor = () => {
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
      }

      setError('');
    } catch (err: any) {
      setError(err.message);
    }
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
    <>
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
            {/* <Tooltip title="Save Diagram">
              <IconButton onClick={handleSave} size="small">
                <SaveOutlined />
              </IconButton>
            </Tooltip> */}
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default MermaidEditor;