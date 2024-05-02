import type { UseFetchOptions } from '#app'
import type { IPaginatedResult } from '~/@types/@types'
import httpService from '~/services/httpService'
import type { IUniversity } from '../modules/reestr/@types'

class UniversityRepository {
  public async getUniversityList(
    filterQuery: string = '',
    opts?: UseFetchOptions<IPaginatedResult<IUniversity>>
  ) {
    const url = `main/public/universities${filterQuery}`
    return await httpService.get<IPaginatedResult<IUniversity>>(url, opts)
  }

  public async uploadUniversities(
    file: File,
    opts?: UseFetchOptions<{ count_added_universities: number }>
  ) {
    const url = 'main/service/universities/upload'
    return await httpService.post<{ count_added_universities: number }, File>(
      url,
      file,
      opts
    )
  }
}

export const universityRepo = new UniversityRepository()
