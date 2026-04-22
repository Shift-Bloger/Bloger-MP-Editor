import { Extension } from "@tiptap/core";

export interface LineHeightOptions {
	types: string[];
	heights: string[];
	defaultHeight: string;
}

declare module "@tiptap/core" {
	interface Commands<ReturnType> {
		lineHeight: {
			setLineHeight: (data: string) => ReturnType;
			unsetLineHeight: () => ReturnType;
		};

	}
}

export const LineHeight = Extension.create({
	name: "lineHeight",

	addOptions() {
		return {
			types: ["heading", "paragraph", "orderedList", "bulletList"],
			heights: ["1", "1.2", "1.5", "1.6", "1.75", "2", "2.5"],
			defaultHeight: "1.6"
		};
	},
	//@ts-ignore
	addGlobalAttributes() {
		return [
			{
				types: this.options.types,
				attributes: {
					lineHeight: {
						default: this.options.defaultHeight,
						parseHTML: (element: HTMLElement) => element.style.lineHeight || this.options.defaultHeight,
						renderHTML: (attributes: { lineHeight: string }) => {
							if (attributes.lineHeight === this.options.defaultHeight) {
								return {};
							}

							return { style: `line-height: ${attributes.lineHeight}em` };
						}
					}
				}
			}
		];
	},

	addCommands() {
		return {
			setLineHeight:
				(height: string) =>
					({ commands }) => {
						if (!this.options.heights.includes(height)) {
							return false;
						}

						return this.options.types.every((type: string) =>
							commands.updateAttributes(type, { lineHeight: height })
						);
					},

			unsetLineHeight:
				() =>
					({ commands }) => {
						return this.options.types.every((type: string) => commands.resetAttributes(type, "lineHeight"));
					}
		};
	}
});

export default LineHeight;
