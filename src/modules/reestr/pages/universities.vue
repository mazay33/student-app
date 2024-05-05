<script setup lang="ts"></script>

<template>
	<div>
		<NuxtErrorBoundary>
			<Card>
				<template #title> Список университетов</template>
				<template #content>
					<ReestrUniversityTable />
				</template>
			</Card>

			<template #error="{ error, clearError }">
				<Error :error="error" />
				<Button @click="clearError">Try to reset</Button>
			</template>
		</NuxtErrorBoundary>
	</div>
</template>

<style scoped></style>
