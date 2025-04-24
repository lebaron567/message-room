<script setup>
import { ref } from 'vue'
import { useAuth } from '@/js/useAuth'

const username = ref('')
const password = ref('')
const { login, error } = useAuth()

const handleLogin = async () => {
  const success = await login(username.value, password.value)
  if (success)  {
    console.log('Connecté ✅') // Tu peux tester ici
  } else {
    console.log('Échec ❌')
  }
}
</script>


<template>
    <form @submit.prevent="handleLogin" class="login-form">
      <div>
        <label for="username">Nom d'utilisateur</label>
        <input type="text" id="username" v-model="username" required />
      </div>
      <div>
        <label for="password">Mot de passe</label>
        <input type="password" id="password" v-model="password" required />
      </div>
      <button type="submit">Se connecter</button>
      <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
    </form>
  </template>
  
  
  
  <style scoped>
  .login-form {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    max-width: 300px;
    margin: auto;
  }
  
  .error {
    color: red;
  }
  </style>
  