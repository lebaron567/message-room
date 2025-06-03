// src/services/MessageService.js
import axios from 'axios'

const API_URL = 'https://edu.tardigrade.land/msg'

export async function getMessages(channelId, batchOffset, token) {
  const response = await axios.get(`${API_URL}/protected/channel/${channelId}/messages/${batchOffset}`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })

  return response.data // Array of messages
}

let socket = null

export function connectWebSocket(token, onMessageReceived) {
  socket = new WebSocket(`wss://edu.tardigrade.land/msg/ws?token=${token}`)

  socket.onopen = () => {
    console.log('🟢 WebSocket connecté')
  }

  socket.onmessage = (event) => {
    const message = JSON.parse(event.data)
    console.log('📨 Message reçu :', message)
    onMessageReceived?.(message)
  }

  socket.onclose = () => {
    console.log('🔴 WebSocket fermé')
  }

  socket.onerror = (err) => {
    console.error('❌ WebSocket error :', err)
  }
}

export function sendMessage(messageObject) {
  if (socket && socket.readyState === WebSocket.OPEN) {
    socket.send(JSON.stringify(messageObject))
  } else {
    console.warn('⚠️ WebSocket non connecté')
  }
}

export function closeWebSocket() {
  socket?.close()
}
