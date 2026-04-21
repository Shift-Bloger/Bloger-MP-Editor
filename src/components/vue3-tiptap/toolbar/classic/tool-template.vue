<template>
	<a-tooltip placement="top" :show-after="200">
		<template #title>
			<span>{{ option.tip }}</span>
		</template>
		<div
			:class="['tool', (option.isActive ? option.isActive(editor) : editor.isActive(option.name)) ? 'tool--active' : '']"
			@click="option.click"
			@dblclick="option.dblclick"
		>
			<i v-if="option.icon" :class="option.icon" style="font-size: 16px; font-weight: normal; color: var(--text-color);"></i>
			<component v-else :is="option.component" style="font-size: 16px" />
		</div>
	</a-tooltip>
</template>

<script setup lang="ts">
import type { Editor } from "@tiptap/core";
import type { OptionProps } from "./classic";

interface ToolTemplateProps {
	editor: Editor;
	option: OptionProps;
}

defineProps<ToolTemplateProps>();
</script>
