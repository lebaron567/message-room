<script setup>
import { ref } from 'vue'
import { sendMessage } from '@/services/MessageService'
import { useAuth } from '@/js/useAuth'
import { useAuthStore } from '@/stores/auth'
import { useRoute } from 'vue-router'
import { banUserFromChannel } from '@/services/SalonService' 


const showBanModal = ref(false)
const userToBan = ref('')
const banning = ref(false)
const banFeedback = ref('')

const openBanModal = () => {
  userToBan.value = ''
  banFeedback.value = ''
  showBanModal.value = true
}

const banUser = async () => {
  try {
    banning.value = true
    await banUserFromChannel(route.params.id, userToBan.value.trim(), token.value)
    banFeedback.value = `✅ "${userToBan.value}" a été banni.`
    userToBan.value = ''
  } catch (err) {
    banFeedback.value = `❌ Erreur : ${err.message}`
  } finally {
    banning.value = false
  }
}

const messageText = ref('')
const imageUrl = ref('') // ✅ ajout nécessaire

const { token } = useAuth()
const authStore = useAuthStore()
const route = useRoute()

const emit = defineEmits(['messageSent'])

const handleSend = async () => {
  const channelId = route.params.id
  if (!messageText.value.trim() && !imageUrl.value.trim()) return

  const msg = imageUrl.value
    ? { type: 'Image', value: imageUrl.value }
    : { type: 'Text', value: messageText.value }

  await sendMessage(channelId, msg, token.value)

  messageText.value = ''
  imageUrl.value = ''
}
</script>


<template>
  <div class="message-input">
    <input v-model="messageText" placeholder="Écrire un message..." />
    <input v-model="imageUrl" placeholder="URL d'une image (https://...)" />
    <button @click="handleSend">Envoyer</button>
  </div>
  <button @click="openBanModal">🚫 Bannir un utilisateur</button>

  <div v-if="showBanModal" class="modal-overlay">
    <div class="modal">
      <h3>Bannir un utilisateur</h3>
      <input v-model="userToBan" placeholder="Pseudo à bannir" />
      <button @click="banUser" :disabled="banning">
        {{ banning ? 'Bannissement...' : 'Confirmer' }}
      </button>
      <p>{{ banFeedback }}</p>
      <button @click="showBanModal = false">Fermer</button>
    </div>
  </div>
</template>

<style scoped>
.message-input {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px;
  border-top: 1px solid #ddd;
  background-color: #fff;
  position: sticky;
  bottom: 0;
}

input {
  flex: 1;
  padding: 12px;
  border: 1px solid #ccc;
  border-radius: 20px;
  font-size: 14px;
  outline: none;
  transition: border-color 0.3s;
}

input:focus {
  border-color: #4CAF50;
}

button {
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 20px;
  padding: 10px 18px;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.3s;
}

.message-input input {
  flex: 1;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 16px;
  font-size: 14px;
  margin-right: 8px;
}

button:hover {
  background-color: #45a049;
}
</style>

