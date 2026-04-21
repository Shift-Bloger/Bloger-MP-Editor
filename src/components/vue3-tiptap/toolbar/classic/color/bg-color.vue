<template>
	<a-popover placement="bottom" trigger="click">
		<template #content>
			<div class="color-more no-color" @click="clearColor">
				<div class="color-circle">
					<i class="ri-blur-off-line" style="font-size: 16px; margin-right: 4px; color: var(--text-color);"></i>
					无颜色
				</div>
			</div>
			<ul class="colors-palette">
				<li
					:class="[
						'color-item',
						{
							border_black: currentIndex === index
						}
					]"
					v-for="(color, index) in colors"
					:key="color"
					@click="toggleColor(color, index)"
				>
					<div class="color-box" :style="{ background: color }"></div>
				</li>
			</ul>

			<a-popover placement="right">
				<template #content>
					<ColorPicker @updateColor="onUpdateColor" />
				</template>
				<div class="color-more">
					<div class="color-circle">
						<Icon name="color-picker" />
						更多颜色
					</div>
					<div>
						<i class="ri-arrow-right-s-line" style="font-size: 12px; color: var(--text-color);"></i>
					</div>
				</div>
			</a-popover>
		</template>
		<a-tooltip placement="top">
			<template #title> <span>背景颜色</span> </template>
			<div
				:class="[
					'tool',
					{
						'tool--active': editor.isActive('highlight')
					}
				]"
			>
				<i class="ri-paint-brush-line" style="font-size: 16px; color: var(--text-color);"></i>
				<i class="ri-arrow-down-s-line" style="font-size: 10px; color: var(--text-color);"></i>
			</div>
		</a-tooltip>
	</a-popover>
</template>

<script setup lang="ts">
import { getTextColor } from "./cells";
import { ref, reactive } from "vue";
import ColorPicker from "@/components/color-picker/color-picker.vue";
import Icon from "@/components/Icon/src/Icon.vue";

const props = defineProps(["editor"]);
const colors = reactive(getTextColor());
const currentIndex = ref(9);

const toggleColor = (color: string, index: number) => {
	currentIndex.value = index;
	props.editor.chain().focus().setHighlight({ color: color }).run();
};

const clearColor = () => {
	currentIndex.value = -1;
	props.editor.chain().focus().unsetHighlight().run();
};

const onUpdateColor = (color: string) => {
	props.editor.chain().focus().setHighlight({ color }).run();
};
</script>

<style lang="scss" scoped>
.border_black {
	border: 1px solid var(--text-color) !important;
}
.colors-palette {
	list-style: none;
	width: 230px;
	display: flex;
	flex-wrap: wrap;
	.color-item {
		padding: 2px;
		border: 1px solid transparent;
		transition: border 0.2s ease-out;
		cursor: pointer;
		border-radius: 3px;
		&:hover {
			border: 1px solid var(--text-secondary);
		}
		.color-box {
			border: 1px solid var(--frame-border);
			background-color: rgb(235, 144, 58);
			border-radius: 3px;
			width: 17px;
			height: 17px;
		}
	}
}

.color-more {
	cursor: pointer;
	width: 100%;
	padding: 5px 8px;
	border-top: 1px solid var(--frame-border);
	display: flex;
	justify-content: space-between;
	align-items: center;
	background: transparent;
	transition: background 0.3s;
	border-radius: 4px;
	color: var(--text-color);
	&:hover {
		background: var(--main-primary-background);
	}
	.color-circle {
		display: flex;
		column-gap: 5px;
		align-items: center;
	}
}
.no-color {
	border-top: none;
	border-bottom: 1px solid var(--frame-border);
	margin-bottom: 8px;
	justify-content: flex-start;
}
</style>
