<template>
  <router-view />
</template>

<script setup>
import { onMounted } from 'vue'
import { useAuthStore } from 'src/stores/auth'

const authStore = useAuthStore()

onMounted(() => {
  authStore.initialize()
})
</script>
