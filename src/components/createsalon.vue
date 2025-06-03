<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { createSalon } from '../services/SalonService'
import { useAuth } from '@/js/useAuth'

const salonName = ref('')
const imageUrl = ref('')
const themeColor = ref('#000000')

const { token } = useAuth()
const router = useRouter()

const error = ref(null)
const success = ref(false)

const createSalonHandler = async () => {
  error.value = null
  success.value = false

  try {
    const salonData = {
      name: salonName.value,
      img: imageUrl.value,
      color: themeColor.value,
    }

    await createSalon(salonData, token.value)
    success.value = true

    // Reset form
    salonName.value = ''
    imageUrl.value = ''
    themeColor.value = '#000000'

    // Redirection
    router.push('/channels')
  } catch (err) {
    error.value = err.response?.data?.message || 'Une erreur est survenue.'
  }
}
</script>

<template>
  <div class="page-center">
    <div class="create-salon">
      <h1>Créer un nouveau salon</h1>
      <form @submit.prevent="createSalonHandler">
        <div>
          <label for="name">Nom du salon :</label>
          <input type="text" v-model="salonName" required />
        </div>

        <div>
          <label for="image">Image (URL) :</label>
          <input type="text" v-model="imageUrl" required />
        </div>

        <div>
          <label for="color">Couleur du thème :</label>
          <div class="color-picker-wrapper">
            <input type="color" v-model="themeColor" />
            <span class="color-preview" :style="{ backgroundColor: themeColor }"></span>
          </div>
        </div>

        <button type="submit">Créer le salon</button>
      </form>

      <div v-if="error" class="error">{{ error }}</div>
      <div v-if="success" class="success">Salon créé avec succès !</div>
    </div>
  </div>
</template>

<style scoped>
.page-center {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  padding: 1rem;
}

.create-salon {
  width: 100%;
  max-width: 500px;
  background-color: #ffffff;
  padding: 2rem;
  border-radius: 10px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.05);
  font-family: 'Segoe UI', sans-serif;
}

h1 {
  text-align: center;
  margin-bottom: 2rem;
  font-size: 1.8rem;
  color: #222;
}

form > div {
  margin-bottom: 1.2rem;
}

label {
  display: block;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: #333;
}

input[type="text"],
input[type="color"] {
  width: 100%;
  padding: 0.6rem;
  border: 1px solid #ccc;
  border-radius: 6px;
  font-size: 1rem;
  box-sizing: border-box;
}

.color-picker-wrapper {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.color-preview {
  width: 32px;
  height: 32px;
  border-radius: 6px;
  border: 1px solid #ccc;
  box-shadow: inset 0 0 3px rgba(0, 0, 0, 0.1);
}

button {
  width: 100%;
  padding: 0.8rem;
  background-color: #55C4FF;
  color: white;
  font-weight: bold;
  font-size: 1rem;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

button:hover {
  background-color: #45b2ea;
}

.error {
  color: #d93025;
  margin-top: 1rem;
  text-align: center;
}

.success {
  color: #34a853;
  margin-top: 1rem;
  text-align: center;
}
</style>
