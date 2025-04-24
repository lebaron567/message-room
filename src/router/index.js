import { createRouter, createWebHistory } from 'vue-router'
import LoginForm from '@/components/LoginForm.vue'
import HomeView from '@/views/HomeView.vue'
import CreateSalon from '@/components/CreateSalon/createsalon.vue'

const routes = [
  { path: '/', name: 'login', component: LoginForm },
  { path: '/home', name: 'home', component: HomeView },
  { path: '/createsalon', name: 'createsalon', component: CreateSalon }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
