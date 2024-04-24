<script setup>
  import httpService from '~/services/httpService'

  const toast = useToast()

  const authStore = useAuthStore()
  const { user } = storeToRefs(authStore)

  const isDisabled = ref(true)

  const submitInfo = async () => {
    try {
      const { data } = await httpService.patch('private/users/update', {
        nickname: user.value.nickname,
        description: user.value.description,
      })

      if (data) {
        authStore.getMe()
        isDisabled.value = true
        toast.add({
          severity: 'success',
          summary: 'Данные успешно обновлены',
          detail: `Username:${user.value.nickname}\nDescription: ${user.value.description}`,
          life: 3000,
        })
      }
    } catch (error) {
      console.error('error', error)
    }
  }
</script>

<template>
  <Toast />
  <div class="flex items-center gap-5 relative">
    <div class="flex flex-col w-100 text-center mt--10">
      <div class="w-5/10 text-black">
        <InputText
          type="text"
          v-model="user.nickname"
          :disabled="isDisabled"
          class="w-50 shadow-none text-black bg-white text-center font-bold mt--5 border-1"
          :class="[isDisabled ? 'border-white' : 'border-blue']"
        />
      </div>
      <div class="w-5/10">
        <img
          class="rounded-full mt-5 w-150px h-150px"
          src="https://pinia.vuejs.org/logo.svg"
        />
      </div>
    </div>

    <div class="ml--40">
      <div class="flex">
        <div class="flex flex-col gap-2 flex flex-col">
          <label>Email</label>
          <div class="bg-slate-200 rounded w-60 h-10">
            <p class="pt-2 pl-3">{{ user.email }}</p>
          </div>
        </div>
      </div>
      <div class="flex mt-6">
        <div class="flex flex-col gap-2 flex flex-col">
          <label>Created at</label>
          <div class="bg-slate-200 rounded w-60 h-10">
            <p class="pt-2 pl-3">{{ user.created_at }}</p>
          </div>
        </div>
      </div>
      <div class="flex mt-6">
        <div class="flex flex-col gap-2 flex flex-col mb-5">
          <label for="username">Description</label>
          <InputText
            type="text"
            v-model="user.description"
            class="placeholder:text-slate-700 shadow-none border-1 h-10"
            :class="[isDisabled ? 'border-white' : 'border-blue']"
            placeholder="Some info about..."
            :disabled="isDisabled"
          />
        </div>
      </div>
    </div>

    <div class="absolute right-0 mt-50 mr-5">
      <Button
        id="disnone"
        label="обновить данные"
        :class="[isDisabled ? 'hidden' : '']"
        @click="submitInfo"
        class="bg-white text-indigo-500 hover:bg-indigo-100"
      ></Button>
      <Button
        id="change_button"
        label="Изменить"
        @click="isDisabled = !isDisabled"
        class="ml-10"
      ></Button>
    </div>
  </div>
</template>

<style></style>
