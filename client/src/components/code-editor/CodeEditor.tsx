import React, { useRef, UIEvent, useMemo } from 'react';
import { useTheme, styled } from '@mui/material/styles';
import Tooltip from '@mui/material/Tooltip';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import AddIcon from '@mui/icons-material/Add';
import { useSyntaxHighlighting } from './hooks/useSyntaxHighlighting';
import { useClipboard } from './hooks/useClipboard';
import {
  EditorContainer,
  ButtonsContainer,
  CopyButton,
  EditorTextarea,
  SyntaxHighlight,
  LineNumbers,
  InteractiveLineNumbers
} from './components/StyledCode';
import DiagramTypeSelector from './components/DiagramTypeSelector';
import { CodeEditorProps } from './types';

const CodeEditor: React.FC<CodeEditorProps> = ({
  value,
  onChange,
  placeholder,
  className = '',
  onLineSelect,
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

  const lines = useMemo(() => value.split('\n'), [value]);
  const lineNumbers = useMemo(() =>
    Array.from({ length: lines.length }, (_, i) => i + 1),
    [lines.length]
  );
  const highlightedLines = useMemo(() => highlightSyntax(value), [value]);

  return (
    <EditorContainer className={className}>
      <ButtonsContainer>
      <Tooltip title={copied ? "Copied!" : "Copy code"}>
        <CopyButton onClick={() => handleCopy(value)} size="medium">
          <ContentCopyIcon fontSize="small" />
        </CopyButton>
      </Tooltip>
      <DiagramTypeSelector value={value} onChange={onChange} />
      </ButtonsContainer>
      <EditorTextarea
        ref={textareaRef}
        value={value}
        onChange={onChange}
        onScroll={syncScroll}
        placeholder={placeholder}
        spellCheck={false}
      />
      <InteractiveLineNumbers>
        {lineNumbers.map((num) => (
          <Tooltip key={num} title="Target this line" placement="right">
            <div onClick={() => onLineSelect?.(num, lines[num - 1])}>
              <span>{num}</span>
              <AddIcon className="add-icon" fontSize="small" />
            </div>
          </Tooltip>
        ))}
      </InteractiveLineNumbers>
      <SyntaxHighlight
        ref={highlightRef}
        onScroll={syncScroll}
      >
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