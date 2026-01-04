export const createComponentMock = vi.hoisted(() => (name: string) => ({
  default: {
    name,
    template: `<div class="${name.toLowerCase().replace('icon', 'icon-')}-mock"></div>`
  }
}))