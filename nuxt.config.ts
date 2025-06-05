export default defineNuxtConfig({
  css: [
    '~/assets/scss/main.scss',
    'swiper/css',
    'swiper/css/pagination'
  ],

  modules: ['@pinia/nuxt'],

  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: `
            @use "./assets/scss/variables" as *;
            @use "./assets/scss/mixins" as *;
          `
        }
      },
    }
  },

  runtimeConfig: {
    public: {
      apiBase: process.env.NUXT_PUBLIC_API_BASE || 'https://example.com/api'
    }
  },

  components: [
    { path: '~/components/ui' },
    { path: '~/components/icons', prefix: 'Icon' },
    '~/components'
  ],

  imports: {
    dirs: ['stores', 'composables/**']
  },

  compatibilityDate: '2025-05-31'
})
