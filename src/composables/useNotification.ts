import { useNotificationStore } from '@/stores/useNotificationStore'
import type { NotificationParams } from '@/types/Notification'

export function useNotification() {
  const store = useNotificationStore()

  function notify({ message, type = 'info', duration = 3000, button }: NotificationParams) {
    store.showNotification(message, type, button)

    if (duration > 0) {
      setTimeout(() => {
        store.hideNotification()
      }, duration)
    }
  }

  return { notify }
}
