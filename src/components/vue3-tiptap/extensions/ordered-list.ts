import { OrderedList } from "@tiptap/extension-ordered-list";

// 定义扩展选项接口
interface OrderedListOptions {
	defaultStyle: string;
	keepAttributes?: boolean;
	keepMarks?: boolean;
	itemTypeName: string;
}

// 定义属性接口
interface OrderedListAttributes {
	orderedStyle: string;
}

const ListItemName = "listItem";
const TextStyleName = "textStyle";

const CustomOrderedList = OrderedList.extend<OrderedListOptions>({
	addOptions() {
		return {
			...this.parent?.(),
			defaultStyle: ""
		};
	},
	addAttributes() {
		return {
			orderedStyle: {
				default: this.options.defaultStyle,
				parseHTML: element => element.getAttribute("data-ordered-style"),
				renderHTML: (attributes: OrderedListAttributes) => ({
					"data-ordered-style": attributes.orderedStyle || this.options.defaultStyle,
					style: "margin-bottom: 0.5em; padding-left: 24px"
				})
			},
			dir: {
				default: null,
				parseHTML: element => element.dir || null,
				renderHTML: (attributes: { dir: string | null }) => {
					if (!attributes.dir) return {};
					const baseDir = { dir: attributes.dir };
					if (attributes.dir === "rtl") {
						return { ...baseDir, style: "direction: rtl; padding-left: 0; padding-right: 24px" };
					}
					return { ...baseDir, style: "direction: ltr; padding-left: 24px" };
				}
			}
		};
	},
	addCommands() {
		return {
			setOrderedStyle: (style: string) => () => {
				this.options.defaultStyle = style;
			},
			toggleOrderedList:
				() =>
					({ commands, chain }) => {
						if (this.options.keepAttributes) {
							return chain()
								.toggleList(this.name, this.options.itemTypeName, this.options.keepMarks)
								.updateAttributes(ListItemName, this.editor.getAttributes(TextStyleName))
								.run();
						}
						return commands.toggleList(this.name, this.options.itemTypeName, this.options.keepMarks);
					}
		};
	}
});

export default CustomOrderedList;
