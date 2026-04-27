<template>
	<a-popover v-model:open="visible" placement="bottom" trigger="click">
		<a-tooltip placement="top">
			<template #title>
				<span> 无序列表</span>
			</template>
			<div :class="[
				'tool bullet_button',
				{
					'tool--active': isActive
				}
			]">
				<i class="ri-list-unordered" style="font-size: 18px; color: var(--text-color);"></i>
				<i class="ri-arrow-down-s-line" style="font-size: 10px; color: var(--text-color);"></i>
			</div>
		</a-tooltip>

		<template #content>
			<div class="bullet-lists">
				<div v-for="item in bulletList" :key="item.type" class="bullet-lists-item"
				@click="setDataSet(item.type)"
				:class="[{ 'bullet-lists__border': isActive && currentStyle === item.type }]">
					<Icon :name="item.icon" :size="18" />
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

const bulletList = [
	{
		type: "disc",
		icon: "ul-solid-circle",
		label: "实心圆点"
	},
	{
		type: "circle",
		icon: "ul-hollow-circle",
		label: "空心圆点"
	},
	{
		type: "square",
		icon: "ul-solid-square",
		label: "实心方块"
	}
];
const currentStyle = ref("");
const isActive = computed(() => {
	return props.editor?.isActive("bulletList");
});

const setDataSet = (style: string) => {
	if (isActive.value && currentStyle.value === style) {
		props.editor.chain().focus().toggleBulletList().run();
	} else {
		if (!isActive.value) {
			props.editor.chain().focus().toggleBulletList().run();
		}
	}
	currentStyle.value = style;
	props.editor
		.chain()
		.focus()
		.setBulletStyle(style)
		.updateAttributes("bulletList", { bulletStyle: style })
		.run();
	visible.value = false;
};
</script>

<style lang="scss" scoped>
.bullet_button {
	width: 45px;
	gap: 5px;
}

.bullet-lists {
	width: 120px;
	display: flex;
	flex-direction: column;
	gap: 10px;

	&-item {
		cursor: pointer;
		padding: 5px 10px;
		display: flex;
		align-items: center;
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