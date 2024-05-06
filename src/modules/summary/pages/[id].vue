<script setup lang="ts">
import type { ISummary } from '../@types';
import type { IUser } from '~/@types/@types';
import useApiService from '~/services/apiService';

const apiService = useApiService();

const route = useRoute();

const summary = ref<ISummary | null>(null);
const user = ref<IUser | null>(null);

const getSummary = async () => {
	const { data } = await apiService.summary.getPublicSummaryById(String(route.params.id));
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

const getYoutubeId = (url: string) => {
	const youtubeRegex =
		// eslint-disable-next-line
		/(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
	const match = url.match(youtubeRegex);
	return match ? match[1] : '';
};

const lectionLink = (link: string) => {
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
</script>

<template>
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
			{{ summary?.name }}
		</h1>

		<div class="flex flex-col sm:flex-row">
			<div class="text-lg font-bold text-center pl-0 sm-pl-3">Автор:</div>

			<div class="text-lg pl-0 sm-pl-5 flex justify-center">
				<div class="flex mt-1 sm-mt--2">
					<img
						v-if="user?.image_url"
						class="w-10 rounded-full text-center"
						:src="user.image_url"
					/>
					<p class="pt-2 ml-3">{{ user?.nickname }}</p>
				</div>
				<i
					class="pi pi-bookmark pt-3 sm-pt-0 pl-3 sm-pl-5 text-center"
					style="font-size: 1.8rem"
				/>
			</div>
		</div>

		<div class="flex flex-col sm:flex-row mt-3 pl-0 sm-pl-3">
			<div class="text-lg font-bold text-center">Вуз:</div>
			<div class="text-lg pl-0 sm-pl-5 text-center">{{ summary?.university?.name }}</div>
		</div>

		<div class="flex flex-col sm:flex-row mt-3 pl-0 sm-pl-3">
			<div class="text-lg font-bold text-center">Предмет:</div>
			<div class="text-lg pl-0 sm-pl-5 text-center">{{ summary?.subject?.name }}</div>
		</div>

		<div class="flex flex-col sm:flex-row mt-3 pl-0 sm-pl-3">
			<div class="text-lg font-bold text-center">Преподаватель:</div>
			<div class="text-lg pl-5 text-center">{{ summary?.teacher?.full_name }}</div>
		</div>

		<div
			v-if="summary?.lectures && summary.lectures.length > 0"
			class="card"
			mt-5
		>
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
									class="w-full sm:w-46 mr-5"
									@click="lectionLink(lecture.pdf_file_url)"
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
									class="w-5/10 md-w-200"
									@hide="closeModal"
								>
									<div>{{ lectureLink }}</div>
									<div class="flex mt-3">
										<Button
											class="p-button-text"
											@click="closeModal"
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
			<p>конспектов пока нет, возможно автор добавит их позже</p>
		</div>
	</div>
</template>

<style scoped>
.p-accordion-header:hover {
	transform: none !important;
}
</style>
