import type { ISummary } from '../@types';
import type { IPaginatedResult, IUser } from '~/@types/@types';
import useApiService from '~/services/apiService';

const apiService = useApiService();

export const useSummaryStore = defineStore('summary', () => {
	const isLoading = ref<boolean>(false);
	const summaries = ref<IPaginatedResult<ISummary[]> | null>();
	const summary = ref<ISummary | null>(null);
	const mySummaries = ref<IPaginatedResult<ISummary[]> | null>(null);
	const mySummary = ref<ISummary | null>(null);
	const summaryUser = ref<IUser | null>(null);

	const getUserById = async (id: string) => {
		isLoading.value = true;
		const { data, pending } = await apiService.user.getUserById(id);

		summaryUser.value = data.value;
		isLoading.value = pending.value;
	};

	const getSummaries = async (filterQuery?: string) => {
		isLoading.value = true;

		const { data, pending } = await apiService.summary.getPublicSummaries(filterQuery);

		summaries.value = data.value;
		isLoading.value = pending.value;
	};

	const getSummaryById = async (id: string) => {
		isLoading.value = true;

		const { data, pending } = await apiService.summary.getPublicSummaryById(id);
		summary.value = data.value;

		isLoading.value = pending.value;
	};

	const getMySummaries = async () => {
		isLoading.value = true;

		const { data, pending } = await apiService.summary.getPrivateSummaries();

		mySummaries.value = data.value;

		isLoading.value = pending.value;
	};

	const getMySummaryById = async (id: string) => {
		isLoading.value = true;

		const { data, pending } = await apiService.summary.getPrivateSummaryById(id);

		mySummary.value = data.value;
		isLoading.value = pending.value;
	};

	return {
		summaryUser,
		getUserById,
		getSummaries,
		isLoading: computed(() => isLoading.value),
		summaries,
		summary,
		getSummaryById,
		getMySummaries,
		mySummaries,
		getMySummaryById,
		mySummary,
	};
});
