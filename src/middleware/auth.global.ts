import { defineNuxtRouteMiddleware } from 'nuxt/app'
import { useAuthStore } from '~/modules/auth/stores/auth'

export default defineNuxtRouteMiddleware(async (to, from) => {
  const authStore = useAuthStore()

  const { authinticated } = authStore

  if (authinticated && to.path.startsWith('/auth/')) {
    return navigateTo('/')
  }
})
