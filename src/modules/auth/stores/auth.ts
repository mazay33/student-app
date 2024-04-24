import httpService from '~/services/httpService'
import type FetchError from 'ofetch'
import { ExpiringStorage } from '@/utils/ExpiringStorage'

interface IAuthLoginResponse {
  access_token: string
  refresh_token: string
  token_type: string
}

interface IUser {
  email: string
  nickname: string
  image_url: string | null
  description: string | null
  created_at: string
}

export const useAuthStore = defineStore('auth', () => {
  const isLoading = ref(false)
  const user = ref(null)
  const errorMessage = ref<FetchError.FetchError<any>>()
  const refreshError = ref<boolean>(false)

  const getRefreshError = computed(() => {
    return refreshError.value
  })

  const login = async (email: string, password: string) => {
    isLoading.value = true

    const { data, error, pending } = await httpService.post<
      IAuthLoginResponse,
      URLSearchParams
    >(
      'public/auth/login',
      new URLSearchParams({
        username: email,
        password: password,
      }),
      { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
    )

    if (error.value) {
      errorMessage.value = error.value
    } else {
      await getMe()
      await navigateTo('/')
    }

    isLoading.value = pending.value

    return data
  }

  const getMe = async () => {
    try {
      const { data, error } = await httpService.get<IUser>('private/users/me')
      user.value = data.value

      if (process.client) {
        ExpiringStorage.set('user', user.value)
      }
    } catch (error) {
      console.log(error)
    }
  }

  const refresh = async () => {
    try {
      const { data, error } = await httpService.post('public/auth/refresh', {})

      if (error.value) {
        refreshError.value = true
        // useRouter().push('/auth/login')
      } else {
        refreshError.value = false
      }
    } catch (error) {}
  }

  const logout = async () => {
    try {
      const { data, error } = await httpService.post('private/auth/logout', {})

      user.value = null
      if (process.client) {
        ExpiringStorage.set('user', null)
      }
    } catch (error) {}
  }

  return {
    login,
    isLoading,
    refresh,
    getMe,
    user,
    errorMessage,
    logout,
    refreshError,
    getRefreshError,
  }
})
