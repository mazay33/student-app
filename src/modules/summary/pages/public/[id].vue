<template>
	<div>
		<NuxtErrorBoundary>
			<Card>
				<template #content>
					<SummaryView />
				</template>
			</Card>

			<template #error="{ error, clearError }">
				<Error :error="error" />
				<Button @click="clearError">Try to reset</Button>
			</template>
		</NuxtErrorBoundary>
	</div>
</template>
