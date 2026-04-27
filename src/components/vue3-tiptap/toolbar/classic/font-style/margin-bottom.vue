<template>
	<a-popover v-model:open="visible" placement="bottom" trigger="click">
		<a-tooltip placement="top">
			<template #title>
				<span> 段后距</span>
			</template>
			<div class="tool font-size" @click="visible = !visible">
					<i class="ri-sort-desc" style="font-size: 16px; margin-right: 2px; color: var(--text-color);"></i>
					<div class="size-label">
						<span class="label"> {{ content }}px</span>
					</div>
					<i class="ri-arrow-down-s-line" style="font-size: 10px; color: var(--text-color);"></i>
				</div>
		</a-tooltip>
		<template #content>
			<div class="size-lists">
				<div
					class="size-lists-text size-lists-item"
					@click="setMargin(item.value)"
					v-for="item in options"
					:key="item.value"
				>
					<span class="pr-2">{{ item.label }}</span>
					<Icon name="correct" v-if="content === item.value" />
				</div>
			</div>
		</template>
	</a-popover>
</template>

<script setup lang="ts">
import Icon from "@/components/Icon/src/Icon.vue";
import { ref } from "vue";

const props = defineProps(["modelValue", "editor"]);
const visible = ref(false);

const content = ref(0);
const setMargin = (value: number) => {
	content.value = value;
	const margin = String(value);
	props.editor.chain().focus().setMarginBottom(margin).run();
	visible.value = false;
};

const options = [
	{ label: "0px", value: 0 },
	{ label: "4px", value: 4 },
	{ label: "8px", value: 8 },
	{ label: "12px", value: 12 },
	{ label: "16px", value: 16 },
	{ label: "20px", value: 20 },
	{ label: "24px", value: 24 }
];
</script>

<style lang="scss">
.font-size {
	width: auto;
	padding: 0 8px;
	font-size: 14px;
	display: flex;
	align-items: center;
	gap: 4px;
}
.size-label {
	white-space: nowrap;
	text-overflow: ellipsis;
	overflow: hidden;
	.label {
		font-size: 14px;
	}
}
.size-lists {
	&-item {
		background-color: transparent;
		transition: all 0.25s ease-out;
		cursor: pointer;
		letter-spacing: 2px;
		padding: 5px 10px;
		&:hover {
			background-color: var(--main-primary-background);
		}
		display: flex;
		align-items: center;
		gap: 10px;
	}
	&-text {
		font-size: 14px;
	}
}
</style>