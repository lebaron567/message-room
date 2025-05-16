import AuthService from '@/services/AuthService'
import { useAuthStore } from '@/stores/auth'

export function useAuth() {
  const store = useAuthStore()

  const login = async (username, password) => {
      console.log('🧪 login() appelé avec :', username, password) // ← ce log DOIT apparaître
    try {
      const data = await AuthService.login(username, password)
      console.log('✅ Réponse API login :', data)
      store.setToken(data.token)
      store.setUser({ username, admin: data.admin })
      store.setError(null);
      return true
    } catch (err) {
      store.setError(err.message); // à ajouter dans le store si besoin
      return false
    }
  }

  const extendSession = async () => {
    try {
      const data = await AuthService.extendSession(store.token)
      console.log('Réponse API reçue :', data)
      store.setToken(data.token)
    } catch (err) {
      console.error('Erreur d’extension de session :', err)
      store.clearAuth()
    }
  }

  const logout = () => {
    store.clearAuth()
  }

  return {
    login,
    logout,
    extendSession,
    token,
    user: store.user,
    error: store.error 
  }
}
