import type { ISummaryCreateForm } from '../@types';
import useApiService from '~/services/apiService';

const apiService = useApiService();

export const useSummaryCreateFormStore = defineStore(
	'summaryCreateForm',
	() => {
		const isLoading = ref<boolean>(false);

		const summaryCreateForm = reactive<ISummaryCreateForm>({
			name: null,
			university: null,
			subject: null,
			teacher: null,
		});

		const clearSummaryCreateForm = () => {
			summaryCreateForm.name = null;
			summaryCreateForm.university = null;
			summaryCreateForm.subject = null;
			summaryCreateForm.teacher = null;
		};

		const createSummary = async () => {
			const { data, pending } = await apiService.summary.createSummary(summaryCreateForm);

			if (data.value) {
				clearSummaryCreateForm();
				await navigateTo(`/summary/private/${data.value}`);
			}

			isLoading.value = pending.value;
		};

		return {
			summaryCreateForm,
			createSummary,

			isLoading: computed(() => isLoading.value),
		};
	},
	{
		persist: {
			storage: persistedState.cookiesWithOptions({
				sameSite: 'strict',
				secure: true,
			}),
		},
	},
);
