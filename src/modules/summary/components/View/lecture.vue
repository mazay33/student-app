<script setup lang="ts">
import type { ILecture } from '../../@types';
import useApiService from '~/services/apiService';
import { getYoutubeId } from '~/helpers';

const apiService = useApiService();

const props = defineProps<{ lectures: ILecture[]; isPrivateSummary: boolean }>();
const emit = defineEmits(['@openEditLectureModal', '@updateSummary']);

const { copy, copied } = useClipboard();
const toast = useToast();

const lecture = ref<ILecture | null>(null);

// Логика редактирования лекции в модалке
const isLectureEditModalVisible = ref(false);
const openEditLectureModal = (lectureData: ILecture) => {
	isLectureEditModalVisible.value = true;
	lecture.value = lectureData;
};
const editLecture = async () => {
	if (!lecture.value) return;
	lecture.value.date = useDateFormat(lecture.value.date, 'YYYY-MM-DD').value;

	const { data } = await apiService.lecture.editLecture(lecture.value);

	if (data.value) {
		toast.add({
			severity: 'success',
			summary: 'Лекция успешно измененна',
			life: 3000,
		});
		emit('@updateSummary');
		isLectureEditModalVisible.value = false;
	}
};

// Логика удаления лекции в модалке
const isLectureDeleteModalVisible = ref(false);
const openDeleteLectureModal = (lectureData: ILecture) => {
	isLectureDeleteModalVisible.value = true;
	lecture.value = lectureData;
};
const deleteLecture = async () => {
	if (!lecture.value) return;
	const { data } = await apiService.lecture.deleteLection(lecture.value.id);

	if (data.value) {
		emit('@updateSummary');
		toast.add({
			severity: 'success',
			summary: 'Лекция удалена',
			life: 3000,
		});
	}

	isLectureDeleteModalVisible.value = false;
};
</script>

<template>
	<accordion
		expand-icon="pi pi-plus"
		collapse-icon="pi pi-minus"
	>
		<accordion-tab
			v-for="(lectureItem, i) in props.lectures"
			:key="i"
		>
			<template #header>
				<span class="flex align-items-center gap-2 w-full">
					<span class="font-bold white-space-nowrap text-lg text-sm sm-text-base">{{
						lectureItem.name
					}}</span>
				</span>
			</template>

			<div>
				<p class="font-bold white-space-nowrap text-base mr-3 sm-mr-10">
					{{ lectureItem.date }}
				</p>
				<div class="italic font-normal text-lg mb-4 w-full md:w-5/10">"{{ lectureItem.description }}"</div>
				<div class="flex flex-col">
					<div class="flex">
						<nuxt-link
							target="_blank"
							:to="lectureItem.pdf_file_url"
						>
							<Button class="w-full sm:w-46 mr-5">Лекция для чтения</Button>
						</nuxt-link>
						<Button
							v-tooltip="{
								value: copied ? 'Скопировано!' : 'Скопировать ссылку',
								autoHide: false,
							}"
							class="bg-green border-green sm-ml-0 ml-5"
							@click="copy(lectureItem.pdf_file_url)"
						>
							<i class="pi pi-share-alt pr-1 sm-pr-0"></i>
						</Button>
					</div>

					<div class="mt-5">
						<div v-if="lectureItem.video_url">
							<iframe
								class="w-full lg-w-6/10 h-70 md-h-100 lg-h-130 rounded-md"
								:src="'https://www.youtube.com/embed/' + getYoutubeId(lectureItem.video_url)"
								frameborder="0"
								allowfullscreen
							/>
						</div>
						<div v-else>тут могла бы быть видео-лекция</div>
					</div>
				</div>
			</div>
			<Button
				v-if="isPrivateSummary"
				class="mt-5 sm-mt-4"
				severity="danger"
				@click="openDeleteLectureModal(lectureItem)"
				>Удалить лекцию</Button
			>
			<Button
				v-if="isPrivateSummary"
				class="mt-5 sm-mt-4 ml-0 sm-ml-5"
				severity="info"
				@click="openEditLectureModal(lectureItem)"
				>Редактировать лекцию</Button
			>
		</accordion-tab>
	</accordion>

	<!-- Модалка удаления лекции -->
	<Dialog
		v-model:visible="isLectureDeleteModalVisible"
		modal
		header="Удаление лекции"
		:style="{ width: '25rem' }"
	>
		<SummaryModalLectureDelete />

		<template #footer>
			<div class="flex justify-content-end gap-2">
				<Button
					type="button"
					label="Отменить"
					severity="secondary"
					@click="isLectureDeleteModalVisible = false"
				></Button>
				<Button
					type="button"
					class="ml-21"
					severity="danger"
					label="Подтвердить"
					@click="deleteLecture()"
				></Button>
			</div>
		</template>
	</Dialog>

	<!-- Модалка редактирования лекции -->
	<Dialog
		v-model:visible="isLectureEditModalVisible"
		modal
		header="Редактирование лекции"
		:style="{ width: '75%' }"
	>
		<SummaryModalLectureEdit
			v-if="lecture"
			:lecture="lecture"
		/>

		<template #footer>
			<div class="flex justify-content-end gap-2">
				<Button
					type="button"
					label="Отменить"
					severity="secondary"
					@click="isLectureEditModalVisible = false"
				></Button>
				<Button
					type="button"
					label="Сохранить"
					@click="editLecture()"
				></Button>
			</div>
		</template>
	</Dialog>
</template>

<style lang="scss" scoped></style>
