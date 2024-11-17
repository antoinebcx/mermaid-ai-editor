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
      const svgElement = document.querySelector('#mermaid-preview svg') as SVGSVGElement;
      if (!svgElement) {
        throw new Error('SVG element not found');
      }

      const contentBox = svgElement.getBBox();
      const padding = 20;
      const width = Math.ceil(contentBox.width + padding * 2);
      const height = Math.ceil(contentBox.height + padding * 2);

      const clonedSvg = svgElement.cloneNode(true) as SVGSVGElement;
      clonedSvg.setAttribute('width', width.toString());
      clonedSvg.setAttribute('height', height.toString());
      clonedSvg.setAttribute('viewBox', 
        `${contentBox.x - padding} ${contentBox.y - padding} ${width} ${height}`);

      const canvas = document.createElement('canvas');
      const scale = 2;
      canvas.width = width * scale;
      canvas.height = height * scale;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        throw new Error('Could not get canvas context');
      }

      ctx.scale(scale, scale);

      if (includeBackground) {
        ctx.fillStyle = theme.palette.mode === 'light' ? theme.palette.grey[50] : '#161616';
        ctx.fillRect(0, 0, width, height);
      }

      const svgString = new XMLSerializer().serializeToString(clonedSvg);
      const svg64 = btoa(unescape(encodeURIComponent(svgString)));
      const imgSrc = `data:image/svg+xml;base64,${svg64}`;

      const img = new Image();
      img.src = imgSrc;

      await new Promise<void>((resolve, reject) => {
        img.onload = () => {
          ctx.drawImage(img, 0, 0, width, height);
          
          const dataUrl = canvas.toDataURL(`image/${format}`, 1.0);
          
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