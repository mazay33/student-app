<script setup lang="ts">
import { useForm } from 'vee-validate';
import * as yup from 'yup';
import { processErrors } from '~/helpers';
import useApiService from '~/services/apiService';

definePageMeta({
	layout: 'auth',
});

const toast = useToast();

const apiService = useApiService();

const authStore = useAuthStore();

const codeConfirmDialog = ref(false);

const { errors, defineField } = useForm({
	validationSchema: yup.object({
		email: yup.string().email('Неккоректная почта').required('Поле обязательно для заполнения'),
		password: yup
			.string()
			.required('Поле обязательно для заполнения')
			.min(8, 'Пароль должен быть больше 8 символов')
			.matches(/[a-zа-яё]/, 'Пароль должен содержать хотя бы одну строчную букву')
			.matches(/[A-ZА-ЯЁ]/, 'Пароль должен содержать хотя бы одну заглавную букву')
			.matches(/\d/, 'Пароль должен содержать хотя бы одну цифру'),
	}),
});

const [email, emailAttrs] = defineField('email', {
	validateOnModelUpdate: false,
});
const [password, passwordAttrs] = defineField('password', {
	validateOnModelUpdate: false,
});

const id = ref<string>('');
const codeConfirmationValue = ref();

const isLoadingPage = ref(false);

const registration = async () => {
	isLoadingPage.value = true;
	const { data, pending, error } = await apiService.auth.registration(
		email.value.trim().toLowerCase(),
		password.value,
	);

	if (data.value) {
		id.value = data.value.id;
		codeConfirmDialog.value = true;
	}

	if (error.value) {
		toast.add({
			detail: processErrors(error.value.data.detail),
			severity: 'error',
			summary: 'Ошибка при регистрации: ',
			life: 3000,
		});
	}

	isLoadingPage.value = pending.value;
};

const confirmRegistration = async () => {
	isLoadingPage.value = true;
	const { data, pending, error } = await apiService.auth.confirmRegistration(codeConfirmationValue.value);

	if (data.value) {
		toast.add({
			summary: 'Регистрация прошла успешно',
			severity: 'success',
			life: 3000,
		});
		authStore.login(email.value.trim().toLowerCase(), password.value);
	}

	if (error.value) {
		toast.add({
			detail: processErrors(error.value.data.detail),
			severity: 'error',
			summary: 'Ошибка при регистрации: ',
			life: 3000,
		});
	}
	isLoadingPage.value = pending.value;
};

const timerValue = ref<number>(0);

const startTimer = () => {
	timerValue.value = 60;
	const interval = setInterval(() => {
		if (timerValue.value > 0) {
			timerValue.value -= 1;
		} else {
			clearInterval(interval);
		}
	}, 1000);
};

const resendCode = async () => {
	startTimer();
	isLoadingPage.value = true;
	const { pending } = await apiService.auth.resendCode(id.value, email.value);
	isLoadingPage.value = pending.value;
};

const isSignUpButtonDisabled = computed(() => {
	return !email.value || !password.value || Object.keys(errors.value).length > 0;
});
</script>
<template>
	<div>
		<Toast />
		<div class="h-screen flex items-center justify-between overflow-y-hidden">
			<div class="mx-auto w-full p-6 md:w-1/3 md:p-8">
				<div class="mb-5">
					<div class="mb-3 text-3xl font-medium">Добро пожаловать в наше приложение</div>
					<span class="mr-2 font-medium">Уже есть аккаунт?</span>
					<nuxtLink
						to="/auth/login"
						class="cursor-pointer text-indigo-500 font-medium no-underline"
					>
						Войти!
					</nuxtLink>
				</div>
				<div>
					<div class="relative mb-2">
						<label
							for="email"
							class="mb-2 block font-medium"
						>
							Электронная почта
						</label>
						<InputText
							id="email"
							v-model="email"
							v-bind="emailAttrs"
							type="text"
							placeholder="Адрес электронной почты"
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
						<span class="absolute left-1 w-full text-xs text-red-500 -bottom-[6px]">{{
							errors.password
						}}</span>
					</div>

					<Button
						:loading="isLoadingPage"
						type="submit"
						label="Зарегистрироваться"
						icon="pi pi-user"
						class="mt-4 w-full"
						:disabled="isSignUpButtonDisabled"
						@click="registration()"
					/>
				</div>
			</div>

			<div class="relative hidden h-full w-1/2 md:block">
				<img
					class="absoltue h-full w-full object-cover"
					src="https://blocks.primevue.org/images/blocks/signin/signin.jpg"
					alt=""
				/>
			</div>
		</div>

		<Button
			label="Показать"
			@click="codeConfirmDialog = true"
		/>
		<Dialog
			v-model:visible="codeConfirmDialog"
			:closable="false"
			modal
			:style="{ width: '30rem' }"
		>
			<div class="flex flex-col items-center">
				<div class="mb-2 text-xl font-bold">Подтвердите ваш аккаунт</div>
				<p class="mb-0 block text-coolGray">Пожалуйста, введите код, отправленный на вашу электронную почту.</p>
				<p class="mb-5 text-coolGray">
					{{ email }}
				</p>
				<div class="flex justify-center">
					<InputOtp
						v-model="codeConfirmationValue"
						:length="6"
						integer-only
					>
						<template #default="{ attrs, events }">
							<input
								type="text"
								v-bind="attrs"
								class="custom-otp-input"
								v-on="events"
							/>
						</template>
					</InputOtp>
				</div>
				<div class="mt-10 flex items-center self-stretch justify-between">
					<Button
						v-if="timerValue == 0"
						:loading="isLoadingPage"
						label="Отправить код повторно"
						link
						class="p-0"
						@click="resendCode"
					/>
					<div
						v-else
						class="text-gray-500"
					>
						{{ timerValue }} секунд осталось
					</div>
					<Button
						:loading="isLoadingPage"
						label="Отправить код"
						@click="confirmRegistration"
					/>
				</div>
			</div>
		</Dialog>
	</div>
</template>

<style lang="scss">
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
