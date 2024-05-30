<script setup lang="ts">
import type { IUser } from '~/@types/@types';
import useApiService from '~/services/apiService';
import { useRouter } from 'vue-router';
import { useAuthStore } from '~/modules/auth/stores/auth';
import { useForm } from 'vee-validate';
import * as yup from 'yup';

const router = useRouter();

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
const MenuOverlayPanel = ref();

const toggle = (event: Event) => {
	avatarOverlayPanel.value.toggle(event);
};

const passwords = ref({
	old_password: null,
	new_password: null,
});

const updatePasswords = ref(false);

const updatePassword = async () => {
	const { data } = await apiService.auth.updatePassword(passwords.value);

	if (data.value) {
		toast.add({
			severity: 'success',
			summary: 'Пароль успешно обновлен',
			life: 3000,
		});
		updatePasswords.value = false;
	} else {
		toast.add({
			severity: 'error',
			summary: 'Старый пароль некорректен',
			life: 3000,
		});
	}
};

const deactivateUser = ref(false);

const deleteUser = async () => {
	const { data } = await apiService.auth.deactivateUser(user.value?.email);
	if (data.value) {
		toast.add({
			severity: 'success',
			summary: 'Аккаунт удалён',
			life: 3000,
		});
		deactivateUser.value = false;
		useAuthStore().logout();
		await navigateTo(`/auth/login`);
	} else {
		toast.add({
			severity: 'error',
			summary: 'ошибка деактивации',
			life: 3000,
		});
	}
};

const toggleMenu = (event: Event) => {
	MenuOverlayPanel.value.toggle(event);
};

const { errors, defineField } = useForm({
	validationSchema: yup.object({
		password: yup
			.string()
			.required('Поле обязательно для заполнения')
			.min(8, 'Пароль должен быть больше 8 символов')
			.matches(/[a-zа-яё]/, 'Пароль должен содержать хотя бы одну строчную букву')
			.matches(/[A-ZА-ЯЁ]/, 'Пароль должен содержать хотя бы одну заглавную букву')
			.matches(/\d/, 'Пароль должен содержать хотя бы одну цифру'),
	}),
});

const [password, passwordAttrs] = defineField('password', {
	validateOnModelUpdate: false,
});
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
						<label for="username">Описание</label>
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
			<Dialog
				v-model:visible="updatePasswords"
				modal
				header="Обновление пароля"
				:style="{ width: '25rem' }"
			>
				<span class="p-text-secondary block mb-5">Пожалуйста введите новый пароль</span>
				<div class="flex flex-col align-items-center gap-3 mb-3">
					<label class="font-semibold w-9rem">Старый пароль</label>
					<InputText
						class="flex-auto"
						autocomplete="off"
						v-model="passwords.old_password"
					/>
				</div>
				<div class="relative mb-2">
					<label
						for="password"
						class="mb-2 block font-medium"
					>
						Пароль
					</label>

					<Password
						v-model="passwords.new_password"
						class="mb-3 w-full"
						v-bind="passwordAttrs"
						placeholder="Пароль"
						:invalid="!!errors.password"
						weak-label="Слабый пароль"
						medium-label="Средный пароль"
						strong-label="Сильный пароль"
						prompt-label="Пожалуйста, введите пароль"
						toggle-mask
					>
						<template #header>
							<h6>Выберите пароль</h6>
						</template>
						<template #footer>
							<Divider />
							<p class="mt-2">Рекомендации</p>
							<ul
								class="ml-2 mt-0 pl-2"
								style="line-height: 1.5"
							>
								<li :class="password.match(/[a-zа-яё]/) ? 'text-green-500' : 'text-red-500'">
									Как минимум одна строчная буква
								</li>
								<li :class="password.match(/[A-ZА-ЯЁ]/) ? 'text-green-500' : 'text-red-500'">
									Как минимум одна заглавная буква
								</li>
								<li :class="password.match(/\d/) ? 'text-green-500' : 'text-red-500'">
									Как минимум одна цифра
								</li>
								<li :class="password.length >= 8 ? 'text-green-500' : 'text-red-500'">
									Минимум 8 символов
								</li>
							</ul>
						</template>
					</Password>
					<span class="absolute left-1 w-full text-xs text-red-500 -bottom-[6px]">{{ errors.password }}</span>
				</div>

				<div class="flex justify-content-end gap-2">
					<Button
						type="button"
						label="Отменить"
						severity="secondary"
						@click="updatePasswords = false"
					></Button>
					<Button
						type="button"
						label="Сохранить"
						@click="updatePassword"
					></Button>
				</div>
			</Dialog>

			<Dialog
				v-model:visible="deactivateUser"
				modal
				header="Удаление аккаунта"
				:style="{ width: '25rem' }"
			>
				<span class="p-text-secondary block mb-5"
					>После удаления аккаунта вы сможете восстановить его. Пожалуйста подтвердите данное действие</span
				>

				<div class="flex justify-content-end gap-2">
					<Button
						type="button"
						label="Отменить"
						severity="success"
						@click="deactivateUser = false"
					></Button>
					<Button
						type="button"
						label="Удалить"
						severity="danger"
						@click="deleteUser"
					></Button>
				</div>
			</Dialog>
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
				@click="isDisabled = !isDisabled"
				:class="[isDisabled ? 'hidden' : '']"
				class="bg-gray border-gray"
				>Отменить</Button
			>
			<Button
				v-if="isOwnerUser"
				icon="pi pi-cog"
				@click="isOwnerUser ? toggleMenu($event) : () => {}"
			></Button>
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

	<OverlayPanel
		ref="MenuOverlayPanel"
		class="sm-ml-7 ml-0"
		append-to="div"
	>
		<div
			v-if="user"
			class="w-175px"
		>
			<div class="overlay-tab">
				<p
					class="m-0 w-full"
					@click="isDisabled = !isDisabled"
				>
					Изменить данные
				</p>
				<i
					class="pi pi-pen-to-square"
					style="font-size: 1rem"
				/>
			</div>
			<div class="overlay-tab">
				<p
					class="m-0 w-full"
					@click="updatePasswords = !updatePasswords"
				>
					Сменить пароль
				</p>
				<i
					class="pi pi-wrench"
					style="font-size: 1rem"
				/>
			</div>
			<div class="overlay-tab overlay-tab--delete">
				<p
					class="m-0 w-full"
					@click="deactivateUser = !deactivateUser"
				>
					Удалить аккаунт
				</p>
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

.custom-otp-input {
	width: 40px;
	margin-right: 8px;
	font-size: 36px;
	text-align: center;
	background: transparent;
	border: 0 none;
	border-bottom: 2px solid var(--surface-500);
	transition: all 0.2s;
	appearance: none;
}

.custom-otp-input:focus {
	border-bottom-color: var(--primary-color);
	outline: 0 none;
}

.p-password {
	&-input {
		@apply w-full;
	}
}
</style>
