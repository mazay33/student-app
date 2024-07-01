<script setup lang="ts">
import useApiService from '~/services/apiService';
import type { IPaginatedResult } from '~/@types/@types';
import type { IUser } from '~/@types/user.types';

const apiService = useApiService();
const router = useRouter();
const authStore = useAuthStore();

const { user } = storeToRefs(authStore);
const toast = useToast();

const props = defineProps<{ summary_id: String; user_img: String; isAuth: Boolean; user_id: String }>();

const isAuthDialogVisible = ref(false);
// const commentContent = useLocalStorage('commentContent');
// если сделаем регу в модалке тогда можно сохранить комент незареганного юзера ну или в lc закинуть

const goToLogin = () => {
	router.push('/auth/login');
};

const ratingValue = ref();

const { data: comments, pending } = await apiService.comments.getComments(props.summary_id);

const users = ref<IPaginatedResult<IUser>>();
const getUsers = async () => {
	const { data } = await apiService.user.getUserList();
	if (data.value) {
		users.value = data.value;
	}
};
await getUsers();

const commentValue = ref('');

const commentForm = ref({
	summary_id: props.summary_id,
	text: commentValue.value,
});

watch(commentValue, newValue => {
	commentForm.value.text = newValue;
});

const addComment = async () => {
	if (authStore.authinticated) {
		const { data } = await apiService.comments.addComment(commentForm.value);
		if (data.value) {
			commentValue.value = '';
			await apiService.comments.getComments(props.summary_id);
		}
	} else {
		isAuthDialogVisible.value = true;
	}
};

const MenuOverlayPanel = ref();
const toggleMenu = (event: Event) => {
	MenuOverlayPanel.value.toggle(event);
};

const isComplain = ref(false);

const selectedComplainComment = ref('');

const selectedCategory = ref('Нежелательная реклама или спам'); //филлерная штука, чтобы пользователь типо выбирал причину жалобы
const categories = ref([
	{ name: 'Нежелательная реклама или спам', key: '1' },
	{ name: 'Дискриминационные высказывания ', key: '2' },
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
			summary: 'Ваша жалоба будет рассмотренна',
			life: 3500,
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
</script>

<template>
	<Toast />
	<div class="shadow-md rounded-xl">
		<accordion
			expand-icon="pi pi-plus"
			collapse-icon="pi pi-minus"
			class="pl-6 pr-6 pt-3 pb-3 rounded-xl"
			>Комментарии
			<accordion-tab>
				<template #header>
					<div>Комментарии</div>
				</template>
				<div class="flex flex-col shadow-md p-5 rounded-lg">
					<div class="flex">
						<img
							:src="[props.isAuth ? props.user_img : 'https://pinia.vuejs.org/logo.svg']"
							:class="[props.isAuth ? 'w-10' : 'w-7']"
							class="rounded-full mr-4"
						/>

						<InputText
							class="w-full"
							v-model="commentValue"
							placeholder="Введите комментарий"
						/>
					</div>
					<div class="flex mt-3">
						<div class="flex-1">
							<Rating
								v-model="ratingValue"
								class="mt-3 ml-3"
							/>
						</div>
						<Button
							class="ml-5 bg-gray border-gray"
							@click="commentValue = ''"
							>Отмена</Button
						>
						<Button
							class="ml-5"
							:disabled="!commentValue"
							@click="addComment()"
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
				<div v-if="comments">
					<div
						v-for="comment in comments.result"
						:key="comment.id"
					>
						<div class="mt-5 shadow-md p-5 rounded-lg">
							<div class="flex">
								<img
									src="https://24konspect.ru/api/public/users/image?file_id=AgACAgIAAxkDAAOXZl3iez3rGcgAAQWlGhEz0qFcCGyrAAIB2TEbc9LxSpNFo4CEyCZDAQADAgADbQADNQQ"
									class="w-10 rounded-full"
								/>
								<div class="p-2">
									{{ users?.result.find((user: IUser) => user.id === comment.user_id)?.nickname }}
								</div>
							</div>
							<div class="flex">
								<p class="mt-4 flex-1">{{ comment.text }}</p>
								<i
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
						></Button></div
				></Dialog>
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
	</div>
</template>
<!-- border border-indigo-500 border-solid -->
