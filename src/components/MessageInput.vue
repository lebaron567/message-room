<script setup>
import { ref, onMounted } from 'vue'
import { sendMessage } from '@/services/MessageService'
import { getChannelMembers, addUserToChannel, removeUserFromChannel } from '@/services/SalonService'
import { useAuth } from '@/js/useAuth'
import { useAuthStore } from '@/stores/auth'
import { useRoute } from 'vue-router'

const messageText = ref('')
const showModal = ref(false)
const members = ref([])
const newMemberUsername = ref('')
const loadingMembers = ref(false)
const route = useRoute()
const channelId = route.params.id

const { token } = useAuth()
const authStore = useAuthStore()

const emit = defineEmits(['messageSent'])

const handleSend = async () => {
  if (!messageText.value.trim()) return

  const msg = { type: 'Text', value: messageText.value }
  await sendMessage(channelId, msg, token.value)
  messageText.value = ''
}

const fetchMembers = async () => {
  try {
    loadingMembers.value = true
    members.value = await getChannelMembers(channelId, token.value)
  } catch (error) {
    alert('❌ Erreur chargement membres')
  } finally {
    loadingMembers.value = false
  }
}

const handleAddMember = async () => {
  try {
    if (!newMemberUsername.value.trim()) return
    await addUserToChannel(channelId, newMemberUsername.value, token.value)
    newMemberUsername.value = ''
    await fetchMembers()
  } catch (err) {
    alert('❌ Utilisateur non ajouté : ' + err.message)
  }
}

const handleRemoveMember = async (userId) => {
  try {
    await removeUserFromChannel(channelId, userId, token.value)
    await fetchMembers()
  } catch (err) {
    alert('❌ Erreur suppression : ' + err.message)
  }
}

const openModal = async () => {
  await fetchMembers()
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
}
</script>

<template>
  <div class="message-input">
    <input v-model="messageText" @keyup.enter="handleSend" placeholder="Écrire un message..." />
    <button @click="handleSend">Envoyer</button>
    <button @click="openModal">👥 Gérer les membres</button>

    <!-- ✅ Modale des membres -->
    <div v-if="showModal" class="modal-overlay">
      <div class="modal-content">
        <h3>👥 Membres du salon</h3>

        <!-- Ajout de membre -->
        <div class="add-member">
          <input v-model="newMemberUsername" placeholder="Nom d'utilisateur à ajouter" />
          <button @click="handleAddMember">➕ Ajouter</button>
        </div>

        <div v-if="loadingMembers">Chargement...</div>

        <ul v-else>
          <li v-for="member in members" :key="member.id" class="member-item">
            {{ member.username || member.email || member.id }}
            <button @click="handleRemoveMember(member.id)">❌ Bannir</button>
          </li>
        </ul>

        <button class="close-btn" @click="closeModal">Fermer</button>
      </div>
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
}
button:hover {
  background-color: #45a049;
}

/* Modale */
.modal-overlay {
  position: fixed;
  top: 0; left: 0;
  width: 100vw; height: 100vh;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}
.modal-content {
  background: white;
  padding: 20px;
  border-radius: 12px;
  min-width: 320px;
  max-height: 80vh;
  overflow-y: auto;
}
.add-member {
  display: flex;
  gap: 10px;
  margin-bottom: 10px;
}
.member-item {
  display: flex;
  justify-content: space-between;
  padding: 6px 0;
}
.close-btn {
  margin-top: 10px;
  background-color: #aaa;
}
</style>
