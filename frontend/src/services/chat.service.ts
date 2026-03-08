import api from '../lib/api';

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface ChatRequest {
  message: string;
  context?: ChatMessage[];
}

export interface ChatResponse {
  response: string;
  timestamp: string;
}

export const chatService = {
  async sendMessage(request: ChatRequest): Promise<ChatResponse> {
    const response = await api.post('/chat', request);
    return response.data;
  },
};
