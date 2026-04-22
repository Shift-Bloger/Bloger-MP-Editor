import { Extension } from "@tiptap/core";

export interface FontFamilyAttrOptions {
	types: string[];
	defaultFontFamily: string;
}

declare module "@tiptap/core" {
	interface Commands<ReturnType> {
		fontFamilyAttr: {
			setFontFamily: (fontFamily: string) => ReturnType;
			unsetFontFamily: () => ReturnType;
		};
	}
}

export const FontFamilyAttr = Extension.create<FontFamilyAttrOptions>({
	name: "fontFamilyAttr",

	addOptions() {
		return {
			types: ["heading", "paragraph", "orderedList", "bulletList"],
			defaultFontFamily: "",
		};
	},
	//@ts-ignore
	addGlobalAttributes() {
		return [
			{
				types: this.options.types,
				attributes: {
					fontFamily: {
						default: this.options.defaultFontFamily,
						parseHTML: (element: HTMLElement) =>
							element.style.fontFamily || this.options.defaultFontFamily,
						renderHTML: (attributes: { fontFamily: string }) => {
							if (!attributes.fontFamily || attributes.fontFamily === this.options.defaultFontFamily) {
								return {};
							}
							return { style: `font-family: ${attributes.fontFamily}` };
						},
					},
				},
			},
		];
	},

	addCommands() {
		return {
			setFontFamily:
				(fontFamily: string) =>
				({ commands }) => {
					return this.options.types.every((type: string) =>
						commands.updateAttributes(type, { fontFamily })
					);
				},
			unsetFontFamily:
				() =>
				({ commands }) => {
					return this.options.types.every((type: string) =>
						commands.resetAttributes(type, "fontFamily")
					);
				},
		};
	},
});

export default FontFamilyAttr;
