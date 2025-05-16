
<script setup>
import { ref, onMounted } from 'vue';
import SalonService from '@/services/SalonService';
import { useRouter } from 'vue-router';

const salons = ref([]);
const router = useRouter();

const fetchSalons = async () => {
  try {
    salons.value = await SalonService.getSalons();
  } catch (error) {
    console.error('Erreur lors de la récupération des salons:', error);
  }
};

const openSalon = (salonId) => {
  // Logique pour ouvrir l'historique des messages du salon
  console.log('Ouverture du salon avec ID:', salonId);
  // Par exemple, rediriger vers une autre vue ou composant
  router.push({ name: 'SalonMessages', params: { id: salonId } });
};

onMounted(() => {
  fetchSalons();
});
</script>


<template>
  <div>
    <h1>Liste des Salons Privés</h1>
    <ul>
      <li v-for="salon in salons" :key="salon.id" @click="openSalon(salon.id)" class="salon-item">
        <img :src="salon.img" :alt="salon.name" class="salon-image" />
        <span>{{ salon.name }}</span>
      </li>
    </ul>
  </div>
</template>


<style scoped>
.salon-item {
  display: flex;
  align-items: center;
  cursor: pointer;
  padding: 8px;
  border-bottom: 1px solid #ccc;
}

.salon-image {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  margin-right: 10px;
}
</style>
