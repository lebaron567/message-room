import AuthService from '@/services/AuthService'
import { useAuthStore } from '@/stores/auth'
import { storeToRefs } from 'pinia'


export function useAuth() {
  const store = useAuthStore()
  const { token, user, error } = storeToRefs(store)


  const login = async (username, password) => {

    try {
      const data = await AuthService.login(username, password)
      store.setToken(data.token)
      store.setUser({ username, admin: data.admin })
      store.setError(null);
      return true
    } catch (err) {
      store.setError(err.message); 
      return false
    }
  }

  const extendSession = async () => {
    try {
      const data = await AuthService.extendSession(token.value)
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
    user,
    error
  }
}
