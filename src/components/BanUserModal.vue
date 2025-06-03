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
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal {
  background: #2c2f33;
  padding: 24px 30px;
  border-radius: 12px;
  min-width: 320px;
  box-shadow: 0 8px 24px rgba(0,0,0,0.25);
  color: #eee;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.modal h3 {
  margin-bottom: 16px;
  font-weight: 700;
  font-size: 1.3rem;
  color: #55C4FF;
  text-align: center;
}

.modal input {
  width: 100%;
  padding: 12px 14px;
  margin-bottom: 20px;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  outline: none;
  box-sizing: border-box;
  background-color: #40444b;
  color: #eee;
  transition: background-color 0.3s;
}

.modal input:focus {
  background-color: #4a4f57;
}

.actions {
  display: flex;
  justify-content: flex-end;
  gap: 14px;
}

button {
  padding: 10px 18px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  font-size: 1rem;
  transition: background-color 0.25s ease;
  user-select: none;
}

button:first-of-type {
  background-color: #e53935;
  color: white;
}

button:first-of-type:hover {
  background-color: #c7322d;
}

button:last-of-type {
  background-color: #72767d;
  color: #d1d3d8;
}

button:last-of-type:hover {
  background-color: #5a5e65;
}
</style>
