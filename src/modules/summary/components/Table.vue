<script setup lang="ts">
import type { VirtualScrollerLazyEvent } from 'primevue/virtualscroller';
import type { PageState } from 'primevue/paginator';
import type { ISummary } from '../@types';
import type { IUser } from '~/@types/@types';
import type { ISubject, ITeacher, IUniversity } from '~/modules/reestr/@types';
import useApiService from '~/services/apiService';

const route = useRoute();

/**
 *  Переменная для определения того, какие конспекты показывать в таблице (приватные - свои или публичные)
 */
const isPrivateSummary = ref(route.path === '/summary/private');

const apiService = useApiService();

const { data: users } = await apiService.user.getUserList({ lazy: true });

// university
// Логика фильтрации по университетам
const university = ref<IUniversity | null>(null);
const universitiesPageSize = ref<number>(25);
const universityName = ref<string>();
const debouncedUniversityName = debouncedRef(universityName, 500);

const { data: universities, pending: universitiesPending } = await apiService.university.getUniversityList({
	lazy: true,
	query: {
		name: debouncedUniversityName,
		page_size: universitiesPageSize,
	},
});

const onUniversityInput = (event: InputEvent) => {
	const target = event.target as HTMLInputElement;
	universityName.value = target.value;
};

const onUniversitiesLazyScrollLoad = (event: VirtualScrollerLazyEvent) => {
	const { last } = event;

	if (universities.value && universities.value.result.length === last && last < universities.value.count) {
		// Проверяем, идет ли уже запрос
		if (!universitiesPending.value) {
			universitiesPageSize.value = last + 25;
		}
	}
};

// subjects
// Логика фильтрации по предметам
const subject = ref<ISubject | null>(null);
const subjectName = ref<string>();
const debouncedSubjectName = debouncedRef(subjectName, 500);

const { data: subjects, pending: subjectsPending } = await apiService.subject.getSubjectList({
	lazy: true,
	query: {
		name: debouncedSubjectName,
	},
});

const onSubjectInput = (event: InputEvent) => {
	const target = event.target as HTMLInputElement;
	subjectName.value = target.value;
};

// teachers
// Логика фильтрации по преподавателям
const teacher = ref<ITeacher | null>(null);
const teacherName = ref<string>();
const debouncedTeacherName = debouncedRef(teacherName, 500);

const { data: teachers, pending: teachersPending } = await apiService.teacher.getTeacherList('', {
	lazy: true,
	query: {
		full_name: debouncedTeacherName,
	},
});

const onTeacherInput = (event: InputEvent) => {
	const target = event.target as HTMLInputElement;
	teacherName.value = target.value;
};

// summaries
// Логика конснпектов
const page = ref(1);
const pageSize = ref(25);
const subjectId = computed(() => subject.value?.id);
const universityId = computed(() => university.value?.id);
const teacherId = computed(() => teacher.value?.id);
const searchName = ref('');
const debouncedSearchName = refDebounced(searchName, 500);

const { data: summaries, pending } = await apiService.summary[
	isPrivateSummary.value ? 'getPrivateSummaries' : 'getPublicSummaries'
]({
	lazy: true,
	query: {
		page,
		page_size: pageSize,
		subject_id: subjectId,
		university_id: universityId,
		teacher_id: teacherId,
		name: debouncedSearchName,
	},
});

const clearFilters = () => {
	university.value = null;

	subject.value = null;

	teacher.value = null;

	searchName.value = '';
};

const updatePageSize = (newSize: number) => {
	pageSize.value = newSize;
};

const updatePage = (newPage: PageState) => {
	page.value = newPage.page + 1;
};
</script>

