<script setup lang="ts">
const summaryStore = useSummaryStore();
const { mySummaries } = storeToRefs(summaryStore);

await summaryStore.getMySummaries();
</script>

<template>
	<pre>{{ mySummaries }}</pre>
</template>

<style scoped></style>
