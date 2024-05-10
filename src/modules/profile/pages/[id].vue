<script setup lang="ts">
import type { IUser } from '~/@types/@types';
import useApiService from '~/services/apiService';

const apiService = useApiService();
const route = useRoute();
const authStore = useAuthStore();

const { user: ownerUser } = storeToRefs(authStore);
const isOwnerUser = computed(() => {
	if (!ownerUser.value) return false;
	return ownerUser.value.id === String(route.params.id);
});

await authStore.getMe();

const user = ref<IUser>();

const getUser = async () => {
	const { data } = await apiService.user.getUserById(String(route.params.id));

	if (data.value) {
		user.value = data.value;
	}
};

await getUser();
</script>

<template>
	<Card class="profile-card">
		<template #title><p class="text-center">Данные пользователя</p></template>
		<template #content>
			<ProfileInfo
				:user="isOwnerUser ? ownerUser : user"
				:is-owner-user="isOwnerUser"
			/>
		</template>
	</Card>
</template>

<style lang="scss">
.profile-card {
	.p-card-title {
		@apply font-bold text-xl pb-3 text-indigo-500;
	}
}
</style>
