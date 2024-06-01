<script setup lang="ts">
import type { PageState } from 'primevue/paginator';
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
} = await apiService.user.getUserList({
	lazy: true,
	query: {
		page,
		page_size: pageSize,
		sort_by: sortBy,
		sort_type: sortType,
		nickname: debouncedUserSearch,
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

watch(
	() => error.value,
	() => {
		throw new Error(error.value?.message);
	},
);
</script>

<template>
	<UiTableWrapper
		class="min-h-[calc(90vh-11rem)]"
		scroll-height="calc(90vh - 15rem)"
		:pending="pending"
		:value="user?.result"
		removable-sort
		:pages="user?.pages"
		:page-size="pageSize"
		:total-records="user?.count"
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
				<Skeleton v-if="pending" />
				<span v-else>{{ slotProps.index + 1 }}</span>
			</template>
		</Column>

		<Column
			sortable
			field="nickname"
			header="Название"
			style="width: 95%"
		>
			<template #body="slotProps">
				<Skeleton v-if="pending" />
				<nuxt-link
					v-else
					:to="`/profile/${slotProps.data.id}`"
				>
					{{ slotProps.data.nickname }}
				</nuxt-link>
			</template>
		</Column>
	</UiTableWrapper>
</template>

<style scoped></style>
