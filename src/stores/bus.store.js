// Simple bus to handle global events like sending notifications to the user
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useAuthStore } from './auth.store'


export const useBusStore = defineStore('bus', () => {
  const notification = ref({})
  const notificationColor = ref('')
  const imapSettings = ref(true)


  function showNotification(options) {
    const authStore = useAuthStore()
    if (authStore.isAuthenticated) {
      notification.value = options.msg
      notificationColor.value = (options.type) ? options.type : 'success'
    }
  }
})