import { createRouter, createWebHistory } from 'vue-router'
import LoginForm from '@/components/LoginForm.vue'
import HomeView from '@/views/HomeView.vue'
import SalonList from '@/components/SalonList.vue'
import CreateSalon from '@/components/createsalon.vue'
import '@/assets/main.css'
import MessageHistory from '@/components/MessageHistory.vue'

const routes = [
  { path: '/', name: 'login', component: LoginForm },
  { path: '/home', name: 'home', component: HomeView },
  { path: '/channels', name: 'channels', component: SalonList },
  { 
    path: '/channels/:id', 
    name: 'SalonMessages', 
    component: MessageHistory, 
    props: true 
  },
  { path: '/create-salon', name: 'create-salon', component: CreateSalon},
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
