<script setup lang="ts">
const summaryStore = useSummaryStore();
const { mySummary } = storeToRefs(summaryStore);
const route = useRoute();
const id = route.params.id;
await summaryStore.getMySummaryById(String(id));
</script>

<template>
	<pre>{{ mySummary }}</pre>
</template>

<style scoped></style>
