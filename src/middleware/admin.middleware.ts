import { defineNuxtRouteMiddleware } from 'nuxt/app';

export default defineNuxtRouteMiddleware(async () => {
	const authStore = useAuthStore();

	if (!authStore.isAdmin) {
		return await navigateTo('/');
	}
});
