<script setup lang="ts">
  const reestrStore = useReestrStore()
  const { universities } = storeToRefs(reestrStore)

  await reestrStore.getUniversities()
</script>

<template>
  <Card>
    <template #title> Список университетов </template>
    <template #content>
      <pre>{{ universities }}</pre>
    </template>
  </Card>
</template>

<style scoped></style>
