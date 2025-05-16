const API_BASE_URL = 'https://edu.tardigrade.land/msg'

export default {
  /**
   * Envoie une requête de connexion
   * @param {string} username
   * @param {string} password
   * @returns {Promise<{ token: string, admin: boolean }>}
   */
  async login(username, password) {
    const response = await fetch(`${API_BASE_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    })

    if (!response.ok) {
      const message = response.status === 403
        ? 'Nom d’utilisateur ou mot de passe incorrect.'
        : 'Erreur de connexion.'
      throw new Error(message)
    }

    return await response.json()
  },

  /**
   * Prolonge la session en récupérant un nouveau token
   * @param {string} token JWT actuel
   * @returns {Promise<{ token: string }>}
   */
  async extendSession(token) {
    const response = await fetch(`${API_BASE_URL}/protected/extend_session`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`
      }
    })

    if (!response.ok) {
      throw new Error('Impossible de prolonger la session.')
    }

    return await response.json()
  }
}