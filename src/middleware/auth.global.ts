import { defineNuxtRouteMiddleware } from 'nuxt/app';

import { useAuthStore } from '~/modules/auth/stores/auth';

export default defineNuxtRouteMiddleware(async to => {
	const authStore = useAuthStore();

	if (authStore.authinticated && to.path.startsWith('/auth/')) {
		return await navigateTo('/');
	}
});
