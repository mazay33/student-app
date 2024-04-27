<script setup lang="ts">
  const reestrStore = useReestrStore()
  const { teachers } = storeToRefs(reestrStore)

  await reestrStore.getTeachers()
</script>

<template>
  <Card>
    <template #title> Список пользователей </template>
    <template #content>
      <pre>{{ teachers }}</pre>
    </template>
  </Card>
</template>

<style scoped></style>
