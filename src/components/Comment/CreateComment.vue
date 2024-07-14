<script setup lang="ts">
import { number } from 'yup';
import useApiService from '~/services/apiService';

const apiService = useApiService();
const authStore = useAuthStore();
const isAuthDialogVisible = ref(false);
const toast = useToast();
const bockComment = ref(true);

const props = inject('propsComment');

let comments = ref([]);
let pending = ref(false);
const popop = defineProps({
	loadSize: number,
});

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
				summary: 'Комментарий опубликован, вы сможете повторно добавить комментарий через некоторое время',
				life: 4000,
			});
			commentForm.value.text = null;
			const { data } = await apiService.comments.getComments(props.summary_id, {
				query: {
					page: '1',
					page_size: popop.loadSize,
					sort_by: 'created_at',
					sort_type: 'asc',
				},
			});

			bockComment.value = false;
		}
	} else {
		isAuthDialogVisible.value = true;
	}
};

watch(
	() => commentForm.value.text,
	newValue => {
		if (newValue && newValue.length > 99) {
			toast.add({
				severity: 'info',
				summary: 'Количество символов в комментарии должно быть не более 100',
				life: 3000,
			});
		}
	},
);
</script>

<template>
	<Toast />
	<div class="flex flex-col shadow-md p-5 rounded-lg border border-gray-100 border-solid dark:border-zinc-400">
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
		<span class="p-text-secondary mb-5 block">Чтобы оставить комментарий необходимо войти в свой аккаунт</span>
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
</template>
