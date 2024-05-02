<script setup lang="ts">
  import { Repository } from '~/repositories/Repository.module'

  const { subjectRepo } = Repository

  const { data: subjects, pending, error } = await subjectRepo.getSubjectList()

  if (error.value) {
    throw new Error(error.value.message)
  }
</script>

<template>
  <DataTable :loading="pending" :value="subjects?.result">
    <Column field="id" header="№" style="width: 20%"></Column>
    <Column field="name" header="Название" style="width: 80%"></Column>
  </DataTable>
</template>

<style scoped></style>
