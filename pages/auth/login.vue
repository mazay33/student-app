<script setup lang="ts">
  definePageMeta({
    layout: 'auth',
  })

  const authStore = useAuthStore()

  const { isLoading } = storeToRefs(authStore)

  const email = ref<string>('')
  const password = ref<string>('')

  const login = () => {
    authStore.login(email.value, password.value)
  }
</script>
<template>
  <div class="flex justify-between items-center h-screen overflow-y-hidden">
    <div class="w-full mx-auto md:w-1/3 p-6 md:p-8">
      <div class="mb-5">
        <div class="text-3xl font-medium mb-3">Welcome Back</div>
        <span class="font-medium mr-2">Already have an account?</span
        ><nuxtLink to="/auth/registration" class="font-medium no-underline text-indigo-500 cursor-pointer"
          >Create today!</nuxtLink
        >
      </div>
      <div>
        <label for="email1" class="block font-medium mb-2">Email</label>
        <InputText
          v-model="email"
          id="email1"
          type="text"
          placeholder="Email address"
          class="w-full mb-3"
        />

        <label for="password1" class="block font-medium mb-2">Password</label>
        <InputText
          v-model="password"
          id="password1"
          type="password"
          placeholder="Password"
          class="w-full mb-3"
        />
        <div class="flex align-items-center justify-content-between mb-6">
          <a
            class="font-medium no-underline ml-2 text-blue-500 text-right cursor-pointer"
            >Forgot password?</a
          >
        </div>

        <Button
          @click="login()"
          :loading="isLoading"
          type="submit"
          label="Sign In"
          icon="pi pi-user"
          class="w-full"
        ></Button>
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
</template>

<style scoped></style>
