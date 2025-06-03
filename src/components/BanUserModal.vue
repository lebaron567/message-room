<script setup>
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import { useAuth } from '@/js/useAuth'

const showModal = ref(false)
const userToBan = ref('')
const route = useRoute()
const { token } = useAuth()

const channelId = route.params.id

const banUser = async () => {
  if (!userToBan.value.trim()) return alert("Veuillez saisir un pseudo")

  try {
    const res = await fetch(`https://edu.tardigrade.land/msg/protected/channel/${channelId}/user/${userToBan.value}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token.value}`,
      },
    })

    if (!res.ok) {
      const data = await res.json()
      throw new Error(data.message || 'Erreur')
    }

    alert(`✅ Utilisateur ${userToBan.value} banni`)
    userToBan.value = ''
    showModal.value = false
  } catch (err) {
    alert(`❌ Erreur : ${err.message}`)
  }
}
</script>

<template>
  <div>
    <button @click="showModal = true">🚫 Bannir un utilisateur</button>

    <div v-if="showModal" class="modal-overlay">
      <div class="modal">
        <h3>Bannir un utilisateur</h3>
        <input v-model="userToBan" placeholder="Pseudo de l'utilisateur" />
        <div class="actions">
          <button @click="banUser">Confirmer</button>
          <button @click="showModal = false">Annuler</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal {
  background: white;
  padding: 20px;
  border-radius: 8px;
  min-width: 300px;
}

.modal h3 {
  margin-bottom: 10px;
}

.modal input {
  width: 100%;
  padding: 10px;
  margin-bottom: 12px;
  border: 1px solid #ccc;
  border-radius: 6px;
}

.actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

button {
  padding: 8px 14px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: bold;
}

button:first-of-type {
  background-color: #e53935;
  color: white;
}

button:last-of-type {
  background-color: #ccc;
}
</style>
