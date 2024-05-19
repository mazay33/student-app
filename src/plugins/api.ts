import { fetchWithCookie } from '~/composables/useFetchCookie';

export default defineNuxtPlugin(() => {
	let isRefreshing = false;

	const $api = $fetch.create({
		baseURL: 'https://auth.24konspect.ru/api/',
		retry: 1,
		retryStatusCodes: [401],
		credentials: 'include',
		headers: useRequestHeaders(['cookie']),

		onRequest({ options }) {
			options.headers = {
				...options.headers,
				...useRequestHeaders(['cookie']),
			};
		},

		async onResponseError({ response }) {
			if (response.status === 401 && !isRefreshing) {
				isRefreshing = true;

				if (process.server) {
					const event = useRequestEvent();

					const { status } = await useAsyncData(
						async () => await fetchWithCookie(event!, 'https://auth.24konspect.ru/api/public/auth/refresh'),
					);

					if (status.value === 'success') {
						await navigateTo(event?.path);
						return;
					}
					// await navigateTo('/auth/login')

					isRefreshing = false;
				}
				if (process.client) {
					await useAuthStore().refresh();

					if (useAuthStore().refreshingError) {
						return;
					}

					isRefreshing = false;
				}
			}
		},
	});
	// Expose to useNuxtApp().$api
	return {
		provide: {
			api: $api,
		},
	};
});
