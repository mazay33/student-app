<script setup lang="ts">
import type { DropdownChangeEvent } from 'primevue/dropdown';
import type { VirtualScrollerLazyEvent } from 'primevue/virtualscroller';
import type { ISummary } from '../@types';
import type { IPaginatedResult, IUser } from '~/@types/@types';
import type { ISubject, ITeacher, IUniversity } from '~/modules/reestr/@types';
import useApiService from '~/services/apiService';
import QueryBuilder from '~/utils/QueryBuilder';

const route = useRoute();

/**
 *  Переменная для определения того, какие конспекты показывать в таблице (приватные - свои или публичные)
 */
const isPrivateSummary = ref(route.path === '/summary/private');

const apiService = useApiService();
const debounceFetch = createDebounceFetch(500);

const users = ref<IPaginatedResult<IUser>>();
const getUsers = async () => {
	const { data } = await apiService.user.getUserList();
	if (data.value) {
		users.value = data.value;
	}
};
await getUsers();

// university
// Логика фильтрации по университетам
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

const onUniversityChange = (event: DropdownChangeEvent) => {
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
// Логика фильтрации по предметам
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

const onSubjectChange = (event: DropdownChangeEvent) => {
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
// Логика фильтрации по преподавателям
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

const onTeacherChange = (event: DropdownChangeEvent) => {
	summaryFilter.value.teacher_id = event.value?.id;
};

// summaries
// Логика конснпектов
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
	const { data, error } = isPrivateSummary.value
		? await apiService.summary.getPrivateSummaries(summaryQueryUrl.value)
		: await apiService.summary.getPublicSummaries(summaryQueryUrl.value);

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
		filter-display="row"
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
			:show-filter-menu="false"
			:show-filter-operators="false"
			:show-clear-button="false"
		>
			<template #body="slotProps">
				<Skeleton v-if="isSummariesLoading" />

				<div v-else>{{ slotProps.index + 1 }}</div>
			</template>
			<template #filter>
				<i
					class="pi pi-filter-slash"
					:class="[
						university?.id || subject?.id || teacher?.id || summarySearchFilter.name
							? 'text-[var(--primary-color)] cursor-pointer'
							: '	text-slate-400 cursor-not-allowed',
					]"
					@click="clearFilters()"
				></i>
			</template>
		</Column>

		<Column
			field="full_name"
			header="Название"
			:show-filter-menu="false"
			:show-filter-operators="false"
			:show-clear-button="false"
		>
			<template #body="{ data }: { data: ISummary }">
				<Skeleton v-if="isSummariesLoading" />
				<div
					v-else
					class="flex"
				>
					<nuxt-link
						:to="isPrivateSummary ? `/summary/private/${data.id}` : `/summary/public/${data.id}`"
						class="text-indigo-500 cursor-pointer"
					>
						<Badge
							v-if="isPrivateSummary"
							:severity="
								data.status === 'approved'
									? 'success'
									: data.status === 'on_moderation'
										? 'warning'
										: 'danger'
							"
							class="mr-2"
						>
						</Badge
						>{{ data.name }}
					</nuxt-link>
					<Badge
						v-if="data.lectures_count"
						v-tooltip="'Кол-во конспектов'"
						class="ml-a"
						:value="data.lectures_count"
					></Badge>
				</div>
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
			:show-filter-menu="false"
			:show-filter-operators="false"
			:show-clear-button="false"
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
					placeholder="Введите название вуза..."
					empty-message="Ничего не найдено"
					:virtual-scroller-options="{
						lazy: true,
						loading: isUniversitiesLoading,
						onLazyLoad: onUniversitiesLazyScrollLoad,
						itemSize: 25,
					}"
					@input="onUniversityInput($event)"
					@change="onUniversityChange($event)"
				>
					<template #clearicon="{ clearCallback }">
						<i
							class="pi pi-times p-dropdown-clear-icon"
							@click="
								clearCallback($event), universityQueryFilter.setFilter('name', ''), getUniversities()
							"
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
			:show-filter-menu="false"
			:show-filter-operators="false"
			:show-clear-button="false"
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
					editable
					show-clear
					placeholder="Введите название предмета..."
					empty-message="Ничего не найдено"
					@input="onSubjectInput($event)"
					@change="onSubjectChange($event)"
				>
					<template #clearicon="{ clearCallback }">
						<i
							class="pi pi-times p-dropdown-clear-icon"
							@click="clearCallback($event), subjectQueryFilter.setFilter('name', ''), getSubjects()"
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
			:show-filter-menu="false"
			:show-filter-operators="false"
			:show-clear-button="false"
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
					placeholder="Введите имя преподователя..."
					empty-message="Ничего не найдено"
					@input="onTeacherInput($event)"
					@change="onTeacherChange($event)"
				>
					<template #clearicon="{ clearCallback }">
						<i
							class="pi pi-times p-dropdown-clear-icon"
							@click="clearCallback($event), teacherQueryFilter.setFilter('full_name', ''), getTeachers()"
						/>
					</template>
					<template #option="{ option }: { option: ITeacher }">
						{{ option.full_name }}
					</template>
				</Dropdown>
			</template>
		</Column>

		<Column
			v-if="!isPrivateSummary"
			field="full_name"
			header="Пользователь"
			style="width: 20%"
			:show-filter-menu="false"
			:show-filter-operators="false"
			:show-clear-button="false"
		>
			<template #body="{ data }: { data: ISummary }">
				<Skeleton v-if="isSummariesLoading" />
				<div v-else>
					<div class="flex items-center gap-2">
						<img
							v-if="users?.result.find((user: IUser) => user.id === data.user_id)?.image_url"
							class="w-10 rounded-full text-center"
							:src="users?.result.find((user: IUser) => user.id === data.user_id)?.image_url || ''"
							alt=""
						/>
						<span>{{ users?.result.find((user: IUser) => user.id === data.user_id)?.nickname }} </span>
					</div>
				</div>
			</template>
			<!-- <template #filter>
				<Dropdown
					v-model="teacher"
					option-label="full_name"
					:loading="isSummariesLoading"
					:options="teachers?.result"
					editable
					show-clear
					placeholder="Введите имя преподователя..."
					empty-message="Ничего не найдено"
					@input="onTeacherInput($event)"
					@change="onTeacherChange($event)"
				>
					<template #clearicon="{ clearCallback }">
						<i
							class="pi pi-times p-dropdown-clear-icon"
							@click="clearCallback($event), teacherQueryFilter.setFilter('full_name', ''), getTeachers()"
						/>
					</template>
					<template #option="{ option }: { option: ITeacher }">
						{{ option.full_name }}
					</template>
				</Dropdown>
			</template> -->
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

<style></style>