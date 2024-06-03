<script setup lang="ts">
import type { PageState } from 'primevue/paginator';
import useApiService from '~/services/apiService';

const apiService = useApiService();

const page = ref<number>(1);
const pageSize = ref<number>(25);
const sortBy = ref<string>();
const sortType = ref<'asc' | 'desc'>('asc');

const subjectSearch = ref<string>();

const debouncedSubjectSearch = debouncedRef(subjectSearch, 500);

const {
	data: subjects,
	pending: subjectsPending,
	error,
} = await apiService.subject.getSubjectList({
	lazy: true,
	query: {
		page,
		page_size: pageSize,
		sort_by: sortBy,
		sort_type: sortType,
		name: debouncedSubjectSearch,
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
	() => subjectsPending.value,
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

watch(error, () => {
	if (error.value) throw new Error(error.value.message);
});
</script>

<template>
	<UiTableWrapper
		class="min-h-[calc(90vh-11rem)]"
		scroll-height="calc(90vh - 16rem)"
		:pending="subjectsPending"
		:value="subjects?.result"
		removable-sort
		:pages="subjects?.pages"
		:page-size="pageSize"
		:total-records="subjects?.count"
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
						v-model="subjectSearch"
						placeholder="Поиск предмета"
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
				<span v-else>
					{{ slotProps.index + 1 }}
				</span>
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
				<span v-else>
					{{ slotProps.data.name }}
				</span>
			</template>
		</Column>
	</UiTableWrapper>
</template>

<style scoped></style>
