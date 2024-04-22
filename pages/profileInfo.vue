<script setup>
import { ref, onMounted, defineProps } from 'vue'
import httpService from '~/services/httpService';
import {useAuthStore} from '../stores/auth'

const AuthStore = useAuthStore()
const props = defineProps({
  nickname: String,
  email: String,
  created_at: String,
  description: String,
  image_url: String
});

const {user} = storeToRefs(AuthStore)
  const isDisabled = ref(true)

  const fetchMe = async () => {

    isDisabled.value = !isDisabled.value
    const inputElements = document.querySelectorAll('#Uform')
    inputElements.forEach((element) => {
    element.disabled = !element.disabled
    })
  }

  const submitInfo = async () => {
  try {
    const response = await httpService.patch('private/users/update', {
      nickname: props.nickname,
      description: props.description,
    });

    if (response.data) {
      AuthStore.getMe();
      console.log(AuthStore.getMe())
    }
  } catch (error) {
    console.error('error', error);
  }
};



</script>

<template>
  
  <div class="flex items-center gap-5 relative">

            <div flex flex-col w-100 text-center mt--10>
              <div class="w-5/10" text-black>
                <InputText id="Uform" type="text" v-model="props.nickname" :style="{ borderColor: isDisabled ? 'white' : 'blue' }"
                w-50 shadow-none text-black disabled bg-white text-center font-bold mt--5 border-1 border-white />
              </div>
              <div class="w-5/10">
                <img rounded-full style="width: 150px; height: 150px;" mt-5 
                src="https://pinia.vuejs.org/logo.svg"
                alt=" :src = image_url ">
              </div>
              
            </div>

            <div ml--40 >
              <div flex bm-5>

                <div class="flex flex-column gap-2 flex flex-col">
                  <label>Email</label>
                  <div bg-slate-200	rounded w-60 h-10 >                  
                    <p pt-2 pl-3>{{ props.email }}</p>
                  </div>
                </div>


              </div>
              <div flex mt-6>
                
                <div class="flex flex-column gap-2 flex flex-col">
                  <label>Created at</label>
                  <div bg-slate-200	rounded w-60 h-10 >                  
                    <p pt-2 pl-3>{{ props.created_at }}</p>
                  </div>
                </div>

              </div>
              <div flex mt-6>
                
                <div class="flex flex-column gap-2 flex flex-col mb-5">
                  <label for="username">Description</label>
                  <InputText id="Uform" type="text" v-model="props.description" placeholder:text-slate-700 shadow-none
                  placeholder ="Some info about..." disabled border-1 border-white h-10 :style="{ borderColor: isDisabled ? 'white' : 'blue' }" />
                </div>
              
              </div>
            </div>
                
              <div absolute botom-0 right-0 mt-50 mr-5>
                <Button id="disnone" label="обновить данные" :style="{ display: isDisabled ? 'none' : '' }" @click="submitInfo"
                bg-white text-indigo-500 hover:bg-indigo-100
                ></Button>
                <Button id="change_button" label="изменить" @click="fetchMe" ml-10></Button>
                
              </div>
              
  </div>
              
<Button @click="AuthStore.getMe()">auth.ts</Button>
              

</template>


<style>

</style>