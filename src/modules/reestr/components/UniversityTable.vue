<script setup lang="ts">
import useApiService from '~/services/apiService';

const apiService = useApiService();

const page = ref<number>(1);
const pageSize = ref<number>(25);
const sortBy = ref<string>();
const sortType = ref<'asc' | 'desc'>('asc');
const universitySearch = ref<string>();
const debouncedUniversitySearch = debouncedRef(universitySearch, 500);

const {
	data: universities,
	pending,
	error,
} = await apiService.university.getUniversityList({
	lazy: true,
	query: {
		page,
		page_size: pageSize,
		sort_by: sortBy,
		sort_type: sortType,
		name: debouncedUniversitySearch,
	},
});

const updateSortBy = (event: string | null) => {
	sortBy.value = event || undefined;
};

if (error.value) {
	throw new Error(error.value.message);
}
</script>

<template>
	<DataTable
		scroll-height="60vh"
		scrollable
		show-gridlines
		:value="universities?.result"
		removable-sort
		lazy
		@sort="() => {}"
		@update:sort-field="updateSortBy($event)"
		@update:sort-order="sortType = $event === 1 ? 'asc' : 'desc'"
	>
		<template #header>
			<div>
				<IconField icon-position="left">
					<InputIcon>
						<i class="pi pi-search" />
					</InputIcon>
					<InputText
						v-model="universitySearch"
						placeholder="Поиск университета"
					/>
				</IconField>
			</div>
		</template>
		<Column
			class="text-center"
			header="№"
			style="width: 2%"
		>
			<template #body="slotProps">
				<Skeleton v-if="pending" />
				<div v-else>{{ slotProps.index + 1 }}</div>
			</template>
		</Column>
		<Column
			sortable
			field="name"
			header="Название"
			style="width: 95%"
		>
			<template #body="slotProps">
				<Skeleton v-if="pending" />
				<div v-else>{{ slotProps.data.short_name }} - {{ slotProps.data.name }}</div>
			</template>
		</Column>
	</DataTable>

	<Paginator
		:rows="pageSize"
		:total-records="universities?.count"
		:rows-per-page-options="[10, 25, 50, 100]"
		@update:rows="pageSize = $event"
		@page="page = $event.page + 1"
	/>
</template>

<style scoped></style>
