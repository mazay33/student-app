<script setup lang="ts">
import type { DropdownChangeEvent } from 'primevue/dropdown';
import type { ISummary } from '../../@types';
import type { IPaginatedResult } from '~/@types/@types';
import type { ISubject, ITeacher, IUniversity } from '~/modules/reestr/@types';
import useApiService from '~/services/apiService';
import QueryBuilder from '~/utils/QueryBuilder';
import type { VirtualScrollerLazyEvent } from 'primevue/virtualscroller';

const apiService = useApiService();
const debounceFetch = createDebounceFetch(500);

//  university
const universities = ref<IPaginatedResult<IUniversity>>();
const university = ref<IUniversity | null>(null);
const universityQueryFilter = ref(new QueryBuilder().setPageSize(25));
const universityQueryUrl = computed(() => universityQueryFilter.value.buildUrl());
const isUniversitiesLoading = ref<boolean>(false);

const getUniversities = async () => {
	isUniversitiesLoading.value = true;
	const { data, error, pending } = await apiService.university.getUniversityList(universityQueryUrl.value);
	if (data.value) {
		universities.value = data.value;
	}
	isUniversitiesLoading.value = pending.value;
};

await getUniversities();

const onUniversityInput = async (event: InputEvent) => {
	const target = event.target as HTMLInputElement;

	universityQueryFilter.value.setFilter('name', target.value);

	await debounceFetch(() => getUniversities());
};

const onUniversityChange = async (event: DropdownChangeEvent) => {
	summaryFilter.value.university_id = event.value?.id;
};

const onUniversitiesLazyScrollLoad = async (event: VirtualScrollerLazyEvent) => {
	const { first, last } = event;

	if (universities.value && universities.value.result.length === last && last < universities.value.count) {
		universityQueryFilter.value.setPageSize(last + 25);

		await debounceFetch(() => getUniversities());
	}
};

// subjects
const subjects = ref<IPaginatedResult<ISubject>>();
const subject = ref<ISubject | null>(null);
const subjectQueryFilter = ref(new QueryBuilder().setPageSize(25));
const subjectQueryUrl = computed(() => subjectQueryFilter.value.buildUrl());
const isSubjectsLoading = ref<boolean>(false);

const getSubjects = async () => {
	isSubjectsLoading.value = true;
	const { data, error, pending } = await apiService.subject.getSubjectList(subjectQueryUrl.value);
	if (data.value) {
		subjects.value = data.value;
	}

	isSubjectsLoading.value = pending.value;
};

await getSubjects();

const onSubjectInput = async (event: InputEvent) => {
	const target = event.target as HTMLInputElement;

	subjectQueryFilter.value.setFilter('name', target.value);

	await debounceFetch(() => getSubjects());
};

const onSubjectChange = async (event: DropdownChangeEvent) => {
	summaryFilter.value.subject_id = event.value?.id;
};

const onSubjectsLazyScrollLoad = async (event: VirtualScrollerLazyEvent) => {
	const { first, last } = event;

	if (subjects.value && subjects.value.result.length === last && last < subjects.value.count) {
		subjectQueryFilter.value.setPageSize(last + 25);

		await debounceFetch(() => getSubjects());
	}
};

// teachers
const teachers = ref<IPaginatedResult<ITeacher>>();
const teacher = ref<ITeacher | null>(null);
const teacherQueryFilter = ref(new QueryBuilder().setPageSize(25));
const teacherQueryUrl = computed(() => teacherQueryFilter.value.buildUrl());
const isTeachersLoading = ref<boolean>(false);
const getTeachers = async () => {
	isTeachersLoading.value = true;
	const { data, error, pending } = await apiService.teacher.getTeacherList(teacherQueryUrl.value);
	if (data.value) {
		teachers.value = data.value;
	}

	isTeachersLoading.value = pending.value;
};

await getTeachers();

const onTeacherInput = async (event: InputEvent) => {
	const target = event.target as HTMLInputElement;

	teacherQueryFilter.value.setFilter('full_name', target.value);

	await debounceFetch(() => getTeachers());
};

const onTeacherChange = async (event: DropdownChangeEvent) => {
	summaryFilter.value.teacher_id = event.value?.id;
};

// summaries
const summaries = ref<IPaginatedResult<ISummary[]>>();
const isSummariesLoading = ref<boolean>(false);

const summaryFilter = ref<{ [key: string]: any }>({
	page: 1,
	page_size: 25,
	university_id: null,
	subject_id: null,
	teacher_id: null,
});
const summarySearchFilter = ref({
	name: '',
});

const summaryQueryUrl = computed(() => {
	return new QueryBuilder()
		.setPage(summaryFilter.value.page)
		.setPageSize(summaryFilter.value.page_size)
		.setFilter('name', summarySearchFilter.value.name)
		.setFilter('university_id', summaryFilter.value.university_id)
		.setFilter('subject_id', summaryFilter.value.subject_id)
		.setFilter('teacher_id', summaryFilter.value.teacher_id)
		.buildUrl();
});

const getSummaries = async () => {
	const { data, error } = await apiService.summary.getPublicSummaries(summaryQueryUrl.value);

	if (data.value) {
		summaries.value = data.value;
	}

	if (error.value) {
		throw new Error(error.value.message);
	}
};

await getSummaries();

watch(
	() => summaryFilter.value,
	async () => {
		await getSummaries();
	},
	{ deep: true },
);

watch(
	() => summarySearchFilter.value,
	async () => {
		await debounceFetch(() => getSummaries());
	},
	{ deep: true },
);

