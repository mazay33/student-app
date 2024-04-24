import { fetchWithCookie } from '~/composables/useFetchCookie'

export default defineNuxtPlugin(() => {
  let isRefreshing = false
  const config = useRuntimeConfig()

  const $api = $fetch.create({
    baseURL: config.public.api,
    retry: 1,
    retryStatusCodes: [401],
    credentials: 'include',
    headers: useRequestHeaders(['cookie']),

    async onRequest({ request, options, error }) {
      options.headers = {
        ...options.headers,
        ...useRequestHeaders(['cookie']),
      }

      console.log(request, options, error)
    },

    async onResponseError({ response, options, error }) {
      if (response.status == 401 && !isRefreshing) {
        const authStore = useAuthStore()
        const { refresh } = authStore

        isRefreshing = true

        if (process.server) {
          const event = useRequestEvent()

          const { data, status } = await useAsyncData(
            async () =>
              await fetchWithCookie(
                event!,
                `${config.public.api}public/auth/refresh`
              )
          )

          if (status.value === 'success') {
            await navigateTo(event.path)
            return
          } else {
            // await navigateTo('/auth/login')
          }

          isRefreshing = false
        }
        if (process.client) {
          await refresh()

          isRefreshing = false
        }
      }
    },
  })
  // Expose to useNuxtApp().$api
  return {
    provide: {
      api: $api,
    },
  }
})
