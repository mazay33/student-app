<script setup lang="ts">
import useApiService from '~/services/apiService';

import type { IPaginatedResult, IUser } from '~/@types/@types';

definePageMeta({
	middleware: ['admin-middleware', 'auth-middleware'],
});

const authStore = useAuthStore();
const apiService = useApiService();

const { user } = storeToRefs(authStore);
const { data } = await apiService.admin.getAdminSummaries();

const dataFilter = ref<{ [key: string]: any }>({
	page: 1,
	page_size: 25,
	university_id: null,
	subject_id: null,
	teacher_id: null,
});

const expandedRow = ref(null);
const comment = ref('');

const status = ref({
	id: null,
	moderation_comment: null,
});

const toast = useToast();

const reject = async rowData => {
	status.value.id = rowData.id;
	status.value.moderation_comment = comment.value;

	const { data } = await apiService.admin.statusRegjected(status.value);

	if (data.value) {
		toast.add({
			severity: 'success',
			summary: 'Запрос отклонен',
			life: 3000,
		});
		comment.value = ' ';
		expandedRow.value = null;
		await apiService.admin.getAdminSummaries();
	}
};

const approve = async rowData => {
	status.value.id = rowData.id;
	status.value.moderation_comment = comment.value;

	const { data } = await apiService.admin.statusApproved(status.value);

	if (data.value) {
		toast.add({
			severity: 'success',
			summary: 'Запрос одобрен',
			life: 3000,
		});
		comment.value = ' ';
		expandedRow.value = null;
		await apiService.admin.getAdminSummaries();
	}
};

const users = ref<IPaginatedResult<IUser>>();
const getUsers = async () => {
	const { data } = await apiService.user.getUserList();
	if (data.value) {
		users.value = data.value;
	}
};
await getUsers();

const openFileDialog = () => {
	const input = document.createElement('input');
	input.type = 'file';
	input.accept = 'text/csv';
	input.multiple = false;
	input.style.display = 'none';
	input.addEventListener('change', event => {
		const target = event.target as HTMLInputElement;
		if (!target.files) {
			return;
		}

		uploadCsv(event);
	});
	document.body.appendChild(input);
	input.click();
	document.body.removeChild(input);
};

const uploadCsv = async (event: Event) => {
	const formData = new FormData();
	const target = event.target as HTMLInputElement;

	if (!event.target || !target.files) {
		return;
	}
	formData.append('file', target.files[0]);

	const { data } = await apiService.admin.uploadCsvFile(formData);

	if (data.value) {
		toast.add({
			severity: 'success',
			summary: `Новых вузов добавленно: ${data.value.count_added_universities}`,
			life: 3000,
		});
	}
};
</script>

<template>
	<div>
		<Toast />

		<div class="rounded-lg bg-white p-5 shadow-lg">
			<div class="mb-5 flex">
				<h2 class="flex-1">Администратор: {{ user?.nickname }}</h2>
				<Button
					severity="info"
					@click="openFileDialog"
					>загрузить справочник</Button
				>
			</div>
			<DataTable
				v-model:expanded-rows="expandedRow"
				scroll-height="64vh"
				scrollable
				show-gridlines
				:value="data?.result"
			>
				<Column
					field="name"
					header="№"
					style="width: 1%"
				>
					<template #body="slotProps">
						<div>{{ slotProps.index + 1 }}</div>
					</template></Column
				>
				<Column
					expander
					style="width: 5rem"
				/>
				<template #expansion="slotProps">
					<div class="p-3">
						<h5>Проверка конспекта - {{ slotProps.data.name }}</h5>
						<div class="flex">
							<Button
								class="border-red-400 bg-red-400"
								@click="reject(slotProps.data)"
								>Отклонить</Button
							>
							<Button
								class="ml-5 border-green-400 bg-green-400"
								@click="approve(slotProps.data)"
								>Одобрить</Button
							>
							<InputText
								v-model="comment"
								type="text"
								class="ml-5"
								placeholder="Комментарий для юзера"
							/>
						</div>
					</div>
				</template>
				<Column
					field="name"
					header="Название"
				>
					<template #body="slotProps">
						<div>{{ slotProps.data.name }}</div>
					</template></Column
				>
				<Column
					field="name"
					header="Наименование вуза"
					><template #body="slotProps">
						<div>{{ slotProps.data.university_name }}</div>
					</template></Column
				>
				<Column
					field="name"
					header="Предмет"
					><template #body="slotProps">
						<div>{{ slotProps.data.subject_name }}</div>
					</template></Column
				>
				<Column
					field="name"
					header="Преподователь"
					><template #body="slotProps">
						<div>{{ slotProps.data.teacher_full_name }}</div>
					</template></Column
				>
				<Column
					field="name"
					header="Пользователь"
				>
					<template #body="{ data: userData }">
						<div class="flex items-center gap-2">
							<img
								v-if="users?.result.find((user: IUser) => user.id === userData.user_id)?.image_url"
								class="w-10 rounded-full text-center"
								:src="
									users?.result.find((user: IUser) => user.id === userData.user_id)?.image_url || ''
								"
								alt=""
							/>
							<span
								>{{ users?.result.find((user: IUser) => user.id === userData.user_id)?.nickname }}
							</span>
						</div>
					</template></Column
				>
				<Column
					field="name"
					header="Статус"
					><template #body="slotProps">
						<div>{{ slotProps.data.status }}</div>
					</template></Column
				>
			</DataTable>

			<Paginator
				v-if="data?.pages"
				:rows="data.page_size"
				:total-records="data?.count"
				:rows-per-page-options="[10, 25, 50, 100]"
				@update:rows="dataFilter.page_size = $event"
				@page="dataFilter.page = $event.page + 1"
			>
			</Paginator>
		</div>
	</div>
</template>

<style scoped></style>
