import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import { VueNodeViewRenderer } from "@tiptap/vue-3";
import CodeBlockView from "@/components/vue3-tiptap/extension-view/code-block-view.vue";

const CodeBlockLights = CodeBlockLowlight.extend({
	name: "CodeBlockLights",
	addAttributes() {
		return {
			...this.parent?.(),
			language: {
				default: "html",
				parseHTML: element => {
					// 支持读取我们自定义的 data-language
					const dataLang = element.getAttribute("data-language");
					if (dataLang) return dataLang;

					// 兼容标准的 <pre><code class="language-xxx">
					const codeNode = element.querySelector("code");
					if (codeNode) {
						const classMatch = codeNode.className.match(/language-(\w+)/);
						if (classMatch) return classMatch[1];
					}

					return "html";
				}
			}
		};
	},
	parseHTML() {
		return [
			{
				tag: "section.mac-code-block",
				preserveWhitespace: "full",
				contentElement: "pre",
				getAttrs: element => {
					return {
						language: element.getAttribute("data-language") || "html"
					};
				}
			},
			{
				tag: "pre",
				preserveWhitespace: "full"
			}
		];
	},
	addNodeView() {
		return VueNodeViewRenderer(CodeBlockView);
	},
	renderHTML({ node }) {
		const lang = node.attrs.language || "html";
		return [
			// 使用 section 替代 div，防止微信公众号自动过滤
			"section",
			{
				class: "mac-code-block",
				"data-language": lang,
				// 外层 Mac 风格窗口内联样式
				style: "background-color: #282c34; border-radius: 8px; margin: 20px 0; overflow: hidden; font-family: Consolas, Monaco, 'Andale Mono', 'Ubuntu Mono', monospace;"
			},
			[
				// 顶部状态栏 (红黄绿三个点 + 语言提示) - 避免使用 display: flex，微信会过滤
				"section",
				{
					style: "height: 32px; line-height: 32px; padding: 0 16px; background-color: #21252b; display: block;"
				},
				// span 标签内加入不换行空格 &nbsp; 实体字符，确保微信公众号不会过滤
				["span", { style: "width: 12px; height: 12px; border-radius: 50%; background-color: #fc625d; margin-right: 8px; display: inline-block; vertical-align: middle; line-height: 12px; overflow: hidden; font-size: 0;" }, "\u00A0"],
				["span", { style: "width: 12px; height: 12px; border-radius: 50%; background-color: #fdbc40; margin-right: 8px; display: inline-block; vertical-align: middle; line-height: 12px; overflow: hidden; font-size: 0;" }, "\u00A0"],
				["span", { style: "width: 12px; height: 12px; border-radius: 50%; background-color: #35cd4b; display: inline-block; vertical-align: middle; line-height: 12px; overflow: hidden; font-size: 0;" }, "\u00A0"],
				["span", { style: "float: right; color: #abb2bf; font-size: 12px; vertical-align: middle;" }, lang]
			],
			[
				// 恢复上一次成功的 pre 标签样式，不带圆角等额外样式，并移除 block 和 white-space，保证和之前一次一样
				"pre",
				{
					class: `code-snippet code-snippet__${lang} code-snippet_nowrap`,
					"data-lang": lang,
					style: "padding: 16px; margin: 0; overflow-x: auto; color: #abb2bf; font-size: 14px; line-height: 1.6; display: block; white-space: pre; background: #282c34;"
				},
				// code 标签不添加任何样式，由外层 pre 及公众号 CSS 接管高亮
				["code", {}, 0]
			]
		];
	}
});

export default CodeBlockLights;