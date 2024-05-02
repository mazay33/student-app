import type { UseFetchOptions } from 'nuxt/app'
import type { FetchError } from 'ofetch'
import type { Ref } from 'vue'
import type { _AsyncData, KeysOf, PickFrom } from '#app/composables/asyncData'

export type HttpReturnType<T> = Promise<
  _AsyncData<PickFrom<T, KeysOf<T>> | null, FetchError<any> | null>
>
export type HttpBodyType<T> = T extends Ref<Record<string, any>>
  ? T
  : Record<string, any>
export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'

class HttpService {
  private _request<T, U>(
    method: HttpMethod,
    url: string,
    body?: HttpBodyType<U>,
    options: UseFetchOptions<T> = {}
  ): HttpReturnType<T> {
    return useAPI<T>(url, {
      method,
      body,
      ...options,
    })
  }

  public get<T>(
    url: string,
    options: UseFetchOptions<T> = {}
  ): HttpReturnType<T> {
    return this._request<T, never>('GET', url, undefined, options)
  }

  public post<T, U>(
    url: string,
    body: HttpBodyType<U>,
    options: UseFetchOptions<T> = {}
  ): HttpReturnType<T> {
    return this._request<T, U>('POST', url, body, options)
  }

  public put<T, U>(
    url: string,
    body: HttpBodyType<U>,
    options: UseFetchOptions<T> = {}
  ): HttpReturnType<T> {
    return this._request<T, U>('PUT', url, body, options)
  }

  public patch<T, U>(
    url: string,
    body: HttpBodyType<U>,
    options: UseFetchOptions<T> = {}
  ): HttpReturnType<T> {
    return this._request<T, U>('PATCH', url, body, options)
  }

  public delete<T>(
    url: string,
    options: UseFetchOptions<T> = {}
  ): HttpReturnType<T> {
    return this._request<T, never>('DELETE', url, undefined, options)
  }
}

export default new HttpService()
