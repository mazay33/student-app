<script setup lang="ts">
import type { DropdownChangeEvent } from 'primevue/dropdown';
import Dialog from 'primevue/dialog';
import Calendar from 'primevue/calendar';
import useApiService from '~/services/apiService';

import type { IPaginatedResult } from '~/@types/@types';
import type { ISubject, ITeacher, IUniversity } from '~/modules/reestr/@types';

const visible = ref(false);
const visible1 = ref(false);

type FetchFunction<T = unknown> = (...args: unknown[]) => Promise<T>;

const apiService = useApiService();

const summaryCreateFormStore = useSummaryCreateFormStore();
const { summaryCreateForm } = summaryCreateFormStore;

const isLoading = ref<boolean>(false);
const universities = ref<IPaginatedResult<IUniversity>>();
const subjects = ref<IPaginatedResult<ISubject>>();
const teachers = ref<IPaginatedResult<ITeacher>>();

const Subject = ref({
	name: null,
});

const Teacher = ref({
	full_name: null,
	date_birth: null,
});

const getUniversities = async (queryUrl: string = '') => {
	isLoading.value = true;
	const { data, error, pending } = await apiService.university.getUniversityList(queryUrl);
	if (data.value) {
		universities.value = data.value;
	}

	isLoading.value = pending.value;
};

const getSubjects = async (queryUrl: string = '') => {
	isLoading.value = true;
	const { data, error, pending } = await apiService.subject.getSubjectList(queryUrl);
	if (data.value) {
		subjects.value = data.value;
	}
	isLoading.value = pending.value;
};

const getTeachers = async (queryUrl: string = '') => {
	isLoading.value = true;
	const { data, error, pending } = await apiService.teacher.getTeacherList(queryUrl);
	if (data.value) {
		teachers.value = data.value;
	}
	isLoading.value = pending.value;
};

await Promise.all([getUniversities(), getSubjects(), getTeachers()]);

const debounceFetch = useDebounceFn(async (fetch: FetchFunction) => {
	await fetch();
}, 250);

const onUniversityChange = async (event: DropdownChangeEvent) => {
	if (typeof event.value === 'string') {
		const formatUrl = computed(() => new QueryBuilder().setFilter('name', event.value).buildUrl());

		await debounceFetch(() => getUniversities(formatUrl.value));
	}
};

const teacherFormatUrl = computed(() => new QueryBuilder());

const onSubjectChange = async (event: DropdownChangeEvent) => {
	if (typeof event.value === 'string') {
		const formatUrl = computed(() => new QueryBuilder().setFilter('name', event.value).buildUrl());
		await debounceFetch(() => getSubjects(formatUrl.value));
	}

	if (event.value?.id) {
		teacherFormatUrl.value.setFilter('subject_id', event.value?.id);

		await getTeachers(teacherFormatUrl.value.buildUrl());
	}
};

const onTeacherChange = async (event: DropdownChangeEvent) => {
	if (typeof event.value === 'string') {
		teacherFormatUrl.value.setFilter('full_name', event.value);

		await debounceFetch(() => getTeachers(teacherFormatUrl.value.buildUrl()));
	}
};

const toast = useToast();

const createSubject = async () => {
	const { data } = await apiService.subject.createSubject(Subject.value.name);

	if (data.value) {
		toast.add({
			severity: 'success',
			summary: 'Предмет успешно добавлен',
			life: 3000,
		});

		// Добавляем новый предмет в список опций
		const newSubject = { id: data.value, name: Subject.value.name };
		subjects.value.result.push(newSubject);

		// Обновляем v-model для Dropdown
		summaryCreateForm.subject = newSubject;

		visible.value = false;
	}
};

const createTeacher = async () => {
	const date = new Date(Teacher.value.date_birth);
	const formattedDate = date.toISOString().split('T')[0];
	Teacher.value.date_birth = formattedDate;

	const { data } = await apiService.teacher.createTeacher(Teacher);

	if (data.value) {
		toast.add({
			severity: 'success',
			summary: 'Предмет успешно добавлен',
			life: 3000,
		});

		const newTeacher = { id: data.value, full_name: Teacher.value.full_name, date_birth: Teacher.value.date_birth };
		teachers.value.result.push(newTeacher);

		summaryCreateForm.teacher = newTeacher;

		visible1.value = false;
	}
};

const submitSummary = async () => {
	await summaryCreateFormStore.createSummary();
};

