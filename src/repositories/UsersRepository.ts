import type { UseFetchOptions } from '#app'
import type { IPaginatedResult, IUser } from '~/@types/@types'
import httpService from '~/services/httpService'

class UsersRepository {
  public async getUsersList(
    filterQuery: string = '',
    opts?: UseFetchOptions<IPaginatedResult<IUser>>
  ) {
    const url = `/public/users${filterQuery}`
    return await httpService.get<IPaginatedResult<IUser>>(url, opts)
  }
}

export const userRepo = new UsersRepository()
