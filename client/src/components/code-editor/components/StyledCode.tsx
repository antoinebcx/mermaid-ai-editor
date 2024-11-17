import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';

export const EditorContainer = styled(Box)(({ theme }) => ({
  position: 'relative',
  width: '100%',
  height: '100%',
  fontFamily: 'monospace',
}));

export const ButtonsContainer = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: '1rem',
  right: '1rem',
  zIndex: 20,
}));

export const CopyButton = styled(IconButton)(({ theme }) => ({
}));

export const EditorTextarea = styled('textarea')(({ theme }) => ({
  border: '1px solid transparent',
  position: 'absolute',
  inset: 0,
  width: '100%',
  height: '100%',
  paddingLeft: '3rem',
  paddingRight: '1rem',
  paddingTop: '1rem',
  paddingBottom: '8rem',
  fontFamily: 'Consolas, Monaco, "Andale Mono", monospace',
  fontSize: '0.875rem',
  lineHeight: '1.5',
  backgroundColor: 'transparent',
  resize: 'none',
  overflow: 'auto',
  whiteSpace: 'pre',
  zIndex: 10,
  color: 'transparent',
  caretColor: theme.palette.mode === 'dark' ? theme.palette.common.white : theme.palette.common.black,
  '&:focus': {
    outline: 'none',
  },
  tabSize: 4,
}));

export const SyntaxHighlight = styled(Box)(({ theme }) => ({
  position: 'absolute',
  inset: 0,
  width: '100%',
  height: '100%',
  paddingLeft: '3rem',
  paddingRight: '1rem',
  paddingTop: '1rem',
  paddingBottom: '8rem',
  fontFamily: 'Consolas, Monaco, "Andale Mono", monospace',
  fontSize: '0.875rem',
  lineHeight: '1.5',
  pointerEvents: 'none',
  overflow: 'auto',
  whiteSpace: 'pre',
  backgroundColor: theme.palette.mode === 'light' ? '#ffffff' : '#141414',
  color: theme.palette.mode === 'dark'
    ? '#eda234'
    : '#ff9800',
}));

export const LineNumbers = styled(Box)(({ theme }) => ({
  position: 'absolute',
  left: 0,
  top: '1rem',
  width: '3rem',
  textAlign: 'right',
  paddingRight: '1rem',
  fontSize: '0.875rem',
  lineHeight: '1.5',
  color: theme.palette.text.secondary,
  opacity: 0.5,
  userSelect: 'none',
}));

export const InteractiveLineNumbers = styled(LineNumbers)(({ theme }) => ({
  zIndex: 11,
  '& div': {
    cursor: 'pointer',
    position: 'relative',
    textAlign: 'right',
    '& .add-icon': {
      position: 'absolute',
      right: '-12px',
      top: '50%',
      transform: 'translateY(-50%)',
      opacity: 0,
      fontSize: '0.875rem',
      transition: 'opacity 0.2s ease',
    },
    '&:hover': {
      opacity: 1,
      backgroundColor: theme.palette.mode === 'dark'
        ? 'rgba(255, 255, 255, 0.1)'
        : 'rgba(0, 0, 0, 0.1)',
      '& .add-icon': {
        opacity: 1
      }
    }
  }
}));