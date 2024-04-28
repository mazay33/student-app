import type { IPaginatedResult } from '~/@types/@types'
import httpService from '~/services/httpService'
import type { ISubject, ITeacher, IUniversity } from '../@types'

export const useReestrStore = defineStore('reestr', () => {
  const isLoading = ref<boolean>(false)
  const universities = ref<IPaginatedResult<IUniversity>>()
  const subjects = ref<IPaginatedResult<ISubject>>()
  const teachers = ref<IPaginatedResult<ITeacher>>()

  const getUniversities = async (filter?: any, search?: any) => {
    isLoading.value = true
    const { data, error } = await httpService.get<
      IPaginatedResult<IUniversity>
    >(
      `main/public/universities?page=${filter?.page || 1}&page_size=${
        filter?.page_size
      }&short_name=${search || ''}`
    )

    universities.value = data.value
    isLoading.value = false
  }

  const getSubjects = async () => {
    isLoading.value = true
    const { data, error } = await httpService.get<IPaginatedResult<ISubject>>(
      'main/public/subjects'
    )
    subjects.value = data.value
    isLoading.value = false
  }

  const getTeachers = async () => {
    isLoading.value = true
    const { data, error } = await httpService.get<IPaginatedResult<ITeacher>>(
      'main/public/teachers'
    )
    teachers.value = data.value
    isLoading.value = false
  }

  return {
    isLoading: computed(() => isLoading.value),
    universities,
    subjects,
    teachers,

    getUniversities,
    getSubjects,
    getTeachers,
  }
})
