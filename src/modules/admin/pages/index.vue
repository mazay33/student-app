<script setup lang="ts">
  definePageMeta({
    middleware: ['admin-middleware', 'auth-middleware'],
  })

  const authStore = useAuthStore()

  const { user } = storeToRefs(authStore)
</script>

<template>
  <div>
    <h1>only for admin</h1>

    <h2>hello {{ user?.nickname }}</h2>
  </div>
</template>

<style scoped></style>
