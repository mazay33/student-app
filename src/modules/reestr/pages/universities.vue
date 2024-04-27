<script setup lang="ts">
  const reestrStore = useReestrStore()
  const { universities, isLoading } = storeToRefs(reestrStore)

  const filter = ref({
    page: 1,
    page_size: 4,
  })

  const search = ref('')

  await reestrStore.getUniversities(filter.value, search.value)

  const debounceSearchUniversities = useDebounceFn(async () => {
    await reestrStore.getUniversities(filter.value, search.value)
  }, 800)

  watch(
    () => search.value,
    async () => {
      await debounceSearchUniversities()
    }
  )

  watch(
    () => filter.value,
    async () => {
      await reestrStore.getUniversities(filter.value, search.value)
    },
    { deep: true }
  )
</script>

<template>
  <Card>
    <template #title> Список университетов </template>
    <template #content>
      <DataTable
        :loading="isLoading"
        showGridlines
        :value="universities?.result"
      >
        <template #header>
          <div>
            <IconField iconPosition="left">
              <InputIcon>
                <i class="pi pi-search" />
              </InputIcon>
              <InputText v-model="search" placeholder="Поиск университета" />
            </IconField>
          </div>
        </template>
        <Column class="text-center" header="№" style="width: 2%">
          <template #body="slotProps">
            {{ slotProps.index + 1 }}
          </template>
        </Column>
        <Column field="name" header="Название" style="width: 95%"></Column>
      </DataTable>
    </template>

    <template #footer>
      <Paginator
        :rows="filter.page_size"
        :total-records="universities?.count"
        :rowsPerPageOptions="[1, 2, 3, 4]"
        @update:rows="filter.page_size = $event"
        @page="filter.page = $event.page + 1"
      >
      </Paginator>
    </template>
  </Card>
</template>

<style scoped></style>
