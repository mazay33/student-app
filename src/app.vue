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
  .page-enter-active,
  .page-leave-active {
    transition: all 0.2s;
  }
  .page-enter-from,
  .page-leave-to {
    opacity: 0;
    filter: blur(0.5rem);
  }
</style>
