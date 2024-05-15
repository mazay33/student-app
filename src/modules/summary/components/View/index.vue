<script setup lang="ts">
import { ref } from 'vue';
import type { DropdownChangeEvent } from 'primevue/dropdown';
import type { ISummary } from '../../@types';
import type { IUser, IPaginatedResult } from '~/@types/@types';
import useApiService from '~/services/apiService';

import type { ISubject, ITeacher, IUniversity } from '~/modules/reestr/@types';

const deleteDialog = ref(false);
const editDialog = ref(false);

type FetchFunction<T = unknown> = (...args: unknown[]) => Promise<T>;

const isNewSubjectModalVisible = ref(false);
const isNewTeacherModalVisible = ref(false);

const newSubjectName = ref('');

const newTeacher = ref({
	full_name: '',
	date_birth: '',
});

const { copy, copied } = useClipboard();

const route = useRoute();
const authStore = useAuthStore();

/**
 *  Переменная для определения того, какие конспекты показывать в таблице (приватные - свои или публичные)
 */
const isPrivateSummary = ref(route.path.includes('/summary/private'));

const apiService = useApiService();

const summary = ref<ISummary>();
const user = ref<IUser>();

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

// TODO: стоит перенести в общии функции composables, youtubeRegex в общие константы
// может использоваться во всех компонентах
const getYoutubeId = (url: string) => {
	if (!url) return '';
	const youtubeRegex =
		// eslint-disable-next-line
		/(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
	const match = url.match(youtubeRegex);
	return match ? match[1] : '';
};

const idDelete = ref('');

const deleteForever = async () => {
	const { data } = await apiService.lecture.deleteLection(idDelete.value);

	if (data.value) {
		await getSummary();
		toast.add({
			severity: 'success',
			summary: 'Лекция удалена',
			life: 3000,
		});
	}

	deleteDialog.value = false;
};

const toast = useToast();

const lectureEditForm = ref({
	name: '',
	description: '',
	pdf_file_url: '',
	video_url: '',
	date: '',
	id: '',
});

const editLecture = async () => {
	lectureEditForm.value.date = useDateFormat(lectureEditForm.value.date, 'YYYY-MM-DD').value;

	const { data } = await apiService.lecture.editLecture(lectureEditForm.value);

	if (data.value) {
		toast.add({
			severity: 'success',
			summary: 'Лекция успешно измененна',
			life: 3000,
		});
		await getSummary();
		editDialog.value = false;
	}
};

const openFileDialog = () => {
	const input = document.createElement('input');
	input.type = 'file';
	input.accept = 'application/pdf';
	input.multiple = false;
	input.style.display = 'none';
	input.addEventListener('change', event => {
		const target = event.target as HTMLInputElement;
		if (!target.files) {
			return;
		}

		uploadPdf(event);
	});
	document.body.appendChild(input);
	input.click();
	document.body.removeChild(input);
};
const lectionName = ref('');

const uploadPdf = async (event: Event) => {
	const formData = new FormData();
	const target = event.target as HTMLInputElement;

	if (!event.target || !target.files) {
		return;
	}
	formData.append('file', target.files[0]);

	const { data } = await apiService.lecture.uploadPdfFile(formData);

	if (data.value) {
		lectureEditForm.value.pdf_file_url = data.value.file_url;
		lectionName.value = data.value.file_url;
	}
};

//

const isDisabled = ref(true);
const isEditing = ref(true);

const summaryEditFormStore = useSummaryCreateFormStore();
const { summaryEditForm } = summaryEditFormStore;

const isLoading = ref<boolean>(false);
const universities = ref<IPaginatedResult<IUniversity>>();
const subjects = ref<IPaginatedResult<ISubject>>();
const teachers = ref<IPaginatedResult<ITeacher>>();

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

summaryEditForm.id = summary.value?.id;
summaryEditForm.name = summary.value?.name;
summaryEditForm.subject = summary.value?.subject;
summaryEditForm.teacher = summary.value?.teacher;
summaryEditForm.university = summary.value?.university;

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
	<div v-if="!isEditing">
		<div class="flex justify-center">
			<Toast />
			<i
				class="pi pi-bookmark mt-13"
				style="font-size: 1.8rem"
			/>
			<InputText
				v-model="summaryEditForm.name"
				class="text-3xl text-indigo-500 font-semibold mb-5 mt-10 bg-white shadow-none text-center w-full sm-w-4/10"
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
				<Dropdown
					v-model="summaryEditForm.subject"
					:options="subjects?.result"
					option-label="name"
					:loading="isLoading"
					editable
					:show-clear="!isDisabled"
					class="text-md leading-7 text-gray-600 pl-5 bg-white shadow-none ml-0 sm-ml-5"
					:class="[isDisabled ? 'border-white' : 'border-blue']"
					:disabled="isDisabled"
					@change="onSubjectChange($event)"
				>
				</Dropdown>
				<Button
					w-11
					m-auto
					mt-2
					sm-ml-2
					sm-mt-0
					text-sm
					font-medium
					@click="isNewSubjectModalVisible = true"
				>
					+
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

			<div class="flex flex-col sm:flex-row mt-3 pl-0 sm-pl-3">
				<div class="flex flex-1 flex-col sm:flex-row">
					<div class="text-base font-bold leading-7 text-gray-900 text-center">Преподаватель:</div>
					<Dropdown
						v-model="summaryEditForm.teacher"
						:loading="isLoading"
						:options="teachers?.result"
						option-label="full_name"
						editable
						:show-clear="!isDisabled"
						class="text-md leading-7 text-gray-600 pl-5 bg-white shadow-none ml-0 sm-ml-5"
						:class="[isDisabled ? 'border-white' : 'border-blue']"
						:disabled="isDisabled"
						@change="onTeacherChange($event)"
					>
					</Dropdown>
					<Button
						w-11
						m-auto
						mt-2
						sm-ml-2
						sm-mt-0
						text-sm
						font-medium
						@click="isNewTeacherModalVisible = true"
					>
						+
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

		<SummaryCreateLectureForm
			v-if="isSummaryCreateLectureFormVisible && isPrivateSummary && summary"
			:summary-id="summary.id"
			@@update-summary="getSummary"
		/>

		<div
			v-if="summary?.lectures && summary.lectures.length > 0"
			class="card"
			mt-5
		>
			<!-- TODO: перенести в отдельный компонент Accordion с леккциями -->
			<accordion
				expand-icon="pi pi-plus"
				collapse-icon="pi pi-minus"
			>
				<accordion-tab
					v-for="(lecture, i) in summary.lectures"
					:key="i"
				>
					<template #header>
						<span class="flex align-items-center gap-2 w-full">
							<span class="font-bold white-space-nowrap text-lg text-sm sm-text-base">{{
								lecture.name
							}}</span>
						</span>
					</template>

					<div>
						<p class="font-bold white-space-nowrap text-base mr-3 sm-mr-10">
							{{ lecture.date }}
						</p>
						<div class="italic font-normal text-lg mb-4 w-full md:w-5/10">"{{ lecture.description }}"</div>
						<div
							flex
							flex-col
						>
							<div class="flex">
								<nuxt-link
									target="_blank"
									:to="lecture.pdf_file_url"
								>
									<Button class="w-full sm:w-46 mr-5">Лекция для чтения</Button>
								</nuxt-link>
								<Button
									v-tooltip="{
										value: copied ? 'Скопировано!' : 'Скопировать ссылку',
										autoHide: false,
									}"
									class="bg-green border-green sm-ml-0 ml-5"
									@click="copy(lecture.pdf_file_url)"
								>
									<i class="pi pi-share-alt pr-1 sm-pr-0"></i>
								</Button>
							</div>

							<div class="mt-5">
								<iframe
									class="w-full lg-w-6/10 h-70 md-h-100 lg-h-130 rounded-md"
									:src="'https://www.youtube.com/embed/' + getYoutubeId(lecture.video_url)"
									frameborder="0"
									allowfullscreen
								/>
							</div>
						</div>
					</div>
					<Button
						v-if="isPrivateSummary"
						class="mt-5 sm-mt-4"
						severity="danger"
						@click="
							deleteDialog = true;
							idDelete = lecture.id;
						"
						>Удалить лекцию</Button
					>
					<Button
						v-if="isPrivateSummary"
						class="mt-5 sm-mt-4 ml-0 sm-ml-5"
						severity="info"
						@click="
							editDialog = true;
							lectureEditForm.name = lecture.name;
							lectureEditForm.description = lecture.description;
							lectureEditForm.pdf_file_url = lecture.pdf_file_url;
							lectureEditForm.video_url = lecture.video_url;
							lectureEditForm.date = lecture.date;
							lectureEditForm.id = lecture.id;
						"
						>Редактировать лекцию</Button
					>
				</accordion-tab>
			</accordion>
		</div>

		<div
			v-else
			class="mt-15 mb-10 text-2xl text-center text-indigo-600 font-semibold"
		>
			<p>конспектов пока нет, но вы можете их добавить</p>
		</div>
	</div>

	<!--  -->

	<!--  -->

	<!--  -->

	<!--  -->

	<div v-if="isEditing">
		<Toast />
		<div class="flex justify-center">
			<i
				class="pi pi-bookmark mt-13 mr-2"
				style="font-size: 1.8rem"
			/>
			<h1 class="text-3xl text-indigo-500 font-semibold mb-10 pt-5">
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
					>Добавить лекцию</Button
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

		<SummaryCreateLectureForm
			v-if="isSummaryCreateLectureFormVisible && isPrivateSummary && summary"
			:summary-id="summary.id"
			@@update-summary="getSummary"
		/>

		<div
			v-if="summary?.lectures && summary.lectures.length > 0"
			class="card"
			mt-5
		>
			<!-- TODO: перенести в отдельный компонент Accordion с леккциями -->
			<accordion
				expand-icon="pi pi-plus"
				collapse-icon="pi pi-minus"
			>
				<accordion-tab
					v-for="(lecture, i) in summary.lectures"
					:key="i"
				>
					<template #header>
						<span class="flex align-items-center gap-2 w-full">
							<span class="font-bold white-space-nowrap text-lg text-sm sm-text-base">{{
								lecture.name
							}}</span>
						</span>
					</template>

					<div>
						<p class="font-bold white-space-nowrap text-base mr-3 sm-mr-10">
							{{ lecture.date }}
						</p>
						<div class="italic font-normal text-lg mb-4 w-full md:w-5/10">"{{ lecture.description }}"</div>
						<div
							flex
							flex-col
						>
							<div class="flex">
								<nuxt-link
									target="_blank"
									:to="lecture.pdf_file_url"
								>
									<Button class="w-full sm:w-46 mr-5">Лекция для чтения</Button>
								</nuxt-link>
								<Button
									v-tooltip="{
										value: copied ? 'Скопировано!' : 'Скопировать ссылку',
										autoHide: false,
									}"
									class="bg-green border-green sm-ml-0 ml-5"
									@click="copy(lecture.pdf_file_url)"
								>
									<i class="pi pi-share-alt pr-1 sm-pr-0"></i>
								</Button>
							</div>

							<div class="mt-5">
								<iframe
									class="w-full lg-w-6/10 h-70 md-h-100 lg-h-130 rounded-md"
									:src="'https://www.youtube.com/embed/' + getYoutubeId(lecture.video_url)"
									frameborder="0"
									allowfullscreen
								/>
							</div>
						</div>
					</div>
					<Button
						v-if="isPrivateSummary"
						class="mt-5 sm-mt-4"
						severity="danger"
						@click="
							deleteDialog = true;
							idDelete = lecture.id;
						"
						>Удалить лекцию</Button
					>
					<Button
						v-if="isPrivateSummary"
						class="mt-5 sm-mt-4 ml-0 sm-ml-5"
						severity="info"
						@click="
							editDialog = true;
							lectureEditForm.name = lecture.name;
							lectureEditForm.description = lecture.description;
							lectureEditForm.pdf_file_url = lecture.pdf_file_url;
							lectureEditForm.video_url = lecture.video_url;
							lectureEditForm.date = lecture.date;
							lectureEditForm.id = lecture.id;
						"
						>Редактировать лекцию</Button
					>
				</accordion-tab>
			</accordion>
		</div>

		<div
			v-else
			class="mt-15 mb-10 text-2xl text-center text-indigo-600 font-semibold"
		>
			<p>конспектов пока нет, но вы можете их добавить</p>
		</div>
	</div>
	<Dialog
		v-model:visible="deleteDialog"
		modal
		header="Удаление лекции"
		:style="{ width: '25rem' }"
	>
		<span class="p-text-secondary block mb-5"
			>Восстановление лекции после удаления невозможно. Пожалуйста подтвердите данное действие</span
		>

		<div class="flex justify-content-end gap-2">
			<Button
				type="button"
				label="Отменить"
				severity="secondary"
				@click="deleteDialog = false"
			></Button>
			<Button
				type="button"
				class="ml-21"
				severity="danger"
				label="Подтвердить"
				@click="deleteForever"
			></Button></div
	></Dialog>

	<Dialog
		v-model:visible="editDialog"
		modal
		header="Редактирование лекции"
		:style="{ width: '33rem' }"
	>
		<span class="p-text-secondary block mb-5">Обновите информацию о вашей лекции</span>
		<div class="flex align-items-center gap-3 mb-3">
			<label class="font-semibold w-6rem">Название лекции</label>
			<InputText
				v-model="lectureEditForm.name"
				class="flex-auto"
			></InputText>
		</div>
		<div class="flex align-items-center gap-3 mb-3">
			<label class="font-semibold w-6rem">Описание</label>
			<InputText
				v-model="lectureEditForm.description"
				class="flex-auto"
			/>
		</div>
		<div class="flex align-items-center gap-3 mb-3">
			<label class="font-semibold w-6rem">Дата лекции</label>
			<Calendar
				v-model="lectureEditForm.date"
				date-format="yy-mm-dd"
				class="flex-auto"
			/>
		</div>
		<div class="flex align-items-center gap-3 mb-3">
			<label class="font-semibold w-6rem">youtube ссылка</label>
			<InputText
				v-model="lectureEditForm.video_url"
				class="flex-auto"
			/>
		</div>
		<div class="flex align-items-center gap-3 mb-3">
			<label class="font-semibold w-6rem">PDF файл</label>
			<div class="flex flex-col">
				<div class="flex">
					<Button
						class="mr-4"
						@click="openFileDialog"
						>Изменить</Button
					>
					<InputText
						v-model="lectureEditForm.pdf_file_url"
						class="flex-auto"
					></InputText>
				</div>
			</div>
		</div>

		<div class="flex justify-content-end gap-2">
			<Button
				type="button"
				label="Отменить"
				severity="secondary"
				@click="editDialog = false"
			></Button>
			<Button
				type="button"
				label="Сохранить"
				@click="editLecture"
			></Button></div
	></Dialog>
</template>

<style scoped>
.p-accordion-header:hover {
	transform: none !important;
}
</style>
