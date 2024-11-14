import React, { ChangeEvent } from 'react';
import { useTheme, styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';

interface CodeEditorProps {
  value: string;
  onChange: (e: ChangeEvent<HTMLTextAreaElement>) => void;
  placeholder?: string;
  className?: string;
}

const EditorContainer = styled(Box)(({ theme }) => ({
  position: 'relative',
  width: '100%',
  height: '100%',
  fontFamily: 'monospace',
}));

const CopyButton = styled(IconButton)(({ theme }) => ({
  position: 'absolute',
  top: '1rem',
  right: '1rem',
  zIndex: 20,
  padding: '4px',
  backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0)' : 'rgba(0, 0, 0, 0)',
  '&:hover': {
    backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
  },
  opacity: 0.6
}));

const EditorTextarea = styled('textarea')(({ theme }) => ({
  border: '1px solid transparent',
  position: 'absolute',
  inset: 0,
  width: '100%',
  height: '100%',
  paddingLeft: '3rem',
  paddingRight: '1rem',
  paddingTop: '1rem',
  paddingBottom: '1rem',
  fontFamily: 'Consolas, Monaco, "Andale Mono", monospace',
  fontSize: '0.875rem',
  lineHeight: '1.5',
  backgroundColor: 'transparent',
  resize: 'none',
  overflow: 'auto',
  zIndex: 10,
  color: 'transparent',
  caretColor: theme.palette.mode === 'dark' ? theme.palette.common.white : theme.palette.common.black,
  '&::selection': {
    backgroundColor: theme.palette.mode === 'dark' 
      ? theme.palette.primary.dark 
      : theme.palette.primary.light,
  },
  '&:focus': {
    outline: 'none',
  },
  tabSize: 4,
}));

const SyntaxHighlight = styled(Box)(({ theme }) => ({
  position: 'absolute',
  inset: 0,
  width: '100%',
  height: '100%',
  paddingLeft: '3rem',
  paddingRight: '1rem',
  paddingTop: '1rem',
  paddingBottom: '1rem',
  fontFamily: 'Consolas, Monaco, "Andale Mono", monospace',
  fontSize: '0.875rem',
  lineHeight: '1.5',
  pointerEvents: 'none',
  overflow: 'auto',
  whiteSpace: 'pre',
  backgroundColor: theme.palette.mode === 'light' ? '#ffffff' : '#1e1e1e',
  color: theme.palette.mode === 'dark' 
    ? '#eda234'
    : '#FFA726',
}));

const LineNumbers = styled(Box)(({ theme }) => ({
  position: 'absolute',
  left: 0,
  top: 0,
  bottom: 0,
  width: '3rem',
  paddingTop: '1rem',
  textAlign: 'right',
  paddingRight: '1rem',
  fontSize: '0.875rem',
  lineHeight: '1.5',
  color: theme.palette.text.secondary,
  opacity: 0.5,
  userSelect: 'none',
}));

const CodeEditor: React.FC<CodeEditorProps> = ({
  value,
  onChange,
  placeholder,
  className = '',
}) => {
  const theme = useTheme();

  const getColors = () => ({
    keyword: theme.palette.mode === 'dark' ? '#B39DDB' : '#9575CD',
    node: theme.palette.mode === 'dark' ? '#4fa1e3' : '#64B5F6',
    operator: theme.palette.mode === 'dark' ? '#A5D6A7' : '#81C784',
    hexColor: (match: string) => match,
  });

  const handleCopy = () => {
    navigator.clipboard.writeText(value);
  };

  const highlightSyntax = (code: string): JSX.Element[] => {
    const colors = getColors();
    
    return code.split('\n').map((line, i) => {
      const coloredLine = line
        .replace(/#[A-Fa-f0-9]{6}/g, (match) => 
          `<span style="color: ${colors.hexColor(match)}">${match}</span>`)
        .replace(/\b(graph|TD|LR|TB|RL)\b/g, 
          `<span style="color: ${colors.keyword}">$1</span>`)
        .replace(/\b([A-Za-z])\b|([A-Za-z][A-Za-z0-9]*?)(\(.*?\)|\[.*?\])/g, (match, single, name, shape) => {
          if (single) {
            return `<span style="color: ${colors.node}">${single}</span>`;
          }
          return `<span style="color: ${colors.node}">${name}</span>${shape}`;
        })
        .replace(/-->/g, `<span style="color: ${colors.operator}">--></span>`);

      return (
        <div
          key={i}
          dangerouslySetInnerHTML={{ __html: coloredLine || '&nbsp;' }}
        />
      );
    });
  };

  const lineNumbers = React.useMemo(() => {
    return Array.from({ length: value.split('\n').length }, (_, i) => i + 1);
  }, [value]);

  return (
    <EditorContainer className={className}>
      <Tooltip title="Copy code">
        <CopyButton onClick={handleCopy} size="small">
          <ContentCopyIcon fontSize="small" />
        </CopyButton>
      </Tooltip>

      <EditorTextarea
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        spellCheck={false}
      />
      
      <SyntaxHighlight>
        {highlightSyntax(value)}
      </SyntaxHighlight>

      <LineNumbers>
        {lineNumbers.map((num) => (
          <div key={num}>{num}</div>
        ))}
      </LineNumbers>
    </EditorContainer>
  );
};

export default React.memo(CodeEditor);