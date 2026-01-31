import type { AuthResponse, User } from '../types';
import { mockUsers } from '../data/mockData';

const TOKEN_KEY = 'auth_token';
const REFRESH_TOKEN_KEY = 'refresh_token';
const USER_KEY = 'auth_user';

export const authService = {
    async login(username: string, password: string): Promise<AuthResponse> {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 800));

        const user = mockUsers.find(u => u.username === username);

        // Mock validation
        if (user && password === 'password') {
            const response: AuthResponse = {
                user,
                token: `mock_jwt_token_${crypto.randomUUID()}`,
                refreshToken: `mock_refresh_token_${crypto.randomUUID()}`
            };

            localStorage.setItem(TOKEN_KEY, response.token);
            localStorage.setItem(REFRESH_TOKEN_KEY, response.refreshToken);
            localStorage.setItem(USER_KEY, JSON.stringify(user));

            return response;
        }

        throw new Error('Invalid username or password');
    },

    logout() {
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(REFRESH_TOKEN_KEY);
        localStorage.removeItem(USER_KEY);
    },

    getCurrentUser(): User | null {
        const userStr = localStorage.getItem(USER_KEY);
        return userStr ? JSON.parse(userStr) : null;
    },

    getToken(): string | null {
        return localStorage.getItem(TOKEN_KEY);
    },

    async refreshToken(): Promise<string> {
        await new Promise(resolve => setTimeout(resolve, 500));
        const newToken = `mock_jwt_token_${crypto.randomUUID()}`;
        localStorage.setItem(TOKEN_KEY, newToken);
        return newToken;
    },

    isAuthenticated(): boolean {
        return !!localStorage.getItem(TOKEN_KEY);
    }
};
