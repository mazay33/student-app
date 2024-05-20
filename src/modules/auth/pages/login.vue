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
		email: yup.string().email().required(),
		password: yup.string().required(),
	}),
});

const [email, emailAttrs] = defineField('email', {
	validateOnModelUpdate: false,
});
const [password, passwordAttrs] = defineField('password');

const login = async () => {
	await authStore.login(email.value, password.value);

	if (authStore.loginErrorMessage) {
		toast.add({
			severity: 'error',
			detail: authStore.loginErrorMessage,
			summary: 'Login error: ',
			life: 3000,
		});
	}
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
					<div class="mb-3 text-3xl font-medium">Welcome Back</div>
					<span class="mr-2 font-medium">Already have an account?</span
					><nuxtLink
						to="/auth/registration"
						class="cursor-pointer text-indigo-500 font-medium no-underline"
					>
						Create today!
					</nuxtLink>
				</div>
				<div @keydown="handleKeydown">
					<div class="relative mb-2">
						<label
							for="email"
							class="mb-2 block font-medium"
						>
							Email
						</label>
						<InputText
							id="email"
							v-model="email"
							v-bind="emailAttrs"
							type="text"
							placeholder="Email address"
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
							Password
						</label>
						<InputText
							id="password"
							v-model="password"
							type="password"
							placeholder="Password"
							class="mb-3 w-full"
							v-bind="passwordAttrs"
							:invalid="!!errors.password"
						/>
						<span class="absolute left-1 w-full text-xs text-red-500 -bottom-[6px]">{{
							errors.password
						}}</span>
					</div>

					<div class="my-4">
						<a class="ml-2 cursor-pointer text-right text-blue-500 font-medium no-underline">
							Forgot password?
						</a>
					</div>

					<Button
						type="submit"
						label="Sign In"
						icon="pi pi-user"
						class="w-full"
						:loading="authStore.isLoading"
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
