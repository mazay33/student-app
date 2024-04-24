import { defineNuxtRouteMiddleware } from 'nuxt/app'

export default defineNuxtRouteMiddleware(async (to, from) => {
  const authStore = useAuthStore()
  try {
    const { authinticated } = storeToRefs(authStore)

    if (!authinticated.value && to.path !== '/auth/login') {
      return navigateTo('/auth/login')
    }
  } catch (error) {
    return navigateTo('/auth/login')
  }
})
