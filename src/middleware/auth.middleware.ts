import { defineNuxtRouteMiddleware } from 'nuxt/app'

export default defineNuxtRouteMiddleware(async (to, from) => {
  const authStore = useAuthStore()
  try {
    await authStore.getMe()

    const { user } = storeToRefs(authStore)

    if (!user.value && to.path !== '/auth/login') {
      return navigateTo('/auth/login')
    }
  } catch (error) {
    return navigateTo('/auth/login')
  }
})
