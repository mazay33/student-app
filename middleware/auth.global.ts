import { defineNuxtRouteMiddleware } from 'nuxt/app'
import { useAuthStore } from '#imports'

export default defineNuxtRouteMiddleware(async (to, from) => {
  const authStore = useAuthStore()

  const { user } = authStore

  if (!!user && to.path.startsWith('/auth/')) {
    return navigateTo('/')
  }
})
