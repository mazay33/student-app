import httpService from '~/services/httpService'
import type { ISummaryCreateForm } from '../@types'

export const useSummaryStore = defineStore(
  'summary',
  () => {
    const isLoading = ref<boolean>(false)

    const summaryCreateForm = reactive<ISummaryCreateForm>({
      name: null,
      university_id: null,
      subject_id: null,
      teacher_id: null,
    })

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