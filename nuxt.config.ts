import { defineNuxtConfig } from 'nuxt/config'
import path from 'path'

export default defineNuxtConfig({
  srcDir: 'src',
  ssr: true,

  css: ['@/assets/scss/main.scss'],
  features: {
    inlineStyles: true,
  },

  modules: ['@pinia/nuxt', '@nuxt/image'],

  image: {
    provider: process.env.GITHUB_ACTIONS === 'true' ? 'none' : 'ipx',
    domains: ['fakestoreapi.com'],
    format: ['webp', 'avif', 'png'],
    screens: {
      xs: 320,
      sm: 640,
      md: 768,
      lg: 1024,
      xl: 1280,
    },
  },

  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: `
            @use "@/assets/scss/variables" as vars;
            @use "@/assets/scss/mixins" as mixins;
            @use "@/assets/scss/shimmer" as shimmer;
          `,
        },
      },
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src'),
        '~': path.resolve(__dirname, 'src'),
      },
    },
    build: {
      assetsInlineLimit: 4096,
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
    baseURL: process.env.GITHUB_ACTIONS === 'true' ? '/Shoppe/' : '/',
    head: {
      title: 'Shoppe - Your Online Store',
      htmlAttrs: {
        lang: 'en',
      },
      link: [
        {
          rel: 'preload',
          href: 'fonts/DMSans-Variable.woff2',
          as: 'font',
          type: 'font/woff2',
          crossorigin: 'anonymous',
        },
        {
          rel: 'preload',
          href: 'fonts/AllertaStencil-Regular.woff2',
          as: 'font',
          type: 'font/woff2',
          crossorigin: 'anonymous',
        },
        { rel: 'icon', type: 'image/x-icon', href: 'favicon.ico' },
      ],
    },
  },
  nitro: {
    compressPublicAssets: true,
    prerender: {
      routes: ['/'],
      crawlLinks: true,
      failOnError: false,
    },
  },
  routeRules: {
    '/_ipx/**': {
      prerender: false,
      headers: { 'cache-control': 'public, max-age=31536000, immutable' },
    },
    '/_nuxt/**': {
      headers: {
        'cache-control': 'public, max-age=31536000, immutable',
      },
    },
    '/Shop/**': { ssr: true, prerender: false },
    '/product/**': { ssr: true, prerender: false },
    '/fonts/**': {
      headers: { 'cache-control': 'public, max-age=31536000, immutable' },
    },
    '/favicon.ico': {
      headers: { 'cache-control': 'public, max-age=31536000, immutable' },
    },
  },
  compatibilityDate: '2025-05-31',
})
