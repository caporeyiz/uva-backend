/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface User {
    id: string;
    name: string;
    email: string;
    major?: string;
    targetRank?: string;
    targetGoal?: string;
    educationStatus?: string;
    baseLevel?: any;
    currentNets?: any;
    dailyStudyHours?: string;
    schoolStatus?: string;
    hardestSubject?: string;
    photoURL?: string;
    phone?: string;
    schoolName?: string;
    subscriptionPlan?: string;
    is2FAEnabled?: boolean;
    notificationPrefs?: {
        email: boolean;
        push: boolean;
        sms: boolean;
    };
    aiDifficulty?: string;
    offDays?: string[];
    maxStudyHours?: string;
    library?: string[];
    role?: 'user' | 'admin';
}

const AUTH_KEY = 'yks_ai_auth_user';
const API_URL = 'http://localhost:3001/api';

export const authService = {
    register: async (
        name: string,
        email: string,
        pass: string,
        profileData?: {
            major?: string;
            targetRank?: string;
            targetGoal?: string;
            educationStatus?: string;
            baseLevel?: any;
            currentNets?: any;
            dailyStudyHours?: string;
            schoolStatus?: string;
            hardestSubject?: string;
        }
    ): Promise<User> => {
        try {
            const response = await fetch(`${API_URL}/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name,
                    email,
                    password: pass,
                    ...profileData
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Registration failed');
            }

            const user = await response.json();
            localStorage.setItem(AUTH_KEY, JSON.stringify(user));
            return user;
        } catch (error) {
            console.error('Registration error:', error);
            throw error;
        }
    },

    login: async (email: string, pass: string): Promise<User> => {
        try {
            const response = await fetch(`${API_URL}/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password: pass }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Login failed');
            }

            const user = await response.json();
            localStorage.setItem(AUTH_KEY, JSON.stringify(user));
            return user;
        } catch (error) {
            console.error('Login error:', error);
            throw error;
        }
    },

    logout: () => {
        localStorage.removeItem(AUTH_KEY);
    },

    updateProfile: async (id: string, updates: Partial<User>): Promise<User> => {
        try {
            const response = await fetch(`${API_URL}/update-profile`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ id, ...updates }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Update failed');
            }

            const updatedUser = await response.json();
            localStorage.setItem(AUTH_KEY, JSON.stringify(updatedUser));
            return updatedUser;
        } catch (error) {
            console.error('Update profile error:', error);
            throw error;
        }
    },

    getCurrentUser: (): User | null => {
        const userJson = localStorage.getItem(AUTH_KEY);
        return userJson ? JSON.parse(userJson) : null;
    }
};
