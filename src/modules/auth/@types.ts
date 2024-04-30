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
  is_superuser: boolean
  created_at: string
}

export type { IAuthLoginResponse }