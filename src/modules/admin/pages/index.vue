<script setup lang="ts">
import UserApi from "~/services/api/userApi";
import useApiService from "~/services/apiService";
import HttpService from "~/services/httpService";

definePageMeta({
	middleware: ['admin-middleware', 'auth-middleware'],
});

const authStore = useAuthStore();
const apiService = useApiService();

const { user } = storeToRefs(authStore);
const { data } = await apiService.admin.getAdminSummaries();
</script>

<template>
	<div>
		<h1>only for admin</h1>

		<h2>hello {{ user?.nickname }}</h2>
		<DataTable :value="data.result" tableStyle="min-width: 50rem">
			<Column field="name" header="Name"></Column>
			<Column field="name" header="Name"></Column>
		</DataTable>

		{{ data }}
	</div>
</template>

<style scoped></style>
