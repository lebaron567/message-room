<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '@/js/useAuth'
import { getSalons, addMemberToSalon } from '@/services/SalonService' // ✅ ajout fonction
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()
const { setCurrentSalon } = authStore

const salons = ref([])
const showModalId = ref(null) // ID du salon actif
const newMember = ref('')     // Email ou ID du membre
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

const openModal = (salonId) => {
  showModalId.value = salonId
  newMember.value = ''
}

const closeModal = () => {
  showModalId.value = null
  newMember.value = ''
}

const handleAddMember = async (salonId) => {
  if (!newMember.value) return alert('Veuillez saisir un identifiant.')
  try {
    await addMemberToSalon(salonId, newMember.value, token.value)
    alert(`✅ Membre ajouté au salon avec succès !`)
    closeModal()
  } catch (error) {
    console.error('❌ Erreur lors de l’ajout :', error)
    alert("Erreur lors de l'ajout du membre.")
  }
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
        class="salon-item"
      >
        <img :src="salon.img" :alt="salon.name" class="salon-image" @click="openSalon(salon.id)" />
        <span @click="openSalon(salon.id)" style="flex: 1;">{{ salon.name }}</span>
        <button @click="openModal(salon.id)">Ajouter un membre</button>

        <!-- ✅ Modale -->
        <div v-if="showModalId === salon.id" class="modal-overlay">
          <div class="modal-content">
            <h3>Ajouter un membre à {{ salon.name }}</h3>
            <input v-model="newMember" placeholder="Email ou ID du membre" />
            <div class="modal-actions">
              <button @click="handleAddMember(salon.id)">Ajouter</button>
              <button @click="closeModal">Annuler</button>
            </div>
          </div>
        </div>
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
  cursor: pointer;
}
button {
  margin-left: 10px;
  cursor: pointer;
}
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}
.modal-content {
  background: white;
  padding: 20px;
  border-radius: 12px;
  min-width: 300px;
}
.modal-actions {
  margin-top: 10px;
  display: flex;
  gap: 10px;
}
input {
  width: 100%;
  padding: 8px;
  margin-top: 10px;
}
</style>
