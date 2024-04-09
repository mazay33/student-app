<script setup lang="ts">
  definePageMeta({
    middleware: 'auth-middleware',
  })
  const authStore = useAuthStore()

  await authStore.getMe()

  const { user } = storeToRefs(authStore)
</script>

<template>
  <div>
    <pre>{{ user }}</pre>
  </div>
</template>

<style scoped></style>
