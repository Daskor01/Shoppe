import { useNotificationStore } from '@/stores/useNotificationStore'

export function useNotification() {
  const store = useNotificationStore()

  function notify({
    message,
    type = 'info',
    duration = 3000,
    buttonText = '',
    buttonHandler,
  }: {
    message: string
    type?: 'success' | 'error' | 'warning' | 'info'
    duration?: number
    buttonText?: string
    buttonHandler?: () => void
  }) {
    store.showNotification(message, type, buttonText, buttonHandler)

    if (duration > 0) {
      setTimeout(() => {
        store.hideNotification()
      }, duration)
    }
  }

  return { notify }
}
