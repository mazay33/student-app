<script setup lang="ts">
import type { ISummary } from '../../@types';
import type { IUser } from '~/@types/@types';
import useApiService from '~/services/apiService';

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
</script>

<template>
	<h1 class="text-3xl text-center text-indigo-500 font-semibold mb-10 pt-5">
		{{ summary?.name }}
	</h1>
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
				<i
					class="pi pi-bookmark pt-3 sm-pt-0 pl-3 sm-pl-5 text-center"
					style="font-size: 1.8rem"
				/>
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
				v-if="isPrivateSummary"
				class="bg-green border-green w-44 mt-5 sm-mt-0 m-auto"
				@click="isSummaryCreateLectureFormVisible = !isSummaryCreateLectureFormVisible"
				>Добавить лекцию</Button
			>
			<Button
				v-else-if="!isPrivateSummary && authStore.user?.id === summary?.user_id"
				class="bg-green border-green mt-5 sm-mt-0 m-auto"
				@click="useRouter().push({ path: `/summary/private/${summary?.id}` })"
				>Редактировать конспект</Button
			>
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
									class="bg-green border-green"
									@click="copy(lecture.pdf_file_url)"
								>
									<i class="pi pi-share-alt pr-2 sm-pr-0"></i>
								</Button>
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
			class="mt-15 mb-10 text-2xl text-center text-indigo-600 font-semibold"
		>
			<p>конспектов пока нет, но вы можете их добавить</p>
		</div>
	</div>
</template>

<style scoped>
.p-accordion-header:hover {
	transform: none !important;
}
</style>
