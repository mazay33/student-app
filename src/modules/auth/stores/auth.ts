import type { IUser } from '~/@types/@types';
import useApiService from '~/services/apiService';

const apiService = useApiService();

export const useAuthStore = defineStore(
	'auth',
	() => {
		const isLoading = ref<boolean>(false);
		const user = ref<IUser | null>();
		const isAuthinticated = computed<boolean>(() => !!user.value);
		const isAdmin = computed<boolean>(() => !!user.value && user.value.is_superuser);

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
			isLoading.value = true;
			const { data, pending } = await apiService.auth.login(email, password);

			if (data.value) {
				await getMe();
				await navigateTo('/');
			}

			isLoading.value = pending.value;
		};

		const refresh = async () => {
			isLoading.value = true;
			const { error, pending } = await apiService.auth.refresh();

			if (error.value) {
				user.value = null;
			}

			isLoading.value = pending.value;
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
