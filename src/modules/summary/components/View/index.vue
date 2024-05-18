<script setup lang="ts">
import type { DropdownChangeEvent } from 'primevue/dropdown';
import type { ISummary } from '../../@types';
import type { IUser, IPaginatedResult } from '~/@types/@types';
import useApiService from '~/services/apiService';

import type { ISubject, ITeacher, IUniversity } from '~/modules/reestr/@types';

const debounceFetch = createDebounceFetch(250);

const route = useRoute();
const authStore = useAuthStore();

/**
 *  Переменная для определения того, какие конспекты показывать в таблице (приватные - свои или публичные)
 */
const isPrivateSummary = ref(route.path.includes('/summary/private'));

const apiService = useApiService();

const summary = ref<ISummary>();
const user = ref<IUser>();

const isNewSubjectModalVisible = ref(false);
const isNewTeacherModalVisible = ref(false);

const newSubjectName = ref('');

const newTeacher = ref({
	full_name: '',
	date_birth: '',
});

const getSummary = async () => {
	const { data } = isPrivateSummary.value
		? await apiService.summary.getPrivateSummaryById(String(route.params.id))
		: await apiService.summary.getPublicSummaryById(String(route.params.id));

	if (data.value) {
		summary.value = data.value;

		await getUser();
	}
};

const getUser = async () => {
	if (!summary.value) return;
	const { data } = await apiService.user.getUserById(summary.value?.user_id);

	if (data.value) {
		user.value = data.value;
	}
};

await getSummary();

const isSummaryCreateLectureFormVisible = ref(false);

const toast = useToast();

const isDisabled = ref(true);
const isEditing = ref(true);

const summaryEditFormStore = useSummaryCreateFormStore();
const { summaryEditForm } = summaryEditFormStore;

const isLoading = ref<boolean>(false);
const universities = ref<IPaginatedResult<IUniversity>>();
const subjects = ref<IPaginatedResult<ISubject>>();
const teachers = ref<IPaginatedResult<ITeacher>>();

// TODO: вынести логику фильтров в отдельную функцию, а то многа кода + переиспользуется в разных компонентах
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
			summaryEditForm.subject &&
			!subjects.value.result.find(subject => subject.id === summaryEditForm.subject?.id)
		) {
			subjects.value.result.push(summaryEditForm.subject);
		}
	}
	isLoading.value = pending.value;
};

const createSubject = async () => {
	const { data } = await apiService.subject.createSubject(newSubjectName.value);

	if (data.value) {
		toast.add({
			severity: 'success',
			summary: 'Предмет успешно добавлен',
			life: 3000,
		});

		subjects.value?.result.push({ id: data.value, name: newSubjectName.value });
		summaryEditForm.subject = { id: data.value, name: newSubjectName.value };

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
			summaryEditForm.teacher &&
			!teachers.value.result.find(teacher => teacher.id === summaryEditForm.teacher?.id)
		) {
			teachers.value.result.push(summaryEditForm.teacher);
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

		summaryEditForm.teacher = {
			id: data.value,
			full_name: newTeacher.value.full_name,
			date_birth: newTeacher.value.date_birth,
			is_moderated: false,
		};

		isNewTeacherModalVisible.value = false;
	}
};

await Promise.all([getUniversities(), getSubjects(), getTeachers()]);

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

// TODO: Убрать из хранилища хранение этой формы, нет смысла
const initEditForm = () => {
	summaryEditForm.id = summary.value.id;
	summaryEditForm.title = summary.value.title;
	summaryEditForm.summary = summary.value.summary;
	summaryEditForm.university = summary.value.university;
	summaryEditForm.subject = summary.value.subject;
};

initEditForm();

const submitSummary = async () => {
	await summaryEditFormStore.editSummary();

	if (submitSummary) {
		toast.add({
			severity: 'success',
			summary: 'Конспект успешно изменнен',
			life: 3000,
		});
		await getSummary();
	} else {
		toast.add({
			severity: 'error',
			summary: 'Не удалось обновить конспект',
			life: 3500,
		});
	}
};
</script>

