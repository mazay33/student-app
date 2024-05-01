import httpService from '~/services/httpService'
import type { ISummaryCreateForm } from '../@types'

export const useSummaryCreateFormStore = defineStore(
  'summaryCreateForm',
  () => {
    const isLoading = ref<boolean>(false)

    const summaryCreateForm = reactive<ISummaryCreateForm>({
      name: null,
      university: null,
      subject: null,
      teacher: null,
    })

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
        return navigateTo(`/summary/my/${data.value}`)
      }

      isLoading.value = pending.value
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
