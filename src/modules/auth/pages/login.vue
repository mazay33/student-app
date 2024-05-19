<script setup lang="ts">
definePageMeta({
	layout: 'auth',
});

const authStore = useAuthStore();

// const { isLoading } = storeToRefs(authStore);

const email = ref<string>('');
const password = ref<string>('');

const login = () => {
	authStore.login(email.value, password.value);
};

const handleKeydown = (e: KeyboardEvent) => {
	if (e.key === 'Enter') {
		login();
	}
};
</script>
<template>
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
				<div class="justify-content-between align-items-center mb-6 flex">
					<a class="ml-2 cursor-pointer text-right text-blue-500 font-medium no-underline">
						Forgot password?
					</a>
				</div>

				<Button
					type="submit"
					label="Sign In"
					icon="pi pi-user"
					class="w-full"
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
</template>

<style scoped></style>
