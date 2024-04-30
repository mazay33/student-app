<script setup lang="ts">
  const reestrStore = useReestrStore()
  const { subjects } = storeToRefs(reestrStore)

  await reestrStore.getSubjects()
</script>

<template>
  <Card>
    <template #title> Список предметов</template>
    <template #content>
      <DataTable :value="subjects?.result">
        <Column field="id" header="№" style="width: 20%"></Column>
        <Column field="name" header="Название" style="width: 80%"></Column>
      </DataTable>
    </template>
  </Card>
</template>

<style scoped></style>
