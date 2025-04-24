import axios from 'axios';

const API_URL = 'https://edu.tardigrade.land/msg/protected/user/meta'; // Remplacez par l'URL de votre API

export default {
  async getSalons() {
    try {
      const response = await axios.get(API_URL);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la requête API:', error);
      throw error;
    }
  }
};
