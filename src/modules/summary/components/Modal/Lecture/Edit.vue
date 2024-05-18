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
	}
};
</script>

<template>
	<div>
		<span class="p-text-secondary block mb-5">Обновите информацию о вашей лекции</span>
		<div class="flex align-items-center gap-3 mb-3">
			<div class="flex flex-col sm-flex-row w-full">
				<label class="font-semibold w-10rem mb-2 sm-mt-2">Название лекции</label>
				<InputText
					v-model="lectureEditForm.name"
					class="flex-auto"
				></InputText>
			</div>
		</div>
		<div class="flex align-items-center gap-3 mb-3">
			<div class="flex flex-col sm-flex-row w-full">
				<label class="font-semibold w-10rem mb-2 sm-mt-2">Описание</label>
				<InputText
					v-model="lectureEditForm.description"
					class="flex-auto"
				/>
			</div>
		</div>
		<div class="flex align-items-center gap-3 mb-3">
			<div class="flex flex-col sm-flex-row w-full">
				<label class="font-semibold w-10rem mb-2 sm-mt-2">Дата лекции</label>
				<Calendar
					v-model="lectureEditForm.date"
					date-format="yy-mm-dd"
					class="flex-auto"
				/>
			</div>
		</div>
		<div class="flex align-items-center gap-3 mb-3">
			<div class="flex flex-col sm-flex-row w-full">
				<label class="font-semibold w-10rem mb-2 sm-mt-2">youtube ссылка</label>
				<InputText
					v-model="lectureEditForm.video_url"
					class="flex-auto"
				/>
			</div>
		</div>
		<div class="flex align-items-center gap-3 mb-5">
			<div class="flex flex-col sm-flex-row w-full">
				<label class="font-semibold w-10rem mb-2 sm-mt-2">PDF файл</label>
				<div class="flex flex-col">
					<div class="flex">
						<div class="card w-75 m-auto">
							<div
								v-if="!lectureEditForm.pdf_file_url"
								class="m-auto"
							>
								<div class="flex flex-col">
									<i
										class="pi pi-cloud-upload text-6xl m-auto pb-3 text-indigo-500 cursor-pointer"
										@click="openFileDialog"
									/>
									<p class="m-auto text-sm">Загрузите новый pdw файл</p>
								</div>
							</div>
							<div v-else>
								<div class="card w-9/10 m-auto mt-5">
									<p class="font-semibold font-xs text-center text-indigo-500">файл с лекцией</p>

									<div class="flex justify-center">
										<Button
											icon="pi pi-times"
											rounded
											outlined
											severity="danger"
											:disabled="!lectureEditForm.pdf_file_url"
											@click="lectureEditForm.pdf_file_url = ''"
										></Button>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>

		<slot name="footer"></slot>
	</div>
</template>

<style scoped></style>
