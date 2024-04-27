import httpService from '~/services/httpService'

export const useReestrStore = defineStore('reestr', () => {
  const isLoading = ref(false)
  const universities = ref([])
  const subjects = ref([])
  const teachers = ref([])

  const getUniversities = async () => {
    isLoading.value = true
    const { data, error } = await httpService.get('main/public/universities')
    universities.value = data.value
    isLoading.value = false
  }

  const getSubjects = async () => {
    isLoading.value = true
    const { data, error } = await httpService.get('main/public/subjects')
    subjects.value = data.value
    isLoading.value = false
  }

  const getTeachers = async () => {
    isLoading.value = true
    const { data, error } = await httpService.get('main/public/teachers')
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
