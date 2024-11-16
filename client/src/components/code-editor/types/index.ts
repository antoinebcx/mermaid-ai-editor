import { ChangeEvent } from 'react';

export interface CodeEditorProps {
  value: string;
  onChange: (e: ChangeEvent<HTMLTextAreaElement>) => void;
  placeholder?: string;
  className?: string;
}

export interface SyntaxColors {
  keyword: string;
  node: string;
  operator: string;
  hexColor: (match: string) => string;
}