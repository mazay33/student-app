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
		class="flex items-center gap-5 flex-col sm:flex-row gap-5 mt-7 justify-between"
	>
		<div
			flex
			flex-col
			sm:flex-row
		>
			<div class="text-center mt--10">
				<div class="w-5/10 text-black">
					<InputText
						v-model="user.nickname"
						type="text"
						:disabled="isDisabled"
						class="w-60 shadow-none text-black bg-white text-center font-bold border-1"
						:class="[isDisabled ? 'border-white' : 'border-blue']"
					/>
				</div>
				<div>
					<img
						class="rounded-full mt-5 h-200px w-200px"
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
					<div class="flex flex-col gap-2 flex flex-col">
						<label>Email</label>
						<div class="bg-slate-200 rounded w-60 h-10">
							<p class="pt-2 pl-3">{{ user.email }}</p>
						</div>
					</div>
				</div>
				<div class="flex mt-6">
					<div class="flex flex-col gap-2 flex flex-col">
						<label>Дата создания аккаунта</label>
						<div class="bg-slate-200 rounded w-60 h-10">
							<p class="pt-2 pl-3">{{ useDateFormat(user.created_at, 'DD.MM.YYYY').value }}</p>
						</div>
					</div>
				</div>
				<div class="flex mt-6">
					<div class="flex flex-col gap-2 flex flex-col mb-5">
						<label for="username">описание</label>
						<InputText
							v-model="user.description"
							type="text"
							class="placeholder:text-slate-700 shadow-none border-1 rounded w-60 h-10"
							:class="[isDisabled ? 'border-white' : 'border-blue']"
							placeholder="Some info about..."
							:disabled="isDisabled"
						/>
					</div>
				</div>
			</div>
		</div>

		<div class="flex items-center justify-center gap-5 flex-col xl:flex-row md:gap-5 sm:mt-48">
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
				class="flex cursor-pointer items-center justify-between p-1 py-2 border-t-none border-b border-l-none border-r-none border-solid border-gray-300 hover:text-indigo-500 duration-200"
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
				class="flex cursor-pointer items-center justify-between p-1 py-2 border-t-none border-b border-l-none border-r-none border-solid border-gray-300 hover:text-indigo-500 duration-200"
				@click="isOwnerUser ? openFileDialog() : () => {}"
			>
				<p class="m-0 w-110px">Изменить фото</p>
				<i
					class="pi pi-pencil"
					style="font-size: 1rem"
				/>
			</div>
			<div
				class="flex items-center justify-between p-1 py-2 text-red hover:text-red-700 duration-200 cursor-pointer"
			>
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
</style>
