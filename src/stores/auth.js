// stores/auth.js
import { defineStore } from 'pinia';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: null,
    user: null,
    error: null,
    currentSalonId: null,
  }),
  actions: {
    setToken(token) {
      this.token = token;
    },
    setUser(user) {
      this.user = user;
    },
    clearAuth() {
      this.token = null;
      this.user = null;
      this.error = null;
    },
    setError(message) {
      this.error = message;
    }
  },
  persist: true, 
});
