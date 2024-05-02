// import type { IPaginatedResult, IUser } from '~/@types/@types'
// import httpService from '~/services/httpService'
// import type { ISubject, ITeacher, IUniversity } from '../@types'
// import UniversityRepository from '../../../repositories/UniversityRepository'

// export const useReestrStore = defineStore('reestr', () => {
//   const isLoading = ref<boolean>(false)
//   const universities = ref<IPaginatedResult<IUniversity>>()
//   const subjects = ref<IPaginatedResult<ISubject>>()
//   const teachers = ref<IPaginatedResult<ITeacher>>()
//   const users = ref<IPaginatedResult<IUser>>()

//   const getUniversities = async (filterQuery?: string) => {
//     isLoading.value = true

//     const { data } = await UniversityRepository.getUniversityList(filterQuery)

//     if (data.value) {
//       universities.value = data.value
//     }

//     isLoading.value = false
//   }

//   const getSubjects = async (filterQuery?: string) => {
//     isLoading.value = true
//     const { data, error } = await httpService.get<IPaginatedResult<ISubject>>(
//       `main/public/subjects${filterQuery ? filterQuery : ''}`
//     )
//     if (data.value) {
//       subjects.value = data.value
//     }
//     isLoading.value = false
//   }

//   const getTeachers = async (filterQuery?: string) => {
//     isLoading.value = true
//     const { data, error } = await httpService.get<IPaginatedResult<ITeacher>>(
//       `main/public/teachers${filterQuery ? filterQuery : ''}`
//     )
//     if (data.value) {
//       teachers.value = data.value
//     }
//     isLoading.value = false
//   }

//   const getUsers = async (filterQuery?: string) => {
//     isLoading.value = true
//     const { data, error } = await httpService.get<IPaginatedResult<IUser>>(
//       `public/users${filterQuery ? filterQuery : ''}`
//     )
//     if (data.value) {
//       users.value = data.value
//     }
//     isLoading.value = false
//   }

//   return {
//     isLoading: computed(() => isLoading.value),
//     universities,
//     subjects,
//     teachers,
//     users,

//     getUniversities,
//     getSubjects,
//     getTeachers,
//     getUsers,
//   }
// })
