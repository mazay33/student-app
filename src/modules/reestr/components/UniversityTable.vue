<script setup lang="ts">
  import QueryBuilder from '~/utils/QueryBuilder'
  import type { IPaginatedResult } from '~/@types/@types'
  import type { IUniversity } from '../@types'
  import { Repository } from '~/repositories/Repository.module'

  const { universityRepo } = Repository

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

  const universities = ref<IPaginatedResult<IUniversity>>()
  const isLoading = ref<boolean>(false)

  const getUniversities = async () => {
    isLoading.value = true
    const { data, error, pending } = await universityRepo.getUniversityList(
      filterUrl.value
    )
    if (data.value) {
      universities.value = data.value
    }

    if (error.value) {
      throw new Error(error.value.message)
    }

    isLoading.value = pending.value
  }

  await getUniversities()

  const debounceFetch = useDebounceFn(async () => {
    await getUniversities()
  }, 500)

  watch(
    () => filter.value,
    async () => {
      await getUniversities()
    },
    { deep: true }
  )

  watch(
    () => searchFilter.value,
    async () => {
      await debounceFetch()
    },
    { deep: true }
  )
</script>

<template>
  <DataTable
    scrollHeight="60vh"
    scrollable
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
        <Skeleton v-if="isLoading" />
        <div v-else>{{ slotProps.index + 1 }}</div>
      </template>
    </Column>
    <Column sortable field="name" header="Название" style="width: 95%">
      <template #body="slotProps">
        <Skeleton v-if="isLoading" />
        <div v-else>
          {{ slotProps.data.short_name }} - {{ slotProps.data.name }}
        </div>
      </template>
    </Column>
  </DataTable>

  <Paginator
    :rows="filter.page_size"
    :total-records="universities?.count"
    :rowsPerPageOptions="[10, 25, 50, 100]"
    @update:rows="filter.page_size = $event"
    @page="filter.page = $event.page + 1"
  >
  </Paginator>
</template>

<style scoped></style>
