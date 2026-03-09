import { api } from '../lib/api';

export interface User {
  id: number;
  email: string;
  phone?: string;
  full_name: string;
  role: string;
  is_active: boolean;
  is_verified: boolean;
  target_exam_date?: string;
  target_university?: string;
  target_department?: string;
  points: number;
  streak_days: number;
  created_at: string;
}

export const userService = {
  async getCurrentUser(): Promise<User> {
    const response = await api.get('/users/me');
    return response.data;
  },

  async updateProfile(data: Partial<User>): Promise<User> {
    const response = await api.put('/users/me', data);
    return response.data;
  },
};
