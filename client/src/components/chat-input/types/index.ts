export interface ChatInputProps {
    onSend: (message: string, files?: UploadedFile[]) => void;
    isLoading?: boolean;
    currentDiagram?: string;
}

export interface ChatInputRef {
    handleLineTarget: (lineNumber: number, lineContent: string) => void;
}
  
export interface UploadedFile {
    file: File;
    content: string;
    type: 'code' | 'text' | 'pdf' | 'word';
    language?: string;
}
  
declare global {
    interface Window {
      pdfjsLib: any;
    }
}
  
export interface StyleProps {
    isDragActive?: boolean;
    isExtracting?: boolean;
    isLoading?: boolean;
}

export interface TargetedLine {
    number: number;
    content: string;
}
  
export interface LineChipsProps {
    lines: TargetedLine[];
    onRemove: (lineNumber: number) => void;
}