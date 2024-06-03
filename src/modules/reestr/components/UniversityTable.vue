<script setup lang="ts">
import type { PageState } from 'primevue/paginator';
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

const updateSortBy = (event: string | undefined) => {
	sortBy.value = event || undefined;
};

const updateSortOrder = (order: 'asc' | 'desc') => {
	sortType.value = order;
};

const updatePageSize = (newSize: number) => {
	pageSize.value = newSize;
};

const updatePage = (newPage: PageState) => {
	page.value = newPage.page + 1;
};

const showSkeleton = ref<boolean>(false);
let skeletonTimeout: ReturnType<typeof setTimeout>;

watch(
	() => pending.value,
	newPending => {
		if (newPending) {
			skeletonTimeout = setTimeout(() => {
				showSkeleton.value = true;
			}, 200);
		} else {
			clearTimeout(skeletonTimeout);
			showSkeleton.value = false;
		}
	},
);

watch(
	() => error.value,
	() => {
		if (error.value) throw new Error(error.value.message);
	},
);
</script>

<template>
	<UiTableWrapper
		class="min-h-[calc(90vh-11rem)]"
		scroll-height="calc(90vh - 16rem)"
		:pending="pending"
		:value="universities?.result"
		removable-sort
		:pages="universities?.pages"
		:page-size="pageSize"
		:total-records="universities?.count"
		@sort="() => {}"
		@update:sort-field="updateSortBy($event)"
		@update:sort-order="updateSortOrder($event)"
		@update:rows="updatePageSize"
		@update:page="updatePage"
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
				<Skeleton v-if="showSkeleton" />
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
				<Skeleton v-if="showSkeleton" />
				<div v-else>{{ slotProps.data.short_name }} - {{ slotProps.data.name }}</div>
			</template>
		</Column>
	</UiTableWrapper>
</template>

<style scoped></style>
