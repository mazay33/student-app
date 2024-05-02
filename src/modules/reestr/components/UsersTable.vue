<script setup lang="ts">
  import type { IPaginatedResult, IUser } from '~/@types/@types'
  import { Repository } from '~/repositories/Repository.module'
  import QueryBuilder from '~/utils/QueryBuilder'

  const { userRepo } = Repository

  const filter = ref<{ [key: string]: any }>({
    page: 1,
    page_size: 25,
  })

  const searchFilter = ref({
    nickname: '',
  })

  const filterUrl = computed(() => {
    return new QueryBuilder()
      .setPage(filter.value.page)
      .setPageSize(filter.value.page_size)

      .setFilter('nickname', searchFilter.value.nickname)
      .buildUrl()
  })

  const users = ref<IPaginatedResult<IUser>>()
  const isLoading = ref<boolean>(false)

  const getUsers = async () => {
    isLoading.value = true
    const { data, error, pending } = await userRepo.getUsersList(
      filterUrl.value
    )
    if (data.value) {
      users.value = data.value
    }

    if (error.value) {
      throw new Error(error.value.message)
    }

    isLoading.value = pending.value
  }

  await getUsers()

  const debounceFetch = useDebounceFn(async () => {
    await getUsers()
  }, 500)

  watch(
    () => filter.value,
    async () => {
      await getUsers()
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
    :value="users?.result"
  >
    <template #header>
      <div>
        <IconField iconPosition="left">
          <InputIcon>
            <i class="pi pi-search" />
          </InputIcon>
          <InputText
            v-model="searchFilter.nickname"
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

  <Paginator
    :rows="filter.page_size"
    :total-records="users?.count"
    :rowsPerPageOptions="[10, 25, 50, 100]"
    @update:rows="filter.page_size = $event"
    @page="filter.page = $event.page + 1"
  >
  </Paginator>
</template>

<style scoped></style>
