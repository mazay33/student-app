<script setup lang="ts"></script>

<template>
  <div>
    <NuxtErrorBoundary>
      <Card>
        <template #title> Список пользователей</template>
        <template #content>
          <ReestrUsersTable />
        </template>
      </Card>

      <template #error="{ error, clearError }">
        <Error :error="error" />
        <Button @click="clearError">Try to reset</Button>
      </template>
    </NuxtErrorBoundary>
  </div>
</template>

<style scoped></style>
