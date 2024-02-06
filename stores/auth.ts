type Tokens = {
  access_token: string
  refresh_token: string
  type: string
}

import { apiService } from '@/services/ApiService'

export const useAuthStore = defineStore('auth', () => {
  const access_token = ref(useCookie('token'))
  const refresh_token = ref()
  const loading = ref(false)

  const login = async (email: string, password: string) => {
    loading.value = true
    const options = {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    }
    const { data, isFetching } = await apiService.post<Tokens, URLSearchParams>(
      'public/auth/login',
      new URLSearchParams({
        username: email,
        password: password,
      }),
      options
    )
    access_token.value = data.value?.access_token
    refresh_token.value = data.value?.refresh_token

    if (data.value) {
      const token = useCookie('token')
      token.value = data.value.access_token
    }
    loading.value = isFetching.value
  }

  const logout = () => {
    access_token.value = null

    const token = useCookie('token')
    token.value = null
  }

  return { access_token, refresh_token, login, loading }
})
