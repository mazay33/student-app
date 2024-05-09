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
	<div class="bg-white border-1 mt-5 ml-0 sm-ml-3">
		<Toast />
		<form>
			<div>
				<div>
					<h2 class="text-base font-semibold leading-7 text-indigo-500">Добавление лекции</h2>
					<p class="mt-1 text-sm leading-6 text-gray-600">Пожалуйста заполните данные о вашей лекции ниже</p>
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
										class="w-10/10"
									/>
								</div>
							</div>

							<div class="sm:col-span-3">
								<label class="block text-sm font-medium leading-6 text-gray-900">Описание</label>
								<div>
									<InputText
										v-model="lectureCreateForm.description"
										type="text"
										class="w-10/10"
									/>
								</div>
							</div>
						</div>
					</div>

					<div class="flex flex-col sm-flex w-5/10 pr-3 mt-2">
						<label class="block text-sm font-medium leading-8 text-gray-900">Дата проведения лекции</label>
						<Calendar
							v-model="lectureCreateForm.date"
							show-icon
							date-format="yy-mm-dd"
						/>
						<label class="block text-sm font-medium leading-8 text-gray-900 mt-2"
							>Ссылка на youtube видео</label
						>
						<InputText
							v-model="lectureCreateForm.video_url"
							type="text"
							class="w-10/10"
						/>
					</div>

					<div class="mt-10 flex-auto gap-x-6 gap-y-8 sm:grid-cols-6">
						<div>
							<label class="text-sm font-medium leading-6 text-gray-900">Добавить файл</label>
							<div
								class="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10"
							>
								<div class="text-center">
									<div class="mt-4 flex text-sm leading-6 text-gray-600">
										<label
											class="relative rounded-md cursor-pointer bg-white font-semibold text-indigo-600 hover:text-indigo-500"
										>
											<p
												v-if="!lectureCreateForm.pdf_file_url"
												@click="openFileDialog"
											>
												Файл с лекцией
											</p>
											<p v-else>{{ lectureCreateForm.pdf_file_url }}</p>
										</label>
									</div>
									<p class="text-xs leading-5 text-gray-600">PDF</p>
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
	</div>
</template>

<style scoped></style>
