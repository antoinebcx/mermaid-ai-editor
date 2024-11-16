import { useEffect, useState } from 'react';
import mermaid from 'mermaid';

export const useDiagramRenderer = (code: string, zoom: number, theme: string) => {
  const [error, setError] = useState('');

  const initializeMermaid = () => {
    mermaid.initialize({
      startOnLoad: true,
      theme: theme === 'dark' ? 'dark' : 'default',
      securityLevel: 'loose',
      flowchart: {
        htmlLabels: true,
        useMaxWidth: true,
        curve: 'basis',
      },
    });
  };

  const renderDiagram = async () => {
    try {
      const element = document.getElementById('mermaid-preview');
      if (!element) return;
      
      initializeMermaid();
      
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

  useEffect(() => {
    initializeMermaid();
    
    const waitForElement = setInterval(() => {
      const element = document.getElementById('mermaid-preview');
      if (element) {
        clearInterval(waitForElement);
        renderDiagram();
      }
    }, 100);

    return () => clearInterval(waitForElement);
  }, []);

  useEffect(() => {
    renderDiagram();
  }, [code, zoom, theme]);

  return { error, renderDiagram };
};