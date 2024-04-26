<script setup lang="ts">
  const summaryStore = useSummaryStore()
  const { summaryCreateForm } = summaryStore
  // const { summaryCreateForm } = storeToRefs(summaryStore)

  const submitSummary = async () => {
    await summaryStore.createSummary()
  }

  const submitButtonDisabled = computed(() => {
    return (
      summaryCreateForm.name &&
      summaryCreateForm.university_id &&
      summaryCreateForm.subject_id &&
      summaryCreateForm.teacher_id
    )
  })

  const universities = [
    {
      name: 'МГУ',
      id: 1,
    },
    {
      name: 'МФТИ',
      id: 2,
    },
    {
      name: 'МАИ',
      id: 3,
    },
    {
      name: 'МГТУ',
      id: 4,
    },
    {
      name: 'МГТСУ',
      id: 5,
    },
  ]

  const subjects = [
    {
      name: 'Математика',
      id: 1,
    },
    {
      name: 'Физика',
      id: 2,
    },
    {
      name: 'Химия',
      id: 3,
    },
    {
      name: 'Биология',
      id: 4,
    },
    {
      name: 'Информатика',
      id: 5,
    },
  ]

  const teachers = [
    {
      id: '3fa85f64-5717-4562-b3fc-2c963f66afa1',
      name: 'Вестяк А.В.',
    },
    {
      id: '3fa85f64-5717-4562-b3fc-2c963f66afa2',
      name: 'Вестяк В.А.',
    },
    {
      id: '3fa85f64-5717-4562-b3fc-2c963f66afa3',
      name: 'Кан Ю.С.',
    },
  ]
</script>
<template>
  <div w-full h-20 text-center text-indigo-500 text-2xl font-bold>
    Создание конспекта
  </div>

  <Card>
    <template #title>Создание конспекта</template>
    <template #content>
      <Stepper orientation="vertical">
        <StepperPanel header="Конспект">
          <template #content="{ nextCallback }">
            <div class="flex flex-column h-3rem">
              <InputText
                v-model="summaryCreateForm.name"
                type="text"
                placeholder="Введите название конспекта..."
                class="border-1 border-solid border-slate-300 rounded-xl surface-border border-round surface-ground flex-auto flex justify-content-center align-items-center font-medium"
              />
            </div>
            <div class="flex py-4">
              <Button label="Next" @click="nextCallback" />
            </div>
          </template>
        </StepperPanel>

        <StepperPanel header="ВУЗ">
          <template #content="{ prevCallback, nextCallback }">
            <div class="flex flex-column h-3rem">
              <Dropdown
                v-model="summaryCreateForm.university_id"
                optionLabel="name"
                optionValue="id"
                :options="universities"
                editable
                showClear
                placeholder="Введите название вуза..."
                class="border-1 border-solid border-slate-300 rounded-xl surface-border border-round surface-ground flex-auto flex justify-content-center align-items-center font-medium"
              />
              <Button ml-5>Добавить ВУЗ</Button>
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
              <Dropdown
                v-model="summaryCreateForm.subject_id"
                :options="subjects"
                optionLabel="name"
                optionValue="id"
                editable
                showClear
                placeholder="Выбрать из существующих"
                class="border-1 border-solid border-slate-300 rounded-xl surface-border border-round surface-ground flex-auto flex justify-content-center align-items-center font-medium"
              />
              <Button ml-5>Добавить предмет</Button>
            </div>
            <!-- <div
              class="border-2 border-dashed rounded-lg h-50 border-round mt-5 flex-auto flex justify-content-center align-items-center font-medium"
            >
              <div>
                <ul flex justify-between>
                  Название предмета
                  <div>
                    <Button ml-190>Сохранить изменения</Button>
                  </div>
                </ul>
              </div>
            </div> -->

            <div class="flex py-4 gap-2">
              <Button label="Back" severity="secondary" @click="prevCallback" />
              <Button label="Next" @click="nextCallback" />
            </div>
          </template>
        </StepperPanel>

        <StepperPanel header="Преподаватель">
          <template #content="{ prevCallback }">
            <div class="flex flex-column h-3rem">
              <Dropdown
                :options="teachers"
                v-model="summaryCreateForm.teacher_id"
                optionLabel="name"
                optionValue="id"
                editable
                showClear
                placeholder="Введите имя преподавателя..."
                class="border-1 border-solid border-slate-300 rounded-xl surface-border border-round surface-ground flex-auto flex justify-content-center align-items-center font-medium"
              />
            </div>
            <div class="flex justify-between py-4">
              <Button label="Back" severity="secondary" @click="prevCallback" />
              <Button @click="submitSummary" :disabled="!submitButtonDisabled"
                >Сохранить</Button
              >
            </div>
          </template>
        </StepperPanel>
      </Stepper>
    </template>
  </Card>
</template>

<style scoped></style>
