import { defineNuxtRouteMiddleware } from 'nuxt/app';

export default defineNuxtRouteMiddleware(async (to, from) => {
	const authStore = useAuthStore();

	if (!authStore.isAdmin) {
		return await navigateTo('/');
	}
});
