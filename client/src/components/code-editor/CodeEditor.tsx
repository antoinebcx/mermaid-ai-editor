import React, { useRef, UIEvent, useMemo } from 'react';
import { useTheme } from '@mui/material/styles';
import Tooltip from '@mui/material/Tooltip';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { useSyntaxHighlighting } from './hooks/useSyntaxHighlighting';
import { useClipboard } from './hooks/useClipboard';
import { 
  EditorContainer, 
  CopyButton, 
  EditorTextarea, 
  SyntaxHighlight, 
  LineNumbers,
} from './components/StyledCode';
import { CodeEditorProps } from './types';

const CodeEditor: React.FC<CodeEditorProps> = ({
  value,
  onChange,
  placeholder,
  className = '',
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const highlightRef = useRef<HTMLDivElement>(null);
  const { highlightSyntax } = useSyntaxHighlighting();
  const { copied, handleCopy } = useClipboard();

  const syncScroll = (e: UIEvent<HTMLElement>) => {
    const source = e.target as HTMLElement;
    if (textareaRef.current && highlightRef.current) {
      if (source === textareaRef.current) {
        highlightRef.current.scrollTop = source.scrollTop;
        highlightRef.current.scrollLeft = source.scrollLeft;
      } else {
        textareaRef.current.scrollTop = source.scrollTop;
        textareaRef.current.scrollLeft = source.scrollLeft;
      }
    }
  };

  const lineNumbers = useMemo(() => {
    return Array.from({ length: value.split('\n').length }, (_, i) => i + 1);
  }, [value]);

  const highlightedLines = useMemo(() => highlightSyntax(value), [value]);

  return (
    <EditorContainer className={className}>
      <Tooltip title={copied ? "Copied!" : "Copy code"}>
        <CopyButton onClick={() => handleCopy(value)} size="medium">
          <ContentCopyIcon fontSize="small" />
        </CopyButton>
      </Tooltip>

      <EditorTextarea
        ref={textareaRef}
        value={value}
        onChange={onChange}
        onScroll={syncScroll}
        placeholder={placeholder}
        spellCheck={false}
      />
      
      <SyntaxHighlight
        ref={highlightRef}
        onScroll={syncScroll}
      >
        <LineNumbers>
          {lineNumbers.map((num) => (
            <div key={num}>{num}</div>
          ))}
        </LineNumbers>
        {highlightedLines.map((line, i) => (
          <div
            key={i}
            dangerouslySetInnerHTML={{ __html: line }}
          />
        ))}
      </SyntaxHighlight>
    </EditorContainer>
  );
};

export default React.memo(CodeEditor);