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

  // Envoi message texte
  if (messageText.value.trim()) {
    const textMsg = {
      type: 'Text',
      value: messageText.value
    }
    await sendMessage(channelId, textMsg, token.value)
    emit('messageSent', textMsg)
    messageText.value = ''
  }

  // Envoi image si présente
  if (imageUrl.value.trim()) {
    const imageMsg = {
      type: 'Image',
      value: imageUrl.value
    }
    await sendMessage(channelId, imageMsg, token.value)
    emit('messageSent', imageMsg)
    imageUrl.value = ''
  }
}

</script>


<template>
  <div class="message-input">
    <input
      v-model="messageText"
      @keyup.enter="handleSend"
      placeholder="Envoyer un message..."
    />
    <input
      v-model="imageUrl"
      @keyup.enter="handleSend"
      placeholder="URL d'image (facultatif)"
    />
    <button @click="handleSend">➤</button>
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
  position: fixed;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 60%;
  display: flex;
  align-items: center;
  gap: 10px;
  background-color: #2f3136;
  padding: 12px 16px;
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.2);
  z-index: 100;
}


.message-input input {
  flex: 1;
  padding: 12px;
  background-color: #32353b;
  color: #dcddde;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  outline: none;
  transition: background-color 0.2s ease;
}

.message-input input::placeholder {
  color: #72767d;
}

.message-input input:focus {
  background-color: #3c3f45;
}

.message-input button {
  background-color: #55C4FF;
  color: white;
  border: none;
  border-radius: 6px;
  padding: 10px 14px;
  font-weight: bold;
  cursor: pointer;
  font-size: 16px;
  transition: background-color 0.2s ease;
}

.message-input button:hover {
  background-color: #4752c4;
}
</style>
