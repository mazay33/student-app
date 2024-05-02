import type { IPaginatedResult } from '~/@types/@types'
import httpService from '~/services/httpService'
import type { ISubject } from '../modules/reestr/@types'
import type { UseFetchOptions } from '#app'

class SubjectRepository {
  public async getSubjectList(
    filterQuery: string = '',
    opts?: UseFetchOptions<IPaginatedResult<ISubject>>
  ) {
    const url = `main/public/subjects${filterQuery}`
    return await httpService.get<IPaginatedResult<ISubject>>(url, opts)
  }
}

export const subjectRepo = new SubjectRepository()
