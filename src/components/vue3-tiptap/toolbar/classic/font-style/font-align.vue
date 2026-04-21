<template>
	<a-popover v-model:open="visible" placement="bottom" trigger="click">
		<a-tooltip placement="top">
			<template #title>
				<span>对齐方式</span>
			</template>
			<div class="tool font-size" @click="visible = !visible">
				<i :class="activeKey" style="font-size: 16px; color: var(--text-color);"></i>
				<i class="ri-arrow-down-s-line" style="font-size: 10px; color: var(--text-color);"></i>
			</div>
		</a-tooltip>
		<template #content>
			<div class="x-flex">
				<div class="item" @click="setClassName(item)" v-for="item in options" :key="item.name">
					<a-tooltip placement="bottom">
						<template #title>
							<span>{{ item.prompt }}</span>
						</template>
						<i :class="item.icon" style="font-size: 16px; color: var(--text-color);"></i>
					</a-tooltip>
				</div>
			</div>
		</template>
	</a-popover>
</template>

<script setup lang="ts">
import { ref } from "vue";

const props = defineProps(["modelValue", "editor"]);

interface ItemType {
	name: string;
	icon: string;
	prompt: string;
}

const visible = ref(false);
const activeKey = ref("ri-align-left");
const setClassName = (item: ItemType) => {
	activeKey.value = item.icon;
	props.editor.chain().focus().setTextAlign(item.name).run();
	visible.value = false;
};

const options = [
	{
		name: "left",
		icon: "ri-align-left",
		prompt: "左对齐"
	},
	{
		name: "center",
		icon: "ri-align-center",
		prompt: "居中对齐"
	},
	{
		name: "right",
		icon: "ri-align-right",
		prompt: "右对齐"
	},
	{
		name: "justify",
		icon: "ri-align-justify",
		prompt: "两端对齐"
	}
];
</script>

<style lang="scss">
.font-size {
	width: 45px !important;
	font-size: 14px;
	gap: 5px;
}

.x-flex {
	display: flex;
	.item {
		background-color: transparent;
		transition: all 0.25s ease-out;
		cursor: pointer;
		padding: 5px 7px;
		&:hover {
			background-color: var(--main-primary-background);
		}
		display: flex;
		align-items: center;
		gap: 5px;
	}
}
</style>
