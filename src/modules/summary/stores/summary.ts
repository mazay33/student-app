import httpService from '~/services/httpService'
import type { ISummaryCreateForm, ISummaries } from '../@types'
import type { IPaginatedResult } from '~/@types/@types'


export const useSummaryStore = defineStore(
  'summary',
  () => {
    const isLoading = ref<boolean>(false)
    const summaries = ref<IPaginatedResult<ISummaries>>()

    const summaryCreateForm = reactive<ISummaryCreateForm>({
      name: null,
      university_id: null,
      subject_id: null,
      teacher_id: null,
    })

    const getSummaries = async (filterQuery?: string) => {
      isLoading.value = true
      
      const { data, error } = await httpService.get<
      IPaginatedResult<ISummaries>
    >(`main/public/summaries${filterQuery ? filterQuery : ''}`)

      summaries.value = data.value
      isLoading.value = false
    }

    const createSummary = async () => {
      const { data, error, pending } = await httpService.post<
        string,
        ISummaryCreateForm
      >('main/private/summaries', summaryCreateForm)

      if (data.value) {
        clearSummaryCreateForm()
      }
    }

    const clearSummaryCreateForm = () => {
      summaryCreateForm.name = null
      summaryCreateForm.university_id = null
      summaryCreateForm.subject_id = null
      summaryCreateForm.teacher_id = null
    }

    return {
      summaryCreateForm,
      createSummary,
      isLoading: computed(() => isLoading.value),
      summaries,
      getSummaries,
    }
  },
  {
    persist: {
      storage: persistedState.cookiesWithOptions({
        sameSite: 'strict',
        secure: true,
      }),
    },
  }
)
