<script setup>
import { useAuthStore } from './modules/auth/stores/auth';

  useHead({
    title: 'Student App',
  })

  const authStore = useAuthStore()

  await authStore.getMe()
</script>

<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<style lang="scss">
  @import 'App.scss';
</style>
