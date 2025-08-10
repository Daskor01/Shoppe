import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { ButtonProps, NotificationType } from '@/types/Notification'

export const useNotificationStore = defineStore('notification', () => {
  const visible = ref(false)
  const message = ref('')
  const type = ref<NotificationType>('info')
  const button = ref<ButtonProps | null>(null)

  interface NotificationState {
    message: string
    type: NotificationType
    button?: ButtonProps | null
    visible: boolean
  }

  const notification = ref<NotificationState>({
    message: '',
    type: 'info',
    button: null,
    visible: false,
  })

  function showNotification(
    message: string,
    notificationType: NotificationType = 'info',
    buttonObj?: ButtonProps,
  ) {
    notification.value = {
      message: message,
      type: notificationType,
      button: buttonObj || null,
      visible: true,
    }
  }

  function hideNotification() {
    visible.value = false
    message.value = ''
    button.value = null
    type.value = 'info'
  }

  return {
    visible,
    message,
    type,
    button,
    showNotification,
    hideNotification,
  }
})
