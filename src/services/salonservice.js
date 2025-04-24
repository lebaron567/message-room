// SalonService.js
import axios from 'axios';

const API_URL = 'https://edu.tardigrade.land/msg/protected/channel'; // Remplace par l’URL de ton API

/**
 * Crée un nouveau salon
 * @param {Object} salon - Données du salon
 * @param {string} salon.name - Nom du salon
 * @param {string} salon.img - URL de l'image du salon
 * @returns {Promise<Object>} Réponse de l’API
 */
export async function createSalon(salon) {
  try {
    const response = await axios.post(API_URL, salon, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`, // Si l’authentification est nécessaire
      }
    });
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la création du salon :', error.response?.data || error.message);
    throw error;
  }
}
