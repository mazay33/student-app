import { defineNuxtRouteMiddleware } from 'nuxt/app'

export default defineNuxtRouteMiddleware(async (to, from) => {
  const authStore = useAuthStore()

  if (!authStore.authinticated && to.path !== '/auth/login') {
    return navigateTo('/auth/login')
  }
})
