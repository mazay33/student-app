<script setup lang="ts">
import useApiService from '~/services/apiService';

const apiService = useApiService();

const page = ref<number>(1);
const pageSize = ref<number>(25);
const sortBy = ref<string>();
const sortType = ref<'asc' | 'desc'>('asc');

const userSearch = ref<string>();

const debouncedUserSearch = debouncedRef(userSearch, 500);

const {
	data: user,
	pending,
	error,
} = await apiService.subject.getSubjectList({
	lazy: true,
	query: {
		page,
		page_size: pageSize,
		sort_by: sortBy,
		sort_type: sortType,
		name: debouncedUserSearch,
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
		:value="user?.result"
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
						v-model="userSearch"
						placeholder="Поиск пользователя"
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
				{{ slotProps.index + 1 }}
			</template>
		</Column>

		<Column
			sortable
			field="full_name"
			header="Название"
			style="width: 95%"
		>
			<template #body="slotProps">
				<nuxt-link :to="`/profile/${slotProps.data.id}`">
					{{ slotProps.data.nickname }}
				</nuxt-link>
			</template>
		</Column>
	</DataTable>

	<Paginator
		:rows="pageSize"
		:total-records="user?.count"
		:rows-per-page-options="[10, 25, 50, 100]"
		@update:rows="pageSize = $event"
		@page="page = $event.page + 1"
	/>
</template>

<style scoped></style>
