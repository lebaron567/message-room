// src/services/SalonService.js
import axios from 'axios'

const BASE_URL = 'https://edu.tardigrade.land/msg/'

/**
 * Récupère la liste des salons de l'utilisateur connecté
 * @param {string} token - Token JWT d'authentification
 * @returns {Promise<Array>} - Liste des salons
 */
export async function getSalons(token) {
  try {
    const response = await axios.get(BASE_URL + "protected/user/channels", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    return response.data
  } catch (error) {
    console.error('❌ Erreur lors de la récupération des salons :', error)
    throw error
  }
}

export async function createSalon(salon, token) {
  try {
    const response = await axios.post(BASE_URL + "protected/channel", salon, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('❌ Erreur lors de la création du salon :', error);
    throw error;
  }
}  


export async function banUserFromChannel(channelId, userId, token) {
  const res = await fetch(`https://edu.tardigrade.land/msg/protected/channel/${channelId}/user/${userId}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  if (!res.ok) {
    const errData = await res.json()
    throw new Error(errData.message || 'Erreur lors du bannissement')
  }

  return true
}
