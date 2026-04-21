<template>
	<div class="toolbar">
		<!-- 历史记录与格式 -->
		<ToolTemplate :editor="editor" :option="toolbars[0]" /> <!-- Undo -->
		<ToolTemplate :editor="editor" :option="toolbars[1]" /> <!-- Redo -->
		<FormatBrush :editor="editor" />
		<ToolTemplate :editor="editor" :option="toolbars[2]" /> <!-- Clear format -->
		<Dvider />

		<!-- 字体与标题 -->
		<FontFamily :editor="editor" />
		<HeaderTool :editor="editor" />
		<FontSize :editor="editor" />
		<LineHeight :editor="editor" />
		<Dvider />

		<!-- 文本样式 -->
		<ToolTemplate :editor="editor" :option="toolbars[3]" /> <!-- Bold -->
		<ToolTemplate :editor="editor" :option="toolbars[4]" /> <!-- Underline -->
		<ToolTemplate :editor="editor" :option="toolbars[6]" /> <!-- Italic -->
		<ToolTemplate :editor="editor" :option="toolbars[5]" /> <!-- Strike -->
		<FontColor :editor="editor" />
		<BgColor :editor="editor" />
		<Dvider />

		<!-- 段落排版 -->
		<ToolTemplate :editor="editor" :option="toolbars[12]" /> <!-- LTR -->
		<ToolTemplate :editor="editor" :option="toolbars[13]" /> <!-- RTL -->
		<FontAlign :editor="editor" />
		<ToolTemplate :editor="editor" :option="toolbars[8]" /> <!-- Indent -->
		<ToolTemplate :editor="editor" :option="toolbars[9]" /> <!-- Outdent -->
		<Dvider />

		<!-- 列表与引用 -->
		<OrderedList :editor="editor" />
		<BulletList :editor="editor" />
		<ToolTemplate :editor="editor" :option="toolbars[10]" /> <!-- Blockquote -->
		<ToolTemplate :editor="editor" :option="toolbars[11]" /> <!-- CodeBlock -->
		<Dvider />

		<!-- 插入元素 -->
		<LinkTool :editor="editor" />
		<ToolTemplate :editor="editor" :option="toolbars[15]" /> <!-- Unlink -->
		<ImageTool :editor="editor" />
		<VideoTool :editor="editor" />
		<PdfTool :editor="editor" />
		<TableTool :editor="editor" />
		<ToolTemplate :editor="editor" :option="toolbars[7]" /> <!-- Minus / HR -->
		<Dvider />

		<!-- 工具 -->
		<ToolTemplate :editor="editor" :option="toolbars[14]" /> <!-- Search -->
	<ToolTemplate :editor="editor" :option="toolbars[16]" /> <!-- HTML Viewer -->
	<FullScreen :editor="editor" />

	<!-- 查找与替换 -->
	<Teleport to="body">
		<FindReplace :editor="editor" :visible="visible" :closeModal="closeModal" />
	</Teleport>

	<!-- HTML 代码查看器 -->
	<Teleport to="body">
		<HtmlViewer :editor="editor" :visible="htmlViewerVisible" :closeModal="closeHtmlViewer" />
		</Teleport>

		<!-- 自定义 toolbar 插槽 -->
		<slot name="tool"></slot>
	</div>
</template>

<script setup lang="ts">
import type { Editor } from "@tiptap/core";
import type { OptionProps } from "./classic";
import { reactive, ref } from "vue";
import { createToolbarOptions } from "./classic-options";
import { useModal } from "@/hooks/useModal";
import ToolTemplate from "./tool-template.vue";
import Dvider from "@/components/dvider";
import FontColor from "./color/font-color.vue";
import BgColor from "./color/bg-color.vue";
import HeaderTool from "./header-tool.vue";
import FontFamily from "./font-style/font-family.vue";
import ImageTool from "./image-tool.vue";
import VideoTool from "./video-tool.vue";
import PdfTool from "./pdf-tool.vue";
import TableTool from "./table/table-tool.vue";
import OrderedList from "./ordered-list.vue";
import BulletList from "./bullet-List.vue";
import LinkTool from "./link-tool.vue";
import FullScreen from "./fullscreen.vue";
import FindReplace from "./find-replace/find-replace.vue";
import FontSize from "./font-style/font-size.vue";
import FontAlign from "./font-style/font-align.vue";
import FormatBrush from "./format-brush.vue";
import LineHeight from "./font-style/line-height.vue";
import HtmlViewer from "./html-viewer.vue";

interface ToolbarProps {
	editor: Editor;
}
const { visible, toggleModal, closeModal } = useModal();
const { visible: htmlViewerVisible, toggleModal: toggleHtmlViewer, closeModal: closeHtmlViewer } = useModal();

const props = defineProps<ToolbarProps>();
const toolbars: OptionProps[] = reactive(
	createToolbarOptions(props.editor, {
		searchoutlined: {
			toggleModal
		},
		htmlviewer: {
			toggleModal: toggleHtmlViewer
		}
	})
);
</script>

<style scoped>
.toolbar {
	display: flex;
	align-items: center;
	gap: 3px;
	flex-shrink: 0;
	flex-wrap: wrap;
	box-sizing: border-box;
	padding: 5px 8px;
	position: relative;
}

.toolbar::before {
	bottom: 0;
	background-color: var(--main-primary-border);
	content: "";
	height: 1px;
	left: 0;
	margin: 0 10px;
	right: 0;
	position: absolute;
}
</style>
