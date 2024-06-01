<template>
	<div class="h-full flex flex-col justify-between">
		<DataTable
			:scroll-height="scrollHeight"
			scrollable
			show-gridlines
			:filter-display="filterDisplay"
			:value="value"
			:removable-sort="removableSort"
			@sort="handleSort"
		>
			<template
				v-if="$slots.header"
				#header
			>
				<slot name="header"></slot>
			</template>
			<template #empty>
				<div
					v-if="value?.length === 0 && !pending"
					class="h-full min-h-[calc(90vh-24rem)] w-full flex flex-col items-center justify-center py-20"
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
import type { DataTableSortEvent } from 'primevue/datatable';
import type { PageState } from 'primevue/paginator';
import { defineProps, defineEmits } from 'vue';

defineProps<{
	value?: Array<any>;
	scrollHeight?: string;
	pending?: boolean;
	pages?: number;
	pageSize?: number;
	totalRecords?: number;
	filterDisplay?: 'row' | 'menu';
	removableSort?: boolean;
}>();

const emit = defineEmits<{
	(e: 'update:rows', newRows: number): void;
	(e: 'update:page', newPage: PageState): PageState;
	(e: 'update:sort-field', field: string | undefined): void;
	(e: 'update:sort-order', order: 'asc' | 'desc'): void;
}>();

const updateRows = (newRows: number) => {
	emit('update:rows', newRows);
};

const updatePage = (newPage: PageState) => {
	emit('update:page', newPage);
};

const sortType = ref<'asc' | 'desc'>('asc');

const updateSortBy = (field: string | any) => {
	emit('update:sort-field', field || undefined);
};

const handleSort = (event: DataTableSortEvent) => {
	const sortField = event.sortField || '';
	updateSortBy(sortField);
	sortType.value = event.sortOrder === 1 ? 'asc' : 'desc';
	emit('update:sort-order', sortType.value);
};
</script>
