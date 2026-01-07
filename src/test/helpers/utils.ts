export const createComponentMock = (name: string) => ({
  default: {
    name,
    template: `<div class="${name.replace(/([A-Z])/g, '-$1').toLowerCase().slice(1)}-mock"></div>`
  }
})