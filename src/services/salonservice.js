import axios from 'axios';

const API_URL = 'https://edu.tardigrade.land/msg/protected/channel';

export async function createSalon(token, salon) {
  /**
   * Crée un salon
   * @param {string} token JWT actuel
   * @param {Object} salon Objet contenant les informations du salon
   * @returns {Promise<Object>} Réponse de l'API
   */
  const response = await axios.post(API_URL, salon, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },

  });
  return response.data;
}
