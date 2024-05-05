<script setup lang="ts">
import type { IUniversity } from '../@types';
import QueryBuilder from '~/utils/QueryBuilder';
import type { IPaginatedResult } from '~/@types/@types';
import useApiService from '~/services/apiService';

const apiService = useApiService();

const filter = ref<{ [key: string]: any }>({
	page: 1,
	page_size: 25,
	sort_by: '',
	sort_type: 'asc',
});

const searchFilter = ref({
	name: '',
});

const filterUrl = computed(() =>
	new QueryBuilder()
		.setPage(filter.value.page)
		.setPageSize(filter.value.page_size)
		.setSortBy(filter.value.sort_by)
		.setSortType(filter.value.sort_type)
		.setFilter('name', searchFilter.value.name)
		.buildUrl(),
);

const universities = ref<IPaginatedResult<IUniversity>>();
const isLoading = ref<boolean>(false);

const getUniversities = async () => {
	isLoading.value = true;
	const { data, error, pending } = await apiService.university.getUniversityList(filterUrl.value);
	if (data.value) {
		universities.value = data.value;
	}

	if (error.value) {
		throw new Error(error.value.message);
	}

	isLoading.value = pending.value;
};

await getUniversities();

const debounceFetch = useDebounceFn(async () => {
	await getUniversities();
}, 500);

watch(
	() => filter.value,
	async () => {
		await getUniversities();
	},
	{ deep: true },
);

watch(
	() => searchFilter.value,
	async () => {
		await debounceFetch();
	},
	{ deep: true },
);
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
		@update:sort-field="filter.sort_by = $event"
		@update:sort-order="filter.sort_type = $event === 1 ? 'asc' : 'desc'"
	>
		<template #header>
			<div>
				<IconField icon-position="left">
					<InputIcon>
						<i class="pi pi-search" />
					</InputIcon>
					<InputText
						v-model="searchFilter.name"
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
				<Skeleton v-if="isLoading" />
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
				<Skeleton v-if="isLoading" />
				<div v-else>{{ slotProps.data.short_name }} - {{ slotProps.data.name }}</div>
			</template>
		</Column>
	</DataTable>

	<Paginator
		:rows="filter.page_size"
		:total-records="universities?.count"
		:rows-per-page-options="[10, 25, 50, 100]"
		@update:rows="filter.page_size = $event"
		@page="filter.page = $event.page + 1"
	/>
</template>

<style scoped></style>
