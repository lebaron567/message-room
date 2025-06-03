let socket = null


export function connect(token, channelId, onMessage) {
  socket = new WebSocket(`wss://edu.tardigrade.land/msg/ws/channel/${channelId}/token/${token}`)

  socket.onopen = () => {
    console.log('🟢 WebSocket connecté')
  }

  socket.onmessage = (event) => {
    const message = JSON.parse(event.data)
    console.log('📨 Message WebSocket reçu :', message)
    if (onMessage) onMessage(message)
  }

  socket.onclose = () => {
    console.log('🔴 WebSocket déconnecté')
  }

  socket.onerror = (err) => {
    console.error('❌ Erreur WebSocket :', err)
  }
}
