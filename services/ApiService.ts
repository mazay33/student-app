import { createFetch } from '@vueuse/core'

const networkFetchClient = createFetch({
  baseUrl: `${import.meta.env.VITE_API_URL}`,
  combination: 'chain',
  options: {
    beforeFetch({ options, url, cancel }) {
      const { access_token } = useAuthStore()
      const isLoggedIn = !!access_token
      const isApiUrl = url?.startsWith(import.meta.env.VITE_API_URL)

      options.headers = {
        ...options.headers,
        Authorization: isLoggedIn && isApiUrl ? `${access_token} ` : '',
      }

      return { options }
    },
    afterFetch(ctx) {
      // if the response contains a data property, return it
      if (ctx.data) {
        return ctx.data
      }

      return ctx
    },
  },
  fetchOptions: {
    mode: 'cors',
  },
})

class ApiService {
  private networkClient: typeof networkFetchClient

  constructor(networkClient: typeof networkFetchClient) {
    this.networkClient = networkClient
  }

  public get<T>(url: string) {
    return this.networkClient(url, {
      afterFetch: (ctx) => ctx.data,
    })
      .get()
      .json<T>()
  }

  public post<T, U>(url: string, body: U, options?: any) {
    return this.networkClient(url, options, {
      afterFetch: (ctx) => ctx.data,
    })
      .post(body)
      .json<T>()
  }

  public put<T, U>(url: string, body: U) {
    return this.networkClient(url, {
      afterFetch: (ctx) => ctx.data,
    })
      .put(body)
      .json<T>()
  }

  public delete<T>(url: string) {
    return this.networkClient(url, {
      afterFetch: (ctx) => ctx.data,
    })
      .delete()
      .json<T>()
  }
}

export const apiService = new ApiService(networkFetchClient)
