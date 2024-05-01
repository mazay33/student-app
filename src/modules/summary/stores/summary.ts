import httpService from '~/services/httpService'
import type { ISummary } from '../@types'
import type { IPaginatedResult } from '~/@types/@types'

export const useSummaryStore = defineStore('summary', () => {
  const isLoading = ref<boolean>(false)
  const summaries = ref<IPaginatedResult<ISummary[]>>()
  const summary = ref<ISummary | null>(null)
  const mySummaries = ref<IPaginatedResult<ISummary[]> | null>(null)
  const mySummary = ref<ISummary | null>(null)

  const getSummaries = async (filterQuery?: string) => {
    isLoading.value = true

    const { data, error, pending } = await httpService.get<
      IPaginatedResult<ISummary[]>
    >(`main/public/summaries${filterQuery ? filterQuery : ''}`)

    summaries.value = data.value
    isLoading.value = pending.value
  }

  const getSummaryById = async (id: string) => {
    isLoading.value = true

    const { data, error, pending } = await httpService.get<ISummary>(
      `main/public/summaries/${id}`
    )
    summary.value = data.value

    isLoading.value = pending.value
  }

  const getMySummaries = async () => {
    isLoading.value = true

    const { data, error, pending } = await httpService.get<
      IPaginatedResult<ISummary[]>
    >('main/private/summaries')

    mySummaries.value = data.value

    isLoading.value = pending.value
  }

  const getMySummaryById = async (id: string) => {
    isLoading.value = true

    const { data, error, pending } = await httpService.get<ISummary>(
      `main/private/summaries/${id}`
    )

    mySummary.value = data.value
    isLoading.value = pending.value
  }

  return {
    getSummaries,
    isLoading: computed(() => isLoading.value),
    summaries,
    summary,
    getSummaryById,
    getMySummaries,
    mySummaries,
    getMySummaryById,
    mySummary,
  }
})
