<template>
  <div>
    dd
  </div>
  
</template>

<script setup lang="ts">
import QueryBuilder from '~/utils/QueryBuilder'

const summaryStore = useSummaryStore()
// const { isLoading, summaries } = storeToRefs(reestrStore)

// const filter = ref<{ [key: string]: any }>({
//   page: 1,
//   page_size: 25,
//   nickname: '',
// })

// const filterUrl = computed(() => {
//   return new QueryBuilder()
//     .setPage(filter.value.page)
//     .setPageSize(filter.value.page_size)
//     .setFilter('nickname', filter.value.nickname, true)
// })

// const debounceFetch = useDebounceFn(async () => {
//   await reestrStore.getUsers(filterUrl.value.buildUrl())
// }, 500)

// await reestrStore.getUsers(filterUrl.value.buildUrl())








  import { ref, onMounted } from 'vue'
  import { FilterMatchMode } from 'primevue/api'
  import httpService from '~/services/httpService';
  // import { CustomerService } from '@/service/CustomerService';
  definePageMeta({
    path: '/',
  })

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
    customers.value = getCustomers([
      {
        id: 1,
        name: 'James Smith',
        country: {
          name: 'Brazil',
          code: 'br',
        },
        company: 'Smith and Sons',
        date: '2018-05-20',
        status: 'qualified',
        verified: true,
        activity: 25,
        representative: {
          name: 'Ioni Bowcher',
          image: 'ionibowcher.png',
        },
        balance: 82217,
      },
      {
        id: 1001,
        name: 'John Johnson',
        country: {
          name: 'Canada',
          code: 'ca',
        },
        company: 'Johnson Enterprises',
        date: '2017-10-15',
        status: 'qualified',
        verified: false,
        activity: 30,
        representative: {
          name: 'Ioni Bowcher',
          image: 'ionibowcher.png',
        },
        balance: 95000,
      },
      {
        id: 1002,
        name: 'Michael Williams',
        country: {
          name: 'France',
          code: 'fr',
        },
        company: 'Williams & Co',
        date: '2019-02-28',
        status: 'qualified',
        verified: true,
        activity: 20,
        representative: {
          name: 'Ioni Bowcher',
          image: 'ionibowcher.png',
        },
        balance: 70000,
      },
      {
        id: 1003,
        name: 'David Jones',
        country: {
          name: 'Germany',
          code: 'de',
        },
        company: 'Jones Corp',
        date: '2020-07-10',
        status: 'qualified',
        verified: true,
        activity: 35,
        representative: {
          name: 'Ioni Bowcher',
          image: 'ionibowcher.png',
        },
        balance: 85000,
      },
      {
        id: 1004,
        name: 'William Brown',
        country: {
          name: 'Italy',
          code: 'it',
        },
        company: 'Brown Industries',
        date: '2016-12-05',
        status: 'qualified',
        verified: true,
        activity: 28,
        representative: {
          name: 'Ioni Bowcher',
          image: 'ionibowcher.png',
        },
        balance: 75000,
      },
      {
        id: 1005,
        name: 'Charles Davis',
        country: {
          name: 'Spain',
          code: 'es',
        },
        company: 'Davis Ltd',
        date: '2018-09-30',
        status: 'qualified',
        verified: false,
        activity: 22,
        representative: {
          name: 'Ioni Bowcher',
          image: 'ionibowcher.png',
        },
        balance: 90000,
      },
      {
        id: 1006,
        name: 'Daniel Miller',
        country: {
          name: 'United Kingdom',
          code: 'uk',
        },
        company: 'Miller Co',
        date: '2017-04-18',
        status: 'qualified',
        verified: true,
        activity: 18,
        representative: {
          name: 'Ioni Bowcher',
          image: 'ionibowcher.png',
        },
        balance: 82000,
      },
      {
        id: 1007,
        name: 'Matthew Wilson',
        country: {
          name: 'United States',
          code: 'us',
        },
        company: 'Wilson Enterprises',
        date: '2019-11-25',
        status: 'qualified',
        verified: true,
        activity: 32,
        representative: {
          name: 'Ioni Bowcher',
          image: 'ionibowcher.png',
        },
        balance: 88000,
      },
      {
        id: 1008,
        name: 'Christopher Taylor',
        country: {
          name: 'Australia',
          code: 'au',
        },
        company: 'Taylor & Sons',
        date: '2020-04-12',
        status: 'qualified',
        verified: false,
        activity: 26,
        representative: {
          name: 'Ioni Bowcher',
          image: 'ionibowcher.png',
        },
        balance: 81000,
      },
      {
        id: 1009,
        name: 'Andrew Anderson',
        country: {
          name: 'Japan',
          code: 'jp',
        },
        company: 'Anderson Corporation',
        date: '2016-08-15',
        status: 'qualified',
        verified: true,
        activity: 29,
        representative: {
          name: 'Ioni Bowcher',
          image: 'ionibowcher.png',
        },
        balance: 93000,
      },
      {
        id: 1010,
        name: 'Joseph Thomas',
        country: {
          name: 'China',
          code: 'cn',
        },
        company: 'Thomas Group',
        date: '2017-03-08',
        status: 'qualified',
        verified: true,
        activity: 23,
        representative: {
          name: 'Ioni Bowcher',
          image: 'ionibowcher.png',
        },
        balance: 87000,
      },
    ])
    loading.value = false
  })

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

  const createSubject = async() => {
    const {data} = await httpService.post('main/private/subjects', {
      name: 'Математика',
    })
  }

  // await createSubject()
</script>
