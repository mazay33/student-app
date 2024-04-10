<script setup lang="ts">
  definePageMeta({
    middleware: 'auth-middleware',
  })
  const authStore = useAuthStore()

  await authStore.getMe()

  const { user }: any = storeToRefs(authStore)

  const avatarOverlayPanel = ref()

  const toggle = (event: any) => {
    avatarOverlayPanel.value.toggle(event)
  }
</script>

<template>
  <Card>
    <template #title>User Information</template>
    <template #content>
      <div class="flex items-center gap-10">
        <div @click="toggle">
          <Image
            imageClass="rounded-full object-cover"
            src="https://yastatic.net/naydex/yandex-search/VnVd89o05/590de6B2Ju/V5lSy4p0LM--7_jGj5We9aM7dZF4gxj5mNmRhdtagTcJn1cvPyCyGnypN04Uc9GgA_W6mZZd0pPiIn3S5051bRiZFofJNTeU46vjiMOSl_G8cGjZeMQEq5POioKAS4xhVZ5WEwEAl24R1gRiYV7-v1Kv7M6NRZWDiE0"
            width="150"
            height="150"
          />
        </div>

        <div>
          <p>Email: {{ user.email }}</p>

          <p>Nickname: {{ user.nickname }}</p>

          <p>Description: {{ user.description }}</p>

          <p>Created At: {{ user.created_at }}</p>
        </div>
      </div>

      <OverlayPanel
        class="user-information-panel"
        ref="avatarOverlayPanel"
        appendTo="div"
      >
        <div class="w-150px">
          <div class="flex items-center justify-between p-1 py-2">
            <p class="m-0 w-110px">Открыть фото</p>
            <i class="pi pi-user" style="font-size: 1rem"></i>
          </div>
          <div
            class="flex items-center justify-between p-1 py-2 border-t border-b border-l-none border-r-none border-solid border-gray-300"
          >
            <p class="m-0 w-110px">Изменить фото</p>
            <i class="pi pi-pencil" style="font-size: 1rem"></i>
          </div>
          <div class="flex items-center justify-between p-1 py-2 text-red">
            <p class="m-0 w-110px">Удалить фото</p>
            <i class="pi pi-trash" style="font-size: 1rem"></i>
          </div>
        </div>
      </OverlayPanel>
    </template>
  </Card>
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
