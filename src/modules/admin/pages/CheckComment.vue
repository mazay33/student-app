<script setup lang="ts">
import useApiService from '~/services/apiService';

import type { IPaginatedResult } from '~/@types/@types';
import type { IUser } from '~/@types/user.types';

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

const expandedComment = ref(null);
const toast = useToast();
const users = ref<IPaginatedResult<IUser>>();
const getUsers = async () => {
	const { data } = await apiService.user.getUserList();
	if (data.value) {
		users.value = data.value;
	}
};
await getUsers();

const { data: complainComment } = await apiService.comments.getComplainComments();

const NotGood = async commentID => {
	const { data } = await apiService.comments.deleteComment(commentID);
	if (data.value) {
		toast.add({
			severity: 'success',
			summary: 'негодяй наказан',
			life: 3500,
		});
		expandedComment.value = null;
		await apiService.comments.getComplainComments();
	} else {
		toast.add({
			severity: 'error',
			summary: 'Не удалось наказать негодяя',
			life: 3500,
		});
	}
};

const Good = async commentID => {
	const { data } = await apiService.comments.approveComment(commentID);
	if (data.value) {
		toast.add({
			severity: 'success',
			summary: 'Наговаривают, все норм',
			life: 3500,
		});
		expandedComment.value = null;
		await apiService.comments.getComplainComments();
	} else {
		toast.add({
			severity: 'error',
			summary: 'почти получилось',
			life: 3500,
		});
	}
};
</script>

<template>
	<div>
		<Toast />

		<div class="rounded-lg bg-white dark:bg-zinc-900 p-5 shadow-lg mb-20">
			<div class="mb-5 flex flex-col">
				<h2>Комментарии с жалобами</h2>
			</div>

			<DataTable
				v-model:expanded-rows="expandedComment"
				scroll-height="64vh"
				scrollable
				show-gridlines
				:value="complainComment?.result"
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
					style="width: 30%"
					header="На оценочку"
				/>
				<template #expansion="slotProps">
					<div class="p-3">
						<h5>Гуд или не гуд - {{ slotProps.data.id }}</h5>
						<div class="flex">
							<Button
								@click="NotGood(slotProps.data.id)"
								class="border-red-400 bg-red-400"
								>Не гуд</Button
							>
							<Button
								@click="Good(slotProps.data.id)"
								class="ml-5 border-green-400 bg-green-400"
								>Гуд</Button
							>
						</div>
					</div>
				</template>
				<Column
					field="name"
					header="Содержание коммента"
					style="width: 30%"
				>
					<template #body="slotProps">
						<div>{{ slotProps.data.text }}</div>
					</template></Column
				>
				<Column
					field="name"
					header="Владелец этого произведения"
					style="width: 30%"
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
