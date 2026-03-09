import { api } from '../lib/api';

export interface ChatMessage {
  role: string;
  content: string;
}

interface ChatRequest {
  messages: ChatMessage[];
}

interface ChatResponse {
  message: string;
}

export const chatService = {
  async sendMessage(messages: ChatMessage[]): Promise<string> {
    try {
      const response = await api.post<ChatResponse>('/chat/', {
        messages
      });
      
      return response.data.message;
    } catch (error) {
      console.error('Chat error:', error);
      throw error;
    }
  }
};
