<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '@/js/useAuth' // ou '@/composables/useAuth'

const router = useRouter()
const username = ref('')
const password = ref('')
const { login, token, error } = useAuth()

const handleLogin = async () => {
  const success = await login(username.value, password.value)
  if (success) {
    console.log('Token reçu :', token.value)
    router.push('/channels')
  } else {
    console.log('❌ Échec de la connexion')
  }
}
</script>

<template>
  <div class="login-container">
    <form @submit.prevent="handleLogin" class="login-form">
      <div class="form-group">
        <label for="username">Nom d'utilisateur</label>
        <input type="text" id="username" v-model="username" required />
      </div>
      <div class="form-group">
        <label for="password">Mot de passe</label>
        <input type="password" id="password" v-model="password" required />
      </div>
      <button type="submit">Se connecter</button>
      <p v-if="error" class="error">Nom d'utilisateur ou mot de passe incorrect</p>
    </form>
  </div>
</template>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: 100%;
  max-width: 300px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

label {
  font-weight: bold;
  color: #FFF;
}

input {
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 5px;
}

button {
  font-size: 1.0rem;
  padding: 0.5rem;
  background-color: #55C4FF;
  color: #FFF;
  border: none;
  border-radius: 4px;
  font-weight: bold;
  cursor: pointer;
}

.error {
  color: red;
  text-align: center;
}
</style>
