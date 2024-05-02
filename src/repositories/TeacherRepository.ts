import type { IPaginatedResult } from '~/@types/@types'
import httpService from '~/services/httpService'
import type { ITeacher } from '../modules/reestr/@types'
import type { UseFetchOptions } from '#app'

class TeacherRepository {
  public async getTeacherList(
    filterQuery: string = '',
    opts?: UseFetchOptions<IPaginatedResult<ITeacher>>
  ) {
    const url = `main/public/teachers${filterQuery}`
    return await httpService.get<IPaginatedResult<ITeacher>>(url, opts)
  }
}

export const teacherRepo = new TeacherRepository()
