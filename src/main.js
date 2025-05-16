import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { createPinia } from 'pinia'
import { useAuth } from '@/js/useAuth'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)     // ✅ Activer Pinia AVANT
app.use(router)
app.mount('#app')  // Puis monter l'app

// ✅ Ensuite SEULEMENT tu peux utiliser `useAuth()` en dehors des composants
const { token, extendSession } = useAuth()

if (token.value) {
  extendSession().then(() => {
    console.log('✅ Session étendue au démarrage')
  }).catch((err) => {
    console.warn('⚠️ Échec de l’extension de session :', err.message)
  })

  // 🔁 Rafraîchir toutes les 2 heures
  setInterval(() => {
    extendSession().then(() => {
      console.log('🔄 Session automatiquement prolongée')
    }).catch((err) => {
      console.warn('⚠️ Prolongation échouée :', err.message)
    })
  }, 1000 * 60 * 60 * 2)
}
