import { Extension } from "@tiptap/core";

export interface CustomTextStyleOptions {
	types: string[];
	defaultFontSize: string | null;
}

declare module "@tiptap/core" {
	interface Commands<ReturnType> {
		customTextStyle: {
			setFontSize: (fontSize: string) => ReturnType;
			unsetFontSize: () => ReturnType;
		};
	}
}

export const CustomTextStyle = Extension.create<CustomTextStyleOptions>({
	name: "customTextStyle",

	addOptions() {
		return {
			types: ["heading", "paragraph", "orderedList", "bulletList"],
			defaultFontSize: null,
		};
	},
	//@ts-ignore
	addGlobalAttributes() {
		return [
			{
				types: this.options.types,
				attributes: {
					fontSize: {
						default: this.options.defaultFontSize,
						parseHTML: (element: HTMLElement) => {
							const fs = element.style.fontSize;
							if (!fs) return this.options.defaultFontSize;
							return fs.replace("px", "");
						},
						renderHTML: (attributes: { fontSize: string | null }) => {
							if (!attributes.fontSize || attributes.fontSize === this.options.defaultFontSize) {
								return {};
							}
							return { style: `font-size: ${attributes.fontSize}px` };
						},
					},
				},
			},
		];
	},

	addCommands() {
		return {
			setFontSize:
				(fontSize: string) =>
				({ commands }) => {
					return this.options.types.every((type: string) =>
						commands.updateAttributes(type, { fontSize })
					);
				},
			unsetFontSize:
				() =>
				({ commands }) => {
					return this.options.types.every((type: string) =>
						commands.resetAttributes(type, "fontSize")
					);
				},
		};
	},
});

export default CustomTextStyle;
