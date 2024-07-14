<script setup lang="ts">
import useApiService from '~/services/apiService';
import type { IPaginatedResult } from '~/@types/@types';
import type { IUser } from '~/@types/user.types';
import CreateComment from './CreateComment.vue';

const apiService = useApiService();
const router = useRouter();
const authStore = useAuthStore();

const { user } = storeToRefs(authStore);
const toast = useToast();

const props = inject('propsComment');

let comments = ref([]);
let pending = ref(false);

const loadSize = ref<Number>(25);
const loadMore = async () => {
	loadSize.value += 25;
	await fetchComments();
};

const fetchComments = async () => {
	pending.value = true;
	const { data } = await apiService.comments.getComments(props.summary_id, {
		query: {
			page: '1',
			page_size: loadSize.value,
			sort_by: 'created_at',
			sort_type: 'desc',
		},
	});
	pending.value = false;
	if (data.value) {
		comments.value = data.value.result;
	}
};

await fetchComments();

const users = ref<IPaginatedResult<IUser>>();
const getUsers = async () => {
	const { data } = await apiService.user.getUserList();
	if (data.value) {
		users.value = data.value;
	}
};
await getUsers();

const MenuOverlayPanel = ref();
const DeleteOverlayPanel = ref();

const toggleMenu = (event: Event) => {
	MenuOverlayPanel.value.toggle(event);
};

const toggleDelete = (event: Event) => {
	DeleteOverlayPanel.value.toggle(event);
};

const isComplain = ref(false);
const isDelete = ref(false);

const selectedComplainComment = ref('');

const selectedCategory = ref('Нежелательная реклама или спам');
const categories = ref([
	{ name: 'Нежелательная реклама или спам', key: '1' },
	{ name: 'Дискриминационные высказывания', key: '2' },
	{ name: 'Ложная информация', key: '3' },
	{ name: 'Домогательства или издевательства', key: '4' },
]);

const complainComment = ref({
	comment_id: selectedComplainComment.value,
	user_from: props.user_id,
});

watch(selectedComplainComment, newValue => {
	complainComment.value.comment_id = newValue;
});

const complainComments = async () => {
	const { data } = await apiService.comments.complainComment(complainComment.value);
	if (data.value) {
		toast.add({
			severity: 'success',
			summary:
				'Ваша жалоба принята и будет рассмотрена в ближайшее время. Если мы обнаружим, что контент не соответствует нашим правилам, то удалим его.',
			life: 4000,
		});
		isComplain.value = false;
	} else {
		toast.add({
			severity: 'error',
			summary: 'Не удалось отправить жалобу',
			life: 3500,
		});
	}
};

const commentToDelete = ref();
const deleteComment = async () => {
	const { data } = await apiService.comments.deleteComment(commentToDelete.value);
	if (data.value) {
		toast.add({
			severity: 'success',
			summary: 'Комментарий успешно удален',
			life: 3500,
		});
		isDelete.value = false;
		await fetchComments();
	} else {
		toast.add({
			severity: 'error',
			summary: 'Не удалось удалить комментарий',
			life: 3500,
		});
	}
};

// // // // // //это все есть в CreateComment

const timer = ref<number>(0);

const startTimer = () => {
	timer.value = 150;
	const interval = setInterval(() => {
		if (timer.value > 0) {
			timer.value -= 1;
		} else {
			clearInterval(interval);
			bockComment.value = true;
		}
	}, 1000);
};

const bockComment = ref(true);
const isAuthDialogVisible = ref(false);

const goToLogin = () => {
	router.push('/auth/login');
};

const commentForm = ref({
	summary_id: props.summary_id,
	text: null,
});

const addComment = async () => {
	if (authStore.authinticated) {
		const { data } = await apiService.comments.addComment(commentForm.value);

		if (data.value) {
			toast.add({
				severity: 'success',
				summary: 'Комментарий опубликован, вы сможете повторно добавить комментарий через 3 минуты',
				life: 4000,
			});
			startTimer();
			commentForm.value.text = null;
			bockComment.value = false;
			await fetchComments();
		}
	} else {
		isAuthDialogVisible.value = true;
	}
};

watch(
	() => commentForm.value.text,
	newValue => {
		if (newValue && newValue.length > 254) {
			toast.add({
				severity: 'info',
				summary: 'Количество символов в комментарии должно быть не более 255',
				life: 3000,
			});
		}
	},
);

const formatCommentText = text => {
	return text.replace(/\n/g, '<br>');
};

// // // // // // пдф ридер
</script>

