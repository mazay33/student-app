<script setup lang="ts">
import { processErrors } from '~/helpers';
import useApiService from '~/services/apiService';

definePageMeta({
	layout: 'auth',
});

const toast = useToast();

const apiService = useApiService();

const authStore = useAuthStore();

const codeConfirmDialog = ref(false);

const email = ref<string>('');
const password = ref<string>('');
const id = ref<string>('');
const codeConfirmationValue = ref();

const isLoadingPage = ref(false);

const registration = async () => {
	isLoadingPage.value = true;
	const { data, pending, error } = await apiService.auth.registration(email.value, password.value);

	if (data.value) {
		id.value = data.value.id;
		codeConfirmDialog.value = true;
	}

	if (error.value) {
		toast.add({
			detail: processErrors(error.value.data.detail),
			severity: 'error',
			summary: 'Registration error: ',
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
		authStore.login(email.value, password.value);
	}

	if (error.value) {
		toast.add({
			detail: processErrors(error.value.data.detail),
			severity: 'error',
			summary: 'Registration error: ',
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
			timerValue.value -= timerValue.value;
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
</script>
<template>
	<div>
		<Toast />
		<div class="h-screen flex items-center justify-between overflow-y-hidden">
			<div class="mx-auto w-full p-6 md:w-1/3 md:p-8">
				<div class="mb-5">
					<div class="mb-3 text-3xl font-medium">Welcome to our App</div>
					<span class="mr-2 font-medium">Already have an account?</span
					><nuxtLink
						to="/auth/login"
						class="cursor-pointer text-indigo-500 font-medium no-underline"
					>
						Sign In!
					</nuxtLink>
				</div>
				<div>
					<label
						for="email1"
						class="mb-2 block font-medium"
					>
						Email
					</label>
					<InputText
						id="email1"
						v-model="email"
						type="text"
						placeholder="Email address"
						class="mb-3 w-full"
					/>

					<label
						for="password1"
						class="mb-2 block font-medium"
					>
						Password
					</label>
					<InputText
						id="password1"
						v-model="password"
						type="password"
						placeholder="Password"
						class="mb-3 w-full"
					/>
					<div class="align-items-center justify-content-between mb-6 flex">
						<a class="ml-2 cursor-pointer text-right text-blue-500 font-medium no-underline">
							Forgot password?
						</a>
					</div>

					<Button
						:loading="isLoadingPage"
						type="submit"
						label="Sign Up"
						icon="pi pi-user"
						class="w-full"
						@click="registration()"
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

		<Button
			label="Show"
			@click="codeConfirmDialog = true"
		/>
		<Dialog
			v-model:visible="codeConfirmDialog"
			:closable="false"
			modal
			:style="{ width: '30rem' }"
		>
			<div class="flex flex-col items-center">
				<div class="mb-2 text-xl font-bold">Authenticate Your Account</div>
				<p class="mb-0 block text-coolGray">Please enter the code sent to your email.</p>
				<p
					mb-5
					text-coolGray
				>
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
						label="Resend Code"
						link
						class="p-0"
						@click="resendCode"
					/>
					<div
						v-else
						class="text-gray-500"
					>
						{{ timerValue }} seconds remaining
					</div>
					<Button
						:loading="isLoadingPage"
						label="Submit Code"
						@click="confirmRegistration"
					/>
				</div>
			</div>
		</Dialog>
	</div>
</template>

<style scoped>
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
</style>
