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
		const rawText = node.textContent || "";
		const lines = rawText.split("\n");
		if (lines.length > 0 && lines[lines.length - 1] === "") {
			lines.pop();
		}
		const safeLines = lines.length > 0 ? lines : [""];
		const codeLines = safeLines.map(line => {
			const normalized = (line || "").replace(/\t/g, "    ");
			const preserved = normalized.length > 0 ? normalized.replace(/ /g, "\u00A0") : "\u00A0";
			return ["code", {}, preserved] as const;
		});
		return [
			// 使用 section 替代 div，防止微信公众号自动过滤
			"section",
			{
				class: "mac-code-block",
				"data-language": lang,
				style: "background-color: #1e1e1e; border-radius: 8px; margin: 15px 0; overflow: hidden; font-family: Consolas, Monaco, 'Andale Mono', 'Ubuntu Mono', monospace;"
			},
			[
				// 顶部状态栏 (红黄绿三个点 + 语言提示)
				"section",
				{
					style: "background-color: #2d2d2d; height: 50px;line-height: 30px;padding: 10px 16px; display: flex;align-items: center;"
				},
				["span", { style: "width: 12px; height: 12px; border-radius: 50%; background-color: #fc625d; margin-right: 8px; display: inline-block; vertical-align: middle; line-height: 12px; overflow: hidden;" }, "\u00A0"],
				["span", { style: "width: 12px; height: 12px; border-radius: 50%; background-color: #fdbc40; margin-right: 8px; display: inline-block; vertical-align: middle; line-height: 12px; overflow: hidden;" }, "\u00A0"],
				["span", { style: "width: 12px; height: 12px; border-radius: 50%; background-color: #35cd4b; display: inline-block; vertical-align: middle; line-height: 12px; overflow: hidden;" }, "\u00A0"],
				["span", { style: "color: #abb2bf; font-size: 12px; flex: 1; text-align: right;" }, lang]
			],
			[
				"pre",
				{
					class: `code-snippet code-snippet_nowrap`,
					"data-lang": lang,
					style: "padding: 0.5em 1em 1em 3em; margin: 0; border: 0px; overflow-x: auto; color: #abb2bf; font-size: 14px; line-height: 1.6; display: block; white-space: pre; word-break: break-all; background: #1e1e1e !important;"
				},
				...codeLines
			]
		];
	}
});

export default CodeBlockLights;