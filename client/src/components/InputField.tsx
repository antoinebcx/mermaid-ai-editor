import { Paper, InputBase, IconButton, useTheme, CircularProgress } from '@mui/material';
import { Send, AttachFile } from '@mui/icons-material';

interface InputFieldProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  onFileButtonClick: () => void;
  isLoading: boolean;
  isExtracting: boolean;
  isDragActive: boolean;
  disabled: boolean;
}

export const InputField: React.FC<InputFieldProps> = ({
  value,
  onChange,
  onSubmit,
  onFileButtonClick,
  isLoading,
  isExtracting,
  isDragActive,
  disabled
}) => {
  const theme = useTheme();

  return (
    <Paper
      component="form"
      onSubmit={onSubmit}
      sx={{
        p: '8px 16px',
        display: 'flex',
        alignItems: 'center',
        borderRadius: '24px',
        backgroundColor: theme.palette.mode === 'light' 
          ? 'rgba(235, 235, 235, 0.9)'
          : 'rgba(40, 40, 40, 0.9)',
        backdropFilter: 'blur(2px)',
        border: isDragActive ? `2px solid ${theme.palette.primary.main}` : 'none',
      }}
      elevation={0}
    >
      <IconButton
        onClick={onFileButtonClick}
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
        value={value}
        onChange={(e) => onChange(e.target.value)}
        autoComplete="off"
        disabled={disabled}
      />

      <IconButton 
        type="submit" 
        disabled={(!value.trim() && disabled) || isLoading || isExtracting}
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
  );
};