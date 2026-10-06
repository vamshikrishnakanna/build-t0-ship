/**
 * client/src/context/authStore.js
 * Zustand store for authentication state.
 * Persists token and user to localStorage.
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useAuthStore = create(
  persist(
    (set, get) => ({
      token: null,
      user: null,
      isAuthenticated: false,

      /**
       * Called after successful login/register.
       * @param {string} token - JWT token
       * @param {object} user - User profile object
       */
      setAuth: (token, user) => {
        set({ token, user, isAuthenticated: true });
      },

      /**
       * Clears all auth state and removes from localStorage.
       */
      logout: () => {
        set({ token: null, user: null, isAuthenticated: false });
      },

      /** Returns the current JWT token */
      getToken: () => get().token,
    }),
    {
      name: 'cropadvisor-auth',
      partialize: (state) => ({
        token: state.token,
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

export default useAuthStore;
