import { useEffect } from 'react';

export const usePdfLoader = () => {
  useEffect(() => {
    const loadPdfJs = async () => {
      const script = document.createElement('script');
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.9.359/pdf.min.js';
      script.async = true;
      
      script.onload = () => {
        window.pdfjsLib.GlobalWorkerOptions.workerSrc = 
          'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.9.359/pdf.worker.min.js';
      };

      document.body.appendChild(script);
      return () => {
        document.body.removeChild(script);
      };
    };

    loadPdfJs();
  }, []);
};