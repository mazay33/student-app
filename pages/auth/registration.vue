<script setup lang="ts">
  import httpService from '~/services/httpService'

  definePageMeta({
    layout: 'auth',
  })

  const authStore = useAuthStore()

  const codeConfirmDialog = ref(false)

  const { isLoading } = storeToRefs(authStore)

  const email = ref<string>('')
  const password = ref<string>('')
  const codeConfirmationValue = ref(null)

  const registration = async () => {
    const { data } = await httpService.post<any, any>(
      'public/users/registration',
      {
        email: email.value,
        password: password.value,
      }
    )

    if (data.value) {
      codeConfirmDialog.value = true
    }
  }

  const confirmRegistration = async () => {
    const { data } = await httpService.patch<any, any>(
      'public/users/registration/confirm',
      {
        code: codeConfirmationValue.value,
      }
    )

    if (data.value) {
      authStore.login(email.value, password.value)
    }
  }
</script>
<template>
  <div class="flex justify-between items-center h-screen overflow-y-hidden">
    <div class="w-full mx-auto md:w-1/3 p-6 md:p-8">
      <div class="mb-5">
        <div class="text-3xl font-medium mb-3">Welcome to our App</div>
        <span class="font-medium mr-2">Already have an account?</span
        ><nuxtLink
          to="/auth/login"
          class="font-medium no-underline text-indigo-500 cursor-pointer"
          >Sign In!</nuxtLink
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
          @click="registration()"
          :loading="isLoading"
          type="submit"
          label="Sign Up"
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

  <Button label="Show" @click="codeConfirmDialog = true" />
  <Dialog
    :closable="false"
    v-model:visible="codeConfirmDialog"
    modal
    :style="{ width: '30rem' }"
  >
    <div class="flex flex-col items-center">
      <div class="font-bold text-xl mb-2">Authenticate Your Account</div>
      <p class="text-color-secondary block mb-5">
        Please enter the code sent to your phone.
      </p>
      <div class="flex justify-center">
        <InputOtp :length="6" v-model="codeConfirmationValue" integerOnly>
          <template #default="{ attrs, events }">
            <input
              type="text"
              v-bind="attrs"
              v-on="events"
              class="custom-otp-input"
            />
          </template>
        </InputOtp>
      </div>
      <div class="flex justify-between mt-10 self-stretch">
        <Button label="Resend Code" link class="p-0"></Button>
        <Button @click="confirmRegistration" label="Submit Code"></Button>
      </div>
    </div>
  </Dialog>
</template>

<style scoped>
  .custom-otp-input {
    width: 40px;
    font-size: 36px;
    border: 0 none;
    appearance: none;
    text-align: center;
    transition: all 0.2s;
    background: transparent;
    border-bottom: 2px solid var(--surface-500);
    margin-right: 8px;
  }

  .custom-otp-input:focus {
    outline: 0 none;
    border-bottom-color: var(--primary-color);
  }
</style>
