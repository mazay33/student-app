<script setup lang="ts">
import type { DropdownChangeEvent } from 'primevue/dropdown';

import type { IPaginatedResult } from '~/@types/@types';
import type { ISubject, ITeacher, IUniversity } from '~/modules/reestr/@types';
import useApiService from '~/services/apiService';

type FetchFunction<T = unknown> = (...args: unknown[]) => Promise<T>;

const apiService = useApiService();

const summaryCreateFormStore = useSummaryCreateFormStore();
const { summaryCreateForm } = summaryCreateFormStore;

const isLoading = ref<boolean>(false);
const universities = ref<IPaginatedResult<IUniversity>>();
const subjects = ref<IPaginatedResult<ISubject>>();
const teachers = ref<IPaginatedResult<ITeacher>>();

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
							class="border-1 border-solid border-slate-200 rounded-xl flex-auto flex font-medium"
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
						>
							Создать новый
						</Button>
					</div>
					<!-- <div
              class="border-2 border-dashed rounded-lg h-50 border-round mt-5 flex-auto flex  font-medium"
            >
              <div>
                <ul flex justify-between>
                  Название предмета
                  <div>
                    <Button ml-190>Сохранить изменения</Button>
                  </div>
                </ul>
              </div>
            </div> -->
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
						>
							Создать нового
						</Button>
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
