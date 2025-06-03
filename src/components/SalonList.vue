<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '@/js/useAuth'
import { getSalons } from '@/services/SalonService'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()
const { setCurrentSalon } = authStore

const salons = ref([])
const router = useRouter()
const { token } = useAuth()

const fetchSalons = async () => {
  try {
    salons.value = await getSalons(token.value)
  } catch (error) {
    console.error('❌ Erreur lors de la récupération des salons :', error)
  }
}

const openSalon = (salonId) => {
  console.log('➡️ Ouverture du salon ID :', salonId)
  setCurrentSalon(salonId)
  router.push({ name: 'SalonMessages', params: { id: salonId } })
}

onMounted(() => {
  if (token.value) {
    fetchSalons()
  } else {
    console.warn('🔒 Aucun token, redirection vers login possible ?')
    router.push('/')
  }
})
</script>

<template>
  <div class="container">
    <h1>Liste des Salons Privés</h1>
    <ul>
      <li
        v-for="salon in salons"
        :key="salon.id"
        @click="openSalon(salon.id)"
        class="salon-item"
      >
        <img :src="salon.img" :alt="salon.name" class="salon-image" />
        <span>{{ salon.name }}</span>
      </li>
    </ul>
    <button @click="router.push('/create-salon')">Créer un nouveau salon</button>
  </div>
</template>

<style scoped>
.container {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem 1rem;
}

h1 {
  text-align: center;
  margin-bottom: 2rem;
  font-size: 2rem;
  color: #FFF;
}

/* Liste des salons */
ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

/* Élément individuel de salon */
.salon-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  margin-bottom: 1rem;
  background-color: #ffffff;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  transition: background-color 0.2s ease, transform 0.1s ease;
  cursor: pointer;
}

.salon-item:hover {
  background-color: #f9f9f9;
  transform: translateY(-2px);
}

/* Image ronde */
.salon-image {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid #eee;
}

/* Nom du salon */
.salon-item span {
  font-size: 1.1rem;
  font-weight: 500;
  color: #333;
}

button {
  display: block;
  margin: 2rem auto 0;
  padding: 0.75rem 1.5rem;
  background-color: #55C4FF;
  color: #fff;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s ease, transform 0.1s ease;
}

button:hover {
  background-color: #3bb5f0;
  transform: translateY(-2px);
}

button:active {
  transform: translateY(0);
  background-color: #2da4dc;
}

</style>
