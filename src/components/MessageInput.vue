<script setup>
import { ref } from 'vue'
import { sendMessage } from '@/services/MessageService'
import { useAuth } from '@/js/useAuth'
import { useAuthStore } from '@/stores/auth'

const messageText = ref('')
const { token } = useAuth()
const authStore = useAuthStore()

const emit = defineEmits(['messageSent'])

const handleSend = async () => {
  if (!messageText.value.trim()) return

  const msg = {
    type: 'Text',
    value: messageText.value
  }

  // Envoi via WebSocket ou REST (dans sendMessage)
  await sendMessage(authStore.currentSalon, msg, token.value)

  emit('messageSent', {
    author: authStore.user?.username || 'Moi',
    content: msg
  })

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
  gap: 10px;
  margin-top: 10px;
}

input {
  flex: 1;
  padding: 8px;
}

button {
  padding: 8px 16px;
}
</style>
