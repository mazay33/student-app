interface IPaginationMeta {
  count: number
  page_size: number
  pages: number
}

interface IPaginatedResult<T> extends IPaginationMeta {
  result: T[]
}

interface IUser {
  email: string
  nickname: string
  image_url: string | null
  description: string | null
  created_at: string
}

export type { IPaginationMeta, IPaginatedResult, IUser }
