export const storage = {
  get: (key: string) => {
    if (import.meta.client) {
      return localStorage.getItem(key)
    }
    return null
  },

  set: (key: string, value: string) => {
    if (import.meta.client) {
      localStorage.setItem(key, value)
    }
  },

  remove: (key: string) => {
    if (import.meta.client) {
      localStorage.removeItem(key)
    }
  },
}
