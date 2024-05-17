<script setup lang="ts">
import type { ILecture } from '~/modules/summary/@types';
import useApiService from '~/services/apiService';

const props = defineProps<{
	lecture?: ILecture;
}>();

const apiService = useApiService();

const lectureEditForm = ref({
	name: props.lecture?.name || '',
	description: props.lecture?.description || '',
	pdf_file_url: props.lecture?.pdf_file_url || '',
	video_url: props.lecture?.video_url || '',
	date: props.lecture?.date || '',
	id: props.lecture?.id || '',
});

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
</script>

<template>
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

	<slot name="footer"></slot>

	<!-- <div class="flex justify-content-end gap-2">
		<Button
			type="button"
			label="Отменить"
			severity="secondary"
		></Button>
		<Button
			type="button"
			label="Сохранить"
			@click="editLecture"
		></Button>
	</div> -->
</template>

<style scoped></style>
