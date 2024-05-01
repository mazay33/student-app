<script setup lang="ts">
  import type { IUniversity } from '~/modules/reestr/@types'

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
      summaryCreateForm.university?.id &&
      summaryCreateForm.subject?.id &&
      summaryCreateForm.teacher?.id
    )
  })

  const debounceFetch = useDebounceFn(async (fetch: Function) => {
    await fetch()
  }, 250)

  const onUniversityChange = async (event: any) => {
    if (typeof event.value == 'string') {
      const formatUrl = computed(() => {
        return new QueryBuilder().setFilter('name', event.value).buildUrl()
      })

      await debounceFetch(() => reestrStore.getUniversities(formatUrl.value))
    }
  }

  const onSubjectChange = async (event: any) => {
    if (typeof event.value == 'string') {
      const formatUrl = computed(() => {
        return new QueryBuilder().setFilter('name', event.value).buildUrl()
      })
      await debounceFetch(() => reestrStore.getSubjects(formatUrl.value))
    }

    if (event.value?.id) {
      teacherFormatUrl.value.setFilter('subject_id', event.value?.id)

      await reestrStore.getTeachers(teacherFormatUrl.value.buildUrl())
    }
  }

  const teacherFormatUrl = computed(() => {
    return new QueryBuilder()
  })

  const onTeacherChange = async (event: any) => {
    if (typeof event.value == 'string') {
      teacherFormatUrl.value.setFilter('full_name', event.value)

      await debounceFetch(() =>
        reestrStore.getTeachers(teacherFormatUrl.value.buildUrl())
      )
    }
  }
</script>
<template>
  <div w-full h-18 text-center text-indigo-500 text-2xl font-bold>
    Создание конспекта
  </div>

  <Card>
    <template #title>Создание конспекта</template>
    <template #content>
      <Stepper orientation="vertical">
        <StepperPanel header="Конспект">
          <div class="flex flex-column h-3rem">
            <InputText
              v-model="summaryCreateForm.name"
              type="text"
              placeholder="Введите название конспекта..."
              class="border-1 border-solid border-slate-200 rounded-xl surface-border border-round surface-ground flex-auto flex justify-content-center align-items-center font-medium"
            />
          </div>
        </StepperPanel>

        <StepperPanel header="ВУЗ">
          <div class="flex flex-col h-3rem">
            <Dropdown
              @change="onUniversityChange($event)"
              v-model="summaryCreateForm.university"
              optionLabel="name"
              :loading="reestrStore.isLoading"
              :options="universities?.result"
              editable
              showClear
              placeholder="Введите название вуза..."
              class="border-1 border-solid border-slate-300 rounded-xl surface-border border-round surface-ground flex-auto font-medium"
            >
              <template #option="{ option }: { option: IUniversity }">
                {{ option.short_name }} - {{ option.name }}
              </template>
            </Dropdown>
          </div>
        </StepperPanel>

        <StepperPanel header="Предмет">
          <div class="flex flex-col sm:flex-row h-8rem sm:h-3rem">
            <Dropdown
              @change="onSubjectChange($event)"
              @update:model-value="summaryCreateForm.teacher = null"
              v-model="summaryCreateForm.subject"
              :options="subjects?.result"
              optionLabel="name"
              :loading="reestrStore.isLoading"
              editable
              showClear
              placeholder="Выбрать из существующих"
              class="border-1 border-solid border-slate-300 rounded-xl surface-border border-round surface-ground flex-auto flex justify-content-center align-items-center font-medium"
            />
            <Button
              mb-3
              ml-0
              mt-3
              sm:mt-0
              sm:ml-5
              sm:mb-0
              w-36
              h-3rem
              text-sm
              font-medium
              >Создать новый</Button
            >
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
        </StepperPanel>

        <StepperPanel header="Преподаватель">
          <div class="flex flex-col sm:flex-row h-3rem">
            <Dropdown
              @change="onTeacherChange($event)"
              :loading="reestrStore.isLoading"
              :options="teachers?.result"
              :disabled="!summaryCreateForm.subject?.id"
              v-model="summaryCreateForm.teacher"
              optionLabel="full_name"
              editable
              showClear
              placeholder="Введите имя преподавателя..."
              class="border-1 border-solid border-slate-300 rounded-xl surface-border border-round surface-ground flex-auto flex justify-content-center align-items-center font-medium"
            />
          </div>
          <div class="flex justify-between py-4">
            <Button w-37 text-sm font-medium h-3rem>Создать нового</Button>
            <Button
              @click="submitSummary"
              :disabled="!submitButtonDisabled"
              text-sm
              font-medium
              h-3rem
              >Сохранить</Button
            >
          </div>
        </StepperPanel>
      </Stepper>
    </template>
  </Card>
</template>

<style scoped></style>
