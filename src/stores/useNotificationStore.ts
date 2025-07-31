import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useNotificationStore = defineStore('notification', () => {
  const visible = ref(false)
  const message = ref('')
  const type = ref<'success' | 'error' | 'warning' | 'info'>('info')
  const buttonText = ref('')
  const buttonHandler = ref<() => void>()

  function showNotification(
    msg: string,
    notifType: typeof type.value = 'info',
    btnText = '',
    btnHandler?: () => void,
  ) {
    message.value = msg
    type.value = notifType
    buttonText.value = btnText
    buttonHandler.value = btnHandler
    visible.value = true
  }

  function hideNotification() {
    visible.value = false
    message.value = ''
    buttonText.value = ''
    buttonHandler.value = undefined
  }

  return {
    visible,
    message,
    type,
    buttonText,
    buttonHandler,
    showNotification,
    hideNotification,
  }
})
