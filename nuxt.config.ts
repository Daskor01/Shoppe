export default defineNuxtConfig({
  srcDir: 'src',

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
  },

  runtimeConfig: {
    public: {
      apiBase: process.env.NUXT_PUBLIC_API_BASE || 'https://example.com/api',
    },
      apiBase: process.env.NUXT_PUBLIC_API_BASE || 'https://example.com/api',
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

  compatibilityDate: '2025-05-31',
})
