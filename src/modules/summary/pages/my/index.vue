<script setup lang="ts">
import type { ISummary } from '../../@types';
import type { IPaginatedResult } from '~/@types/@types';
import type { ISubject, ITeacher, IUniversity } from '~/modules/reestr/@types';
import useApiService from '~/services/apiService';
import QueryBuilder from '~/utils/QueryBuilder';
type FetchFunction<T = unknown> = (...args: unknown[]) => Promise<T>;
const apiService = useApiService();

const universities = ref<IPaginatedResult<IUniversity>>();

const getUniversities = async (queryUrl: string = '') => {
	const { data, error, pending } = await apiService.university.getUniversityList(queryUrl);
	if (data.value) {
		universities.value = data.value;
	}
};

await getUniversities();

const subjects = ref<IPaginatedResult<ISubject>>();

const getSubjects = async (queryUrl: string = '') => {
	const { data, error, pending } = await apiService.subject.getSubjectList(queryUrl);
	if (data.value) {
		subjects.value = data.value;
	}
};

await getSubjects();

const teachers = ref<IPaginatedResult<ITeacher>>();
const teacher = ref<ITeacher | null>(null);
const getTeachers = async (queryUrl: string = '') => {
	const { data, error, pending } = await apiService.teacher.getTeacherList(queryUrl);
	if (data.value) {
		teachers.value = data.value;
	}
};

await getTeachers();

const summaries = ref<IPaginatedResult<ISummary[]>>();
const isLoading = ref<boolean>(false);

//

const summaryStore = useSummaryStore();
const { mySummaries } = storeToRefs(summaryStore);
await summaryStore.getMySummaries();

//

const filter = ref<{ [key: string]: any }>({
	page: 1,
	page_size: 25,
	university_id: null,
	subject_id: null,
	teacher_id: null,
});

const searchFilter = ref({
	name: '',
});

const filterUrl = computed(() => {
	return new QueryBuilder()
		.setPage(filter.value.page)
		.setPageSize(filter.value.page_size)
		.setFilter('name', searchFilter.value.name)
		.buildUrl();
});

const getSummaries = async () => {
	const { data, error } = await apiService.summary.getPublicSummaries(filterUrl.value);

	if (data.value) {
		summaries.value = data.value;
	}

	if (error.value) {
		throw new Error(error.value.message);
	}
};

const debounceFetch = useDebounceFn(async (fetch: FetchFunction) => {
	await fetch();
}, 500);

await getSummaries();

watch(
	() => filter.value,
	async () => {
		await getSummaries();
	},
	{ deep: true },
);

watch(
	() => searchFilter.value,
	async () => {
		await debounceFetch(() => getSummaries());
	},
	{ deep: true },
);
</script>

<template>
	<div class="bg-white shadow-lg w-full p-5 rounded-xl">
		<div class="flex mb-4">
			<p class="text-lg font-bold flex-1">Список моих конспектов</p>
		</div>

		<DataTable
			scroll-height="60vh"
			scrollable
			show-gridlines
			filterDisplay="row"
			:value="mySummaries?.result"
		>
			<Column
				class="text-center"
				header="№"
				style="width: 1%"
				:showFilterMenu="false"
				filterField="representative"
			>
				<template #body="slotProps">
					<Skeleton v-if="isLoading" />

					<div v-else>{{ slotProps.index + 1 }}</div>
				</template>
			</Column>

			<Column
				field="full_name"
				header="Название"
				style="width: 15%"
				:showFilterMenu="false"
			>
				<template #body="slotProps">
					<Skeleton v-if="isLoading" />
					<nuxt-link
						v-else
						:to="`/summary/my/${slotProps.data.id}`"
						class="text-indigo-500 cursor-pointer"
						>{{ slotProps.data.name }}</nuxt-link
					>
				</template>
				<template #filter>
					<IconField icon-position="left">
						<InputIcon>
							<i class="pi pi-search" />
						</InputIcon>
						<InputText
							v-model="searchFilter.name"
							placeholder="Название конспекта"
						/>
					</IconField>
				</template>
			</Column>

			<Column
				field="full_name"
				header="Наименование вуза"
				style="width: 20%"
				:showFilterMenu="false"
			>
				<template #body="slotProps">
					<Skeleton v-if="isLoading" />

					<div v-else>
						{{ slotProps.data.university_name }}
					</div>
				</template>
			</Column>

			<Column
				field="full_name"
				header="Предмет"
				style="width: 20%"
				:showFilterMenu="false"
			>
				<template #body="slotProps">
					<Skeleton v-if="isLoading" />
					<div v-else>
						{{ slotProps.data.subject_name }}
					</div>
				</template>
			</Column>

			<Column
				field="full_name"
				header="Преподователь"
				style="width: 20%"
				:showFilterMenu="false"
			>
				<template #body="slotProps">
					<Skeleton v-if="isLoading" />
					<div v-else>
						{{ slotProps.data.teacher_full_name }}
					</div>
				</template>
			</Column>
		</DataTable>

		<Paginator
			:rows="filter.page_size"
			:total-records="summaries?.count"
			:rows-per-page-options="[10, 25, 50, 100]"
			@update:rows="filter.page_size = $event"
			@page="filter.page = $event.page + 1"
		>
		</Paginator>
	</div>
</template>
