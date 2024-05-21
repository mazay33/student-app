html
<script setup lang="ts">
import { useForm } from 'vee-validate';
import * as yup from 'yup';
definePageMeta({
	layout: 'auth',
});

const authStore = useAuthStore();
const toast = useToast();

const { errors, defineField } = useForm({
	validationSchema: yup.object({
		email: yup.string().required('Поле обязательно для заполнения'),
		password: yup.string().required('Поле обязательно для заполнения'),
	}),
});

const [email, emailAttrs] = defineField('email', {
	validateOnModelUpdate: false,
});
const [password, passwordAttrs] = defineField('password');

const isLoading = ref(false);
const login = async () => {
	isLoading.value = true;
	await authStore.login(email.value.trim().toLowerCase(), password.value);

	if (authStore.loginErrorMessage) {
		toast.add({
			severity: 'error',
			detail: authStore.loginErrorMessage,
			summary: 'Ошибка входа: ',
			life: 3000,
		});
	}
	isLoading.value = false;
};

const handleKeydown = (e: KeyboardEvent) => {
	if (e.key === 'Enter') {
		login();
	}
};

const isSignInButtonDisabled = computed(() => {
	return !email.value || !password.value || Object.keys(errors.value).length > 0;
});
</script>
<template>
	<div>
		<Toast />

		<div class="h-screen flex items-center justify-between overflow-y-hidden">
			<div class="mx-auto w-full p-6 md:w-1/3 md:p-8">
				<div class="mb-5">
					<div class="mb-3 text-3xl font-medium">Войти в приложение</div>
					<span class="mr-2 font-medium">Еще нет аккаунта?</span>
					<nuxtLink
						to="/auth/registration"
						class="cursor-pointer text-indigo-500 font-medium no-underline"
					>
						Создайте сегодня!
					</nuxtLink>
				</div>
				<div @keydown="handleKeydown">
					<div class="relative mb-2">
						<label
							for="email"
							class="mb-2 block font-medium"
						>
							Логин
						</label>
						<InputText
							id="email"
							v-model="email"
							v-bind="emailAttrs"
							type="text"
							placeholder="Электронная почта / Никнейм"
							class="mb-3 w-full"
							:invalid="!!errors.email"
						/>
						<span class="absolute left-1 w-full text-xs text-red-500 -bottom-[6px]">{{
							errors.email
						}}</span>
					</div>

					<div class="relative mb-2">
						<label
							for="password"
							class="mb-2 block font-medium"
						>
							Пароль
						</label>
						<Password
							v-model="password"
							class="mb-3 w-full"
							v-bind="passwordAttrs"
							placeholder="Пароль"
							:invalid="!!errors.password"
							toggle-mask
							:feedback="false"
						>
						</Password>
						<span class="absolute left-1 w-full text-xs text-red-500 -bottom-[6px]">{{
							errors.password
						}}</span>
					</div>

					<div class="my-4">
						<a class="ml-2 cursor-pointer text-right text-blue-500 font-medium no-underline">
							Забыли пароль?
						</a>
					</div>

					<Button
						type="submit"
						label="Войти"
						icon="pi pi-user"
						class="w-full"
						:loading="isLoading"
						:disabled="isSignInButtonDisabled"
						@click="login()"
					/>
				</div>
			</div>

			<div class="relative h-full w-1/2">
				<img
					class="absoltue h-full w-full object-cover"
					src="https://blocks.primevue.org/images/blocks/signin/signin.jpg"
					alt=""
				/>
			</div>
		</div>
	</div>
</template>

<style scoped></style>
