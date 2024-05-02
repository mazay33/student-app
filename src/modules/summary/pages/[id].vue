<script setup lang="ts">
  import 'primeicons/primeicons.css'
  import Accordion from 'primevue/accordion';
  import AccordionTab from 'primevue/accordiontab';


  const summaryStore = useSummaryStore()
  const { summary } = storeToRefs(summaryStore)

  const route = useRoute()
  const id = route.params.id
  
  await summaryStore.getSummaryById(String(id))

  
</script>

<template>
  
  <div w-full bg-white shadow-md rounded-lg  p-5>
    <h1 text-4xl text-center text-indigo-500 font-semibold	mb-10 pt-5>{{ summary.name }}</h1>

    <div class="flex">
      <i class="pi pi-bookmark" style="font-size: 1.8rem"></i>
      <div text-xl font-bold pl-5>id автора:</div>
      <div text-xl pl-5>{{ summary?.user_id }}</div>
    </div>

    <div class="flex mt-3 pl-13">
      <div text-xl font-bold>Вуз:</div>
      <div text-xl pl-5 >{{ summary?.university?.name }}</div>    
    </div>

    <div class="flex mt-3 pl-13">
      <div text-xl font-bold>Предмет:</div>
      <div text-xl pl-5>{{ summary?.subject?.name }}</div>    
    </div>

    <div class="flex mt-3 pl-13">
      <div text-xl font-bold>Преподаватель:</div>
      <div text-xl pl-5>{{ summary?.teacher?.full_name }}</div>    
    </div>


    <div class="card" mt-5 v-if="summary.lectures && summary.lectures.length > 0">
        <Accordion :activeIndex="0" expandIcon="pi pi-plus" collapseIcon="pi pi-minus">
            
            <AccordionTab v-for="(lecture, i) in summary.lectures" :key="i">
                <template #header>
                    <span class="flex align-items-center gap-2 w-full">
                        <span class="font-bold white-space-nowrap">{{ lecture.name }}</span>
                        <Badge value="1" class="ml-auto mr-2" />
                    </span>
                </template>
                
                <div  mt-5>
                  
                  <div text-center font-bold>{{ lecture.description }}</div>
                  <div flex flex-col>
                    <a :href="lecture.pdf_file_url" border-10	>Скачать файл с лекцией</a>
                    <a :href="lecture.video_url" >Yotube ссылка</a>
                  </div>


                </div>

            </AccordionTab>
            
        </Accordion>
        
    </div>

    <div v-else mt-15 mb-10 text-4xl text-center text-indigo-800 font-semibold>
      <p>конспектов пока нет, возможно автор добавит их позже</p>
    </div>

  
  </div>


</template>

<style scoped>
div{
  font-size: 1.25rem; 
  line-height: 1.75rem; 
}

</style>
<!-- 
  <pre>{{ summary }}</pre> -->