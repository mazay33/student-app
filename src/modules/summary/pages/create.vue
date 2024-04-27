<script setup lang="ts">
  const summaryStore = useSummaryStore()
  const reestrStore = useReestrStore()
  const { universities, subjects, teachers } = storeToRefs(reestrStore)
  const { summaryCreateForm } = summaryStore

  await Promise.all([
    reestrStore.getUniversities(),
    reestrStore.getSubjects(),
    reestrStore.getTeachers(),
  ])

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
                :options="universities.result"
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
                :options="subjects.result"
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
                :options="teachers.result"
                v-model="summaryCreateForm.teacher_id"
                optionLabel="full_name"
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
