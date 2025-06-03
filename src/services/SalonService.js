// src/services/SalonService.js
import axios from 'axios'

const API_URL = 'https://edu.tardigrade.land/msg/protected/user/channels'

/**
 * Récupère la liste des salons de l'utilisateur connecté
 * @param {string} token - Token JWT d'authentification
 * @returns {Promise<Array>} - Liste des salons
 */
export async function getSalons(token) {
  try {
    const response = await axios.get(API_URL, {
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

export const addMemberToSalon = async (salonId, userIdentifier, token) => {
  const response = await fetch(`https://edu.tardigrade.land/msg/protected/channel/${salonId}/user/${userIdentifier}`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ user: userIdentifier }),
  })

  if (!response.ok) {
    const err = await response.json()
    throw new Error(err.message || 'Erreur lors de l’ajout du membre')
  }

  return await response.json()
}
