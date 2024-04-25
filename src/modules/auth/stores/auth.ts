import httpService from '~/services/httpService'

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

export const useAuthStore = defineStore(
  'auth',
  () => {
    const isLoading = ref(false)
    const user = ref()
    const authinticated = ref(false)

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

      if (data.value) {
        await getMe()

        await navigateTo('/')
      }

      isLoading.value = pending.value
    }

    const getMe = async () => {
      const { data, error } = await httpService.get<IUser>('private/users/me')

      if (data.value) {
        user.value = data.value
        authinticated.value = true
      }

      if(error.value) {
        user.value = null
        authinticated.value = false
      }
    }

    const refresh = async () => {
      const { data, error } = await httpService.post('public/auth/refresh', {})
    }

    const logout = async () => {
      const { data, error } = await httpService.post('private/auth/logout', {})

      user.value = null
      authinticated.value = false
    }

    return {
      user,
      isLoading,
      authinticated,

      login,
      refresh,
      getMe,
      logout,
    }
  },
  {
    persist: {
      storage: persistedState.cookiesWithOptions({
        sameSite: 'strict',
        secure: true,
      }),
    },
  }
)
