import React, { useState, useRef, useCallback, useEffect } from 'react';
import { 
  Paper, 
  InputBase, 
  IconButton, 
  useTheme,
  Box,
  Chip,
  Alert,
  CircularProgress
} from '@mui/material';
import { Send, AttachFile, InsertDriveFileOutlined } from '@mui/icons-material';
import { useDropzone } from 'react-dropzone';
import hljs from 'highlight.js';
import mammoth from 'mammoth';

interface ChatInputProps {
  onSend: (message: string, files?: UploadedFile[]) => void;
  isLoading?: boolean;
  currentDiagram?: string;
}

declare global {
  interface Window {
    pdfjsLib: any;
  }
}

interface UploadedFile {
  file: File;
  content: string;
  type: 'code' | 'text' | 'pdf' | 'word';
  language?: string;
}

const ChatInput: React.FC<ChatInputProps> = ({ onSend, isLoading = false, currentDiagram }) => {
  const theme = useTheme();
  const [input, setInput] = useState('');
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [isExtracting, setIsExtracting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const loadPdfJs = async () => {
      const script = document.createElement('script');
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.9.359/pdf.min.js';
      script.async = true;
      
      script.onload = () => {
        window.pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.9.359/pdf.worker.min.js';
      };

      document.body.appendChild(script);
      
      return () => {
        document.body.removeChild(script);
      };
    };

    loadPdfJs();
  }, []);

  const detectFileType = (file: File): 'code' | 'text' | 'pdf' | 'word' => {
    if (file.type === 'application/pdf') return 'pdf';
    if (file.type === 'application/msword' || 
        file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') return 'word';
    
    const textExtensions = ['.txt', '.md', '.csv', '.json', '.xml', '.yml', '.yaml'];
    const codeExtensions = ['.js', '.jsx', '.ts', '.tsx', '.py', '.java', '.cpp', '.c', '.html', 
                           '.css', '.php', '.rb', '.go', '.rs', '.swift', '.kt', '.cs', '.m', 
                           '.scala', '.hs', '.sql', '.sh', '.ps1'];
    const extension = file.name.slice(file.name.lastIndexOf('.')).toLowerCase();
    
    if (textExtensions.includes(extension)) return 'text';
    if (codeExtensions.includes(extension)) return 'code';
    return 'text';
  };

  const detectLanguage = (content: string): string => {
    const detection = hljs.highlightAuto(content);
    return detection.language || 'plaintext';
  };

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
      reader.onerror = (error) => reject(error);
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

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    setIsExtracting(true);
    try {
      const processedFiles = await Promise.all(
        acceptedFiles.map(async (file) => {
          try {
            return await processFile(file);
          } catch (error) {
            console.error(`Failed to process file ${file.name}:`, error);
            // Return null for failed files
            return null;
          }
        })
      );
      // Filter out null values (failed files) and add successful ones
      const successfulFiles = processedFiles.filter((file): file is UploadedFile => file !== null);
      setUploadedFiles(prevFiles => [...prevFiles, ...successfulFiles]);
    } catch (error) {
      console.error('Error processing files:', error);
    } finally {
      setIsExtracting(false);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    noClick: true,
    accept: {
      'text/*': ['.txt', '.md', '.csv', '.json', '.xml', '.yml', '.yaml'],
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'text/plain': [
        '.js', '.jsx', '.ts', '.tsx', '.py', '.java', '.cpp', '.c', '.html', '.css', 
        '.php', '.rb', '.go', '.rs', '.swift', '.kt', '.cs', '.m', '.scala', '.hs', 
        '.sql', '.sh', '.ps1'
      ]
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if ((input.trim() || uploadedFiles.length > 0) && !isLoading && !isExtracting) {
      const formattedFiles = uploadedFiles.map((file, index) => {
        const fileInfo = `File: ${file.file.name} (${file.type.toUpperCase()}${file.language ? ` - ${file.language}` : ''})`;
        let formattedContent = file.content;
        
        if (file.type === 'code') {
          formattedContent = '```' + (file.language || '') + '\n' + formattedContent + '\n```';
        }
        
        return `<START DOCUMENT ${index + 1}>\n${fileInfo}\n\n${formattedContent}\n<END DOCUMENT ${index + 1}>`;
      }).join('\n\n');
  
      const fullMessage = [
        formattedFiles, 
        input.trim()
      ].filter(Boolean).join('\n\n');
      
      onSend(fullMessage);
      setInput('');
      setUploadedFiles([]);
    }
  };

  const handleRemoveFile = (fileToRemove: UploadedFile) => {
    setUploadedFiles(prevFiles => prevFiles.filter(file => file !== fileToRemove));
  };

  const handleFileButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
      fileInputRef.current.click();
    }
  };

  return (
    <Box
      sx={{
        position: 'absolute',
        bottom: '20px',
        width: '90%',
        maxWidth: '90%',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 1000,
      }}
    >
      {isExtracting && (
        <Alert 
          severity="info" 
          sx={{ 
            mb: 1, 
            borderRadius: '12px',
            backgroundColor: theme.palette.mode === 'light' 
              ? 'rgba(235, 235, 235, 0.9)'
              : 'rgba(50, 50, 50, 0.9)',
          }}
        >
          Extracting text from files...
        </Alert>
      )}
      
      {uploadedFiles.length > 0 && !isExtracting && (
        <Box sx={{ 
          display: 'flex', 
          flexWrap: 'wrap', 
          gap: 0.5, 
          mb: 1,
          maxWidth: '100%',
          overflow: 'hidden'
        }}>
          {uploadedFiles.map((file, index) => (
            <Chip
              key={index}
              icon={<InsertDriveFileOutlined fontSize="small" />}
              label={file.file.name}
              onDelete={() => handleRemoveFile(file)}
              size="medium"
              sx={{
                backgroundColor: theme.palette.mode === 'light' 
                  ? 'rgba(235, 235, 235, 0.9)'
                  : 'rgba(50, 50, 50, 0.9)',
              }}
            />
          ))}
        </Box>
      )}

      <div {...getRootProps()}>
        <Paper
          component="form"
          onSubmit={handleSubmit}
          sx={{
            p: '8px 16px',
            display: 'flex',
            alignItems: 'center',
            borderRadius: '24px',
            backgroundColor: theme.palette.mode === 'light' 
              ? 'rgba(235, 235, 235, 0.9)'
              : 'rgba(50, 50, 50, 0.9)',
            backdropFilter: 'blur(2px)',
            // boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
            border: isDragActive ? `2px solid ${theme.palette.primary.main}` : 'none',
          }}
          elevation={0}
        >
          <IconButton
            onClick={handleFileButtonClick}
            sx={{
              p: '8px',
              color: theme.palette.primary.main,
              '&:hover': {
                backgroundColor: theme.palette.mode === 'light'
                  ? 'rgba(0, 0, 0, 0.04)'
                  : 'rgba(255, 255, 255, 0.08)',
              },
            }}
          >
            <AttachFile />
          </IconButton>

          <InputBase
            sx={{
              ml: 1,
              flex: 1,
              '& input': {
                padding: '8px 0',
              },
            }}
            placeholder={isDragActive ? "Drop files here" : "Type your message"}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            autoComplete="off"
            disabled={isLoading || isExtracting}
          />

          <IconButton 
            type="submit" 
            disabled={(!input.trim() && uploadedFiles.length === 0) || isLoading || isExtracting}
            sx={{ 
              p: '8px',
              color: theme.palette.primary.main,
              '&:hover': {
                backgroundColor: theme.palette.mode === 'light'
                  ? 'rgba(0, 0, 0, 0.04)'
                  : 'rgba(255, 255, 255, 0.08)',
              },
            }}
          >
            {isLoading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              <Send />
            )}
          </IconButton>
        </Paper>

        <input {...getInputProps()} />
        <input
          type="file"
          ref={fileInputRef}
          style={{ display: 'none' }}
          onChange={(e) => e.target.files && onDrop(Array.from(e.target.files))}
          accept=".txt,.md,.csv,.json,.xml,.yml,.yaml,.pdf,.doc,.docx,.js,.jsx,.ts,.tsx,.py,.java,.cpp,.c,.html,.css,.php,.rb,.go,.rs,.swift,.kt,.cs,.m,.scala,.hs,.sql,.sh,.ps1"
          multiple
        />
      </div>
    </Box>
  );
};

export default ChatInput;