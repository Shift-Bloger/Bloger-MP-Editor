<template>
	<a-popover placement="bottom" trigger="click" v-model:open="visible">
		<a-tooltip placement="top">
			<template #title>
				<span> 段落</span>
			</template>
			<div class="tool header-tool">
				<i class="ri-sort-desc" style="font-size: 16px; margin-right: 2px; color: var(--text-color);"></i>
				<i class="ri-arrow-down-s-line" style="font-size: 10px; color: var(--text-color);"></i>
			</div>
		</a-tooltip>
		<template #content>
			<div class="header-lists">
				<h1 class="header-lists-h1 header-lists-item" @click="setClassName(1)">
					一级标题
					<Icon name="correct" v-if="content === '一级标题'" />
				</h1>
				<h2 class="header-lists-h2 header-lists-item" @click="setClassName(2)">
					二级标题 <Icon name="correct" v-if="content === '二级标题'" />
				</h2>
				<h3 class="header-lists-h3 header-lists-item" @click="setClassName(3)">
					三级标题 <Icon name="correct" v-if="content === '三级标题'" />
				</h3>
				<h4 class="header-lists-h4 header-lists-item" @click="setClassName(4)">
					四级标题 <Icon name="correct" v-if="content === '四级标题'" />
				</h4>
				<div class="header-lists-text header-lists-item" @click="setClassName(0)">
					正文
					<Icon name="correct" v-if="content === '正文'" />
				</div>
			</div>
		</template>
	</a-popover>
</template>

<script setup lang="ts">
import { ref } from "vue";
import type { Editor } from "@tiptap/core";
import Icon from "@/components/Icon/src/Icon.vue";

type Level = 0 | 1 | 2 | 3 | 4 | 5 | 6;
interface HeaderProps {
	editor: Editor;
}

const props = defineProps<HeaderProps>();

const header = ["正文", "一级标题", "二级标题", "三级标题", "四级标题"];
const visible = ref(false);
const content = ref("正文");
const setClassName = (value: Level) => {
	content.value = header[value];
	visible.value = false;
	if (value === 0) {
		props.editor.chain().focus().setParagraph().run();
	} else {
		props.editor.chain().focus().toggleHeading({ level: value }).run();
	}
};
</script>

<style lang="scss" scoped>
.header-tool {
	width: auto;
	font-size: 14px;
	padding: 0 8px;
	display: flex;
	align-items: center;
	gap: 4px;
	.header_label {
		white-space: nowrap;
		text-overflow: ellipsis;
		overflow: hidden;
	}
}
.header-lists {
	&-item {
		background-color: transparent;
		transition: all 0.25s ease-out;
		cursor: pointer;
		letter-spacing: 1px;
		padding: 6px 10px;
		margin-bottom: 4px;
		&:hover {
			border-radius: 4px;
			background-color: var(--main-primary-background);
		}
		display: flex;
		align-items: center;
		line-height: 1.25;
	}
	&-text {
		font-size: 14px;
		font-weight: 400;
	}
	&-h1 {
		font-size: 24px;
		font-weight: bold;
	}
	&-h2 {
		font-size: 20px;
		font-weight: bold;
	}
	&-h3 {
		font-size: 18px;
		font-weight: bold;
	}
	&-h4 {
		font-size: 16px;
		font-weight: bold;
	}
}
</style>
