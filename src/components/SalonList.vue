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
const { token } = useAuth() // ✅ récupère le token réactif

const fetchSalons = async () => {
  try {
    salons.value = await getSalons(token.value) // ✅ injecte le token
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
  <div>
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

.salon-item:hover {
  background-color: #f5f5f5;
}

.salon-image {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  margin-right: 10px;
}
</style>