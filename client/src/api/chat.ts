import { API_ENDPOINTS, DEFAULT_HEADERS } from './config';

interface APIMessage {
  role: 'user' | 'assistant';
  content: string;
}

export const sendChatMessage = async (messages: APIMessage[]): Promise<string> => {
  try {
    const response = await fetch(API_ENDPOINTS.CHAT, {
      method: 'POST',
      headers: DEFAULT_HEADERS,
      body: JSON.stringify({ messages }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    if (!data.success || !data.data?.response) {
      throw new Error('Invalid response format from server');
    }

    return data.data.response;
  } catch (error) {
    console.error('Error sending chat message:', error);
    throw error;
  }
};

export const streamChatMessage = async (
  messages: APIMessage[], 
  onUpdate: (text: string) => void,
  onComplete: (text: string) => void,
  onError: (error: string) => void
) => {
  try {
    const response = await fetch(API_ENDPOINTS.CHAT, {
      method: 'POST',
      headers: {
        ...DEFAULT_HEADERS,
        'Accept': 'text/event-stream',
      },
      body: JSON.stringify({ messages }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const reader = response.body?.getReader();
    const decoder = new TextDecoder();

    if (!reader) {
      throw new Error('Response body is null');
    }

    let buffer = '';
    while (true) {
      const { value, done } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      
      // Process all complete lines
      buffer = lines.pop() || ''; // Keep the incomplete line in the buffer
      
      for (const line of lines) {
        if (line.startsWith('data: ')) {
          try {
            const data = JSON.parse(line.slice(6));
            
            switch (data.type) {
              case 'content':
                onUpdate(data.text);
                break;
              case 'done':
                onComplete(data.text);
                break;
              case 'error':
                onError(data.error);
                break;
            }
          } catch (e) {
            console.error('Error parsing SSE data:', e);
          }
        }
      }
    }
  } catch (error) {
    console.error('Error in stream:', error);
    onError(error instanceof Error ? error.message : 'Unknown error occurred');
  }
};