interface IPaginationMeta {
  count: number
  page_size: number
  pages: number
}

interface IPaginatedResult<T> extends IPaginationMeta {
  result: T[]
}

export type { IPaginationMeta, IPaginatedResult }
