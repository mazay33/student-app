<script setup lang="ts">
import useApiService from '~/services/apiService';

definePageMeta({
	layout: 'auth',
});

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
	const { data, pending } = await apiService.auth.registration(email.value, password.value);

	if (data.value) {
		id.value = data.value.id;
		codeConfirmDialog.value = true;
	}

	isLoadingPage.value = pending.value;
};

const confirmRegistration = async () => {
	isLoadingPage.value = true;
	const { data, pending } = await apiService.auth.confirmRegistration(codeConfirmationValue.value);

	if (data.value) {
		authStore.login(email.value, password.value);
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
		<div class="flex justify-between items-center h-screen overflow-y-hidden">
			<div class="w-full mx-auto md:w-1/3 p-6 md:p-8">
				<div class="mb-5">
					<div class="text-3xl font-medium mb-3">Welcome to our App</div>
					<span class="font-medium mr-2">Already have an account?</span
					><nuxtLink
						to="/auth/login"
						class="font-medium no-underline text-indigo-500 cursor-pointer"
					>
						Sign In!
					</nuxtLink>
				</div>
				<div>
					<label
						for="email1"
						class="block font-medium mb-2"
					>
						Email
					</label>
					<InputText
						id="email1"
						v-model="email"
						type="text"
						placeholder="Email address"
						class="w-full mb-3"
					/>

					<label
						for="password1"
						class="block font-medium mb-2"
					>
						Password
					</label>
					<InputText
						id="password1"
						v-model="password"
						type="password"
						placeholder="Password"
						class="w-full mb-3"
					/>
					<div class="flex align-items-center justify-content-between mb-6">
						<a class="font-medium no-underline ml-2 text-blue-500 text-right cursor-pointer">
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

			<div class="relative w-1/2 h-full">
				<img
					class="absoltue w-full h-full object-cover"
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
				<div class="font-bold text-xl mb-2">Authenticate Your Account</div>
				<p class="text-coolGray block mb-0">Please enter the code sent to your email.</p>
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
				<div class="flex justify-between items-center mt-10 self-stretch">
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
