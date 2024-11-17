import React, { useState, useRef, forwardRef, useImperativeHandle } from 'react';
import { Box, Alert, useTheme, Chip } from '@mui/material';
import { useDropzone } from 'react-dropzone';
import { FileChips } from './components/FileChips';
import { LineChips } from './components/LineChips';
import { InputField } from './components/InputField';
import { useFileProcessing } from './hooks/useFileProcessing';
import { usePdfLoader } from './hooks/usePdfLoader';
import { ChatInputProps, ChatInputRef, TargetedLine } from './types';
import { ACCEPTED_FILES } from './constants';

const ChatInput = forwardRef<ChatInputRef, ChatInputProps>(({ onSend, isLoading = false }, ref) => {
  const theme = useTheme();
  const [input, setInput] = useState('');
  const [targetedLines, setTargetedLines] = useState<TargetedLine[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const {
    uploadedFiles,
    isExtracting,
    handleFiles,
    removeFile,
    clearFiles
  } = useFileProcessing();

  usePdfLoader();

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: handleFiles,
    noClick: true,
    accept: ACCEPTED_FILES
  });

  const handleLineTarget = (lineNumber: number, lineContent: string) => {
    if (!targetedLines.some(line => line.number === lineNumber)) {
      setTargetedLines(prev => [...prev, { number: lineNumber, content: lineContent }]);
    }
  };

  useImperativeHandle(ref, () => ({
    handleLineTarget
  }));

  const removeTargetedLine = (lineNumber: number) => {
    setTargetedLines(prev => prev.filter(line => line.number !== lineNumber));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if ((input.trim() || uploadedFiles.length > 0 || targetedLines.length > 0) && !isLoading && !isExtracting) {
      const formattedFiles = uploadedFiles.map((file, index) => {
        const fileInfo = `File: ${file.file.name} (${file.type.toUpperCase()}${file.language ? ` - ${file.language}` : ''})`;
        let formattedContent = file.content;
        if (file.type === 'code') {
          formattedContent = '```' + (file.language || '') + '\n' + formattedContent + '\n```';
        }
        return `<START DOCUMENT ${index + 1}>\n${fileInfo}\n\n${formattedContent}\n<END DOCUMENT ${index + 1}>`;
      }).join('\n\n');

      const formattedLines = targetedLines.map(line => 
        `<TARGETED LINE ${line.number}>\n${line.content}\n</TARGETED LINE ${line.number}>`
      ).join('\n\n');

      const fullMessage = [formattedFiles, formattedLines, input.trim()]
        .filter(Boolean)
        .join('\n\n');

      onSend(fullMessage);
      setInput('');
      clearFiles();
      setTargetedLines([]);
    }
  };

  const handleFileButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
      fileInputRef.current.click();
    }
  };

  return (
    <Box sx={{
      position: 'absolute',
      bottom: '20px',
      width: '90%',
      maxWidth: '90%',
      left: '50%',
      transform: 'translateX(-50%)',
      zIndex: 1000,
    }}>
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
      <div {...getRootProps()}>
        <LineChips 
          lines={targetedLines}
          onRemove={removeTargetedLine}
        />
        
        <FileChips
          files={uploadedFiles}
          onRemove={removeFile}
          isExtracting={isExtracting}
        />
        
        <InputField
          value={input}
          onChange={setInput}
          onSubmit={handleSubmit}
          onFileButtonClick={handleFileButtonClick}
          isLoading={isLoading}
          isExtracting={isExtracting}
          isDragActive={isDragActive}
          disabled={isLoading || isExtracting}
        />
        <input {...getInputProps()} />
        <input
          type="file"
          ref={fileInputRef}
          style={{ display: 'none' }}
          onChange={(e) => e.target.files && handleFiles(Array.from(e.target.files))}
          accept={Object.values(ACCEPTED_FILES).flat().join(',')}
          multiple
        />
      </div>
    </Box>
  );
});

export default ChatInput;