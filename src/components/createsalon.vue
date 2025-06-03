<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { createSalon } from '../services/SalonService'; // Vérifie le chemin
import './CreateSalon/createsalon.css'; // Vérifie le chemin
import { useAuth } from '@/js/useAuth';

const salonName = ref('');
const imageUrl = ref('');
const themeColor = ref('#000000');

const { token } = useAuth();
const router = useRouter();

const error = ref(null);
const success = ref(false);

const createSalonHandler = async () => {
  error.value = null;
  success.value = false;

  try {
    const salonData = {
      name: salonName.value,
      img: imageUrl.value,
      color: themeColor.value,
    };

    await createSalon(salonData, token.value);
    success.value = true;

    // Reset form
    salonName.value = '';
    imageUrl.value = '';
    themeColor.value = '#000000';

    // Redirection vers /channels
    router.push('/channels');
  } catch (err) {
    error.value = err.response?.data?.message || 'Une erreur est survenue.';
  }
};
</script>

<template>
  <div class="create-salon">
    <h1>Create a New Salon</h1>
    <form @submit.prevent="createSalonHandler">
      <div>
        <label for="name">Salon Name:</label>
        <input type="text" v-model="salonName" required />
      </div>

      <div>
        <label for="image">Image :</label>
        <input type="text" v-model="imageUrl" required />
      </div>

      <div>
        <label for="color">Theme Color:</label>
        <input type="color" v-model="themeColor" />
      </div>

      <button type="submit">Create Salon</button>
    </form>

    <div v-if="error" class="error">{{ error }}</div>
    <div v-if="success" class="success">Salon created successfully!</div>
  </div>
</template>
