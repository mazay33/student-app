<template>
	<Dropdown
		ref="dropdownRef"
		v-model="selectedOption"
		:option-label="optionLabel"
		:loading="loading"
		:options="options?.result"
		show-clear
		editable
		:placeholder="placeholder"
		empty-message="Ничего не найдено"
		:virtual-scroller-options="
			props.onLazyScrollLoad && {
				lazy: true,
				loading: loading,
				onLazyLoad: onLazyScrollLoad,
				itemSize: 25,
				showLoader: true,
			}
		"
		@input="onInput"
		@click="onFocus"
	>
		<template #clearicon="{ clearCallback }">
			<i
				class="pi pi-times p-dropdown-clear-icon"
				@click="clearCallback($event), (inputValue = '')"
			/>
		</template>
		<template #option="{ option }">
			<slot
				v-if="$slots.customOption"
				name="customOption"
				:option="option"
			/>
			<span v-else> {{ option[optionLabel] }}</span>
		</template>
	</Dropdown>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import type { VirtualScrollerLazyEvent } from 'primevue/virtualscroller';

interface FilterDropdownProps {
	modelValue: any;
	options: any;
	loading: boolean;
	optionLabel: string;
	placeholder: string;
	onInput: (event: InputEvent) => void;
	onLazyScrollLoad?: (event: VirtualScrollerLazyEvent) => void;
}

const props = defineProps<FilterDropdownProps>();
const emit = defineEmits(['@update:modelValue', '@update:inputValue']);

const dropdownRef = ref();
const selectedOption = ref(props.modelValue);
const inputValue = ref('');

const onInput = (event: InputEvent) => {
	const target = event.target as HTMLInputElement;
	inputValue.value = target.value;

	props.onInput(event);
};

const onFocus = (event: Event) => {
	if ((event.target as HTMLElement).closest('.p-dropdown-trigger')) {
		return;
	}
	dropdownRef.value.$data.overlayVisible = !dropdownRef.value.$data.overlayVisible;
};

watch(
	() => props.modelValue,
	newValue => {
		selectedOption.value = newValue;
	},
);

watch(selectedOption, newValue => {
	emit('@update:modelValue', newValue);
});

watch(inputValue, newValue => {
	emit('@update:inputValue', newValue);
});
</script>
