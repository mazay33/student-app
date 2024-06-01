<script setup lang="ts">
import type { VirtualScrollerLazyEvent } from 'primevue/virtualscroller';
import useApiService from '~/services/apiService';

const authStore = useAuthStore();
const router = useRouter();
const toast = useToast();

const isNewTeacherModalVisible = ref(false);

const apiService = useApiService();

const summaryCreateFormStore = useSummaryCreateFormStore();
const { summaryCreateForm } = summaryCreateFormStore;

// Логика выбора и фильтрации универов
const universitySearchName = ref<string>();
const universityPageSize = ref<number>(25);
const debouncedUniversitySearchName = debouncedRef(universitySearchName, 500);

const { data: universities, pending: universitiesPending } = await apiService.university.getUniversityList({
	lazy: true,
	query: {
		page_size: universityPageSize,
		name: debouncedUniversitySearchName,
	},
});

const onUniversityInput = (event: InputEvent) => {
	const target = event.target as HTMLInputElement;
	universitySearchName.value = target.value;
};

const onUniversitiesLazyScrollLoad = (event: VirtualScrollerLazyEvent) => {
	const { last } = event;

	if (universities.value && universities.value.result.length === last && last < universities.value.count) {
		// Проверяем, идет ли уже запрос
		if (!universitiesPending.value) {
			universityPageSize.value = last + 25;
		}
	}
};

// Логика выбора и фильтрации предметов

const subjectSearchName = ref<string>();
const subjectPageSize = ref<number>(25);
const debouncedSubjectSearchName = debouncedRef(subjectSearchName, 500);

const { data: subjects, pending: subjectsPending } = await apiService.subject.getSubjectList({
	lazy: true,
	query: {
		page_size: subjectPageSize,
		name: debouncedSubjectSearchName,
	},
});

// Если в форме есть новый предмет, который еще не прошел модерацию, то добавляем его в список опций
if (
	subjects.value &&
	summaryCreateForm.subject &&
	!subjects.value.result.find(subject => subject.id === summaryCreateForm.subject?.id)
) {
	subjects.value.result.push(summaryCreateForm.subject);
}

const onSubjectInput = (event: InputEvent) => {
	const target = event.target as HTMLInputElement;
	subjectSearchName.value = target.value;
};

