import { getErrorConfig } from '@/config/error'

export const useError = (statusCode: number, customMessage: string) => {
  const config = getErrorConfig(statusCode)

  const title = config.title

  const message =
    customMessage && customMessage !== statusCode.toString() ? customMessage : config.message

  const showContact = config.showContact || false

  return {
    title,
    message,
    showContact,
    statusCode,
  }
}
