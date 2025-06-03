<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useAuth } from '@/js/useAuth'
import { getMessages } from '@/services/MessageService'

const { token } = useAuth()
const route = useRoute()
const channelId = route.params.id

const messages = ref([])
const offset = ref(0)
const batchSize = 40
const hasMore = ref(true)

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
  if (token.value) {
    loadMessages()
  }
})
</script>

<template>
  <div class="message-history">
    <button v-if="hasMore" @click="loadMessages">⬆️ Charger les messages précédents</button>

    <div class="message" v-for="msg in messages" :key="msg.id">
      <strong>{{ msg.user?.username || 'Utilisateur' }} :</strong> {{ msg.content }}
    </div>
  </div>
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
