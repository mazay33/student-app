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
const getUniversities = async (queryUrl = '') => {
	isLoading.value = true;
	const { data, pending } = await apiService.university.getUniversityList(queryUrl);
	if (data.value) {
		universities.value = data.value;
	}

	isLoading.value = pending.value;
};

const getSubjects = async (queryUrl = '') => {
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

const getTeachers = async (queryUrl = '') => {
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
			is_moderated: false,
		});

		summaryEditForm.teacher = {
			id: data.value,
			full_name: newTeacher.value.full_name,
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
	summaryEditForm.name = summary.value?.name;
	summaryEditForm.teacher = summary.value?.teacher;
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
		isDisabled.value = !isDisabled.value;
		isEditing.value = !isEditing.value;
		await getSummary();
	} else {
		toast.add({
			severity: 'error',
			summary: 'Не удалось обновить конспект',
			life: 3500,
		});
	}
};

const confirm = useConfirm();

const showComment = event => {
	confirm.require({
		target: event.currentTarget,
		group: 'headless',
	});
};
</script>

<template>
	<div>
		<Toast />

		<!-- Отображение информации конспекта -->
		<!-- TODO: перенести в отдельный компонент, вынести логику  -->

		<div v-if="isEditing">
			<div class="mb-10 flex items-center justify-center gap-4">
				<i class="pi pi-bookmark pt-2 text-3xl" />
				<h1 class="m-0 p-0 text-3xl text-indigo-500 font-semibold">
					{{ summary?.name }}
				</h1>
			</div>
			<div>
				<div class="flex flex-col sm:flex-row">
					<div class="pl-0 text-center text-base text-gray-900 font-bold leading-7 sm-pl-3">Автор:</div>

					<div class="flex justify-center pl-0 text-lg sm-pl-5">
						<div class="mt-1 flex sm-mt--2">
							<img
								v-if="user?.image_url"
								class="w-10 rounded-full text-center"
								:src="user.image_url"
							/>
							<p class="ml-3 pt-2">{{ user?.nickname }}</p>
						</div>
					</div>
				</div>

				<div class="mt-3 flex flex-col pl-0 sm:flex-row sm-pl-3">
					<div class="text-center text-base text-gray-900 font-bold leading-7">Вуз:</div>
					<div class="text-md pl-0 text-center text-gray-600 leading-7 sm-pl-5">
						{{ summary?.university?.name }}
					</div>
				</div>

				<div class="mt-3 flex flex-col pl-0 sm:flex-row sm-pl-3">
					<div class="text-center text-base text-gray-900 font-bold leading-7">Предмет:</div>
					<div class="text-md pl-0 text-center text-gray-600 leading-7 sm-pl-5">
						{{ summary?.subject?.name }}
					</div>
				</div>

				<div class="mt-3 flex flex-col pl-0 sm:flex-row sm-pl-3">
					<div class="text-center text-base text-gray-900 font-bold leading-7">Преподаватель:</div>
					<div class="text-md pl-0 text-center text-gray-600 leading-7 sm-pl-5">
						{{ summary?.teacher?.full_name }}
					</div>
				</div>

				<div class="mt-3 flex flex-col pl-0 sm:flex-row sm-pl-3">
					<div
						v-if="isPrivateSummary"
						class="flex flex-1 flex-col sm:flex-row"
					>
						<div class="mb-1 text-center text-base text-gray-900 font-bold leading-7 sm-mt-1">
							Комментарии:
						</div>
						<div class="m-auto sm-ml-2">
							<Button
								severity="info"
								@click="showComment($event)"
								class="pi pi-angle-down w-12"
							></Button>
							<ConfirmPopup group="headless">
								<template #container="{ rejectCallback }">
									<div class="border-round p-3">
										<div class="flex">
											<p class="font-bold">Статус конспекта:</p>
											<p
												class="ml-2"
												v-if="summary?.status === 'approved'"
												style="color: green"
											>
												Одобрен
											</p>
											<p
												class="ml-2"
												v-if="summary?.status === 'rejected'"
												style="color: red"
											>
												Отклонен
											</p>
											<p
												class="ml-2"
												v-if="summary?.status === 'on_moderation'"
												style="color: orange"
											>
												На модерации
											</p>
										</div>

										<span class="font-bold">Комментарий администратора:</span>
										<p class="mt-2">{{ summary?.moderation_comment }}</p>

										<div class="align-items-center mt--1 flex gap-2">
											<Button
												label="Закрыть"
												outlined
												severity="secondary"
												size="small"
												text
												@click="rejectCallback"
											></Button>
										</div>
									</div>
								</template>
							</ConfirmPopup>
						</div>
					</div>

					<Button
						v-if="isPrivateSummary"
						class="m-auto mt-5 h-9 border-green bg-green sm-mr-10 sm-mt-0"
						@click="isSummaryCreateLectureFormVisible = !isSummaryCreateLectureFormVisible"
						>{{ isSummaryCreateLectureFormVisible ? 'Отменить добавление' : 'Добавить лекцию' }}</Button
					>
					<Button
						v-if="isPrivateSummary"
						class="m-auto mt-5 h-9 translate-x--0 sm-mt-0 sm-translate-x--5"
						@click="
							isDisabled = !isDisabled;
							isEditing = !isEditing;
						"
						>Редактировать конспект</Button
					>
					<Button
						v-else-if="!isPrivateSummary && authStore.user?.id === summary?.user_id"
						class="m-auto border-green bg-green sm-ml-0"
						@click="useRouter().push({ path: `/summary/private/${summary?.id}` })"
						>Редактировать</Button
					>
				</div>
			</div>
		</div>
		<!-- Отображение редактирования информации конспекта -->
		<div v-else>
			<div class="mb-10 flex items-center justify-center gap-4">
				<Toast />
				<i class="pi pi-bookmark text-3xl" />
				<InputText
					v-model="summaryEditForm.name"
					class="w-full bg-white text-center text-3xl text-indigo-500 font-semibold shadow-none sm-w-4/10"
					:class="[isDisabled ? 'border-white' : 'border-blue']"
					:disabled="isDisabled"
				>
				</InputText>
			</div>
			<div>
				<div class="flex flex-col sm:flex-row">
					<div class="pl-0 text-center text-base text-gray-900 font-bold leading-7 sm-pl-3">Автор:</div>

					<div class="flex justify-center pl-0 text-lg sm-pl-5">
						<div class="mt-1 flex sm-mt--2">
							<img
								v-if="user?.image_url"
								class="w-10 rounded-full text-center"
								:src="user.image_url"
							/>
							<p class="ml-3 pt-2">{{ user?.nickname }}</p>
						</div>
					</div>
				</div>

				<div class="mt-3 flex flex-col pl-0 sm:flex-row sm-pl-3">
					<div class="text-center text-base text-gray-900 font-bold leading-7">Вуз:</div>
					<Dropdown
						v-model="summaryEditForm.university"
						option-label="name"
						:loading="isLoading"
						:options="universities?.result"
						editable
						:show-clear="!isDisabled"
						class="text-md ml-0 bg-white pl-5 text-gray-600 leading-7 shadow-none sm-ml-5"
						:class="[isDisabled ? 'border-white' : 'border-blue']"
						:disabled="isDisabled"
						required
						@change="onUniversityChange($event)"
					>
					</Dropdown>
				</div>

				<div class="mt-3 flex flex-col pl-0 sm:flex-row sm-pl-3">
					<div class="text-center text-base text-gray-900 font-bold leading-7">Предмет:</div>
					<div class="flex">
						<Dropdown
							v-model="summaryEditForm.subject"
							:options="subjects?.result"
							option-label="name"
							:loading="isLoading"
							editable
							:show-clear="!isDisabled"
							class="text-md ml-0 w-full bg-white pl-5 text-gray-600 leading-7 shadow-none sm-ml-5"
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
								@click="createSubject"
							></Button>
						</div>
					</Dialog>
				</div>

				<div class="mt-3 flex flex-col pl-0 sm:flex-row sm-pl-3">
					<div class="flex flex-1 flex-col sm:flex-row">
						<div class="text-center text-base text-gray-900 font-bold leading-7">Преподаватель:</div>
						<div class="flex">
							<Dropdown
								v-model="summaryEditForm.teacher"
								:loading="isLoading"
								:options="teachers?.result"
								option-label="full_name"
								editable
								:show-clear="!isDisabled"
								class="text-md ml-0 w-full bg-white pl-5 text-gray-600 leading-7 shadow-none sm-ml-5"
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
							<span class="p-text-secondary mb-5 block"
								>При добавлении нового преподавателя, ваш конспект будет отправлен на модерацию</span
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
										v-model="newTeacher.full_name"
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
					</div>
					<Button
						v-if="isPrivateSummary && !isDisabled"
						class="m-auto mt-5 sm-ml-5 sm-mr-4 sm-mt-0"
						@click="submitSummary"
						>Сохранить</Button
					>

					<Button
						v-else-if="!isPrivateSummary && authStore.user?.id === summary?.user_id"
						class="m-auto mt-5 border-green bg-green sm-mt-0"
						@click="useRouter().push({ path: `/summary/private/${summary?.id}` })"
						>Редактировать</Button
					>
					<Button
						v-if="isPrivateSummary"
						class="m-auto mt-5 border-gray bg-gray sm-mt-0"
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
				<div class="pl-6 pt-4 text-xl text-indigo-500 font-semibold">Добавление лекции</div>
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
				<div class="pl-6 pt-4 text-xl text-indigo-500 font-semibold">Лекции</div>
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
			class="mb-10 mt-15 text-center text-2xl text-indigo-600 font-semibold"
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
