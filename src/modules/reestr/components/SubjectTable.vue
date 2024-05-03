<script setup lang="ts">
  import { Repository } from '~/repositories/Repository.module'
  import QueryBuilder from '~/utils/QueryBuilder'
  import type { IPaginatedResult } from '~/@types/@types'
  import type { ISubject } from '../@types'

  const { subjectRepo } = Repository

  const filter = ref<{ [key: string]: any }>({
    page: 1,
    page_size: 25,
  })

  const searchFilter = ref({
    name: '',
  })

  const filterUrl = computed(() => {
    return new QueryBuilder()
      .setPage(filter.value.page)
      .setPageSize(filter.value.page_size)

      .setFilter('name', searchFilter.value.name)
      .buildUrl()
  })

  const subject = ref<IPaginatedResult<ISubject>>()
  const isLoading = ref<boolean>(false)

  const getSubjects = async () => {
    isLoading.value = true
    const { data, error, pending } = await subjectRepo.getSubjectList(
      filterUrl.value
    )
    if (data.value) {
      subject.value = data.value
    }

    if (error.value) {
      throw new Error(error.value.message)
    }

    isLoading.value = pending.value
  }

  await getSubjects()

  const debounceFetch = useDebounceFn(async () => {
    await getSubjects()
  }, 500)

  watch(
    () => filter.value,
    async () => {
      await getSubjects()
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
    :loading="isLoading"
    showGridlines
    :value="subject?.result"
  >
    <template #header>
      <div>
        <IconField iconPosition="left">
          <InputIcon>
            <i class="pi pi-search" />
          </InputIcon>
          <InputText
            v-model="searchFilter.name"
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
        {{ slotProps.data.name }}
      </template>
    </Column>
  </DataTable>

  <Paginator
    :rows="filter.page_size"
    :total-records="subject?.count"
    :rowsPerPageOptions="[10, 25, 50, 100]"
    @update:rows="filter.page_size = $event"
    @page="filter.page = $event.page + 1"
  >
  </Paginator>

</template>

<style scoped></style>
