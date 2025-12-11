import { defineNuxtRouteMiddleware, createError } from 'nuxt/app'

export default defineNuxtRouteMiddleware((to) => {
  if (to.path === '/500-test') {
    throw createError({
      statusCode: 500,
      message: '500',
    })
  }

  if (to.path === '/404-test') {
    throw createError({
      statusCode: 404,
      message: '404',
    })
  }
})
