import path from 'path'

export default defineNuxtConfig({
  srcDir: 'src',
  ssr: true,

  css: ['~/assets/scss/main.scss'],

  modules: ['@pinia/nuxt'],

  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: `
            @use "@/assets/scss/variables" as vars;
            @use "@/assets/scss/mixins" as mixins;
          `,
        },
      },
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src'),
      },
    },
  },

  runtimeConfig: {
    public: {
      productApi: process.env.NUXT_PUBLIC_PRODUCTS_API,
      imageApi: process.env.NUXT_PUBLIC_IMAGE_API,
    },
  },

  components: [
    { path: '~/components/ui' },
    { path: '~/components/icons', prefix: 'Icon' },
    '~/components',
  ],

  imports: {
    dirs: ['stores', 'composables/**'],
  },

  app: {
    baseURL: process.env.GITHUB_ACTIONS === 'true' ? '/shoppe-project/' : '/',
    buildAssetsDir: 'assets',
  },

  nitro: {
    prerender: {
      routes: ['/'],
      crawlLinks: true,
      failOnError: false 
    }
  },

  compatibilityDate: '2025-05-31',
})
