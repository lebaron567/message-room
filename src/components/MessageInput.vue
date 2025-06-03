<script setup>
import { ref } from 'vue'
import { sendMessage } from '@/services/WebSocketService'

const message = ref('')

const handleSend = () => {
  if (message.value.trim()) {
    sendMessage({
      content: {
        type: 'Text',
        value: message.value
      }
    })
    message.value = ''
  }
}
</script>

<template>
  <form @submit.prevent="handleSend">
    <input v-model="message" placeholder="Tape ton message..." />
    <button type="submit">Envoyer</button>
  </form>
</template>
