import { fetchWithCookie } from '~/composables/useFetchCookie'

export default defineNuxtPlugin(() => {
  let isRefreshing = false
  const config = useRuntimeConfig()

  const $api = $fetch.create({
    baseURL: `https://la-parole.ru/api/`,
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
		console.log('SERVER PROCESSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSS STAAAAARTTT')
          const event = useRequestEvent()

	  console.log('EVENT SHIT _>>>>>>>>>>>>>>>>>>>>>>>>>>>', event)

          const { data, status } = await useAsyncData(
            async () =>
              await fetchWithCookie(
                event!,
                `https://la-parole.ru/api/public/auth/refresh`
              )
          )

	  console.log('РАБОТЕТ ВООБЩЕ БЛЯТЬ ????????????????????????????')

	  console.log('DATA FUCK THIS SHIT _>>>>>>>>>>>>>>>>>>>>>>>>>', data.value)

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
