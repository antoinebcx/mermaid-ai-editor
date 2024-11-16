import { useState } from 'react';
import { ChatMessage, APIMessage } from '../types';
import { MAX_HISTORY_LENGTH } from '../constants';
import { sendChatMessage } from '../../../api';

export const useChat = (code: string, updateCode: (code: string) => void) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [chatError, setChatError] = useState<string | null>(null);
  const [isChatLoading, setIsChatLoading] = useState(false);

  const truncateMessageHistory = (messages: ChatMessage[], maxLength: number): ChatMessage[] => {
    let totalLength = 0;
    const truncatedMessages = [];

    for (let i = messages.length - 1; i >= 0; i--) {
      const messageLength = messages[i].content.length;

      if (totalLength + messageLength <= maxLength) {
        truncatedMessages.unshift(messages[i]);
        totalLength += messageLength;
      } else if (i === 0) {
        const remainingLength = maxLength - totalLength;
        if (remainingLength > 0) {
          truncatedMessages.unshift({
            ...messages[i],
            content: messages[i].content.slice(0, remainingLength),
          });
        } else {
          truncatedMessages.unshift({
            ...messages[i],
            content: '[Message truncated]',
          });
        }
      } else {
        break;
      }
    }

    return truncatedMessages;
  };

  const handleChatMessage = async (message: string) => {
    setIsChatLoading(true);
    setChatError(null);

    try {
      const userMessage: ChatMessage = {
        sender: 'user',
        content: `<USER_REQUEST>\n${message}\n</USER_REQUEST>\n\n<CURRENT_DIAGRAM>\n${code}\n</CURRENT_DIAGRAM>`
      };

      let updatedMessages = [...messages, userMessage];
      updatedMessages = truncateMessageHistory(updatedMessages, MAX_HISTORY_LENGTH);

      const apiMessages: APIMessage[] = updatedMessages.map((msg) => ({
        role: msg.sender,
        content: msg.content
      }));

      const response = await sendChatMessage(apiMessages);
      const cleanedResponse = response.replace(/^```mermaid\n?|\n?```$/g, '').trim();

      const assistantMessage: ChatMessage = {
        sender: 'assistant',
        content: cleanedResponse
      };

      updatedMessages = [...updatedMessages, assistantMessage];
      setMessages(updatedMessages);

      updateCode(cleanedResponse);
    } catch (error) {
      console.error('Chat error:', error);
      setChatError('Failed to process chat message. Please try again.');
    } finally {
      setIsChatLoading(false);
    }
  };

  return {
    messages,
    chatError,
    isChatLoading,
    handleChatMessage
  };
};