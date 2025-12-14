import { defineNuxtRouteMiddleware, createError } from 'nuxt/app'

export default defineNuxtRouteMiddleware((to) => {
  if (to.path === '/500-test') {
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal Server Error Test',
    })
  }
})
