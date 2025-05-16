// main.js
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { createPinia } from 'pinia'

const app = createApp(App)

const pinia = createPinia()
app.use(pinia)       // Pinia branché AVANT le mount
app.use(router)
app.mount('#app')    // Et ensuite seulement on monte
