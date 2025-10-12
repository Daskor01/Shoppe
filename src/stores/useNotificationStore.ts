import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { ButtonProps, NotificationType } from '@/types/Notification'

export const useNotificationStore = defineStore('notification', () => {
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
    msg: string,
    notificationType: NotificationType = 'info',
    buttonObj?: ButtonProps,
  ) {
    notification.value = {
      message: msg,
      type: notificationType,
      button: buttonObj || null,
      visible: true,
    }
  }

  function hideNotification() {
    notification.value = {
      message: '',
      type: 'info',
      button: null,
      visible: false,
    }
  }

  return {
    notification,
    showNotification,
    hideNotification,
  }
})
