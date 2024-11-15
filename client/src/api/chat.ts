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