import { defineNuxtRouteMiddleware } from 'nuxt/app'

export default defineNuxtRouteMiddleware(async (to, from) => {
  const authStore = useAuthStore()

  const { user } = authStore

  if (!user) {
    return navigateTo('/auth/login')
  }
})
