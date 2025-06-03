<script setup>
import { ref } from 'vue'
import { sendMessage } from '@/services/MessageService'
import { useAuth } from '@/js/useAuth'
import { useAuthStore } from '@/stores/auth'
import { useRoute } from 'vue-router'

const messageText = ref('')
const { token } = useAuth()
const authStore = useAuthStore()
const route = useRoute()

const emit = defineEmits(['messageSent'])

const handleSend = async () => {
  if (!messageText.value.trim()) return
  
  const channelId = route.params.id // ✅ on lit directement depuis l'URL
  const msg = {
    type: 'Text',
    value: messageText.value
  }

  // Envoi via WebSocket ou REST (dans sendMessage)
await sendMessage(channelId, msg, token.value)


  messageText.value = ''
}
</script>

<template>
  <div class="message-input">
    <input v-model="messageText" @keyup.enter="handleSend" placeholder="Écrire un message..." />
    <button @click="handleSend">Envoyer</button>
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

button:hover {
  background-color: #45a049;
}
</style>

