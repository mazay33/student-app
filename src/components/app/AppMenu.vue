<script setup lang="ts">
import AppMenuItem from './AppMenuItem.vue';
import { useNavigationMenu } from '~/composables/navigation';

const { navigationMenu } = useNavigationMenu();
// const model = navigationMenu()
</script>

<template>
	<ul
		v-if="navigationMenu"
		class="layout-menu"
	>
		<template
			v-for="(item, i) in navigationMenu"
			:key="item"
		>
			<app-menu-item
				:item="item"
				:index="i"
			/>
			<li class="menu-separator" />
		</template>
	</ul>
</template>

<style lang="scss" scoped></style>
