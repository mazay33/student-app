<script setup lang="ts">
import type { DropdownChangeEvent } from 'primevue/dropdown';

import type { IPaginatedResult } from '~/@types/@types';
import type { ISubject, ITeacher, IUniversity } from '~/modules/reestr/@types';
import useApiService from '~/services/apiService';

const isNewSubjectModalVisible = ref(false);
const isNewTeacherModalVisible = ref(false);

type FetchFunction<T = unknown> = (...args: unknown[]) => Promise<T>;

const apiService = useApiService();

const summaryCreateFormStore = useSummaryCreateFormStore();
const { summaryCreateForm } = summaryCreateFormStore;

const isLoading = ref<boolean>(false);
const universities = ref<IPaginatedResult<IUniversity>>();
const subjects = ref<IPaginatedResult<ISubject>>();
const teachers = ref<IPaginatedResult<ITeacher>>();

const newSubjectName = ref('');

const newTeacher = ref({
	full_name: '',
	date_birth: '',
});

const getUniversities = async (queryUrl: string = '') => {
	isLoading.value = true;
	const { data, pending } = await apiService.university.getUniversityList(queryUrl);
	if (data.value) {
		universities.value = data.value;
	}

	isLoading.value = pending.value;
};

const getSubjects = async (queryUrl: string = '') => {
	isLoading.value = true;
	const { data, pending } = await apiService.subject.getSubjectList(queryUrl);
	if (data.value) {
		subjects.value = data.value;

		// Если в форме есть новый предмет, который еще не прошел модерацию, то добавляем его в список опций
		if (
			summaryCreateForm.subject &&
			!subjects.value.result.find(subject => subject.id === summaryCreateForm.subject?.id)
		) {
			subjects.value.result.push(summaryCreateForm.subject);
		}
	}
	isLoading.value = pending.value;
};

const toast = useToast();

const createSubject = async () => {
	const { data } = await apiService.subject.createSubject(newSubjectName.value);

	if (data.value) {
		toast.add({
			severity: 'success',
			summary: 'Предмет успешно добавлен',
			life: 3000,
		});

		subjects.value?.result.push({ id: data.value, name: newSubjectName.value });
		summaryCreateForm.subject = { id: data.value, name: newSubjectName.value };

		isNewSubjectModalVisible.value = false;
	}
};

const getTeachers = async (queryUrl: string = '') => {
	isLoading.value = true;
	const { data, pending } = await apiService.teacher.getTeacherList(queryUrl);
	if (data.value) {
		teachers.value = data.value;

		// Если в форме есть новый учитель, который еще не прошел модерацию, то добавляем его в список опций
		if (
			summaryCreateForm.teacher &&
			!teachers.value.result.find(teacher => teacher.id === summaryCreateForm.teacher?.id)
		) {
			teachers.value.result.push(summaryCreateForm.teacher);
		}
	}
	isLoading.value = pending.value;
};

const createTeacher = async () => {
	if (!newTeacher.value.date_birth || !newTeacher.value.full_name) return;
	newTeacher.value.date_birth = useDateFormat(newTeacher.value.date_birth, 'YYYY-MM-DD').value;

	const { data } = await apiService.teacher.createTeacher(newTeacher.value);

	if (data.value) {
		toast.add({
			severity: 'success',
			summary: 'Преподаватель успешно добавлен',
			life: 3000,
		});

		teachers.value?.result.push({
			id: data.value,
			full_name: newTeacher.value.full_name,
			date_birth: newTeacher.value.date_birth,
			is_moderated: false,
		});

		summaryCreateForm.teacher = {
			id: data.value,
			full_name: newTeacher.value.full_name,
			date_birth: newTeacher.value.date_birth,
			is_moderated: false,
		};

		isNewTeacherModalVisible.value = false;
	}
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

const submitSummary = async () => {
	await summaryCreateFormStore.createSummary();
	await navigateTo(`/summary/private/${data.value}`);
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
	<Card>
		<Toast />
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
					<div class="flex flex-col h-8rem sm:h-8rem">
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
							mb-4
							ml-0
							mt-3
							w-36
							h-3rem
							text-sm
							font-medium
							@click="isNewSubjectModalVisible = true"
						>
							Создать новый
						</Button>
						<Dialog
							v-model:visible="isNewSubjectModalVisible"
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
									v-model="newSubjectName"
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
									@click="isNewSubjectModalVisible = false"
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
							@click="isNewTeacherModalVisible = true"
						>
							Создать нового
						</Button>
						<Dialog
							v-model:visible="isNewTeacherModalVisible"
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
										v-model="newTeacher.full_name"
										class="flex-auto w-10/10 mb-3"
										autocomplete="off"
									/>
									<div class="flex">
										<p class="ml--30 font-semibold translate-y-2">Календарь</p>
										<Calendar
											id="Календарь"
											v-model="newTeacher.date_birth"
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
									@click="isNewTeacherModalVisible = false"
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

<style>
span.p-stepper-title {
	font-size: 15px;
}
</style>
