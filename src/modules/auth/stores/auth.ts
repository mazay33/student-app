import type { IUser } from '~/@types/@types';
import { processErrors } from '~/helpers';
import useApiService from '~/services/apiService';

const apiService = useApiService();

export const useAuthStore = defineStore(
	'auth',
	() => {
		const isLoading = ref<boolean>(false);
		const user = ref<IUser | null>();
		const isAuthinticated = computed<boolean>(() => !!user.value);
		const isAdmin = computed<boolean>(() => !!user.value && user.value.is_superuser);
		const refreshingError = ref<boolean>(false);
		const loginErrorMessage = ref<string | null>(null);

		const getMe = async () => {
			isLoading.value = true;
			const { data, error, pending } = await apiService.auth.getMe();

			if (data.value) {
				user.value = data.value;
			}

			if (error.value) {
				user.value = null;
			}

			isLoading.value = pending.value;
		};

		const login = async (email: string, password: string) => {
			const { data, error, pending } = await apiService.auth.login(email, password);

			if (data.value) {
				loginErrorMessage.value = null;
				await getMe();
				await navigateTo('/');
			}

			if (error.value) {
				loginErrorMessage.value = processErrors(error.value.data.detail);
			}
		};

		const refresh = async () => {
			isLoading.value = true;
			const { error, pending } = await apiService.auth.refresh();
			isLoading.value = pending.value;
			if (error.value) {
				user.value = null;
				refreshingError.value = true;
			}
		};

		const logout = async () => {
			isLoading.value = true;
			const { pending } = await apiService.auth.logout();

			user.value = null;

			isLoading.value = pending.value;
		};

		return {
			user,
			isLoading: computed(() => isLoading.value),
			authinticated: isAuthinticated,
			isAdmin,
			refreshingError: computed(() => refreshingError.value),
			loginErrorMessage: computed(() => loginErrorMessage.value),

			login,
			refresh,
			getMe,
			logout,
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
