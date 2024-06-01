<template>
	<div>
		<DataTable
			:scroll-height="scrollHeight"
			scrollable
			show-gridlines
			filter-display="row"
			:value="value"
		>
			<template #empty>
				<div
					v-if="value?.length === 0 && !pending"
					class="w-full flex flex-col items-center justify-center py-20"
				>
					<img
						class="h-90px w-90px text-slate-400"
						src="~/assets/images/empty.svg"
					/>
					<div class="mt-4 text-2xl text-slate-400">Конспекты не найдены :(</div>
				</div>

				<div
					v-else
					class="w-full flex flex-col items-center justify-center py-20"
				>
					<ProgressSpinner
						style="width: 50px; height: 50px"
						animation-duration="1s"
					/>
				</div>
			</template>
			<slot></slot>
		</DataTable>

		<Paginator
			v-if="pages"
			:rows="pageSize"
			:total-records="totalRecords"
			:rows-per-page-options="[10, 25, 50, 100]"
			@update:rows="updateRows"
			@page="updatePage"
		>
		</Paginator>
	</div>
</template>

<script setup lang="ts">
import type { PageState } from 'primevue/paginator';
import { defineProps, defineEmits } from 'vue';

defineProps<{
	value?: Array<any>;
	scrollHeight?: string;
	pending?: boolean;
	pages?: number;
	pageSize?: number;
	totalRecords?: number;
}>();

const emit = defineEmits<{
	(e: 'update:rows', newRows: number): void;
	(e: 'update:page', newPage: PageState): PageState;
}>();

const updateRows = (newRows: number) => {
	emit('update:rows', newRows);
};

const updatePage = (newPage: PageState) => {
	emit('update:page', newPage);
};
</script>
