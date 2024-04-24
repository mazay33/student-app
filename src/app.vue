<script setup>
import { useAuthStore } from './modules/auth/stores/auth';

  useHead({
    title: 'Student App',
  })

  const authStore = useAuthStore()

  const { getMe } = authStore

  onBeforeMount(async () => {
    await getMe()
  })
</script>

<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<style lang="scss">
  @import 'App.scss';
</style>
