import type { ISummaryCreateForm, ISummaryEditForm } from '../@types';
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

		const summaryEditForm = reactive<ISummaryEditForm>({
			name: null,
			university: null,
			subject: null,
			teacher: null,
			id: null,
		});

		const summaryResponseId = ref<string>();

		const clearSummaryCreateForm = () => {
			summaryCreateForm.name = null;
			summaryCreateForm.university = null;
			summaryCreateForm.subject = null;
			summaryCreateForm.teacher = null;
		};

		const createSummary = async () => {
			isLoading.value = true;
			const { data, pending } = await apiService.summary.createSummary(summaryCreateForm);

			if (data.value) {
				clearSummaryCreateForm();
				summaryResponseId.value = data.value;
				// await navigateTo(`/summary/private/${data.value}`);
			}

			isLoading.value = pending.value;
		};

		const editSummary = async () => {
			isLoading.value = true;
			const { pending } = await apiService.summary.editSummary(summaryEditForm);

			isLoading.value = pending.value;
		};

		return {
			summaryCreateForm,
			createSummary,
			summaryEditForm,
			editSummary,
			summaryResponseId,
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
