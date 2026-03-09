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

export interface ChatHistoryItem {
  id: number;
  message: string;
  role: string;
  created_at: string;
}

interface ChatHistoryResponse {
  history: ChatHistoryItem[];
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
  },

  async getChatHistory(limit: number = 50): Promise<ChatHistoryItem[]> {
    try {
      const response = await api.get<ChatHistoryResponse>(`/chat/history?limit=${limit}`);
      return response.data.history;
    } catch (error) {
      console.error('Failed to fetch chat history:', error);
      throw error;
    }
  }
};
