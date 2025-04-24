<script setup>
import { ref } from 'vue';
import { createSalon } from '../../services/salonservice'; // Assure-toi que le chemin est bon
import './createsalon.css'; // Assure-toi que le chemin est bon

const salonName = ref('');
const imageUrl = ref('');
const themeColor = ref('#000000');

const error = ref(null);
const success = ref(false);

const createSalonHandler = async () => {
  error.value = null;
  success.value = false;

  try {
    const salonData = {
      name: salonName.value,
      img: imageUrl.value,
    };

    await createSalon(salonData);
    success.value = true;

    // Reset form
    salonName.value = '';
    imageUrl.value = '';
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
      <button type="submit">Create Salon</button>
    </form>
  </div>

  <div v-if="error" class="error">{{ error }}</div>
  <div v-if="success" class="success">Salon created successfully!</div>
</template>
