<script setup lang="ts">
import useApiService from '~/services/apiService';
import type { IPaginatedResult } from '~/@types/@types';
import type { IUser } from '~/@types/user.types';
import { string } from 'yup';
import CreateComment from './CreateComment.vue';

const apiService = useApiService();
const router = useRouter();
const authStore = useAuthStore();

const { user } = storeToRefs(authStore);
const toast = useToast();

const props = inject('propsComment');

const { data: comments, pending } = await apiService.comments.getComments(props.summary_id);
comments.value.result.reverse();

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
		const { data: comments, pending } = await apiService.comments.getComments(props.summary_id);
		comments.value.result.reverse();
	} else {
		toast.add({
			severity: 'error',
			summary: 'Не удалось удалить комментарий',
			life: 3500,
		});
	}
};
</script>

<template>
	<Toast />
	<div class="shadow-md rounded-xl border border-gray-100 border-solid dark:border-zinc-400">
		<accordion
			expand-icon="pi pi-plus"
			collapse-icon="pi pi-minus"
			class="pl-1 pr-1 sm-pr- sm-pl-4 pt-3 pb-3 rounded-xl"
			>Комментарии
			<accordion-tab>
				<template #header>
					<div>Комментарии</div>
				</template>

				<CreateComment />

				<div v-if="comments">
					<div
						v-for="comment in comments.result"
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
								<p class="mt-4 flex-1">{{ comment.text }}</p>
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
						></Button></div
				></Dialog>
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
