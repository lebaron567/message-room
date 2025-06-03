<script setup>
import { ref, onMounted } from 'vue'
import { useAuth } from '@/js/useAuth'
import { useAuthStore } from '@/stores/auth'
import { getMessages } from '@/services/MessageService'
import MessageInput from '@/components/MessageInput.vue'
import { useRoute } from 'vue-router'


const authStore = useAuthStore()
const { token } = useAuth()
const route = useRoute()
const channelId = route.params.id


const messages = ref([])
const offset = ref(0)
const batchSize = 40
const hasMore = ref(true)

const onMessageSent = (msg) => {
  messages.value.push(msg) // On l'ajoute en bas de la liste
}

const loadMessages = async () => {
  try {
    const newMessages = await getMessages(channelId, offset.value, token.value)
    if (newMessages.length < batchSize) {
      hasMore.value = false
    }
    messages.value = [...newMessages, ...messages.value]
    offset.value += batchSize
  } catch (err) {
    console.error('❌ Erreur lors du chargement des messages :', err)
  }
}

onMounted(() => {
  if (token.value && channelId) {
    loadMessages()
  } else {
    console.warn('⛔️ Token ou salon manquant')
  }
})
</script>
<template>
  <div class="message-history">
    <button v-if="hasMore" @click="loadMessages">⬆️ Charger les messages précédents</button>

    <div v-for="msg in messages" :key="msg.timestamp || msg.id" class="message">
      <strong>{{ msg.author || 'Utilisateur' }} :</strong>
      <template v-if="msg.content?.type === 'Image'">
        <img :src="msg.content.value" alt="image" style="max-height: 100px" />
      </template>
      <template v-else>
        {{ msg.content?.value || msg.content }}
      </template>
    </div>
  </div>

  <MessageInput @messageSent="onMessageSent" />
</template>


<style scoped>
.message-history {
  max-height: 400px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
}

.message {
  padding: 5px;
  border-bottom: 1px solid #ddd;
}
</style>
