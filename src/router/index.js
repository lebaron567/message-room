import { createRouter, createWebHistory } from 'vue-router'
import LoginForm from '@/components/LoginForm.vue'
import HomeView from '@/views/HomeView.vue'
import SalonList from '@/components/SalonList.vue'

const routes = [
  { path: '/', name: 'login', component: LoginForm },
  { path: '/home', name: 'home', component: HomeView },
  { path: '/channels', name: 'channels', component: SalonList}
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
