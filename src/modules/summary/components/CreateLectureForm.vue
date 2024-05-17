<script setup lang="ts">
import type { ICreateLectureForm } from '../@types';
import useApiService from '~/services/apiService';

const props = defineProps<{ summaryId: string }>();
const emit = defineEmits(['@updateSummary']);

const toast = useToast();

const apiService = useApiService();

const isLoading = ref<boolean>(false);

const lectureCreateForm = ref<ICreateLectureForm>({
	name: '',
	date: '',
	video_url: '',
	pdf_file_url: '',
	summary_id: props.summaryId,
	description: '',
});

const createLecture = async () => {
	isLoading.value = true;
	lectureCreateForm.value.date = useDateFormat(lectureCreateForm.value.date, 'YYYY-MM-DD').value;

	const { data, pending } = await apiService.lecture.createLecture(lectureCreateForm.value);

	if (data.value) {
		clearLectureCreateForm();
		toast.add({
			severity: 'success',
			summary: 'Лекция успешно добавлена',
			life: 3000,
		});
		emit('@updateSummary');
	}
	isLoading.value = pending.value;
};

const isCreateLectrueButtonDisabled = computed(() => {
	return !lectureCreateForm.value.name || !lectureCreateForm.value.date || !lectureCreateForm.value.summary_id;
});

const openFileDialog = () => {
	const input = document.createElement('input');
	input.type = 'file';
	input.accept = 'application/pdf'; // тип файла
	input.multiple = false; // только 1
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
		lectureCreateForm.value.pdf_file_url = data.value.file_url;
		lectionName.value = data.value.name;
	}
};

const clearLectureCreateForm = () => {
	lectureCreateForm.value = {
		name: '',
		date: '',
		video_url: '',
		pdf_file_url: '',
		summary_id: props.summaryId,
		description: '',
	};
};
</script>

<template>
	<Toast />
	<form>
		<div>
			<div>
				<p class="text-sm leading-6 text-gray-600">Пожалуйста заполните данные о вашей лекции ниже</p>
				<p class="mt--3 text-sm text-gray-600">
					Помните что другие пользователи также смогут увидеть данную лекцию
				</p>

				<div>
					<div class="mt-5 grid grid-cols-1 gap-x-6 gap-y-3 sm:grid-cols-6">
						<div class="sm:col-span-3">
							<label class="block text-sm font-medium leading-6 text-gray-900">Название лекции</label>
							<div>
								<InputText
									v-model="lectureCreateForm.name"
									type="text"
									class="w-full"
								/>
							</div>
						</div>

						<div class="sm:col-span-3">
							<label class="block text-sm font-medium leading-6 text-gray-900">Описание</label>
							<div>
								<InputText
									v-model="lectureCreateForm.description"
									type="text"
									class="w-full"
								/>
							</div>
						</div>
					</div>
				</div>

				<div class="grid grid-cols-1 gap-x-6 gap-y-3 sm:grid-cols-6">
					<div class="sm:col-span-3">
						<label class="block text-sm font-medium leading-8 text-gray-900">Дата проведения лекции</label>
						<Calendar
							v-model="lectureCreateForm.date"
							show-icon
							class="w-full"
							date-format="yy-mm-dd"
						/>
					</div>
					<div class="sm:col-span-3">
						<label class="block text-sm font-medium leading-8 text-gray-900">Ссылка на youtube видео</label>
						<InputText
							v-model="lectureCreateForm.video_url"
							type="text"
							class="w-full"
						/>
					</div>
				</div>

				<div class="mt-10 flex-auto gap-x-6 gap-y-8 sm:grid-cols-6">
					<div>
						<label class="text-sm font-medium leading-6 text-gray-900">Добавить файл</label>
						<div class="mt-5 border border-dashed border-gray-900/25 rounded-lg">
							<div
								v-if="lectureCreateForm.pdf_file_url"
								class="mb-5"
							>
								<div class="card w-5/10 sm-w-3/10 m-auto mt-5">
									<p class="font-semibold text-center text-indigo-500">{{ lectionName }}</p>
									<p class="font-light text-sm text-center">
										Ваш файл смогут просмотреть другие пользователи
									</p>

									<div class="flex justify-center">
										<Button
											icon="pi pi-times"
											rounded
											outlined
											severity="danger"
											:disabled="!lectureCreateForm.pdf_file_url"
											@click="lectureCreateForm.pdf_file_url = ''"
										></Button>
									</div>
								</div>
							</div>

							<div v-if="!lectureCreateForm.pdf_file_url">
								<div class="flex flex-col mb-5 mt-5">
									<i
										class="pi pi-cloud-upload text-6xl m-auto pb-3 text-indigo-500 cursor-pointer"
										@click="openFileDialog"
									/>

									<p class="m-auto text-sm">Загрузите pdw файл с лекцией</p>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
		<div class="mt-6 flex items-center justify-end gap-x-6">
			<Button
				:disabled="isCreateLectrueButtonDisabled"
				:loading="isLoading"
				@click="createLecture"
			>
				Сохранить
			</Button>
		</div>
	</form>
</template>

<style scoped></style>
