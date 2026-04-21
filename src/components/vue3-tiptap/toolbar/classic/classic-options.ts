import type { OptionProps } from "./classic";
import type { Editor } from "@tiptap/core";

export const createToolbarOptions = (
	editor: Editor,
	methods: Record<string, any>
): OptionProps[] => [
	{
		name: "Undo",
		icon: "ri-arrow-go-back-line",
		tip: "撤销",
		click() {
			editor.chain().focus().undo().run();
		},
		active: false
	},
	{
		name: "Redo",
		icon: "ri-arrow-go-forward-line",
		tip: "重做",
		click() {
			editor.chain().focus().redo().run();
		},
		active: false
	},
	{
		name: "Delete",
		icon: "ri-eraser-line",
		tip: "清除格式",
		click() {
			editor.chain().focus().clearNodes().unsetAllMarks().run();
		},
		active: false
	},
	{
		name: "bold",
		icon: "ri-bold",
		click() {
			editor.chain().focus().toggleBold().run();
		},
		tip: "粗体",
		active: false
	},
	{
		name: "underline",
		icon: "ri-underline",
		click() {
			editor.chain().focus().toggleUnderline().run();
		},
		tip: "下划线",
		active: false
	},
	{
		name: "strike",
		icon: "ri-strikethrough",
		click() {
			editor.chain().focus().toggleStrike().run();
		},
		tip: "删除线",
		active: false
	},
	{
		name: "italic",
		icon: "ri-italic",
		tip: "斜体",
		click() {
			editor.chain().focus().toggleItalic().run();
		},
		active: false
	},
	{
		name: "Minus",
		icon: "ri-separator",
		tip: "水平线",
		click() {
			editor.chain().focus().setHorizontalRule().run();
		},
		active: false
	},
	{
		name: "MenuUnfold",
		icon: "ri-indent-increase",
		tip: "缩进",
		click() {
			editor.chain().focus().indent().run();
		},
		active: false
	},
	{
		name: "MenuFold",
		icon: "ri-indent-decrease",
		tip: "取消缩进",
		click() {
			editor.chain().focus().outdent().run();
		},
		active: false
	},
	{
		name: "blockquote",
		icon: "ri-at-line",
		click() {
			editor.chain().focus().toggleBlockquote().run();
		},
		tip: "引用",
		active: false
	},
	{
		name: "codeBlock",
		icon: "ri-code-box-line",
		click() {
			editor.chain().focus().toggleCodeBlock().run();
		},
		tip: "代码块",
		active: false
	},
	{
		name: "ltr",
		icon: "ri-text-direction-l",
		click() {
			if (editor.isActive({ dir: "ltr" })) {
				editor.chain().focus().unsetTextDirection().run();
			} else {
				editor.chain().focus().setTextDirection("ltr").run();
			}
		},
		tip: "从左到右(LTR)",
		active: false,
		isActive: (editor) => editor.isActive({ dir: "ltr" })
	},
	{
		name: "rtl",
		icon: "ri-text-direction-r",
		click() {
			if (editor.isActive({ dir: "rtl" })) {
				editor.chain().focus().unsetTextDirection().run();
			} else {
				editor.chain().focus().setTextDirection("rtl").run();
			}
		},
		tip: "从右到左(RTL)",
		active: false,
		isActive: (editor) => editor.isActive({ dir: "rtl" })
	},
	{
		name: "searchoutlined",
		icon: "ri-search-line",
		tip: "查找",
		click() {
			const { toggleModal } = methods[this.name];
			toggleModal();
		},
		active: false
	},
	{
		name: "unsetlink",
		icon: "ri-link-unlink-m",
		tip: "取消链接",
		click() {
			editor.chain().focus().extendMarkRange("link").unsetLink().run();
		},
		active: false
	}
];
