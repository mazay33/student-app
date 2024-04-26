<script setup lang="ts">
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
          // detail: `Username:${user.value.nickname}\nDescription: ${user.value.description}`,
          life: 3000,
        })
      }
    } catch (error) {
      console.error('error', error)
    }
  }

  const openFileDialog = () => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = 'image/*'
    input.multiple = false
    input.style.display = 'none'
    input.addEventListener('change', (event) => {
      const target = event.target as HTMLInputElement
      if (!target.files) return

      uploadImage(event)
    })
    document.body.appendChild(input)
    input.click()
    document.body.removeChild(input)
  }

  const uploadImage = async (event) => {
    try {
      const formData = new FormData()
      formData.append('file', event.target.files[0])

      const { data } = await httpService.patch('private/users/image', formData)

      if (data.value) {
        await authStore.getMe()
        toast.add({
          severity: 'success',
          summary: 'Изображение успешно обновлено',
          life: 3000,
        })
      }
    } catch (error) {
      console.error('error', error)
    }
  }

  const avatarOverlayPanel = ref()

  const toggle = (event: any) => {
    avatarOverlayPanel.value.toggle(event)
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
          @click="toggle"
          class="rounded-full mt-5 w-150px h-150px cursor-pointer"
          :src="
            user.image_url
              ? `${user.image_url.replace('localhost', 'la-parole.ru/api')}`
              : 'https://pinia.vuejs.org/logo.svg'
          "
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
  <OverlayPanel
    class="user-information-panel"
    ref="avatarOverlayPanel"
    appendTo="div"
  >
    <div class="w-150px">
      <div
        @click="openFileDialog"
        v-if="!user.image_url"
        class="flex cursor-pointer items-center justify-between p-1 py-2 border-t-none border-b border-l-none border-r-none border-solid border-gray-300 hover:text-indigo-500 duration-200"
      >
        <p class="m-0 w-110px">Загрузить фото</p>
        <i class="pi pi-upload" style="font-size: 1rem"></i>
      </div>
      <div
        @click="openFileDialog"
        v-else
        class="flex cursor-pointer items-center justify-between p-1 py-2 border-t-none border-b border-l-none border-r-none border-solid border-gray-300 hover:text-indigo-500 duration-200"
      >
        <p class="m-0 w-110px">Изменить фото</p>
        <i class="pi pi-pencil" style="font-size: 1rem"></i>
      </div>
      <div
        class="flex items-center justify-between p-1 py-2 text-red hover:text-red-700 duration-200 cursor-pointer"
      >
        <p class="m-0 w-110px">Удалить фото</p>
        <i class="pi pi-trash" style="font-size: 1rem"></i>
      </div>
    </div>
  </OverlayPanel>
</template>

<style lang="scss">
  .user-information-panel {
    display: flex;
    justify-content: center;
    width: 170px;
    &:before {
      margin-left: 45px;
    }
    &:after {
      margin-left: 47px;
    }
  }
</style>
