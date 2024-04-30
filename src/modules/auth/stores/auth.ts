import httpService from '~/services/httpService'
import type { IAuthLoginResponse } from '../@types'
import type { IUser } from '~/@types/@types'

export const useAuthStore = defineStore(
  'auth',
  () => {
    const isLoading = ref<boolean>(false)
    const user = ref<IUser | null>()
    const authinticated = computed<boolean>(() => !!user.value)
    const isAdmin = computed<boolean>(
      () => !!user.value && user.value.is_superuser
    )

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
      isLoading.value = true
      const { data, error, pending } = await httpService.get<IUser>(
        'private/users/me'
      )

      if (data.value) {
        user.value = data.value
      }

      if (error.value) {
        user.value = null
      }

      isLoading.value = pending.value
    }

    const refresh = async () => {
      isLoading.value = true
      const { data, error, pending } = await httpService.post<
        IAuthLoginResponse,
        {}
      >('public/auth/refresh', {})

      if (error.value) {
        user.value = null
      }

      isLoading.value = pending.value
    }

    const logout = async () => {
      isLoading.value = true
      const { data, error, pending } = await httpService.post<
        { message: string },
        {}
      >('private/auth/logout', {})

      user.value = null

      isLoading.value = pending.value
    }

    return {
      user,
      isLoading: computed(() => isLoading.value),
      authinticated,
      isAdmin,

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
