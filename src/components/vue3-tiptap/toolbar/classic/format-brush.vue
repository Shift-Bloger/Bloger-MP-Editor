<template>
	<a-tooltip placement="top" :show-after="200">
		<template #title> 格式刷 </template>
		<div
			:class="['tool', editor.isActive('formatBrush') ? 'tool--active' : '']"
			@click="onClick"
			@dblclick="onDblclick"
		>
			<i class="ri-brush-3-line" style="font-size: 16px; color: var(--text-color);"></i>
		</div>
	</a-tooltip>
</template>

<script setup lang="ts">
import { ref } from "vue";

const props = defineProps(["editor"]);
const timer = ref();

const onClick = () => {
	clearTimeout(timer.value);
	timer.value = setTimeout(() => {
		props.editor.chain().focus().copyFormat({ type: "click" }).run();
	}, 300);
};
const onDblclick = () => {
	clearTimeout(timer.value);
	props.editor.chain().focus().copyFormat({ type: "dblclick" }).run();
};
</script>

<style lang="scss" scoped></style>
