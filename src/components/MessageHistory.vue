<script setup>
import { ref, onMounted, nextTick } from 'vue'
import { useAuth } from '@/js/useAuth'
import { useAuthStore } from '@/stores/auth'
import { getMessages } from '@/services/MessageService'
import MessageInput from '@/components/MessageInput.vue'
import { useRoute } from 'vue-router'
import { connect } from '@/services/WebSocketService'
import { moderateMessage } from '@/services/MessageService'
import { getSalons } from '@/services/SalonService'

const authStore = useAuthStore()
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
    if (newMessages.length < batchSize) hasMore.value = false
    messages.value = [...newMessages, ...messages.value]
    offset.value += batchSize
    await nextTick()
    const container = document.querySelector('.message-history')
    if (container) container.scrollTop = container.scrollHeight
  } catch (err) {
    console.error('❌ Erreur de chargement :', err)
  }
}

onMounted(async () => {
  if (token.value && channelId) {
    await loadCreator()
    loadMessages()
    connect(token.value, channelId, (msg) => {
      messages.value.push(msg)
    })
  } else {
    console.warn('⛔️ Token ou channelId manquant')
  }
})

const moderate = async (timestamp, author) => {
  const replacement = prompt('Contenu de remplacement :', '[message modéré]')
  if (!replacement) return

  const newContent = {
    type: 'Text',
    value: replacement
  }

  try {
    await moderateMessage(Number(channelId), timestamp, author, newContent, token.value)
    alert('✅ Message modéré')
    const msg = messages.value.find(m => m.timestamp === timestamp && m.author === author)
    if (msg) msg.content = newContent
  } catch (e) {
    console.error('❌ Erreur de modération', e)
    alert('❌ Erreur de modération')
  }
}


</script>

<template>
  <div class="chat-wrapper">
    <div class="message-history">
      <button v-if="hasMore" @click="loadMessages">⬆ Charger les anciens messages</button>

      <div
        v-for="msg in messages"
        :key="msg.timestamp || msg.id"
        :class="['message', msg.author === authStore.user?.username ? 'right' : 'left']"
      >
        <strong>{{ msg.author || 'Utilisateur' }}</strong>
        <template v-if="msg.content?.type === 'Image'">
          <img :src="msg.content.value" alt="image" />
        </template>
        <template v-else>
          {{ msg.content?.value || msg.content }}
        </template>
      </div>
    </div>

    <MessageInput />
  </div>
</template>

<style scoped>
.chat-wrapper {
  width: 60%;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: #2b2d31; /* Discord dark */
  color: #e0e0e0;
  padding-bottom: 80px; /* leave room for input */
  font-family: 'Segoe UI', sans-serif;
}

.message-history {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.message {
  max-width: 75%;
  padding: 12px 16px;
  border-radius: 12px;
  font-size: 14px;
  line-height: 1.4;
  word-break: break-word;
  background-color: #40444b;
}

.message.left {
  align-self: flex-start;
  background-color: #40444b;
  border: 1px solid #303338;
}

.message.right {
  align-self: flex-end;
  background-color: #55C4FF;
  color: white;
  border: 1px solid #55C4FF;
}

.message strong {
  display: block;
  font-weight: 600;
  margin-bottom: 4px;
  color: #ffffff;
}

.message img {
  max-width: 100%;
  border-radius: 6px;
  margin-top: 6px;
  border: 1px solid #222;
}

button {
  background-color: #55C4FF;
  color: white;
  border: none;
  padding: 6px 10px;
  border-radius: 6px;
  cursor: pointer;
  align-self: center;
  font-size: 12px;
  transition: background 0.3s;
}

button:hover {
  background-color: #4752c4;
}
</style>
