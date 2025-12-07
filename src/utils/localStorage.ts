const getFromLocalStorage = (key: string) => {
  if (import.meta.client) {
    return localStorage.getItem(key)
  }
}

const setToLocalStorage = (key: string, value: string) => {
  if (import.meta.client) {
    localStorage.setItem(key, value)
  }
}

const removeFromLocalStorage = (key: string) => {
  if (import.meta.client) {
    localStorage.removeItem(key)
  }
}

export { getFromLocalStorage, setToLocalStorage, removeFromLocalStorage }
