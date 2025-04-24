import { ref } from 'vue'
import AuthService from '@/services/AuthService'

const token = ref(localStorage.getItem('jwt') || '')
const error = ref(null)

export function useAuth() {
  const login = async (username, password) => {
    try {
      const data = await AuthService.login(username, password)
      console.log('✅ Réponse API login :', data) // ← Pour voir le contenu exact

      if (!data.token) {
        throw new Error("Le champ 'token' est manquant dans la réponse.")
      }

      token.value = data.token
      localStorage.setItem('jwt', token.value)
      error.value = null
      return true
    } catch (err) {
      error.value = err.message
      return false
    }
  }

  const extendSession = async () => {
    try {
      const data = await AuthService.extendSession(token.value)
      token.value = data.token
      localStorage.setItem('jwt', token.value)
    } catch (err) {
      console.error('Erreur d’extension de session :', err)
    }
  }

  const logout = () => {
    token.value = ''
    localStorage.removeItem('jwt')
  }

  return {
    token,
    login,
    logout,
    extendSession,
    error
  }
}