const clearFilters = () => {
	university.value = null;
	subject.value = null;
	teacher.value = null;

	summarySearchFilter.value.name = '';

	summaryFilter.value = {
		page: 1,
		page_size: 25,
		university_id: null,
		subject_id: null,
		teacher_id: null,
	};
};
</script>

<template>
	<DataTable
		scroll-height="64vh"
		scrollable
		show-gridlines
		filterDisplay="row"
		:value="summaries?.result"
	>
		<template #empty>
			<div class="w-full flex flex-col items-center justify-center py-20">
				<img
					class="w-90px h-90px text-slate-400"
					src="~/assets/images/empty.svg"
				/>
				<div class="text-slate-400 text-2xl mt-4">Конспекты не найдены</div>
			</div>
		</template>
		<Column
			class="text-center"
			header="№"
			style="width: 1%"
			:showFilterMenu="false"
			:showFilterOperators="false"
			:showClearButton="false"
		>
			<template #body="slotProps">
				<Skeleton v-if="isSummariesLoading" />

				<div v-else>{{ slotProps.index + 1 }}</div>
			</template>
			<template #filter>
				<i
					@click="clearFilters()"
					class="pi pi-filter-slash"
					:class="[
						university?.id || subject?.id || teacher?.id || summarySearchFilter.name
							? 'text-[var(--primary-color)] cursor-pointer'
							: '	text-slate-400 cursor-not-allowed',
					]"
				></i>
			</template>
		</Column>

		<Column
			field="full_name"
			header="Название"
			:showFilterMenu="false"
			:showFilterOperators="false"
			:showClearButton="false"
		>
			<template #body="slotProps">
				<Skeleton v-if="isSummariesLoading" />
				<nuxt-link
					v-else
					:to="`/summary/${slotProps.data.id}`"
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
						v-model="summarySearchFilter.name"
						placeholder="Название конспекта"
					/>
				</IconField>
			</template>
		</Column>

		<Column
			field="full_name"
			header="Наименование вуза"
			:showFilterMenu="false"
			:showFilterOperators="false"
			:showClearButton="false"
		>
			<template #body="slotProps">
				<Skeleton v-if="isSummariesLoading" />

				<div v-else>
					{{ slotProps.data.university_name }}
				</div>
			</template>
			<template #filter>
				<Dropdown
					v-model="university"
					option-label="short_name"
					:loading="isUniversitiesLoading"
					:options="universities?.result"
					show-clear
					editable
					@input="onUniversityInput($event)"
					@change="onUniversityChange($event)"
					placeholder="Введите название вуза..."
					emptyMessage="Ничего не найдено"
					:virtualScrollerOptions="{
						lazy: true,
						loading: isUniversitiesLoading,
						onLazyLoad: onUniversitiesLazyScrollLoad,
						itemSize: 25,
					}"
				>
					<template #clearicon="{ clearCallback }">
						<i
							@click="
								clearCallback($event), universityQueryFilter.setFilter('name', ''), getUniversities()
							"
							class="pi pi-times p-dropdown-clear-icon"
					/></template>
					<template #option="{ option }: { option: IUniversity }">
						{{ option.short_name }} - {{ option.name }}
					</template>
				</Dropdown>
			</template>
		</Column>

		<Column
			field="full_name"
			header="Предмет"
			:showFilterMenu="false"
			:showFilterOperators="false"
			:showClearButton="false"
		>
			<template #body="slotProps">
				<Skeleton v-if="isSummariesLoading" />
				<div v-else>
					{{ slotProps.data.subject_name }}
				</div>
			</template>
			<template #filter>
				<Dropdown
					v-model="subject"
					option-label="name"
					:loading="isSubjectsLoading"
					:options="subjects?.result"
					@input="onSubjectInput($event)"
					editable
					show-clear
					@change="onSubjectChange($event)"
					placeholder="Введите название предмета..."
					emptyMessage="Ничего не найдено"
				>
					<template #clearicon="{ clearCallback }">
						<i
							@click="clearCallback($event), subjectQueryFilter.setFilter('name', ''), getSubjects()"
							class="pi pi-times p-dropdown-clear-icon"
						/>
					</template>
					<template #option="{ option }: { option: ISubject }">
						{{ option.name }}
					</template>
				</Dropdown>
			</template>
		</Column>

		<Column
			field="full_name"
			header="Преподователь"
			style="width: 20%"
			:showFilterMenu="false"
			:showFilterOperators="false"
			:showClearButton="false"
		>
			<template #body="slotProps">
				<Skeleton v-if="isSummariesLoading" />
				<div v-else>
					{{ slotProps.data.teacher_full_name }}
				</div>
			</template>
			<template #filter>
				<Dropdown
					v-model="teacher"
					option-label="full_name"
					:loading="isSummariesLoading"
					:options="teachers?.result"
					editable
					show-clear
					@input="onTeacherInput($event)"
					@change="onTeacherChange($event)"
					placeholder="Введите имя преподователя..."
					emptyMessage="Ничего не найдено"
				>
					<template #clearicon="{ clearCallback }">
						<i
							@click="clearCallback($event), teacherQueryFilter.setFilter('full_name', ''), getTeachers()"
							class="pi pi-times p-dropdown-clear-icon"
						/>
					</template>
					<template #option="{ option }: { option: ITeacher }">
						{{ option.full_name }}
					</template>
				</Dropdown>
			</template>
		</Column>
	</DataTable>

	<Paginator
		v-if="summaries?.pages"
		:rows="summaryFilter.page_size"
		:total-records="summaries?.count"
		:rows-per-page-options="[10, 25, 50, 100]"
		@update:rows="summaryFilter.page_size = $event"
		@page="summaryFilter.page = $event.page + 1"
	>
	</Paginator>
</template>
