import { ref } from 'vue'

const token = ref(localStorage.getItem('jwt') || '')

export function useAuth() {
  const error = ref(null)

  const login = async (username, password) => {
    try {
      const response = await fetch('https://edu.tardigrade.land/msg/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      })

      if (!response.ok) {
        throw new Error('Nom d’utilisateur ou mot de passe incorrect.')
      }

      const data = await response.json()
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
      const response = await fetch('https://edu.tardigrade.land/msg/extend_session', {
        method: 'GET',
        headers: { Authorization: `Bearer ${token.value}` }
      })

      if (!response.ok) throw new Error('Session invalide.')

      const data = await response.json()
      token.value = data.token
      localStorage.setItem('jwt', token.value)
    } catch (err) {
      console.error('Erreur d’extension de session:', err)
    }
  }

  const logout = () => {
    token.value = ''
    localStorage.removeItem('jwt')
  }

  return { token, login, extendSession, logout, error }
}
