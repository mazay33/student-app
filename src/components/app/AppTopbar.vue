<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '~/modules/auth/stores/auth';
const { onMenuToggle } = useLayout();
const outsideClickListener = ref(null);
const topbarMenuActive = ref(false);
const router = useRouter();
const authStore = useAuthStore();

const { user } = authStore;

const userImg = computed(() => {
	return authStore.user?.image_url;
});

onMounted(() => {
	bindOutsideClickListener();
});
onBeforeUnmount(() => {
	unbindOutsideClickListener();
});
// const logoUrl = computed(() => {
// 	return `/layout/images/${layoutConfig.darkTheme.value ? 'logo-white' : 'logo-dark'}.svg`;
// });

const onTopBarMenuButton = () => {
	topbarMenuActive.value = !topbarMenuActive.value;
};

// const onSettingsClick = () => {
// 	topbarMenuActive.value = false;
// 	router.push('/utilities/documentation');
// };

const topbarMenuClasses = computed(() => {
	return {
		'layout-topbar-menu-mobile-active': topbarMenuActive.value,
	};
});

const bindOutsideClickListener = () => {
	if (!outsideClickListener.value) {
		outsideClickListener.value = event => {
			if (isOutsideClicked(event)) {
				topbarMenuActive.value = false;
			}
		};

		document.addEventListener('click', outsideClickListener.value);
	}
};

const unbindOutsideClickListener = () => {
	if (outsideClickListener.value) {
		document.removeEventListener('click', outsideClickListener);
		outsideClickListener.value = null;
	}
};

const isOutsideClicked = event => {
	if (!topbarMenuActive.value) {
		return;
	}
	const sidebarEl = document.querySelector('.layout-topbar-menu');
	const topbarEl = document.querySelector('.layout-topbar-menu-button');

	return !(
		sidebarEl.isSameNode(event.target) ||
		sidebarEl.contains(event.target) ||
		topbarEl.isSameNode(event.target) ||
		topbarEl.contains(event.target)
	);
};

const emit = defineEmits(['menuToggle']);

const themeStore = useThemeStore();
const op = ref<any>(null);
const isUserMenuActive = ref<any>(null);

function toggle(event: any) {
	op.value.toggle(event);
}

function toggleUserMenu(event: any) {
	isUserMenuActive.value.toggle(event);
}

const items = computed(() => {
	if (authStore.authinticated) {
		return [
			{
				label: 'Профиль',
				icon: 'pi pi-user',
				command: () => {
					router.push(`/profile/${user?.id}`);
				},
			},
			{
				label: 'Выйти',
				icon: 'pi pi-sign-out',
				command: () => {
					useAuthStore().logout();
					router.push('/auth/login');
				},
			},
		];
	} else {
		return [
			{
				label: 'Войти',
				icon: 'pi pi-sign-in ',
				command: () => {
					router.push('/auth/login');
				},
			},
		];
	}
});
</script>

<template>
	<div class="layout-topbar">
		<NuxtLink
			to="/"
			class="layout-topbar-logo"
		>
			<img
				class="mt--1"
				src="~/assets/images/konspect.png"
			/>
		</NuxtLink>

		<button
			class="layout-menu-button layout-topbar-button p-link"
			@click="onMenuToggle()"
		>
			<i class="pi pi-bars" />
		</button>

		<button
			class="p-link layout-topbar-button layout-topbar-menu-button"
			@click="onTopBarMenuButton()"
		>
			<i class="pi pi-ellipsis-v" />
		</button>

		<div
			class="layout-topbar-menu"
			:class="topbarMenuClasses"
		>
			<button
				class="p-link layout-topbar-button"
				@click="toggleUserMenu"
			>
				<i
					v-if="!userImg"
					class="pi pi-user"
				/>
				<img
					v-else
					class="h-40px w-40px cursor-pointer rounded-full"
					:src="userImg"
				/>
				<span>Profile</span>
			</button>
			<button
				class="p-link layout-topbar-button"
				@click="toggle"
			>
				<i class="pi pi-cog" />
				<span>Settings</span>
			</button>
		</div>
		<client-only>
			<OverlayPanel
				id="overlay_panel"
				ref="isUserMenuActive"
				append-to="body"
				style="width: 200px"
			>
				<Menu
					class="border-none"
					:model="items"
				/>
			</OverlayPanel>
		</client-only>

		<client-only>
			<OverlayPanel
				id="overlay_panel"
				ref="op"
				append-to="body"
				style="width: 200px"
			>
				<h6>Тема</h6>

				<div class="field-radiobutton">
					<RadioButton
						id="aura-dark"
						v-model="themeStore.themeName"
						name="layoutColorMode"
						value="aura-dark"
						@change="themeStore.setTheme('aura-dark')"
					/>
					<label>Тёмная тема</label>
				</div>
				<div class="field-radiobutton">
					<RadioButton
						id="aura-light"
						v-model="themeStore.themeName"
						name="layoutColorMode"
						value="aura-light"
						@change="themeStore.setTheme('aura-light')"
					/>
					<label>Светлая тема</label>
				</div>

				<!-- <h6>Primary Color</h6>
				<div class="flex">
					<div
						style="width: 2rem; height: 2rem; border-radius: 6px"
						class="mr-3 cursor-pointer bg-green-500"
						@click="themeStore.setColor('green')"
					/>
					<div
						style="width: 2rem; height: 2rem; border-radius: 6px"
						class="mr-3 cursor-pointer bg-blue-500"
						@click="themeStore.setColor('blue')"
					/>
					<div
						style="width: 2rem; height: 2rem; border-radius: 6px"
						class="mr-3 cursor-pointer bg-teal-500"
						@click="themeStore.setColor('teal')"
					/>
					<div
						style="width: 2rem; height: 2rem; border-radius: 6px"
						class="mr-3 cursor-pointer bg-purple-500"
						@click="themeStore.setColor('purple')"
					/>
					<div
						style="width: 2rem; height: 2rem; border-radius: 6px"
						class="mr-3 cursor-pointer bg-amber-500 text-8xl"
						@click="themeStore.setColor('amber')"
					/>
				</div> -->
			</OverlayPanel>
		</client-only>
	</div>
</template>

<style lang="scss" scoped></style>
