export const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:3001';

export const API_ENDPOINTS = {
  CHAT: `${API_BASE_URL}/api/chat`,
  DIAGRAMS: `${API_BASE_URL}/api/diagrams`,
} as const;

export const DEFAULT_HEADERS = {
  'Content-Type': 'application/json',
};