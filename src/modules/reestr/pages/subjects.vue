<script setup lang="ts">
  const reestrStore = useReestrStore()
  const { subjects } = storeToRefs(reestrStore)

  await reestrStore.getSubjects()
</script>

<template>
  <Card>
    <template #title> Список предметов </template>
    <template #content>
      <pre>{{ subjects }}</pre>
    </template>
  </Card>
</template>

<style scoped></style>