<template>
	<Toast />
	<div class="shadow-md rounded-xl border border-gray-100 border-solid dark:border-zinc-400">
		<accordion
			expand-icon="pi pi-plus"
			collapse-icon="pi pi-minus"
			class="pl-1 pr-1 sm-pr- sm-pl-4 pt-3 pb-3 rounded-xl"
		>
			Комментарии
			<accordion-tab>
				<template #header>
					<div>Комментарии</div>
				</template>

				<!-- костыльнул, не получилось обновлять комментарии в CreateComment при добавлении нового -->

				<div
					class="flex flex-col shadow-md p-5 rounded-lg border border-gray-100 border-solid dark:border-zinc-400"
				>
					<div class="flex">
						<img
							:src="[props.isAuth ? props.user_img : 'https://pinia.vuejs.org/logo.svg']"
							:class="[props.isAuth ? 'w-10' : 'w-7']"
							class="rounded-full mr-4"
						/>

						<Textarea
							class="w-full resize-none h-10"
							v-model="commentForm.text"
							:disabled="!bockComment"
							placeholder="Введите комментарий"
							maxlength="100"
						/>
					</div>
					<div class="flex flex-col mt-3 sm-flex-row items-center justify-center">
						<div class="flex-1"></div>
						<Button
							class="ml-0 sm-ml-5 bg-gray border-gray w-24 text-center mb-3 sm-mb-0"
							:disabled="!bockComment"
							@click="commentForm.text = ''"
							>Отмена</Button
						>
						<Button
							class="ml-0 sm-ml-5 w-55"
							:disabled="!commentForm.text || !bockComment"
							@click="addComment"
							>Оставить комментарий</Button
						>
					</div>
				</div>

				<Dialog
					v-model:visible="isAuthDialogVisible"
					modal
					header="Ошибка авторизации"
					:closable="true"
					:style="{ width: '25rem' }"
				>
					<span class="p-text-secondary mb-5 block"
						>Чтобы оставить комментарий необходимо войти в свой аккаунт</span
					>
					<div class="align-items-center mb-3 flex gap-3"></div>

					<div class="justify-content-end flex gap-2">
						<Button
							type="button"
							label="Закрыть"
							severity="secondary"
							@click="isAuthDialogVisible = false"
						></Button>
						<Button
							type="button"
							label="Войти"
							@click="goToLogin()"
						></Button>
					</div>
				</Dialog>

				<!--  -->

				<div v-if="comments.length">
					<div
						v-for="comment in comments"
						:key="comment.id"
					>
						<div
							class="mt-5 shadow-md p-5 rounded-lg border border-gray-100 border-solid dark:border-zinc-400"
						>
							<div class="flex">
								<img
									:src="users?.result.find((user: IUser) => user.id === comment.user_id)?.image_url"
									class="w-10 rounded-full"
								/>
								<div class="p-2">
									{{ users?.result.find((user: IUser) => user.id === comment.user_id)?.nickname }}
								</div>
							</div>
							<div class="flex">
								<p
									class="mt-4 flex-1"
									v-html="formatCommentText(comment.text)"
								></p>
								<i
									v-if="user?.id === comment.user_id"
									@click="
										commentToDelete = comment.id;
										toggleDelete($event);
									"
									class="pi pi-ellipsis-v cursor-pointer"
								>
								</i>
								<i
									v-else
									@click="
										toggleMenu($event);
										selectedComplainComment = comment.id;
									"
									class="pi pi-ellipsis-v cursor-pointer"
								></i>
							</div>
						</div>
					</div>
				</div>
				<div
					class="text-center mt-5"
					@click="console.log(props)"
					v-else
				>
					Комментариев пока нет, но вы можете оставить его первым
				</div>
				<Dialog
					v-model:visible="isComplain"
					modal
					header="Причина жалобы"
					:style="{ width: '27rem' }"
				>
					<div class="flex flex-col gap-4">
						<div
							v-for="category in categories"
							:key="category.key"
							class="flex items-center"
						>
							<RadioButton
								v-model="selectedCategory"
								:inputId="category.key"
								name="dynamic"
								:value="category.name"
							/>
							<label
								:for="category.key"
								class="ml-2"
								>{{ category.name }}</label
							>
						</div>
					</div>
					<div class="flex justify-end gap-2 mt-6">
						<Button
							type="button"
							label="Отмена"
							severity="secondary"
							@click="isComplain = false"
						></Button>
						<Button
							type="button"
							label="Пожаловаться"
							@click="complainComments()"
						></Button>
					</div>
				</Dialog>
				<Dialog
					v-model:visible="isDelete"
					modal
					header="Подтвердите действие"
					:style="{ width: '27rem' }"
				>
					<div>Удалить комментарий?</div>
					<div class="flex justify-end gap-2 mt-6">
						<Button
							type="button"
							label="Отмена"
							severity="secondary"
							@click="isDelete = false"
						></Button>
						<Button
							type="button"
							class="bg-red border-red"
							label="Удалить"
							@click="deleteComment()"
						></Button>
					</div>
				</Dialog>
				<div class="text-center mt-8 mb-3">
					<Button
						v-if="comments.length >= loadSize"
						label="Загрузить ещё"
						severity="secondary"
						text
						@click="loadMore"
					></Button>
				</div>
			</accordion-tab>
		</accordion>
		<OverlayPanel
			ref="MenuOverlayPanel"
			class="ml-7 sm-ml-7"
			append-to="div"
		>
			<div class="w-135px flex">
				<i
					class="pi pi-flag mt-1 mr-3"
					style="font-size: 1rem"
				/>
				<p
					@click="isComplain = !isComplain"
					class="m-0 w-full cursor-pointer"
				>
					Пожаловаться
				</p>
			</div>
		</OverlayPanel>
		<OverlayPanel
			ref="DeleteOverlayPanel"
			class="ml-7 sm-ml-7"
			append-to="div"
		>
			<div class="w-185px flex">
				<i
					class="pi pi-eraser mt-1 mr-3 text-red"
					style="font-size: 1rem"
				/>
				<p
					@click="isDelete = !isDelete"
					class="m-0 w-full cursor-pointer text-red"
				>
					Удалить комментарий
				</p>
			</div>
		</OverlayPanel>
	</div>
</template>
