html
<script setup lang="ts">
import { useForm } from 'vee-validate';
import * as yup from 'yup';
import useApiService from '~/services/apiService';

const apiService = useApiService();

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

const isForgot = ref(false);
const forgotEmail = ref('');

const resetPassword = async () => {
	const { data } = await apiService.auth.resetPassword(forgotEmail.value);

	if (data.value) {
		toast.add({
			severity: 'success',
			summary: 'Пароль успешно сброшен',
			life: 3000,
		});
		isForgot.value = false;
	} else {
		toast.add({
			severity: 'error',
			summary: 'Произошла ошибка',
			life: 3000,
		});
	}
};

const timer = ref<number>(0);

const startTimer = () => {
	timer.value = 60;
	const interval = setInterval(() => {
		if (timer.value > 0) {
			timer.value -= 1;
		} else {
			clearInterval(interval);
		}
	}, 1000);
};

const submiteForgotCode = ref(false);

const isActivate = ref(false);
const activateEmail = ref('');

const activateUser = async () => {
	const { data } = await apiService.auth.activateUser(activateEmail.value);
	if (data.value) {
		toast.add({
			severity: 'success',
			summary: 'Код для восстановления отправлен',
			life: 3500,
		});
		isActivate.value = false;
		submiteForgotCode.value = true;
		startTimer();
	} else {
		toast.add({
			severity: 'error',
			summary: 'Произошла ошибка',
			life: 3000,
		});
	}
};

const code = ref('');

const confirmUser = async () => {
	const { data } = await apiService.auth.confirmUser(code.value);

	if (data.value) {
		toast.add({
			severity: 'success',
			summary: 'Аккаунт успешно восстановлен',
			life: 3500,
		});
		submiteForgotCode.value = !submiteForgotCode.value;
	} else {
		toast.add({
			severity: 'error',
			summary: 'Введён неверный код',
			life: 3500,
		});
	}
};
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

					<div class="my-4 flex flex-col sm-flex-row">
						<a
							class="mb-5 flex-1 cursor-pointer text-blue-500 font-medium no-underline sm-mb-0"
							@click="isForgot = !isForgot"
						>
							Забыли пароль?
						</a>

						<Dialog
							v-model:visible="isForgot"
							modal
							header="Сброс пароля"
							:style="{ width: '27rem' }"
						>
							<span class="p-text-secondary mb-5 block"
								>После сброса пароля на ваш email придёт письмо с инструкцией</span
							>

							<div class="align-items-center mb-5 flex gap-3">
								<label
									for="email"
									class="mt-2 w-6rem font-semibold"
									>Ваш Email</label
								>
								<InputText
									v-model="forgotEmail"
									class="flex-auto"
								/>
							</div>
							<div class="justify-content-end flex gap-2">
								<Button
									type="button"
									label="Закрыть"
									severity="secondary"
									@click="isForgot = false"
								></Button>
								<Button
									type="button"
									label="Сбросить пароль"
									@click="resetPassword"
								></Button>
							</div>
						</Dialog>
						<a
							class="cursor-pointer text-blue-500 font-medium no-underline"
							@click="isActivate = !isActivate"
							>Восстановить аккаунт</a
						>
						<Dialog
							v-model:visible="isActivate"
							modal
							header="Активация аккаунта"
							:style="{ width: '27rem' }"
						>
							<span class="p-text-secondary mb-5 block"
								>Для восстановления аккаунта пожалуйста укажите Email, туда придёт письмо с
								инструкцией</span
							>

							<div class="align-items-center mb-5 flex gap-3">
								<label class="mt-2 w-4rem font-semibold">Email</label>
								<InputText
									v-model="activateEmail"
									class="flex-auto"
								/>
							</div>

							<div class="justify-content-end flex gap-2">
								<Button
									type="button"
									label="Закрыть"
									severity="secondary"
									@click="isActivate = false"
								></Button>
								<Button
									type="button"
									label="Отправить код"
									@click="activateUser"
								></Button>
							</div>
						</Dialog>
						<Dialog
							v-model:visible="submiteForgotCode"
							modal
							:closable="false"
							class="w-28rem"
						>
							<div class="justify-content-center flex">
								<div class="align-items-center flex flex-col">
									<div class="mb-2 text-center text-xl font-bold">Подтверждение аккаунта</div>
									<p class="text-color-secondary mb-3 text-center text-coolGray">
										Пожалуйста, введите код, отправленный на вашу электронную почту.
									</p>
									<p class="mb-5 text-center text-coolGray">{{ email }}</p>
									<InputOtp
										v-model="code"
										:length="6"
										class="justify-center"
									/>
									<div class="mt-7 flex">
										<Button
											v-if="timer == 0"
											label="Отправить код еще раз"
											link
											@click="activateUser()"
										></Button>
										<div
											v-else
											class="mt-2 flex-1 text-gray-500"
										>
											{{ timer }} Секунд осталось
										</div>
										<Button
											label="Подтвердить код"
											@click="confirmUser()"
										></Button>
									</div>
								</div>
							</div>
						</Dialog>
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

<style scoped>
.custom-otp-input {
	width: 48px;
	height: 48px;
	font-size: 24px;
	appearance: none;
	text-align: center;
	transition: all 0.2s;
	border-radius: 0;
	border: 1px solid var(--surface-400);
	background: transparent;
	outline-offset: -2px;
	outline-color: transparent;
	border-right: 0 none;
	transition: outline-color 0.3s;
	color: var(--text-color);
}

.custom-otp-input:focus {
	outline: 2px solid var(--primary-color);
}

.custom-otp-input:first-child,
.custom-otp-input:nth-child(5) {
	border-top-left-radius: 12px;
	border-bottom-left-radius: 12px;
}

.custom-otp-input:nth-child(3),
.custom-otp-input:last-child {
	border-top-right-radius: 12px;
	border-bottom-right-radius: 12px;
	border-right-width: 1px;
	border-right-style: solid;
	border-color: var(--surface-400);
}
</style>
