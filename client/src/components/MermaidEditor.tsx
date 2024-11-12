import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  IconButton,
  Alert,
  Stack,
  Button,
  styled,
} from '@mui/material';
import {
  ZoomIn,
  ZoomOut,
  Save,
  Upload as UploadIcon,
} from '@mui/icons-material';
import mermaid from 'mermaid';

const defaultDiagram = `graph TD
    A[Start] --> B[Process]
    B --> C[End]
    D[Branch] --> B`;

const Editor = styled('textarea')(({ theme }) => ({
  width: '100%',
  height: '100%',
  padding: theme.spacing(2),
  fontFamily: 'monospace',
  fontSize: '0.875rem',
  border: 'none',
  resize: 'none',
  backgroundColor: theme.palette.grey[50],
  '&:focus': {
    outline: 'none',
  },
}));

const MermaidEditor: React.FC = () => {
  const [code, setCode] = useState(defaultDiagram);
  const [error, setError] = useState('');
  const [zoom, setZoom] = useState(1);

  useEffect(() => {
    mermaid.initialize({
      startOnLoad: true,
      theme: 'default',
      securityLevel: 'loose',
      flowchart: {
        htmlLabels: true,
        useMaxWidth: true,
        curve: 'basis',
      },
    });
    renderDiagram();
  }, []);

  useEffect(() => {
    renderDiagram();
  }, [code, zoom]);

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
    let pos1 = 0,
      pos2 = 0,
      pos3 = 0,
      pos4 = 0;

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

      element.style.transform = `translate(${element.offsetLeft - pos1}px, ${
        element.offsetTop - pos2
      }px)`;
    };

    const closeDragElement = () => {
      document.onmouseup = null;
      document.onmousemove = null;
    };

    element.onmousedown = dragMouseDown as any;
    element.style.cursor = 'move';
  };

  const handleZoomIn = () => setZoom((prev) => Math.min(prev + 0.1, 2));
  const handleZoomOut = () => setZoom((prev) => Math.max(prev - 0.1, 0.5));

  const handleSave = async () => {
    try {
      await fetch('http://localhost:3001/api/diagrams', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ diagram: code }),
      });
      // You could add success notification here
    } catch (err) {
      console.error('Failed to save diagram:', err);
    }
  };

  const handleLoad = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => setCode(e.target?.result as string);
      reader.readAsText(file);
    }
  };

  return (
    <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Paper
        elevation={1}
        sx={{
          p: 2,
          borderRadius: 0,
          borderBottom: 1,
          borderColor: 'divider',
        }}
      >
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Typography variant="h5" fontWeight="bold">
            Mermaid Editor
          </Typography>
          <Stack direction="row" spacing={1}>
            <IconButton onClick={handleZoomIn} size="small" title="Zoom In">
              <ZoomIn />
            </IconButton>
            <IconButton onClick={handleZoomOut} size="small" title="Zoom Out">
              <ZoomOut />
            </IconButton>
            <IconButton onClick={handleSave} size="small" title="Save Diagram">
              <Save />
            </IconButton>
            <Button
              component="label"
              size="small"
              startIcon={<UploadIcon />}
              sx={{ minWidth: 'auto' }}
            >
              <input
                type="file"
                accept=".mmd,.txt"
                onChange={handleLoad}
                hidden
              />
            </Button>
          </Stack>
        </Stack>
        {error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {error}
          </Alert>
        )}
      </Paper>

      <Box sx={{ display: 'flex', flexGrow: 1 }}>
        <Box
          sx={{
            width: '50%',
            borderRight: 1,
            borderColor: 'divider',
          }}
        >
          <Editor
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="Enter Mermaid diagram code here..."
          />
        </Box>
        <Box
          sx={{
            width: '50%',
            p: 2,
            bgcolor: 'background.paper',
            overflow: 'auto',
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
        </Box>
      </Box>
    </Box>
  );
};

export default MermaidEditor;