// useDownloadDiagram.ts
import { useState } from 'react';
import { useTheme } from '@mui/material';

interface DownloadOptions {
  includeBackground: boolean;
  format: 'jpg' | 'png';
}

export const useDownloadDiagram = () => {
  const theme = useTheme();
  const [isDownloadMenuOpen, setIsDownloadMenuOpen] = useState(false);
  const [downloadAnchorEl, setDownloadAnchorEl] = useState<HTMLElement | null>(null);

  const handleDownloadClick = (event: React.MouseEvent<HTMLElement>) => {
    setDownloadAnchorEl(event.currentTarget);
    setIsDownloadMenuOpen(true);
  };

  const handleDownloadClose = () => {
    setDownloadAnchorEl(null);
    setIsDownloadMenuOpen(false);
  };

  const getTimestamp = (): string => {
    const now = new Date();
    return now.toISOString()
      .replace(/[:.]/g, '-')
      .replace('T', '_')
      .slice(0, -5);
  };

  const downloadDiagram = async ({ includeBackground, format }: DownloadOptions): Promise<void> => {
    try {
      // First get the SVG element
      const svgElement = document.querySelector('#mermaid-preview svg') as SVGSVGElement;
      if (!svgElement) {
        throw new Error('SVG element not found');
      }

      // Get the actual SVG content dimensions
      const contentBox = svgElement.getBBox();
      // Add some padding
      const padding = 20;
      const width = Math.ceil(contentBox.width + padding * 2);
      const height = Math.ceil(contentBox.height + padding * 2);

      // Create a copy of the SVG with the correct dimensions
      const clonedSvg = svgElement.cloneNode(true) as SVGSVGElement;
      clonedSvg.setAttribute('width', width.toString());
      clonedSvg.setAttribute('height', height.toString());
      clonedSvg.setAttribute('viewBox', 
        `${contentBox.x - padding} ${contentBox.y - padding} ${width} ${height}`);

      // Create a canvas with matching dimensions
      const canvas = document.createElement('canvas');
      // Scale up for better quality
      const scale = 2;
      canvas.width = width * scale;
      canvas.height = height * scale;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        throw new Error('Could not get canvas context');
      }

      // Scale the context for higher resolution
      ctx.scale(scale, scale);

      // If background is needed, fill it with theme-appropriate color
      if (includeBackground) {
        ctx.fillStyle = theme.palette.mode === 'light' ? theme.palette.grey[50] : '#161616';
        ctx.fillRect(0, 0, width, height);
      }

      // Convert SVG to data URL
      const svgString = new XMLSerializer().serializeToString(clonedSvg);
      const svg64 = btoa(unescape(encodeURIComponent(svgString)));
      const imgSrc = `data:image/svg+xml;base64,${svg64}`;

      // Create an image from the SVG
      const img = new Image();
      img.src = imgSrc;

      // Wait for the image to load then draw it to canvas
      await new Promise<void>((resolve, reject) => {
        img.onload = () => {
          ctx.drawImage(img, 0, 0, width, height);
          
          // Get the data URL from the canvas
          const dataUrl = canvas.toDataURL(`image/${format}`, 1.0);
          
          // Create download link
          const link = document.createElement('a');
          const timestamp = getTimestamp();
          link.download = `diagram-${timestamp}.${format}`;
          link.href = dataUrl;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          resolve();
        };
        img.onerror = () => reject(new Error('Error loading SVG image'));
      });
    } catch (error) {
      console.error('Error downloading diagram:', error);
    }
  };

  return {
    isDownloadMenuOpen,
    downloadAnchorEl,
    handleDownloadClick,
    handleDownloadClose,
    downloadDiagram
  };
};