<template>
  {{ data }}

  <!-- <div w-full h-20 text-center text-indigo-500 text-2xl font-bold>
        Создание конспекта
    </div>

    <div class="card" style="box-shadow: rgba(0, 0, 0, 0.16) 0px 1px 4px;">
        <Stepper orientation="vertical">

            <StepperPanel header="Конспект">
                <template #content="{ nextCallback }">
                    <div class="flex flex-column h-3rem">

                        <InputText type="text" placeholder="Введите название конспекта..." class="border-1 border-solid border-slate-300  rounded-xl surface-border border-round surface-ground flex-auto flex justify-content-center align-items-center font-medium" />


                    </div>
                    <div class="flex py-4">
                        <Button label="Next" @click="nextCallback" />
                    </div>
                </template>
            </StepperPanel>

            <StepperPanel header="ВУЗ">
                <template #content="{ prevCallback, nextCallback }">
                    <div class="flex flex-column h-3rem">

                        <Dropdown editable showClear placeholder="Введите название вуза..." class="border-1 border-solid border-slate-300  rounded-xl surface-border border-round surface-ground flex-auto flex justify-content-center align-items-center font-medium" />

                    </div>
                    <div class="flex py-4 gap-2">
                        <Button label="Back" severity="secondary" @click="prevCallback" />
                        <Button label="Next" @click="nextCallback" />
                    </div>
                </template>
            </StepperPanel>

            <StepperPanel header="Предмет">
                <template #content="{ prevCallback, nextCallback }">

                    <div class="flex flex-column h-3rem">
                        <Dropdown editable showClear placeholder="Выбрать из существующих" class="border-1 border-solid border-slate-300  rounded-xl surface-border border-round surface-ground flex-auto flex justify-content-center align-items-center font-medium" />
                        <Button  ml-5 >Добавить предмет</Button>
                    </div>
                    <div class="border-2 border-dashed rounded-lg h-50 border-round mt-5  flex-auto flex justify-content-center align-items-center font-medium">

                        <div>
                            <ul flex justify-between> Название предмета
                                <div>
                                    <Button ml-190>Сохранить изменения</Button>
                                </div>
                            </ul>
                        </div>

                    </div>

                    <div class="flex py-4 gap-2">
                        <Button label="Back" severity="secondary" @click="prevCallback" />
                        <Button label="Next" @click="nextCallback" />
                    </div>
                </template>
            </StepperPanel>

            <StepperPanel header="Преподаватель">
                <template #content="{ prevCallback }">
                    <div class="flex flex-column h-3rem">

                        <Dropdown editable showClear placeholder="Введите имя преподавателя..." class="border-1 border-solid border-slate-300  rounded-xl surface-border border-round surface-ground flex-auto flex justify-content-center align-items-center font-medium" />

                    </div>
                    <div class="flex justify-between py-4 ">
                        <Button label="Back" severity="secondary" @click="prevCallback" />
                        <Button disabled>Сохранить</Button>
                    </div>

                </template>
            </StepperPanel>

        </Stepper>
    </div> -->
</template>

<script setup lang="ts">
  import Stepper from 'primevue/stepper'
  import StepperPanel from 'primevue/stepperpanel'
  import SpeedDial from 'primevue/speeddial'
  import httpService from '~/services/httpService'

  // const authStore = useAuthStore()
  // const {user} = storeToRefs(authStore)
  // await authStore.getMe()

  const { data, error } = await httpService.get('private/users/me')
  console.log('Error', error)

  console.log(data.value)
</script>

<style scoped></style>
