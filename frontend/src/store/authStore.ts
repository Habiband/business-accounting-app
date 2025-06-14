import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { authApi } from '@/lib/api';
import { toast } from 'react-hot-toast';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  role: 'CUSTOMER' | 'ADMIN' | 'SUPER_ADMIN';
  emailVerified: boolean;
  avatar?: string;
  createdAt: string;
  updatedAt: string;
}

interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

interface AuthActions {
  login: (credentials: { email: string; password: string }) => Promise<void>;
  register: (userData: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    phone?: string;
  }) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (data: Partial<User>) => Promise<void>;
  changePassword: (data: { currentPassword: string; newPassword: string }) => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
  resetPassword: (data: { token: string; password: string }) => Promise<void>;
  loadUser: () => Promise<void>;
  setTokens: (accessToken: string, refreshToken: string) => void;
  clearAuth: () => void;
}

type AuthStore = AuthState & AuthActions;

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      // Initial state
      user: null,
      accessToken: null,
      refreshToken: null,
      isLoading: false,
      isAuthenticated: false,

      // Actions
      login: async (credentials) => {
        try {
          set({ isLoading: true });
          const response = await authApi.login(credentials);
          
          if (response.success && response.data) {
            const { user, tokens } = response.data;
            
            // Store tokens in localStorage
            localStorage.setItem('accessToken', tokens.accessToken);
            localStorage.setItem('refreshToken', tokens.refreshToken);
            
            set({
              user,
              accessToken: tokens.accessToken,
              refreshToken: tokens.refreshToken,
              isAuthenticated: true,
              isLoading: false,
            });
            
            toast.success('Login successful!');
          }
        } catch (error: any) {
          set({ isLoading: false });
          throw error;
        }
      },

      register: async (userData) => {
        try {
          set({ isLoading: true });
          const response = await authApi.register(userData);
          
          if (response.success && response.data) {
            const { user, tokens } = response.data;
            
            // Store tokens in localStorage
            localStorage.setItem('accessToken', tokens.accessToken);
            localStorage.setItem('refreshToken', tokens.refreshToken);
            
            set({
              user,
              accessToken: tokens.accessToken,
              refreshToken: tokens.refreshToken,
              isAuthenticated: true,
              isLoading: false,
            });
            
            toast.success('Registration successful!');
          }
        } catch (error: any) {
          set({ isLoading: false });
          throw error;
        }
      },

      logout: async () => {
        try {
          await authApi.logout();
        } catch (error) {
          // Continue with logout even if API call fails
          console.error('Logout API error:', error);
        } finally {
          // Clear tokens from localStorage
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          
          set({
            user: null,
            accessToken: null,
            refreshToken: null,
            isAuthenticated: false,
          });
          
          toast.success('Logged out successfully');
        }
      },

      updateProfile: async (data) => {
        try {
          set({ isLoading: true });
          const response = await authApi.updateProfile(data);
          
          if (response.success && response.data) {
            set({
              user: response.data.user,
              isLoading: false,
            });
            
            toast.success('Profile updated successfully!');
          }
        } catch (error: any) {
          set({ isLoading: false });
          throw error;
        }
      },

      changePassword: async (data) => {
        try {
          set({ isLoading: true });
          await authApi.changePassword(data);
          
          set({ isLoading: false });
          toast.success('Password changed successfully!');
        } catch (error: any) {
          set({ isLoading: false });
          throw error;
        }
      },

      forgotPassword: async (email) => {
        try {
          set({ isLoading: true });
          await authApi.forgotPassword(email);
          
          set({ isLoading: false });
          toast.success('Password reset link sent to your email!');
        } catch (error: any) {
          set({ isLoading: false });
          throw error;
        }
      },

      resetPassword: async (data) => {
        try {
          set({ isLoading: true });
          await authApi.resetPassword(data);
          
          set({ isLoading: false });
          toast.success('Password reset successfully!');
        } catch (error: any) {
          set({ isLoading: false });
          throw error;
        }
      },

      loadUser: async () => {
        try {
          const token = localStorage.getItem('accessToken');
          if (!token) return;

          set({ isLoading: true });
          const response = await authApi.getProfile();
          
          if (response.success && response.data) {
            set({
              user: response.data.user,
              isAuthenticated: true,
              isLoading: false,
            });
          }
        } catch (error) {
          // Token might be invalid, clear auth
          get().clearAuth();
        }
      },

      setTokens: (accessToken, refreshToken) => {
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', refreshToken);
        
        set({
          accessToken,
          refreshToken,
          isAuthenticated: true,
        });
      },

      clearAuth: () => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        
        set({
          user: null,
          accessToken: null,
          refreshToken: null,
          isAuthenticated: false,
        });
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
