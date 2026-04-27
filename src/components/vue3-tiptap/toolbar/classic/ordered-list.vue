<template>
	<a-popover v-model:open="visible" placement="bottom" trigger="click">
		<div>
			<a-tooltip placement="top">
				<template #title>
					<span> 有序列表</span>
				</template>
				<div :class="[
					'tool ordered_button',
					{
						'tool--active': isActive
					}
				]">
					<i class="ri-list-ordered" style="font-size: 18px; color: var(--text-color);"></i>
					<i class="ri-arrow-down-s-line" style="font-size: 10px; color: var(--text-color);"></i>
				</div>
			</a-tooltip>
		</div>

		<template #content>
			<div class="order-lists">
				<div v-for="item in orderList" :key="item.type" class="order-lists-item" @click="setDataSet(item.type)"
					:class="[{ 'order-lists__border': isActive && currentStyle === item.type }]">
						<Icon :name="item.icon" :size="20" />
						<span class="list-label">{{ item.label }}</span>
					</div>
			</div>
		</template>
	</a-popover>
</template>

<script setup lang="ts">
import Icon from "@/components/Icon/src/Icon.vue";
import { computed, ref } from "vue";

const emit = defineEmits(["update:modelValue", "change"]);
const props = defineProps(["modelValue", "editor"]);
const visible = ref(false);
const currentStyle = ref("");

const orderList = [
	{
		type: "chinese",
		icon: "ol-chinese-number",
		label: "汉字"
	},
	{
		type: "decimal",
		icon: "ol-decimal",
		label: "数字"
	},
	{
		type: "letter",
		icon: "ol-upper-alpha",
		label: "英文"
	}
];

const isActive = computed(() => {
	return props.editor?.isActive("orderedList");
});

const setDataSet = (style: string) => {
	if (isActive.value && currentStyle.value === style) {
		props.editor.chain().focus().toggleOrderedList().run();
	} else {
		if (!isActive.value) {
			props.editor.chain().focus().toggleOrderedList().run();
		}
	}
	currentStyle.value = style;
	props.editor
		.chain()
		.focus()
		.setOrderedStyle(style)
		.updateAttributes("orderedList", { orderedStyle: style })
		.run();
	visible.value = false;
};
</script>

<style lang="scss" scoped>
.ordered_button {
	width: 45px;
	gap: 5px;
}

.order-lists {
	width: 120px;
	display: flex;
	flex-direction: column;
	gap:10px;
	&-item {
		transition: all 0.2s;
		cursor: pointer;
		display: flex;
		align-items: center;
		padding: 5px 10px;
		gap: 10px;
		&:hover {
			background-color: var(--main-primary-background);
			border-radius: 4px;
		}
	}
}

.list-label {
	font-size: 14px;
	color: var(--text-color);
	white-space: nowrap;
}
</style>