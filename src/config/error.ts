export interface ErrorConfig {
  title: string
  message: string
  showContact?: boolean
}

export const errorConfig: Record<number, ErrorConfig> = {
  404: {
    title: '404 Error',
    message: 'This page not found. Go back to home and start again.',
  },
  500: {
    title: '500 Error',
    message: 'Internal server error. Please try again later.',
    showContact: true,
  },
}

export const getErrorConfig = (statusCode: number) => {
  return (
    errorConfig[statusCode] || {
      title: 'Error',
      message: 'An unexpected error occurred.',
    }
  )
}
