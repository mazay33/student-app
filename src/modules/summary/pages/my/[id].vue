<script setup lang="ts">
import Calendar from 'primevue/calendar';
import InputText from 'primevue/inputtext';

//

const summaryStore = useSummaryStore();
const { mySummary } = storeToRefs(summaryStore);

const route = useRoute();
const id = route.params.id;

await summaryStore.getMySummaryById(String(id));

//

//

import useApiService from '~/services/apiService';

const apiService = useApiService();

const openFileDialog = () => {
	const input = document.createElement('input');
	input.type = 'file';
	input.accept = 'application/pdf'; //тип файла
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

//

const toast = useToast();
const Lection = ref({
	name: null,
	description: null,
	uLink: null,
	date: null,
	pdf_file_url: null,
	summary_id: null,
});

const uploadPdf = async (event: Event) => {
	const formData = new FormData();
	const target = event.target as HTMLInputElement;

	if (!event.target || !target.files) {
		return;
	}
	formData.append('file', target.files[0]);

	const { data } = await apiService.lectures.uploadPdfFile(formData);

	if (data.value) {
		Lection.value.pdf_file_url = data.value.file_url;
	}
};

const createLectures = async () => {
	const date = new Date(Lection.value.date);
	const formattedDate = date.toISOString().split('T')[0];
	Lection.value.date = formattedDate;

	Lection.value.summary_id = mySummary.value?.id;

	const { data } = await apiService.lectures.createLecture(Lection.value);

	if (data.value) {
		toast.add({
			severity: 'success',
			summary: 'Лекция успешно добавлена',
			life: 3000,
		});
		active.value = !active.value;
		await summaryStore.getMySummaryById(String(id));
	}
};
//

//

const getYoutubeId = (url: string) => {
	const youtubeRegex =
		/(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
	const match = url.match(youtubeRegex);
	return match ? match[1] : '';
};

const lectionLink = link => {
	window.open(link, '_blank');
};

const showModal = ref(false);
let lectureLink = '';

const openModal = (link: string) => {
	lectureLink = link;
	showModal.value = true;
};

const closeModal = () => {
	showModal.value = false;
};

const active = ref(false);

const activeCheck = () => {
	active.value = !active.value;
};
</script>

<template>
	<Toast />

	<div
		w-full
		bg-white
		shadow-md
		rounded-xl
		p-5
	>
		<h1
			text-3xl
			text-center
			text-indigo-500
			font-semibold
			mb-10
			pt-5
		>
			{{ mySummary?.name }}
		</h1>

		<div class="flex flex-col sm:flex-row">
			<div class="text-base font-bold leading-7 text-gray-900 text-center pl-0 sm-pl-3">Автор:</div>

			<div class="text-lg pl-0 sm-pl-5 flex justify-center">
				<div class="flex mt-1 sm-mt--2">
					<img
						v-if="summaryUser?.image_url"
						class="w-10 rounded-full text-center"
						:src="summaryUser.image_url"
					/>
					<p class="pt-2 ml-3">{{ summaryUser?.nickname }}</p>
				</div>
				<i
					class="pi pi-bookmark pt-3 sm-pt-0 pl-3 sm-pl-5 text-center"
					style="font-size: 1.8rem"
				/>
			</div>
		</div>

		<div class="flex flex-col sm:flex-row mt-3 pl-0 sm-pl-3">
			<div class="text-base font-bold leading-7 text-gray-900 text-center">Вуз:</div>
			<div class="text-md leading-7 text-gray-600 pl-0 sm-pl-5 text-center">
				{{ mySummary?.university?.name }}
			</div>
		</div>

		<div class="flex flex-col sm:flex-row mt-3 pl-0 sm-pl-3">
			<div class="text-base font-bold leading-7 text-gray-900 text-center">Предмет:</div>
			<div class="text-md leading-7 text-gray-600 pl-0 sm-pl-5 text-center">{{ mySummary?.subject?.name }}</div>
		</div>

		<div class="flex flex-col sm:flex-row mt-3 pl-0 sm-pl-3">
			<div class="flex flex-1 flex-col sm:flex-row">
				<div class="text-base font-bold leading-7 text-gray-900 text-center">Преподаватель:</div>
				<div class="text-md leading-7 text-gray-600 pl-5 text-center">{{ mySummary?.teacher?.full_name }}</div>
			</div>
			<Button
				class="bg-green border-green w-44 mt-5 sm-mt-0 m-auto"
				@click="activeCheck()"
				>Добавить лекцию</Button
			>
		</div>

		<div
			v-if="active"
			class="bg-white border-1 mt-5 ml-0 sm-ml-3"
		>
			<form>
				<div>
					<div>
						<h2 class="text-base font-semibold leading-7 text-indigo-500">Добавление лекции</h2>
						<p class="mt-1 text-sm leading-6 text-gray-600">
							Пожалуйста заполните данные о вашей лекции ниже
						</p>
						<p class="mt--3 text-sm text-gray-600">
							Помните что другие пользователи также смогут увидеть данную лекцию
						</p>

						<div>
							<div class="mt-5 grid grid-cols-1 gap-x-6 gap-y-3 sm:grid-cols-6">
								<div class="sm:col-span-3">
									<label class="block text-sm font-medium leading-6 text-gray-900"
										>Название лекции</label
									>
									<div>
										<InputText
											type="text"
											class="w-10/10"
											v-model="Lection.name"
										/>
									</div>
								</div>

								<div class="sm:col-span-3">
									<label class="block text-sm font-medium leading-6 text-gray-900">Описание</label>
									<div>
										<InputText
											type="text"
											class="w-10/10"
											v-model="Lection.description"
										/>
									</div>
								</div>
							</div>
						</div>

						<div class="flex flex-col sm-flex w-5/10 pr-3 mt-2">
							<label class="block text-sm font-medium leading-8 text-gray-900"
								>Дата проведения лекции</label
							>
							<Calendar
								class=""
								v-model="Lection.date"
								dateFormat="yy-mm-dd"
							/>
							<label class="block text-sm font-medium leading-8 text-gray-900 mt-2"
								>Ссылка на youtube видео</label
							>
							<InputText
								type="text"
								class="w-10/10"
								v-model="Lection.uLink"
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
												<p @click="openFileDialog">Файл с лекцией</p>
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
					<Button @click="createLectures"> Сохранить </Button>
				</div>
			</form>
		</div>

		<div
			v-if="mySummary?.lectures && mySummary.lectures.length > 0"
			class="card"
			mt-5
		>
			<accordion
				expand-icon="pi pi-plus"
				collapse-icon="pi pi-minus"
			>
				<accordion-tab
					v-for="(lecture, i) in mySummary.lectures"
					:key="i"
				>
					<template #header>
						<span class="flex align-items-center gap-2 w-full">
							<span class="font-bold white-space-nowrap text-lg">{{ lecture.name }}</span>
						</span>
					</template>

					<div>
						<div class="italic font-normal text-lg mb-4 w-full md:w-5/10">"{{ lecture.description }}"</div>
						<div
							flex
							flex-col
						>
							<div class="flex">
								<Button
									@click="lectionLink(lecture.pdf_file_url)"
									class="w-full sm:w-46 mr-5"
									>Лекция для чтения</Button
								>
								<Button
									class="bg-green border-green"
									@click="openModal(lecture.pdf_file_url)"
								>
									<i class="pi pi-share-alt pr-2 sm-pr-0"></i>
								</Button>

								<Dialog
									v-model="showModal"
									header="Ссылка на лекцию"
									:modal="true"
									:visible="showModal"
									@hide="closeModal"
									class="w-5/10 md-w-200"
								>
									<div>{{ lectureLink }}</div>
									<div class="flex mt-3">
										<Button
											@click="closeModal"
											class="p-button-text"
											>Закрыть</Button
										>
									</div>
								</Dialog>
							</div>

							<div class="mt-5">
								<iframe
									class="w-full lg-w-6/10 h-100 lg-h-130 rounded-md"
									:src="'https://www.youtube.com/embed/' + getYoutubeId(lecture.video_url)"
									frameborder="0"
									allowfullscreen
								/>
							</div>
						</div>
					</div>
				</accordion-tab>
			</accordion>
		</div>

		<div
			v-else
			mt-15
			mb-10
			text-2xl
			text-center
			text-indigo-600
			font-semibold
		>
			<p>конспектов пока нет, но вы можете их добавить</p>
		</div>
	</div>
</template>

<style scoped></style>
