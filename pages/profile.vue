<script setup lang="ts">
  definePageMeta({
    middleware: 'auth-middleware',
  })
  const authStore = useAuthStore()

  const { user } = storeToRefs(authStore)
</script>

<template>
  <div>
    <p>{{ user }}</p>
  </div>
</template>

<style scoped></style>
