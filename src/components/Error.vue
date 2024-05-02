<template>
  <div v-if="error" class="error-container">
    <h3>Oh no, something went wrong!</h3>
    <span class="error-message"
      ><code>{{ errorMessage }}</code></span
    >
  </div>
</template>

<script setup lang="ts">
  import { ref, watchEffect } from 'vue'

  const props = defineProps({
    error: Object as PropType<null>,
    customMessage: String,
  })

  const errorMessage = ref('')

  watchEffect(() => {
    if (props.error) {
      errorMessage.value =
        props.customMessage ||
        (props.error as string) ||
        'An unknown error occurred'
    }
  })
</script>

<style scoped>
  .error-container {
    padding: 10px;
    background-color: #ffdddd;
    border-left: 6px solid #f44336;
    margin-bottom: 15px;
  }
</style>
