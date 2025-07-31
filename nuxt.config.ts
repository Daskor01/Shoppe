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
  compatibilityDate: '2025-05-31',
})
