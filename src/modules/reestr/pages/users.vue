<script setup lang="ts">
  import QueryBuilder from '~/utils/QueryBuilder'

  const reestrStore = useReestrStore()
  const { isLoading, users } = storeToRefs(reestrStore)

  const filter = ref<{ [key: string]: any }>({
    page: 1,
    page_size: 25,
    nickname: '',
  })

  const filterUrl = computed(() => {
    return new QueryBuilder()
      .setPage(filter.value.page)
      .setPageSize(filter.value.page_size)
      .setFilter('nickname', filter.value.nickname, true)
  })

  const debounceFetch = useDebounceFn(async () => {
    await reestrStore.getUsers(filterUrl.value.buildUrl())
  }, 500)
  
  await reestrStore.getUsers(filterUrl.value.buildUrl())

  watch(
    () => filter.value,
    async () => {

      for (let i = 0; i < filterUrl.value.getDebounceFilters().length; i++) {
        if (!filter.value[filterUrl.value.getDebounceFilters()[i]]) {
          await reestrStore.getUsers(filterUrl.value.buildUrl())
        } else {
          debounceFetch()
        }
      }
    },
    { deep: true }
  )
</script>

<template>
  <Card>
    <template #title> Список пользователей</template>
    <template #content>
      <DataTable
        scrollHeight="60vh"
        scrollable
        :loading="isLoading"
        showGridlines
        :value="users?.result"
      >

      <template #header>
          <div>
            <IconField iconPosition="left">
              <InputIcon>
                <i class="pi pi-search" />
              </InputIcon>
              <InputText
                v-model="filter.nickname"
                placeholder="Поиск пользователя"
              />
            </IconField>
          </div>
        </template>

        <Column class="text-center" header="№" style="width: 2%">
          <template #body="slotProps">
            {{ slotProps.index + 1 }}
          </template>
        </Column>

        <Column field="full_name" header="Название" style="width: 95%">
          <template #body="slotProps">
            {{ slotProps.data.nickname }}
          </template>
        </Column>
    </DataTable>
    </template>

    <template #footer>
      <Paginator
        :rows="filter.page_size"
        :total-records="users?.count"
        :rowsPerPageOptions="[10, 25, 50, 100]"
        @update:rows="filter.page_size = $event"
        @page="filter.page = $event.page + 1"
      >
      </Paginator>
    </template>

  </Card>
</template>

<style scoped></style>
~/utils/QueryBuilder