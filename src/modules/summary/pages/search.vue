<script setup lang="ts">
import QueryBuilder from '~/utils/QueryBuilder'

const summaryStore = useSummaryStore()
const { isLoading, summaries } = storeToRefs(summaryStore)


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

  const debounceFetch = useDebounceFn(async () => {
    await summaryStore.getSummaries(filterUrl.value)
  }, 500)

await summaryStore.getSummaries()

watch(
    () => filter.value,
    async () => {
      await summaryStore.getSummaries(filterUrl.value)
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


  // import { CustomerService } from '@/service/CustomerService';
  definePageMeta({
    path: '/',
  })
</script>



<template>
<!-- <pre>
  {{ summaries }}
</pre> -->


<Card>
    <template #title>Поиск конспектов</template>
    <template #content>
      <DataTable
        scrollHeight="60vh"
        scrollable
        :loading="isLoading"
        showGridlines
        :value="summaries?.result"
      >
        <template #header>
          <div>
            <IconField iconPosition="left">
              <InputIcon>
                <i class="pi pi-search" />
              </InputIcon>
              <InputText
                v-model="searchFilter.name"
                placeholder="Название конспекта"
              />
            </IconField>
          </div>
        </template>

        <Column class="text-center" header="№" style="width: 1%">
          <template #body="slotProps">
            {{ slotProps.index + 1 }}
          </template>
        </Column>

        <Column field="full_name" header="Название" style="width: 19%">
          <template #body="slotProps">
            {{ slotProps.data.name }}
          </template>
        </Column>

        <Column field="full_name" header="id конспекта" style="width: 40%">
          <template #body="slotProps">
            {{ slotProps.data.id }}
          </template>
        </Column>

        <Column field="full_name" header="id пользователя" style="width: 40%">
          <template #body="slotProps">
            {{ slotProps.data.user_id }}
          </template>
        </Column>

      </DataTable>
    </template>

    <template #footer>
      <Paginator
        :rows="filter.page_size"
        :total-records="summaries?.count"
        :rowsPerPageOptions="[10, 25, 50, 100]"
        @update:rows="filter.page_size = $event"
        @page="filter.page = $event.page + 1"
      >
      </Paginator>
    </template>
  </Card>
</template>









  <!-- <div class="card">
    <DataTable
      v-model:filters="filters"
      :value="customers"
      paginator
      :rows="10"
      filterDisplay="row"
      :loading="loading"
      :globalFilterFields="[
        'name',
        'country.name',
        'representative.name',
        'status',
      ]"
    >
      <template #header>
        <div class="flex justify-content-end">
          <IconField iconPosition="left">
            <InputIcon>
              <i class="pi pi-search" />
            </InputIcon>
            <InputText
              v-model="filters['global'].value"
              placeholder="Keyword Search"
            />
          </IconField>
        </div>
      </template>
      <template #empty> No customers found. </template>
      <template #loading> Loading customers data. Please wait. </template>
      <Column field="name" header="Name" style="min-width: 12rem">
        <template #body="{ data }">
          {{ data.name }}
        </template>
        <template #filter="{ filterModel, filterCallback }">
          <InputText
            v-model="filterModel.value"
            type="text"
            @input="filterCallback()"
            class="p-column-filter"
            placeholder="Search by name"
          />
        </template>
      </Column>
      <Column
        header="Country"
        filterField="country.name"
        style="min-width: 12rem"
      >
        <template #body="{ data }">
          <div class="flex align-items-center gap-2">
            <img
              alt="flag"
              src="https://primefaces.org/cdn/primevue/images/flag/flag_placeholder.png"
              :class="`flag flag-${data.country.code}`"
              style="width: 24px"
            />
            <span>{{ data.country.name }}</span>
          </div>
        </template>
        <template #filter="{ filterModel, filterCallback }">
          <InputText
            v-model="filterModel.value"
            type="text"
            @input="filterCallback()"
            class="p-column-filter"
            placeholder="Search by country"
          />
        </template>
      </Column>
      <Column
        header="Agent"
        filterField="representative"
        :showFilterMenu="false"
        :filterMenuStyle="{ width: '14rem' }"
        style="min-width: 14rem"
      >
        <template #body="{ data }">
          <div class="flex align-items-center gap-2">
            <img
              :alt="data.representative.name"
              :src="`https://primefaces.org/cdn/primevue/images/avatar/${data.representative.image}`"
              style="width: 32px"
            />
            <span>{{ data.representative.name }}</span>
          </div>
        </template>
        <template #filter="{ filterModel, filterCallback }">
          <MultiSelect
            v-model="filterModel.value"
            @change="filterCallback()"
            :options="representatives"
            optionLabel="name"
            placeholder="Any"
            class="p-column-filter"
            style="min-width: 14rem"
            :maxSelectedLabels="1"
          >
            <template #option="slotProps">
              <div class="flex align-items-center gap-2">
                <img
                  :alt="slotProps.option.name"
                  :src="`https://primefaces.org/cdn/primevue/images/avatar/${slotProps.option.image}`"
                  style="width: 32px"
                />
                <span>{{ slotProps.option.name }}</span>
              </div>
            </template>
          </MultiSelect>
        </template>
      </Column>
      <Column
        field="status"
        header="Status"
        :showFilterMenu="false"
        :filterMenuStyle="{ width: '14rem' }"
        style="min-width: 12rem"
      >
        <template #body="{ data }">
          <Tag :value="data.status" :severity="getSeverity(data.status)" />
        </template>
        <template #filter="{ filterModel, filterCallback }">
          <Dropdown
            v-model="filterModel.value"
            @change="filterCallback()"
            :options="statuses"
            placeholder="Select One"
            class="p-column-filter"
            style="min-width: 12rem"
            :showClear="true"
          >
            <template #option="slotProps">
              <Tag
                :value="slotProps.option"
                :severity="getSeverity(slotProps.option)"
              />
            </template>
          </Dropdown>
        </template>
      </Column>
      <Column
        field="verified"
        header="Verified"
        dataType="boolean"
        style="min-width: 6rem"
      >
        <template #body="{ data }">
          <i
            class="pi"
            :class="{
              'pi-check-circle text-green-500': data.verified,
              'pi-times-circle text-red-400': !data.verified,
            }"
          ></i>
        </template>
        <template #filter="{ filterModel, filterCallback }">
          <TriStateCheckbox
            v-model="filterModel.value"
            @change="filterCallback()"
          />
        </template>
      </Column>
    </DataTable> 
  </div>-->
  







