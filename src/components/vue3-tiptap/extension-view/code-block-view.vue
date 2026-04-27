<template>
	<!-- 编辑器内的代码块使用 section 和防过滤内联样式 -->
	<node-view-wrapper as="section" class="code-block" style="background-color: #282c34; border-radius: 8px; margin: 20px 0; overflow: hidden; font-family: Consolas, Monaco, 'Andale Mono', 'Ubuntu Mono', monospace;">
		<section class="mac-header" style="height: 32px; line-height: 32px; padding: 0 16px; background-color: #21252b; display: block; font-size: 0;">
			<span style="width: 12px; height: 12px; border-radius: 50%; background-color: #fc625d; margin-right: 8px; display: inline-block; vertical-align: middle; line-height: 12px; overflow: hidden; font-size: 0;">&nbsp;</span>
			<span style="width: 12px; height: 12px; border-radius: 50%; background-color: #fdbc40; margin-right: 8px; display: inline-block; vertical-align: middle; line-height: 12px; overflow: hidden; font-size: 0;">&nbsp;</span>
			<span style="width: 12px; height: 12px; border-radius: 50%; background-color: #35cd4b; display: inline-block; vertical-align: middle; line-height: 12px; overflow: hidden; font-size: 0;">&nbsp;</span>
			<div style="float: right; vertical-align: middle;">
				<a-select ref="select" v-model:value="selectedLanguage" :bordered="false" class="language-select" popupClassName="mac-code-dropdown">
					<a-select-option v-for="(language, index) in languages" :value="language" :key="index">{{
						language
					}}</a-select-option>
				</a-select>
			</div>
		</section>
		<!-- NodeViewContent将可编辑内容添加到节点视图中 -->
		<pre :class="'code-snippet code-snippet__' + selectedLanguage + ' code-snippet_nowrap'" :data-lang="selectedLanguage" style="padding: 16px; margin: 0; overflow-x: auto; color: #abb2bf; font-size: 14px; line-height: 1.6; display: block; white-space: pre; background: #282c34;"><code><node-view-content /></code></pre>
	</node-view-wrapper>
</template>

<script setup lang="ts">
import { NodeViewWrapper, nodeViewProps, NodeViewContent } from "@tiptap/vue-3";
import { ref, computed } from "vue";

const props = defineProps(nodeViewProps);
const languages = ref(['html', 'css', 'javascript', 'java', 'python', 'php', 'typescript', 'json', 'scss', 'sql', 'vue', 'bash']);

const selectedLanguage = computed({
	get() {
		return props.node.attrs.language || 'html';
	},
	set(language) {
		props.updateAttributes({ language });
	}
});
</script>

<style lang="scss" scoped>
.code-block {
	:deep(.language-select) {
		display: block;
		width: 100px;
		.ant-select-selector {
			background: transparent !important;
			color: #abb2bf !important;
			box-shadow: none !important;
			border: none !important;
			text-align: right;
			.ant-select-selection-item {
				line-height: 32px;
				padding-right: 20px !important;
			}
		}
		.ant-select-arrow {
			color: #abb2bf;
		}
	}
}
</style>