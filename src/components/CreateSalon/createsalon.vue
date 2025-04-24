<script setup>
    import './createsalon.css';
</script>
<template>
    <div class="create-salon">
        <h1>Create a New Salon</h1>
        <form @submit.prevent="createSalon">
            <div>
                <label for="name">Salon Name:</label>
                <input type="text" v-model="salonName" required />
            </div>
            <div>
                <label for="location">Image :</label>
                <input type="text" v-model="imageUrl" required />
            </div>
            <div>
                <label for="location">Thème color :</label>
                <input type="color" v-model="themeColor" required />
            </div>
            <button type="submit">Create Salon</button>
        </form>
    </div>
    <div v-if="error" class="error">{{ error }}</div>
    <div v-if="success" class="success">Salon created successfully!</div>
</template>

