import { useState, useCallback } from 'react';
import hljs from 'highlight.js';
import mammoth from 'mammoth';
import { UploadedFile } from '../types';
import { TEXT_EXTENSIONS, CODE_EXTENSIONS } from '../constants';

export const useFileProcessing = () => {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [isExtracting, setIsExtracting] = useState(false);

  const detectFileType = (file: File): 'code' | 'text' | 'pdf' | 'word' => {
    if (file.type === 'application/pdf') return 'pdf';
    if (file.type === 'application/msword' || 
        file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') return 'word';
    
    const extension = file.name.slice(file.name.lastIndexOf('.')) as string;
    const lowerExtension = extension.toLowerCase();
    
    if (TEXT_EXTENSIONS.includes(lowerExtension as typeof TEXT_EXTENSIONS[number])) return 'text';
    if (CODE_EXTENSIONS.includes(lowerExtension as typeof CODE_EXTENSIONS[number])) return 'code';
    return 'text';
  };

  const detectLanguage = useCallback((content: string): string => {
    const detection = hljs.highlightAuto(content);
    return detection.language || 'plaintext';
  }, []);

  const extractTextFromPDF = async (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.onload = async (event) => {
        const typedarray = new Uint8Array(event.target?.result as ArrayBuffer);
        try {
          if (typeof window.pdfjsLib === 'undefined') {
            throw new Error('PDF.js library not loaded');
          }
          const pdf = await window.pdfjsLib.getDocument(typedarray).promise;
          let fullText = '';
          for (let i = 1; i <= pdf.numPages; i++) {
            const page = await pdf.getPage(i);
            const textContent = await page.getTextContent();
            const pageText = textContent.items
              .filter((item: any) => 'str' in item)
              .map((item: any) => item.str)
              .join(' ');
            fullText += pageText + '\n';
          }
          resolve(fullText);
        } catch (error) {
          console.error('Error extracting text from PDF:', error);
          reject(error);
        }
      };
      fileReader.onerror = reject;
      fileReader.readAsArrayBuffer(file);
    });
  };

  const extractTextFromWord = async (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = async (e) => {
        try {
          const arrayBuffer = e.target?.result as ArrayBuffer;
          const result = await mammoth.extractRawText({ arrayBuffer });
          resolve(result.value);
        } catch (error) {
          reject(error);
        }
      };
      reader.onerror = reject;
      reader.readAsArrayBuffer(file);
    });
  };

  const processFile = async (file: File): Promise<UploadedFile> => {
    const fileType = detectFileType(file);
    let content = '';

    try {
      switch (fileType) {
        case 'pdf':
          content = await extractTextFromPDF(file);
          break;
        case 'word':
          content = await extractTextFromWord(file);
          break;
        default:
          content = await file.text();
      }

      const language = fileType === 'code' ? detectLanguage(content) : undefined;
      return { file, content, type: fileType, language };
    } catch (error) {
      console.error(`Error processing file ${file.name}:`, error);
      throw error;
    }
  };

  const handleFiles = async (acceptedFiles: File[]) => {
    setIsExtracting(true);
    try {
      const processedFiles = await Promise.all(
        acceptedFiles.map(async (file) => {
          try {
            return await processFile(file);
          } catch (error) {
            console.error(`Failed to process file ${file.name}:`, error);
            return null;
          }
        })
      );
      const successfulFiles = processedFiles.filter((file): file is UploadedFile => file !== null);
      setUploadedFiles(prev => [...prev, ...successfulFiles]);
    } finally {
      setIsExtracting(false);
    }
  };

  const removeFile = (fileToRemove: UploadedFile) => {
    setUploadedFiles(prev => prev.filter(file => file !== fileToRemove));
  };

  const clearFiles = () => {
    setUploadedFiles([]);
  };

  return {
    uploadedFiles,
    isExtracting,
    handleFiles,
    removeFile,
    clearFiles
  };
};