<script setup>
  useHead({
    title: 'Student App',
  })

  const authStore = useAuthStore()

  await authStore.getMe()
</script>

<template>
  <NuxtLoadingIndicator />
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<style lang="scss">
  @import 'App.scss';
</style>
