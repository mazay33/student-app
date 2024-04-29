<script setup lang="ts">
  import QueryBuilder from '~/utils/QueryBuilder'

  const reestrStore = useReestrStore()
  const { universities, isLoading } = storeToRefs(reestrStore)

  const filter = ref<{ [key: string]: any }>({
    page: 1,
    page_size: 25,
    sort_by: '',
    sort_type: 'asc',
  })

  const searchFilter = ref({
    name: '',
  })

  const filterUrl = computed(() => {
    return new QueryBuilder()
      .setPage(filter.value.page)
      .setPageSize(filter.value.page_size)
      .setSortBy(filter.value.sort_by)
      .setSortType(filter.value.sort_type)
      .setFilter('name', searchFilter.value.name)
      .buildUrl()
  })

  const debounceFetch = useDebounceFn(async () => {
    await reestrStore.getUniversities(filterUrl.value)
  }, 500)

  await reestrStore.getUniversities(filterUrl.value)

  watch(
    () => filter.value,
    async () => {
      await reestrStore.getUniversities(filterUrl.value)
    },
    { deep: true, immediate: true }
  )

  watch(
    () => searchFilter.value,
    async () => {
      await debounceFetch()
    },
    { deep: true, immediate: true }
  )
</script>

<template>
  <Card>
    <template #title> Список университетов </template>
    <template #content>
      <DataTable
        scrollHeight="60vh"
        scrollable
        :loading="isLoading"
        showGridlines
        :value="universities?.result"
        removableSort
        @sort="() => {}"
        lazy
        @update:sortField="filter.sort_by = $event"
        @update:sortOrder="filter.sort_type = $event === 1 ? 'asc' : 'desc'"
      >
        <template #header>
          <div>
            <IconField iconPosition="left">
              <InputIcon>
                <i class="pi pi-search" />
              </InputIcon>
              <InputText
                v-model="searchFilter.name"
                placeholder="Поиск университета"
              />
            </IconField>
          </div>
        </template>
        <Column class="text-center" header="№" style="width: 2%">
          <template #body="slotProps">
            {{ slotProps.index + 1 }}
          </template>
        </Column>
        <Column sortable field="name" header="Название" style="width: 95%">
          <template #body="slotProps">
            {{ slotProps.data.short_name }} - {{ slotProps.data.name }}
          </template>
        </Column>
      </DataTable>
    </template>

    <template #footer>
      <Paginator
        :rows="filter.page_size"
        :total-records="universities?.count"
        :rowsPerPageOptions="[10, 25, 50, 100]"
        @update:rows="filter.page_size = $event"
        @page="filter.page = $event.page + 1"
      >
      </Paginator>
    </template>
  </Card>
</template>

<style scoped></style>
