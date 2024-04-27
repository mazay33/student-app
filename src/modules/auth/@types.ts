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

export type { IAuthLoginResponse, IUser }
