<script setup lang="ts">
definePageMeta({
	path: '/',
});
</script>

<template>
	<div>
		<NuxtErrorBoundary>
			<Card>
				<template #title> Поиск конспектов</template>
				<template #content>
					<SummaryPublicTable />
				</template>
			</Card>

			<template #error="{ error, clearError }">
				<Error :error="error" />
				<Button @click="clearError">Try to reset</Button>
			</template>
		</NuxtErrorBoundary>
	</div>
</template>
