const DEFAULT_WINDOW_WIDTH = 1920
const DEFAULT_WINDOW_WIDTH_MOBILE = 375

export function setWindowWidth(width: number) {
  Object.defineProperty(window, 'innerWidth', {
    writable: true,
    configurable: true,
    value: width,
  })
  window.dispatchEvent(new Event('resize'))
}

export function setMobile() {
  setWindowWidth(DEFAULT_WINDOW_WIDTH_MOBILE)
}

export function resetMobile() {
  setWindowWidth(DEFAULT_WINDOW_WIDTH)
}

export function initWindowWidth() {
  setWindowWidth(DEFAULT_WINDOW_WIDTH)
}

