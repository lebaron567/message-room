<script setup>
import { ref, onMounted, nextTick  } from 'vue'
import { useAuth } from '@/js/useAuth'
import { useAuthStore } from '@/stores/auth'
import { getMessages} from '@/services/MessageService'
import MessageInput from '@/components/MessageInput.vue'
import { useRoute } from 'vue-router'
import { connect } from '@/services/WebSocketService'
import { moderateMessage } from '@/services/MessageService'
import { getSalons } from '@/services/SalonService'

const authStore = useAuthStore()
const { token } = useAuth()
const route = useRoute()
const props = defineProps(['id'])
const channelId = props.id// ✅ récupération dynamique de l'ID

const messages = ref([])
const offset = ref(0)
const batchSize = 40
const hasMore = ref(true)
const creator = ref('')

const loadCreator = async () => {
  try {
    const salons = await getSalons(token.value)
    const current = salons.find(s => s.id == channelId)
    if (current) creator.value = current.creator
  } catch (err) {
    console.error('❌ Erreur chargement du créateur du salon', err)
  }
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
  await nextTick()  // attendre que le DOM soit mis à jour
  const container = document.querySelector('.message-history')
  container.scrollTop = container.scrollHeight
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
  <div class="message-history">
    <button v-if="hasMore" @click="loadMessages">⬆️ Charger les messages précédents</button>

  <div v-for="msg in messages"
    :key="msg.timestamp || msg.id"
    :class="['message', msg.author === authStore.user?.username ? 'right' : 'left']"
  >
    <strong>{{ msg.author || 'Utilisateur' }} :</strong>
    <template v-if="msg.content?.type === 'Image'">
      <img :src="msg.content.value" alt="image" />
    </template>
    <template v-else>
      {{ msg.content?.value || msg.content }}
    </template>
    <button
      v-if="authStore.user?.username === creator"
      @click="moderate(msg.timestamp, msg.author)"
      class="mod-btn"
    >
      🛠 Modérer
    </button>
  </div>
  </div>
  <MessageInput  />
</template>


<style scoped>
.message-history {
  height: 400px;
  overflow-y: auto;
  padding: 10px;
  background-color: #f9f9f9;
  display: flex;
  flex-direction: column;
  gap: 10px;
  border: 1px solid #ccc;
  border-radius: 8px;
}

.message {
  max-width: 75%;
  padding: 10px 14px;
  border-radius: 12px;
  word-break: break-word;
  font-size: 14px;
  display: inline-block;
}

.message.left {
  align-self: flex-start;
  background-color: #ffffff;
  border: 1px solid #ddd;
  color: #000;
}

.message.right {
  align-self: flex-end;
  background-color: #d1e7ff;
  border: 1px solid #80bdff;
  color: #000;
}

.message strong {
  display: block;
  font-weight: bold;
  margin-bottom: 4px;
}

.message img {
  max-width: 100%;
  border-radius: 6px;
  margin-top: 6px;
}

button {
  background-color: #007bff;
  color: white;
  border: none;
  padding: 8px 12px;
  border-radius: 6px;
  cursor: pointer;
  margin-top: 10px;
}

.mod-btn {
  background-color: #dc3545;
  color: white;
  border: none;
  margin-top: 6px;
  padding: 4px 10px;
  border-radius: 6px;
  font-size: 12px;
  cursor: pointer;
}

.mod-btn:hover {
  background-color: #c82333;
}
</style>
