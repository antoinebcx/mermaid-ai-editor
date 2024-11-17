import { ChangeEvent } from 'react';

export interface CodeEditorProps {
  value: string;
  onChange: (e: ChangeEvent<HTMLTextAreaElement>) => void;
  placeholder?: string;
  className?: string;
  onLineSelect?: (lineNumber: number, lineContent: string) => void;
}

export interface SyntaxColors {
  keyword: string;
  node: string;
  operator: string;
  hexColor: (match: string) => string;
}