// создание нового предмета
const isNewSubjectModalVisible = ref(false);
const newSubjectName = ref();
const createNewSubject = async () => {
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

// Логика выбора и фильтрации учителей
const teacherSearchName = ref<string>();
const teacherPageSize = ref<number>(25);
const debouncedTeacherSearchName = debouncedRef(teacherSearchName, 500);

const { data: teachers, pending: teachersPending } = await apiService.teacher.getTeacherList({
	lazy: true,
	query: {
		page_size: teacherPageSize,
		full_name: debouncedTeacherSearchName,
	},
});

if (
	teachers.value &&
	summaryCreateForm.teacher &&
	!teachers.value.result.find(teacher => teacher.id === summaryCreateForm.teacher?.id)
) {
	teachers.value.result.push(summaryCreateForm.teacher);
}

const onTeacherInput = (event: InputEvent) => {
	const target = event.target as HTMLInputElement;
	teacherSearchName.value = target.value;
};

const newТeacherName = ref();
const createTeacher = async () => {
	const { data } = await apiService.teacher.createTeacher(newТeacherName.value);

	if (data.value) {
		toast.add({
			severity: 'success',
			summary: 'Преподаватель успешно добавлен',
			life: 3000,
		});

		teachers.value?.result.push({
			id: data.value,
			full_name: newТeacherName.value,
			is_moderated: false,
		});

		summaryCreateForm.teacher = {
			id: data.value,
			full_name: newТeacherName.value,
			is_moderated: false,
		};

		isNewTeacherModalVisible.value = false;
	}
};

const submitSummary = async () => {
	await summaryCreateFormStore.createSummary();

	await router.push(`/summary/private/${summaryCreateFormStore.summaryResponseId}`);
	summaryCreateFormStore.summaryResponseId = undefined;
};

const submitButtonDisabled = computed(() => {
	return (
		!summaryCreateForm.name ||
		!summaryCreateForm.subject ||
		!summaryCreateForm.university ||
		!summaryCreateForm.teacher
	);
});

const goToLogin = () => {
	router.push('/auth/login');
};

const goToSearch = () => {
	router.push(`/`);
};

const isAuthDialogVisible = ref(!authStore.authinticated);
</script>
<template>
	<div v-if="!universitiesPending || !subjectsPending || !teachersPending">
		<Toast />
		<Dialog
			v-model:visible="isAuthDialogVisible"
			modal
			header="Ошибка авторизации"
			:closable="false"
			:style="{ width: '25rem' }"
		>
			<span class="p-text-secondary mb-5 block">Чтобы создать конспект необходимо войти в свой аккаунт</span>
			<div class="align-items-center mb-3 flex gap-3"></div>

			<div class="justify-content-end flex gap-2">
				<Button
					type="button"
					label="Закрыть"
					severity="secondary"
					@click="goToSearch()"
				></Button>
				<Button
					type="button"
					label="Войти"
					@click="goToLogin()"
				></Button>
			</div>
		</Dialog>
		<Card>
			<template #title>Создание конспекта</template>

			<template #content>
				<Stepper orientation="vertical">
					<StepperPanel header="Конспект">
						<div class="flex-column h-3rem flex">
							<InputText
								v-model="summaryCreateForm.name"
								type="text"
								placeholder="Введите название конспекта..."
								class="flex flex-auto border-1 border-slate-300 rounded-xl border-solid font-normal"
							/>
						</div>
					</StepperPanel>

					<StepperPanel header="ВУЗ">
						<div class="h-3rem flex flex-col">
							<UiDropdownFilter
								v-model="summaryCreateForm.university"
								:options="universities"
								:loading="universitiesPending"
								option-label="short_name"
								placeholder="Введите название вуза..."
								@input="onUniversityInput"
								@lazy-scroll-load="onUniversitiesLazyScrollLoad"
								@@update:input-value="universitySearchName = $event"
								@@update:model-value="summaryCreateForm.university = $event"
							>
								<template #customOption="{ option }">
									{{ option.short_name }} - {{ option.name }}
								</template>
							</UiDropdownFilter>
						</div>
					</StepperPanel>

					<StepperPanel header="Предмет">
						<div class="h-8rem flex flex-col sm:h-8rem">
							<UiDropdownFilter
								v-model="summaryCreateForm.subject"
								:options="subjects"
								:loading="subjectsPending"
								option-label="name"
								placeholder="Введите название предмета..."
								@input="onSubjectInput"
								@@update:input-value="subjectSearchName = $event"
								@@update:model-value="summaryCreateForm.subject = $event"
							/>
							<Button
								class="mb-4 ml-0 mt-3 h-3rem w-36 text-sm font-medium"
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
								<span class="p-text-secondary mb-5 block"
									>При добавлении нового предмета, ваш конспект будет отправлен на модерацию</span
								>
								<div class="align-items-center mb-3 flex gap-3">
									<label
										for="Предмет"
										class="mt-2 w-6rem font-semibold"
										>Предмет</label
									>
									<InputText
										id="Предмет"
										v-model="newSubjectName"
										class="flex-auto"
										autocomplete="off"
									/>
								</div>
								<div class="align-items-center mb-5 flex gap-3"></div>
								<div class="justify-content-end flex gap-2">
									<Button
										type="button"
										label="Отменить"
										severity="secondary"
										@click="isNewSubjectModalVisible = false"
									></Button>
									<Button
										type="button"
										label="Добавить"
										@click="createNewSubject"
									></Button>
								</div>
							</Dialog>
						</div>
					</StepperPanel>

					<StepperPanel header="Преподаватель">
						<div class="h-3rem flex flex-col sm:flex-row">
							<UiDropdownFilter
								v-model="summaryCreateForm.teacher"
								class="w-full"
								:options="teachers"
								:loading="teachersPending"
								option-label="full_name"
								placeholder="Введите имя преподавателя..."
								@input="onTeacherInput"
								@@update:input-value="teacherSearchName = $event"
								@@update:model-value="summaryCreateForm.teacher = $event"
							/>
						</div>
						<div class="flex justify-between py-4">
							<Button
								h-3rem
								w-37
								text-sm
								font-medium
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
								<span class="p-text-secondary mb-5 block"
									>При добавлении нового преподавателя, ваш конспект будет отправлен на
									модерацию</span
								>
								<div class="align-items-center mb-3 flex gap-3">
									<label
										for="Преподаватель"
										class="mt-2 w-8rem font-semibold"
										>Преподаватель</label
									>

									<div class="flex flex-col">
										<InputText
											id="Преподаватель"
											v-model="newТeacherName"
											class="mb-3 w-10/10 flex-auto"
											autocomplete="off"
										/>
									</div>
								</div>
								<div class="align-items-center mb-5 flex gap-3"></div>
								<div class="justify-content-end flex gap-2">
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
								:disabled="submitButtonDisabled && authStore.authinticated"
								h-3rem
								text-sm
								font-medium
								@click="submitSummary"
							>
								Сохранить
							</Button>
						</div>
					</StepperPanel>
				</Stepper>
			</template>
		</Card>
	</div>
</template>

<style>
span.p-stepper-title {
	font-size: 15px;
}
</style>
