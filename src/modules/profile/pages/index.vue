<script setup lang="ts">
  definePageMeta({
    middleware: ['auth-middleware'],
  })
  const authStore = useAuthStore()

  const { user } = storeToRefs(authStore)

  await authStore.getMe()
</script>

<template>
  <Card class="profile-card">
    <template #title> User Information</template>
    <template #content>
      <ProfileInfo v-if="user" />
    </template>
  </Card>
</template>

<style lang="scss">
  .profile-card {
    .p-card-title {
      @apply font-bold text-xl pb-3 text-indigo-500;
    }
  }
</style>
