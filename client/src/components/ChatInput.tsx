import React, { useState } from 'react';
import { 
  Paper, 
  InputBase, 
  IconButton, 
  useTheme,
  Box 
} from '@mui/material';
import { Send } from '@mui/icons-material';

interface ChatInputProps {
  onSend: (message: string) => void;
}

const ChatInput: React.FC<ChatInputProps> = ({ onSend }) => {
  const theme = useTheme();
  const [input, setInput] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      onSend(input);
      setInput('');
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
          boxShadow: theme.palette.mode === 'light'
            ? '2 0px 2px rgba(0, 0, 0, 0.1)'
            : '2 0px 2px rgba(0, 0, 0, 0.1)',
        }}
        elevation={0}
      >
        <InputBase
          sx={{
            ml: 1,
            flex: 1,
            '& input': {
              padding: '8px 0',
            },
          }}
          placeholder="Type your message"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          autoComplete="off"
        />
        <IconButton 
          type="submit" 
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
          <Send />
        </IconButton>
      </Paper>
    </Box>
  );
};

export default ChatInput;