const submitButtonDisabled = computed(
	() =>
		summaryCreateForm.name &&
		summaryCreateForm.university?.id &&
		summaryCreateForm.subject?.id &&
		summaryCreateForm.teacher?.id,
);
</script>
<template>
	<Toast />
	<Card>
		<template #title>Создание конспекта</template>
		<template #content>
			<Stepper orientation="vertical">
				<StepperPanel header="Конспект">
					<div class="flex flex-column h-3rem">
						<InputText
							v-model="summaryCreateForm.name"
							type="text"
							placeholder="Введите название конспекта..."
							class="border-1 border-solid border-slate-300 rounded-xl flex-auto flex font-normal"
						/>
					</div>
				</StepperPanel>

				<StepperPanel header="ВУЗ">
					<div class="flex flex-col h-3rem">
						<Dropdown
							v-model="summaryCreateForm.university"
							option-label="name"
							:loading="isLoading"
							:options="universities?.result"
							editable
							show-clear
							placeholder="Введите название вуза..."
							class="border-1 border-solid border-slate-300 rounded-xl flex-auto font-medium"
							@change="onUniversityChange($event)"
						>
							<template #option="{ option }: { option: IUniversity }">
								{{ option.short_name }} - {{ option.name }}
							</template>
						</Dropdown>
					</div>
				</StepperPanel>

				<StepperPanel header="Предмет">
					<div class="flex flex-col sm:flex-row h-8rem sm:h-3rem">
						<Dropdown
							v-model="summaryCreateForm.subject"
							:options="subjects?.result"
							option-label="name"
							:loading="isLoading"
							editable
							show-clear
							placeholder="Выбрать из существующих"
							class="border-1 border-solid border-slate-300 rounded-xl flex-auto flex font-medium"
							@change="onSubjectChange($event)"
							@update:model-value="summaryCreateForm.teacher = null"
						/>
						<Button
							mb-3
							ml-0
							mt-3
							sm:mt-0
							sm:ml-5
							sm:mb-0
							w-36
							h-3rem
							text-sm
							font-medium
							@click="visible = true"
						>
							Создать новый
						</Button>
						<Dialog
							v-model:visible="visible"
							modal
							header="Добавление предмета"
							:style="{ width: '25rem' }"
						>
							<span class="p-text-secondary block mb-5"
								>При добавлении нового предмета, ваш конспект будет отправлен на модерацию</span
							>
							<div class="flex align-items-center gap-3 mb-3">
								<label
									for="Предмет"
									class="font-semibold w-6rem mt-2"
									>Предмет</label
								>
								<InputText
									id="Предмет"
									v-model="Subject.name"
									class="flex-auto"
									autocomplete="off"
								/>
							</div>
							<div class="flex align-items-center gap-3 mb-5"></div>
							<div class="flex justify-content-end gap-2">
								<Button
									type="button"
									label="Отменить"
									severity="secondary"
									@click="visible = false"
								></Button>
								<Button
									type="button"
									label="Добавить"
									@click="createSubject"
								></Button>
							</div>
						</Dialog>
					</div>
				</StepperPanel>

				<StepperPanel header="Преподаватель">
					<div class="flex flex-col sm:flex-row h-3rem">
						<Dropdown
							v-model="summaryCreateForm.teacher"
							:loading="isLoading"
							:options="teachers?.result"
							:disabled="!summaryCreateForm.subject?.id"
							option-label="full_name"
							editable
							show-clear
							placeholder="Введите имя преподавателя..."
							class="border-1 border-solid border-slate-300 rounded-xl flex-auto flex font-medium"
							@change="onTeacherChange($event)"
						/>
					</div>
					<div class="flex justify-between py-4">
						<Button
							w-37
							text-sm
							font-medium
							h-3rem
							@click="visible1 = true"
						>
							Создать нового
						</Button>
						<Dialog
							v-model:visible="visible1"
							modal
							header="Добавление преподавателя"
							:style="{ width: '25rem' }"
						>
							<span class="p-text-secondary block mb-5"
								>При добавлении нового преподавателя, ваш конспект будет отправлен на модерацию</span
							>
							<div class="flex align-items-center gap-3 mb-3">
								<label
									for="Преподаватель"
									class="font-semibold w-8rem mt-2"
									>Преподаватель</label
								>

								<div class="flex flex-col">
									<InputText
										id="Преподаватель"
										v-model="Teacher.full_name"
										class="flex-auto w-10/10 mb-3"
										autocomplete="off"
									/>
									<div class="flex">
										<p class="ml--30 font-semibold">Календарь</p>
										<Calendar
											id="Календарь"
											v-model="Teacher.date_birth"
											class="w-10/10 ml-8"
											date-format="yy-mm-dd"
										/>
									</div>
								</div>
							</div>
							<div class="flex align-items-center gap-3 mb-5"></div>
							<div class="flex justify-content-end gap-2">
								<Button
									type="button"
									label="Отменить"
									severity="secondary"
									@click="visible1 = false"
								></Button>
								<Button
									type="button"
									label="Добавить"
									@click="createTeacher"
								></Button>
							</div>
						</Dialog>
						<Button
							:disabled="!submitButtonDisabled"
							text-sm
							font-medium
							h-3rem
							@click="submitSummary"
						>
							Сохранить
						</Button>
					</div>
				</StepperPanel>
			</Stepper>
		</template>
	</Card>
</template>

<style scoped></style>
