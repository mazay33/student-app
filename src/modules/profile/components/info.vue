<script setup lang="ts">
import type { IUser } from '~/@types/@types';
import useApiService from '~/services/apiService';

const props = defineProps<{ user: IUser | null | undefined; isOwnerUser: boolean }>();

const apiService = useApiService();
const toast = useToast();
const authStore = useAuthStore();

const isDisabled = ref(true);

const user = computed({
	get() {
		return props.user;
	},
	set(value) {
		if (!props.isOwnerUser) return;
		authStore.user = value;
	},
});

const submitInfo = async () => {
	if (!props.isOwnerUser || !props.user || !props.user.description) {
		return;
	}
	const { data } = await apiService.user.updateUserInfo(props.user.nickname, props.user.description);

	if (data.value) {
		authStore.getMe();
		isDisabled.value = true;
		toast.add({
			severity: 'success',
			summary: 'Данные успешно обновлены',
			life: 3000,
		});
	}
};

const uploadImage = async (event: Event) => {
	const formData = new FormData();
	const target = event.target as HTMLInputElement;
	if (!event.target || !target.files) {
		return;
	}
	formData.append('file', target.files[0]);

	const { data } = await apiService.user.updateUserImage(formData);

	if (data.value) {
		await authStore.getMe();
		toast.add({
			severity: 'success',
			summary: 'Изображение успешно обновлено',
			life: 3000,
		});
	}
};

const openFileDialog = () => {
	const input = document.createElement('input');
	input.type = 'file';
	input.accept = 'image/*';
	input.multiple = false;
	input.style.display = 'none';
	input.addEventListener('change', event => {
		const target = event.target as HTMLInputElement;
		if (!target.files) {
			return;
		}

		uploadImage(event);
	});
	document.body.appendChild(input);
	input.click();
	document.body.removeChild(input);
};

const avatarOverlayPanel = ref();

const toggle = (event: Event) => {
	avatarOverlayPanel.value.toggle(event);
};
</script>

<template>
	<Toast />

	<div
		v-if="user"
		class="mt-7 flex flex-col items-center justify-between gap-5 gap-5 sm:flex-row"
	>
		<div
			flex
			flex-col
			sm:flex-row
		>
			<div class="mt--10 text-center">
				<div class="w-5/10 text-black">
					<InputText
						v-model="user.nickname"
						type="text"
						:disabled="isDisabled"
						class="w-60 border-1 bg-white text-center text-black font-bold shadow-none"
						:class="[isDisabled ? 'border-white' : 'border-blue']"
					/>
				</div>
				<div>
					<img
						class="mt-5 h-200px w-200px rounded-full"
						:class="isOwnerUser ? 'cursor-pointer' : ''"
						:src="
							user.image_url
								? `${user.image_url.replace('localhost', 'la-parole.ru/api')}`
								: 'https://pinia.vuejs.org/logo.svg'
						"
						@click="isOwnerUser ? toggle($event) : () => {}"
					/>
				</div>
			</div>

			<div sm:ml-7>
				<div class="flex">
					<div class="flex flex flex-col flex-col gap-2">
						<label>Email</label>
						<div class="h-10 w-60 rounded bg-slate-200">
							<p class="pl-3 pt-2">{{ user.email }}</p>
						</div>
					</div>
				</div>
				<div class="mt-6 flex">
					<div class="flex flex flex-col flex-col gap-2">
						<label>Дата создания аккаунта</label>
						<div class="h-10 w-60 rounded bg-slate-200">
							<p class="pl-3 pt-2">{{ useDateFormat(user.created_at, 'DD.MM.YYYY').value }}</p>
						</div>
					</div>
				</div>
				<div class="mt-6 flex">
					<div class="mb-5 flex flex flex-col flex-col gap-2">
						<label for="username">описание</label>
						<InputText
							v-model="user.description"
							type="text"
							class="h-10 w-60 border-1 rounded shadow-none placeholder:text-slate-700"
							:class="[isDisabled ? 'border-white' : 'border-blue']"
							placeholder="Some info about..."
							:disabled="isDisabled"
						/>
					</div>
				</div>
			</div>
		</div>

		<div class="flex flex-col items-center justify-center gap-5 sm:mt-48 xl:flex-row md:gap-5">
			<Button
				id="disnone"
				label="обновить данные"
				:class="[isDisabled ? 'hidden' : '']"
				class="bg-white text-indigo-500 hover:bg-indigo-100"
				@click="submitInfo"
			/>
			<Button
				v-if="isOwnerUser"
				id="change_button"
				label="Изменить"
				class=""
				@click="isDisabled = !isDisabled"
			/>
		</div>
	</div>
	<OverlayPanel
		ref="avatarOverlayPanel"
		class="user-information-panel ml-7"
		append-to="div"
	>
		<div
			v-if="user"
			class="w-150px"
		>
			<div
				v-if="!user.image_url"
				class="overlay-tab"
				@click="isOwnerUser ? openFileDialog() : () => {}"
			>
				<p class="m-0 w-110px">Загрузить фото</p>
				<i
					class="pi pi-upload"
					style="font-size: 1rem"
				/>
			</div>
			<div
				v-else
				class="overlay-tab"
				@click="isOwnerUser ? openFileDialog() : () => {}"
			>
				<p class="m-0 w-110px">Изменить фото</p>
				<i
					class="pi pi-pencil"
					style="font-size: 1rem"
				/>
			</div>
			<div class="overlay-tab overlay-tab--delete">
				<p class="m-0 w-110px">Удалить фото</p>
				<i
					class="pi pi-trash"
					style="font-size: 1rem"
				/>
			</div>
		</div>
	</OverlayPanel>
</template>

<style lang="scss">
.user-information-panel {
	display: flex;
	justify-content: center;
	width: 170px;

	&::before {
		margin-left: 45px;
	}

	&::after {
		margin-left: 47px;
	}
}

.overlay-tab {
	@apply flex cursor-pointer items-center justify-between border-b border-gray-300
	border-solid border-l-none border-r-none border-t-none p-1 py-2 duration-200 hover:text-indigo-500;
	&--delete {
		@apply text-red duration-200 hover:text-red-700 border-b-none;
	}
}
</style>
