<template>
	<div>
		<NuxtErrorBoundary>
			<Card>
				<template #title>Мои конспекты </template>
				<template #content>
					<SummaryTable />
				</template>
			</Card>

			<template #error="{ error, clearError }">
				<Error :error="error" />
				<Button @click="clearError">Try to reset</Button>
			</template>
		</NuxtErrorBoundary>
	</div>
</template>
