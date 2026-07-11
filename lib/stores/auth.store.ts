import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import api from '@/lib/api';

interface AuthUser {
  id: string;
  email: string;
  firstname: string;
  lastname: string;
  role: 'admin' | 'manager' | 'student';
}

interface AuthState {
  user: AuthUser | null;
  accessToken: string | null;

  setAuth: (user: AuthUser, token: string) => void;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,

      setAuth: (user, accessToken) =>
        set({
          user,
          accessToken,
        }),

      logout: async () => {
        try {
          // Appel backend pour invalider le refresh token/session
          await api.post('/auth/logout');

        } catch (error) {
          console.error('Erreur logout API:', error);

        } finally {
          // Nettoyage Zustand
          set({
            user: null,
            accessToken: null,
          });

          // Nettoyage localStorage (les deux emplacements où le token vit)
          localStorage.removeItem('auth-storage');
          localStorage.removeItem('accessToken');
        }
      },
    }),
    {
      name: 'auth-storage',
    }
  )
);