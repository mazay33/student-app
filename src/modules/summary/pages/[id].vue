<script setup lang="ts">
import 'primeicons/primeicons.css';
import Accordion from 'primevue/accordion';
import AccordionTab from 'primevue/accordiontab';
import Menu from 'primevue/menu';

const summaryStore = useSummaryStore();
const { summary } = storeToRefs(summaryStore);
const { summaryUser } = storeToRefs(summaryStore);

const route = useRoute();
const { id } = route.params;

await summaryStore.getSummaryById(String(id));

const userId = summary.value?.user_id;
await summaryStore.getUserById(userId!);

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
			<div class="text-md leading-7 text-gray-600 pl-0 sm-pl-5 text-center">{{ summary?.university?.name }}</div>
		</div>

		<div class="flex flex-col sm:flex-row mt-3 pl-0 sm-pl-3">
			<div class="text-base font-bold leading-7 text-gray-900 text-center">Предмет:</div>
			<div class="text-md leading-7 text-gray-600 pl-0 sm-pl-5 text-center">{{ summary?.subject?.name }}</div>
		</div>

		<div class="flex flex-col sm:flex-row mt-3 pl-0 sm-pl-3">
			<div class="text-base font-bold leading-7 text-gray-900 text-center">Преподаватель:</div>
			<div class="text-md leading-7 text-gray-600 pl-5 text-center">{{ summary?.teacher?.full_name }}</div>
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
						<span class="flex gap-2 w-full">
							<p class="flex-1 pt-2 font-bold white-space-nowrap text-lg">{{ lecture.name }}</p>
							<p class="pt-3 font-bold white-space-nowrap text-lg mr-10">{{ lecture.date }}</p>
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
