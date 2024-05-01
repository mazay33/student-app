<script setup lang="ts">
  const summaryStore = useSummaryStore()
  const { summary } = storeToRefs(summaryStore)
  const route = useRoute()
  const id = route.params.id
  await summaryStore.getSummaryById(String(id))
</script>

<template>
  <pre>{{ summary }}</pre>
</template>

<style scoped></style>