<!-- <script setup lang="ts">

  // import { CustomerService } from '@/service/CustomerService';
  definePageMeta({
    path: '/',
  })

  const summaryStore = useSummaryStore()

  await summaryStore.getSummaries()

  const customers = ref()
  const filters = ref({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    name: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    'country.name': { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    representative: { value: null, matchMode: FilterMatchMode.IN },
    status: { value: null, matchMode: FilterMatchMode.EQUALS },
    verified: { value: null, matchMode: FilterMatchMode.EQUALS },
  })
  const representatives = ref([
    { name: 'Amy Elsner', image: 'amyelsner.png' },
    { name: 'Anna Fali', image: 'annafali.png' },
    { name: 'Asiya Javayant', image: 'asiyajavayant.png' },
    { name: 'Bernardo Dominic', image: 'bernardodominic.png' },
    { name: 'Elwin Sharvill', image: 'elwinsharvill.png' },
    { name: 'Ioni Bowcher', image: 'ionibowcher.png' },
    { name: 'Ivan Magalhaes', image: 'ivanmagalhaes.png' },
    { name: 'Onyama Limba', image: 'onyamalimba.png' },
    { name: 'Stephen Shaw', image: 'stephenshaw.png' },
    { name: 'XuXue Feng', image: 'xuxuefeng.png' },
  ])
  const statuses = ref([
    'unqualified',
    'qualified',
    'new',
    'negotiation',
    'renewal',
    'proposal',
  ])
 const loading = ref(true)

  onMounted(() => {
  customers.value = summaries.result;
  loading.value = false;
});


  const getCustomers = (data) => {
    return [...(data || [])].map((d) => {
      d.date = new Date(d.date)

      return d
    })
  }
  const formatDate = (value) => {
    return value.toLocaleDateString('en-US', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    })
  }
  const formatCurrency = (value) => {
    return value.toLocaleString('en-US', { style: 'currency', currency: 'USD' })
  }
  const getSeverity = (status) => {
    switch (status) {
      case 'unqualified':
        return 'danger'

      case 'qualified':
        return 'success'

      case 'new':
        return 'info'

      case 'negotiation':
        return 'warning'

      case 'renewal':
        return null
    }
  }

</script> -->