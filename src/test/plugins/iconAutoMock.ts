import type { Plugin } from 'vite'

export function iconAutoMockPlugin(): Plugin {
  return {
    name: 'icon-auto-mock',
    enforce: 'pre',

    resolveId(id) {
      const aliasMatch = id.match(/^[@~]\/components\/icons\/(Icon[\w]+)\.vue$/)
      if (aliasMatch) {
        return `\0virtual:icon-mock:${aliasMatch[1]}`
      }

      const pathMatch = id.match(/components\/icons\/(Icon[\w]+)\.vue$/)
      if (pathMatch) {
        return `\0virtual:icon-mock:${pathMatch[1]}`
      }

      return null
    },

    load(id) {
      if (id.startsWith('\0virtual:icon-mock:')) {
        const iconName = id.replace('\0virtual:icon-mock:', '')
        const className = iconName.toLowerCase().replace('icon', 'icon-')

        return `
          export default {
            name: '${iconName}',
            template: '<div class="${className}-mock"></div>'
          }
        `
      }
      return null
    }
  }
}

