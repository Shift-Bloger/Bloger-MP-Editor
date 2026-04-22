import BulletList from "@tiptap/extension-bullet-list";

export interface BulletListType {
	defaultStyle: string;
	keepAttributes: boolean;
	keepMarks: boolean;
	itemTypeName: string;
}

const ListItemName = "listItem";
const TextStyleName = "textStyle";

const CustomBulletList = BulletList.extend<BulletListType>({
	addOptions() {
		return {
			...this.parent?.(),
			defaultStyle: ""
		};
	},
	addAttributes() {
		return {
			bulletStyle: {
				default: this.options.defaultStyle,
				parseHTML: element => element.getAttribute("data-bullet-style"),
				renderHTML: attributes => ({
					"data-bullet-style": attributes.bulletStyle || this.options.defaultStyle,
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
			setBulletStyle: (style: string) => () => {
				this.options.defaultStyle = style;
			},
			toggleBulletList:
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

export default CustomBulletList;
