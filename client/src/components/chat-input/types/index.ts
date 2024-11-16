export interface ChatInputProps {
    onSend: (message: string, files?: UploadedFile[]) => void;
    isLoading?: boolean;
    currentDiagram?: string;
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