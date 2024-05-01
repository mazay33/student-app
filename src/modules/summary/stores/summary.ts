import httpService from '~/services/httpService'
import type { ISummaryCreateForm, ISummaries } from '../@types'
import type { IPaginatedResult } from '~/@types/@types'

export const useSummaryStore = defineStore(
  'summary',
  () => {
    const isLoading = ref<boolean>(false)
    const summaries = ref([])

    const summaryCreateForm = reactive<ISummaryCreateForm>({
      name: null,
      university: null,
      subject: null,
      teacher: null,
    })

    const getSummaries = async () => {
      isLoading.value = true
      const { data, error } = await httpService.get<
        IPaginatedResult<ISummaries>
      >('main/public/summaries')
      summaries.value = data.value
      isLoading.value = false
    }

    const createSummary = async () => {
      const { data, error, pending } = await httpService.post<
        string,
        ISummaryCreateForm
      >('main/private/summaries', {
        name: summaryCreateForm.name,
        university_id: summaryCreateForm.university?.id,
        subject_id: summaryCreateForm.subject?.id,
        teacher_id: summaryCreateForm.teacher?.id,
      })

      if (data.value) {
        clearSummaryCreateForm()
      }
    }

    const clearSummaryCreateForm = () => {
      summaryCreateForm.name = null
      summaryCreateForm.university = null
      summaryCreateForm.subject = null
      summaryCreateForm.teacher = null
    }

    return {
      summaryCreateForm,
      createSummary,
      getSummaries,
      isLoading: computed(() => isLoading.value),
      summaries,
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