<template>
	<UiTableWrapper
		scroll-height="64vh"
		scrollable
		show-gridlines
		filter-display="row"
		:value="summaries?.result"
		:pending="pending"
		:pages="summaries?.pages"
		:page-size="pageSize"
		:total-records="summaries?.count"
		@update:rows="updatePageSize"
		@update:page="updatePage"
	>
		<template #empty>
			<div
				v-if="summaries?.result?.length === 0 && !pending"
				class="w-full flex flex-col items-center justify-center py-20"
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
		<Column
			class="text-center"
			header="№"
			style="width: 1%"
			:show-filter-menu="false"
			:show-filter-operators="false"
			:show-clear-button="false"
		>
			<template #body="slotProps">
				<Skeleton
					v-if="pending"
					height="35px"
				/>

				<div v-else>{{ slotProps.index + 1 }}</div>
			</template>
			<template #filter>
				<i
					class="pi pi-filter-slash"
					:class="[
						university?.id || subject?.id || teacher?.id || searchName
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
				<Skeleton
					v-if="pending"
					height="35px"
				/>
				<div
					v-else
					class="flex"
				>
					<nuxt-link
						:to="isPrivateSummary ? `/summary/private/${data.id}` : `/summary/public/${data.id}`"
						class="cursor-pointer text-indigo-500"
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
						v-model="searchName"
						placeholder="Название конспекта"
					/>
				</IconField>
			</template>
		</Column>

		<Column
			field="full_name"
			header="ВУЗ"
			:show-filter-menu="false"
			:show-filter-operators="false"
			:show-clear-button="false"
		>
			<template #body="slotProps">
				<Skeleton
					v-if="pending"
					height="35px"
				/>

				<div v-else>
					{{ slotProps.data.university_name }}
				</div>
			</template>
			<template #filter>
				<UiDropdownFilter
					v-model="university"
					:options="universities"
					:loading="universitiesPending"
					option-label="short_name"
					placeholder="Введите название вуза..."
					@input="onUniversityInput"
					@lazy-scroll-load="onUniversitiesLazyScrollLoad"
					@@update:input-value="universityName = $event"
					@@update:model-value="university = $event"
				>
					<template #customOption="{ option }"> {{ option.short_name }} - {{ option.name }} </template>
				</UiDropdownFilter>
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
				<Skeleton
					v-if="pending"
					height="35px"
				/>
				<div v-else>
					{{ slotProps.data.subject_name }}
				</div>
			</template>
			<template #filter>
				<UiDropdownFilter
					v-model="subject"
					:options="subjects"
					:loading="subjectsPending"
					option-label="name"
					placeholder="Введите название предмета..."
					@input="onSubjectInput"
					@@update:input-value="subjectName = $event"
					@@update:model-value="subject = $event"
				/>
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
				<Skeleton
					v-if="pending"
					height="35px"
				/>
				<div v-else>
					{{ slotProps.data.teacher_full_name }}
				</div>
			</template>
			<template #filter>
				<UiDropdownFilter
					v-model="teacher"
					:options="teachers"
					:loading="teachersPending"
					option-label="full_name"
					placeholder="Введите имя преподавателя..."
					@input="onTeacherInput"
					@@update:input-value="teacherName = $event"
					@@update:model-value="teacher = $event"
				/>
			</template>
		</Column>

		<Column
			v-if="!isPrivateSummary"
			field="full_name"
			header="Пользователь"
			style="width: 15%"
			:show-filter-menu="false"
			:show-filter-operators="false"
			:show-clear-button="false"
		>
			<template #body="{ data }: { data: ISummary }">
				<Skeleton
					v-if="pending"
					height="35px"
				/>
				<div v-else>
					<div class="flex items-center gap-2">
						<img
							v-if="users?.result.find((user: IUser) => user.id === data.user_id)?.image_url"
							class="w-10 rounded-full text-center"
							:src="users?.result.find((user: IUser) => user.id === data.user_id)?.image_url || ''"
							alt=""
						/>
						<nuxt-link
							v-if="users?.result.find((user: IUser) => user.id === data.user_id)?.nickname"
							:to="`/profile/${users?.result.find((user: IUser) => user.id === data.user_id)?.id}`"
							>{{ users?.result.find((user: IUser) => user.id === data.user_id)?.nickname }}
						</nuxt-link>
						<div v-else>Аккаунт удален</div>
					</div>
				</div>
			</template>
		</Column>
	</UiTableWrapper>
</template>

<style lang="scss">
.p-component-overlay {
	@apply bg-white;
}

.p-progress-spinner-circle {
	stroke: var(--primary-color) !important;
}
</style>
