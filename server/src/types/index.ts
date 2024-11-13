export interface Diagram {
    id?: string;
    content: string;
    created_at?: Date;
    updated_at?: Date;
}
  
export interface ChatMessage {
    message: string;
}
  
export interface ChatResponse {
    response: string;
}