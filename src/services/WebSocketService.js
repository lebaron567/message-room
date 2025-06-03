let socket = null

export function connect(token, onMessage) {
  socket = new WebSocket(`wss://edu.tardigrade.land/msg/ws?token=${token}`)

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

export function send(messageObject) {
  if (socket?.readyState === WebSocket.OPEN) {
    socket.send(JSON.stringify(messageObject))
  } else {
    console.warn('⚠️ WebSocket non prêt')
  }
}

export function disconnect() {
  socket?.close()
}
