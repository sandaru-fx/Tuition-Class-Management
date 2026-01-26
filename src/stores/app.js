import { defineStore } from 'pinia'
import { ref } from 'vue'
import { classService } from 'src/services/classService'

export const useAppStore = defineStore('app', () => {
  const classes = ref([])
  const isInitialized = ref(false)
  const loading = ref(false)

  async function initData() {
    if (isInitialized.value) return
    loading.value = true
    try {
      classes.value = await classService.getOptions()
      isInitialized.value = true
    } catch (error) {
      console.error('Error initializing app data:', error)
    } finally {
      loading.value = false
    }
  }

  function clearCache() {
    classes.value = []
    isInitialized.value = false
  }

  return {
    classes,
    isInitialized,
    loading,
    initData,
    clearCache
  }
})
