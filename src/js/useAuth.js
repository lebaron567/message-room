import AuthService from '@/services/AuthService'
import { useAuthStore } from '@/stores/auth'

export function useAuth() {
  const store = useAuthStore()

  const login = async (username, password) => {
    try {
      const data = await AuthService.login(username, password)
      store.setToken(data.token)
      store.setUser({ username, admin: data.admin })
      return true
    } catch (err) {
      store.error = err.message // à ajouter dans le store si besoin
      return false
    }
  }

  const extendSession = async () => {
    try {
      const data = await AuthService.extendSession(store.token)
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
    token: store.token,
    user: store.user
  }
}
