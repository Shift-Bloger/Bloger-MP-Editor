<template>
	<a-popover placement="bottom" trigger="click" v-model:open="visible">
		<a-tooltip placement="top">
			<template #title>
				<span> 字体</span>
			</template>
			<div class="tool family_button" @click="visible = !visible">
				<i class="ri-font-size" style="font-size: 16px; margin-right: 2px; color: var(--text-color);"></i>
				<i class="ri-arrow-down-s-line" style="font-size: 10px; color: var(--text-color);"></i>
			</div>
		</a-tooltip>
		<template #content>
			<div class="family-lists">
				<div class="item SegoeUI" @click="setClassName('SegoeUI')">
					默认字体 <Icon name="correct" v-if="content === 'SegoeUI'" />
				</div>
				<div class="item yahei" @click="setClassName('YaHei')">
					微软雅黑 <Icon name="correct" v-if="content === 'YaHei'" />
				</div>
				<div class="item simsun" @click="setClassName('SimSun')">
					宋体 <Icon name="correct" v-if="content === 'SimSun'" />
				</div>
				<div class="item simhei" @click="setClassName('SimHei')">
					黑体 <Icon name="correct" v-if="content === 'SimHei'" />
				</div>
				<div class="item fangsong" @click="setClassName('FangSong')">
					仿宋 <Icon name="correct" v-if="content === 'FangSong'" />
				</div>
				<div class="item times" @click="setClassName('Times')">
					Times New Roman <Icon name="correct" v-if="content === 'Times'" />
				</div>
			</div>
		</template>
	</a-popover>
</template>

<script setup lang="ts">
import Icon from "@/components/Icon/src/Icon.vue";
import { ref } from "vue";
import { FAMILY } from "./cells.js";

const props = defineProps(["modelValue", "editor"]);
const visible = ref(false);

const content = ref("SegoeUI");
const setClassName = (value: string) => {
	content.value = value;
	props.editor.chain().focus().setFontFamily(FAMILY[value]).run();
};
</script>

<style lang="scss" scoped>
.family_button {
	width: auto;
	padding: 0 8px;
	font-size: 14px;
	display: flex;
	align-items: center;
	gap: 4px;
	.family_label {
		white-space: nowrap;
		text-overflow: ellipsis;
		overflow: hidden;
	}
}
.family-lists {
	.item {
		background-color: transparent;
		transition: all 0.25s ease-out;
		cursor: pointer;
		letter-spacing: 1px;
		padding: 5px 10px;
		&:hover {
			background-color: var(--main-primary-background);
		}
		display: flex;
		align-items: center;
		gap: 5px;
		font-size: 14px;
	}
	.SegoeUI {
		font-family:
			Segoe UI,
			sans-serif;
	}
	.yahei {
		font-family:
			Microsoft YaHei,
			sans-serif;
	}
	.simsun {
		font-family: SimSun, STSong, sans-serif;
	}
	.simhei {
		font-family: SimHei, STHeiti, sans-serif;
	}
	.fangsong {
		font-family: FangSong, STFangsong, sans-serif;
	}
	.times {
		font-family:
			Times New Roman,
			sans-serif;
	}
}
</style>
