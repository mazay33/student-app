<script setup>
useHead({
	title: 'Student App',
});
const route = useRoute();
const authStore = useAuthStore();

if (!route.path.includes('/auth')) {
	await authStore.getMe();
}
</script>

<template>
	<div id="#app">
		<NuxtLoadingIndicator />
		<NuxtLayout>
			<NuxtPage />
		</NuxtLayout>
	</div>
</template>

<style lang="scss">
@import 'App.scss';

// .page-enter-active,
// .page-leave-active {
// 	// transition: all 0.1s;
// }

// .page-enter-from,
// .page-leave-to {
// 	opacity: 0;
// 	filter: blur(0.5rem);
// }
</style>
