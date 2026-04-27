<template>
	<a-popover v-model:open="visible" placement="bottom" trigger="click">
		<a-tooltip placement="top">
			<template #title>
				<span> 引用</span>
			</template>
			<div class="tool font-size" @click="visible = !visible">
				<i class="ri-at-line" style="font-size: 16px; color: var(--text-color);"></i>
				<i class="ri-arrow-down-s-line" style="font-size: 10px; color: var(--text-color);"></i>
			</div>
		</a-tooltip>
		<template #content>
			<div class="blockquote-options">
				<div class="option-item" @click="toggleBlockquote">
					<i class="ri-at-line"></i>
					<span>添加/移除引用</span>
				</div>
				<div class="color-section">
					<span class="section-title">引用颜色</span>
					<div class="color-palette">
						<div
							class="color-item"
							v-for="color in colors"
							:key="color"
							@click="setColor(color)"
							:class="{ 'active': currentColor === color }"
						>
							<div class="color-dot" :style="{ backgroundColor: color }"></div>
						</div>
					</div>
				</div>
			</div>
		</template>
	</a-popover>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";

const props = defineProps(["editor"]);
const visible = ref(false);
const currentColor = ref("rgb(140, 140, 140)"); // 默认灰色

const colors = [
    "rgb(140, 140, 140)",  // 灰色
    "rgb(225, 60, 57)",  // 红色
    "rgb(231, 95, 51)",  // 橙红色
    "rgb(235, 144, 58)",  // 橙色
    "rgb(245, 219, 77)",  // 黄色
    "rgb(114, 192, 64)",  // 绿色
    "rgb(89, 191, 192)",  // 青色
    "rgb(66, 144, 247)",  // 蓝色
    "rgb(54, 88, 226)",  // 深蓝色
    "rgb(106, 57, 201)",  // 紫色
    "rgb(216, 68, 147)"   // 粉色
];

const toggleBlockquote = () => {
	props.editor.chain().focus().toggleBlockquote().run();
	visible.value = false;
};

const setColor = (color: string) => {
	currentColor.value = color;
	if (props.editor.isActive("blockquote")) {
		props.editor.chain().focus().setBlockquoteColor(color).run();
	} else {
		// 如果当前没有引用，先添加引用再设置颜色
		props.editor.chain().focus().toggleBlockquote().setBlockquoteColor(color).run();
	}
	visible.value = false;
};

// 监听编辑器状态变化，更新当前颜色
watch(() => props.editor?.getHTML(), () => {
	if (props.editor.isActive("blockquote")) {
		const blockquote = props.editor.state.selection.$from.node(-1);
		if (blockquote && blockquote.type.name === "blockquote") {
			const color = blockquote.attrs.color;
			if (color) {
				currentColor.value = color;
			}
		}
	}
});
</script>

<style lang="scss" scoped>
.font-size {
	width: auto;
	padding: 0 8px;
	font-size: 14px;
	display: flex;
	align-items: center;
	gap: 4px;
}

.blockquote-options {
	padding: 10px;
	min-width: 200px;
}

.option-item {
	display: flex;
	align-items: center;
	gap: 8px;
	padding: 8px 10px;
	border-radius: 4px;
	cursor: pointer;
	transition: all 0.2s;
	&:hover {
		background-color: var(--frame-hover);
	}
	span {
		font-size: 14px;
		color: var(--text-color);
	}
}

.color-section {
	margin-top: 10px;
	border-top: 1px solid var(--frame-border);
	padding-top: 10px;
}

.section-title {
	display: block;
	font-size: 12px;
	color: var(--text-color-secondary);
	margin-bottom: 8px;
}

.color-palette {
	display: flex;
	flex-wrap: wrap;
	gap: 8px;
}

.color-item {
	width: 24px;
	height: 24px;
	border-radius: 4px;
	cursor: pointer;
	transition: all 0.2s;
	display: flex;
	align-items: center;
	justify-content: center;
	&:hover {
		transform: scale(1.1);
	}
	&.active {
		border: 2px solid var(--main-primary-border);
	}
}

.color-dot {
	width: 20px;
	height: 20px;
	border-radius: 3px;
}
</style>