<template>
	<div>
		<Toast />

		<!-- Отображение информации конспекта -->
		<!-- TODO: перенести в отдельный компонент, вынести логику  -->
		<div v-if="isEditing">
			<div class="flex justify-center items-center gap-4 mb-10">
				<i class="pi pi-bookmark pt-2 text-3xl" />
				<h1 class="text-3xl text-indigo-500 font-semibold p-0 m-0">
					{{ summary?.name }}
				</h1>
			</div>
			<div>
				<div class="flex flex-col sm:flex-row">
					<div class="text-base font-bold leading-7 text-gray-900 text-center pl-0 sm-pl-3">Автор:</div>

					<div class="text-lg pl-0 sm-pl-5 flex justify-center">
						<div class="flex mt-1 sm-mt--2">
							<img
								v-if="user?.image_url"
								class="w-10 rounded-full text-center"
								:src="user.image_url"
							/>
							<p class="pt-2 ml-3">{{ user?.nickname }}</p>
						</div>
					</div>
				</div>

				<div class="flex flex-col sm:flex-row mt-3 pl-0 sm-pl-3">
					<div class="text-base font-bold leading-7 text-gray-900 text-center">Вуз:</div>
					<div class="text-md leading-7 text-gray-600 pl-0 sm-pl-5 text-center">
						{{ summary?.university?.name }}
					</div>
				</div>

				<div class="flex flex-col sm:flex-row mt-3 pl-0 sm-pl-3">
					<div class="text-base font-bold leading-7 text-gray-900 text-center">Предмет:</div>
					<div class="text-md leading-7 text-gray-600 pl-0 sm-pl-5 text-center">
						{{ summary?.subject?.name }}
					</div>
				</div>

				<div class="flex flex-col sm:flex-row mt-3 pl-0 sm-pl-3">
					<div class="flex flex-1 flex-col sm:flex-row">
						<div class="text-base font-bold leading-7 text-gray-900 text-center">Преподаватель:</div>
						<div class="text-md leading-7 text-gray-600 pl-5 text-center">
							{{ summary?.teacher?.full_name }}
						</div>
					</div>
					<Button
						v-if="isPrivateSummary && !isDisabled"
						class="mt-5 sm-mt-0 m-auto translate-x--0 sm-translate-x--5"
						@click="submitSummary"
						>Сохранить изменения</Button
					>

					<Button
						v-if="isPrivateSummary"
						class="bg-green border-green mt-5 sm-mt-0 m-auto sm-mr-10"
						@click="isSummaryCreateLectureFormVisible = !isSummaryCreateLectureFormVisible"
						>{{ isSummaryCreateLectureFormVisible ? 'Отменить добавление' : 'Добавить лекцию' }}</Button
					>
					<Button
						v-if="isPrivateSummary"
						class="mt-5 sm-mt-0 m-auto translate-x--0 sm-translate-x--5"
						@click="
							isDisabled = !isDisabled;
							isEditing = !isEditing;
						"
						>Редактировать конспект</Button
					>
					<Button
						v-else-if="!isPrivateSummary && authStore.user?.id === summary?.user_id"
						class="bg-green border-green mt-5 sm-mt-0 m-auto"
						@click="useRouter().push({ path: `/summary/private/${summary?.id}` })"
						>Редактировать</Button
					>
				</div>
			</div>
		</div>
		<!-- Отображение редактирования информации конспекта -->
		<div v-else>
			<div class="flex justify-center items-center gap-4 mb-10">
				<Toast />
				<i class="pi pi-bookmark text-3xl" />
				<InputText
					v-model="summaryEditForm.name"
					class="text-3xl text-indigo-500 font-semibold bg-white shadow-none text-center w-full sm-w-4/10"
					:class="[isDisabled ? 'border-white' : 'border-blue']"
					:disabled="isDisabled"
				>
				</InputText>
			</div>
			<div>
				<div class="flex flex-col sm:flex-row">
					<div class="text-base font-bold leading-7 text-gray-900 text-center pl-0 sm-pl-3">Автор:</div>

					<div class="text-lg pl-0 sm-pl-5 flex justify-center">
						<div class="flex mt-1 sm-mt--2">
							<img
								v-if="user?.image_url"
								class="w-10 rounded-full text-center"
								:src="user.image_url"
							/>
							<p class="pt-2 ml-3">{{ user?.nickname }}</p>
						</div>
					</div>
				</div>

				<div class="flex flex-col sm:flex-row mt-3 pl-0 sm-pl-3">
					<div class="text-base font-bold leading-7 text-gray-900 text-center">Вуз:</div>
					<Dropdown
						v-model="summaryEditForm.university"
						option-label="name"
						:loading="isLoading"
						:options="universities?.result"
						editable
						:show-clear="!isDisabled"
						class="text-md leading-7 text-gray-600 pl-5 shadow-none bg-white ml-0 sm-ml-5"
						:class="[isDisabled ? 'border-white' : 'border-blue']"
						:disabled="isDisabled"
						required
						@change="onUniversityChange($event)"
					>
					</Dropdown>
				</div>

				<div class="flex flex-col sm:flex-row mt-3 pl-0 sm-pl-3">
					<div class="text-base font-bold leading-7 text-gray-900 text-center">Предмет:</div>
					<div class="flex">
						<Dropdown
							v-model="summaryEditForm.subject"
							:options="subjects?.result"
							option-label="name"
							:loading="isLoading"
							editable
							:show-clear="!isDisabled"
							class="text-md leading-7 text-gray-600 pl-5 bg-white shadow-none ml-0 sm-ml-5 w-full"
							:class="[isDisabled ? 'border-white' : 'border-blue']"
							:disabled="isDisabled"
							@change="onSubjectChange($event)"
						>
						</Dropdown>
						<Button
							ml-2
							text-sm
							font-medium
							@click="isNewSubjectModalVisible = true"
						>
							+
						</Button>
					</div>
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

				<div class="flex flex-col sm:flex-row mt-3 pl-0 sm-pl-3">
					<div class="flex flex-1 flex-col sm:flex-row">
						<div class="text-base font-bold leading-7 text-gray-900 text-center">Преподаватель:</div>
						<div class="flex">
							<Dropdown
								v-model="summaryEditForm.teacher"
								:loading="isLoading"
								:options="teachers?.result"
								option-label="full_name"
								editable
								:show-clear="!isDisabled"
								class="text-md leading-7 text-gray-600 pl-5 bg-white shadow-none ml-0 sm-ml-5 w-full"
								:class="[isDisabled ? 'border-white' : 'border-blue']"
								:disabled="isDisabled"
								@change="onTeacherChange($event)"
							>
							</Dropdown>
							<Button
								ml-2
								text-sm
								font-medium
								@click="isNewTeacherModalVisible = true"
							>
								+
							</Button>
						</div>
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
					</div>
					<Button
						v-if="isPrivateSummary && !isDisabled"
						class="mt-5 sm-mt-0 m-auto sm-mr-4 sm-ml-5"
						@click="submitSummary"
						>Сохранить</Button
					>

					<Button
						v-else-if="!isPrivateSummary && authStore.user?.id === summary?.user_id"
						class="bg-green border-green mt-5 sm-mt-0 m-auto"
						@click="useRouter().push({ path: `/summary/private/${summary?.id}` })"
						>Редактировать</Button
					>
					<Button
						v-if="isPrivateSummary"
						class="bg-gray border-gray mt-5 sm-mt-0 m-auto"
						@click="
							isDisabled = !isDisabled;
							isEditing = !isEditing;
						"
						>Отменить</Button
					>
				</div>
			</div>
		</div>

		<!-- Форма добавления лекции -->
		<Card
			v-if="isSummaryCreateLectureFormVisible"
			class="mt-8 border border-indigo-500 border-solid"
		>
			<template #header>
				<div class="text-xl text-indigo-500 font-semibold pl-6 pt-4">Добавление лекции</div>
			</template>
			<template #content>
				<SummaryCreateLectureForm
					v-if="isSummaryCreateLectureFormVisible && isPrivateSummary && summary"
					:summary-id="summary.id"
					@@update-summary="getSummary"
				/>
			</template>
		</Card>

		<!--  Аккардеон с лекциями -->
		<Card
			v-if="summary?.lectures && summary.lectures.length > 0"
			class="mt-8"
		>
			<template #header>
				<div class="text-xl text-indigo-500 font-semibold pl-6 pt-4">Лекции</div>
			</template>
			<template #content>
				<SummaryViewLecture
					:lectures="summary.lectures"
					:is-private-summary="isPrivateSummary"
					@@update-summary="getSummary"
				/>
			</template>
		</Card>

		<div
			v-else
			class="mt-15 mb-10 text-2xl text-center text-indigo-600 font-semibold"
		>
			<p>Лекций пока нет, но вы можете их добавить</p>
		</div>
	</div>
</template>

<style scoped>
.p-accordion-header:hover {
	transform: none !important;
}
</style>
