import axios from 'axios';

const API_URL = 'https://edu.tardigrade.land/msg/protected/user/channels'; // Remplacez par l'URL de votre API
import { createPinia, setActivePinia } from 'pinia';
import { useAuthStore } from '@/stores/auth';

const pinia = createPinia();
setActivePinia(pinia);

const authStore = useAuthStore();
const token = authStore.token;
const SalonService = {
  async getSalons() {
    try {
      const response = await axios.get(API_URL, {
        headers: {
          Authorization: `Bearer ${token}` // Inclure le token dans l'en-tête Authorization
        }
      });
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la requête API:', error);
      throw error;
    }
  }
};
export default SalonService;
