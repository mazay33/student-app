<script setup lang="ts">
  import 'primeicons/primeicons.css'
  import Accordion from 'primevue/accordion';
  import AccordionTab from 'primevue/accordiontab';


  const summaryStore = useSummaryStore()
  const { summary } = storeToRefs(summaryStore)
  const { summaryUser } = storeToRefs(summaryStore)

  const route = useRoute()
  const id = route.params.id

  await summaryStore.getSummaryById(String(id))

  const userId = summary.value.user_id
  await summaryStore.getUserById(userId)
</script>

<template>
  
  <div w-full bg-white shadow-md rounded-xl  p-5>
    <h1 text-3xl text-center text-indigo-500 font-semibold	mb-10 pt-5>{{ summary.name }}</h1>

    <div class="flex flex-col  sm:flex-row">
      <i class="pi pi-bookmark" style="font-size: 1.8rem"></i>
      <div class="text-lg font-bold text-center pl-0 sm-pl-5">id автора:</div>

      <div class="text-lg pl-0 sm-pl-5 flex justify-center ">
        <div class="flex mt-1  sm-mt--2">
          <img class="w-10 rounded-full text-center" :src="summaryUser.image_url" >
          <p class="pt-2 ml-3">{{ summaryUser.nickname }}</p>
        </div>
      </div>

    </div>

    <div class="flex flex-col sm:flex-row mt-3 pl-0 sm-pl-13">
      <div class="text-lg font-bold text-center">Вуз:</div>
      <div class="text-lg pl-0 sm-pl-5 text-center">{{ summary?.university?.name }}</div>    
    </div>

    <div class="flex flex-col sm:flex-row mt-3 pl-0 sm-pl-13">
      <div class="text-lg font-bold text-center">Предмет:</div>
      <div class="text-lg pl-0 sm-pl-5 text-center">{{ summary?.subject?.name }}</div>    
    </div>

    <div class="flex flex-col sm:flex-row mt-3 pl-0 sm-pl-13">
      <div class="text-lg font-bold text-center">Преподаватель:</div>
      <div class="text-lg pl-5 text-center">{{ summary?.teacher?.full_name }}</div>    
    </div>


    <div class="card" mt-5 v-if="summary.lectures && summary.lectures.length > 0">
        <Accordion :activeIndex="0" expandIcon="pi pi-plus" collapseIcon="pi pi-minus">
            
            <AccordionTab v-for="(lecture, i) in summary.lectures" :key="i">
                <template #header>
                    <span class="flex align-items-center gap-2 w-full">
                        <span class="font-bold white-space-nowrap text-lg">{{ lecture.name }}</span>
                        
                    </span>
                </template>
                
                <div  mt-5>
                  
                  <div text-center font-bold text-lg mb-4>{{ lecture.description }}</div>
                  <div flex flex-col>
                    <a :href="lecture.pdf_file_url" class="text-lg"	>Скачать файл с лекцией</a>
                    <a :href="lecture.video_url" class="text-lg" >Yotube ссылка</a>
                  </div>


                </div>

            </AccordionTab>
            
        </Accordion>
        
    </div>

    <div v-else mt-15 mb-10 text-2xl text-center text-indigo-600 font-semibold>
      <p>конспектов пока нет, возможно автор добавит их позже</p>
    </div>

  
  </div>


</template>

<style scoped>


</style>
