export type NotificationType = 'success' | 'error' | 'warning' | 'info'

export interface ButtonProps {
  text: string
  handler: () => void
}

export interface NotificationProps {
  visible: boolean
  message: string
  type?: NotificationType
  button?: ButtonProps | null
}

export interface NotificationParams {
  message: string
  type?: NotificationType
  duration?: number
  button?: ButtonProps
}
