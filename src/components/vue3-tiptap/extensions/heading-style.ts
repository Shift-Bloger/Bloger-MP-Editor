import { Extension } from "@tiptap/core";

const HEADING_STYLES: Record<number, { fontSize: string; fontWeight: string }> = {
	1: { fontSize: "24px", fontWeight: "bold" },
	2: { fontSize: "22px", fontWeight: "bold" },
	3: { fontSize: "18px", fontWeight: "bold" },
	4: { fontSize: "16px", fontWeight: "bold" },
	5: { fontSize: "14px", fontWeight: "bold" },
	6: { fontSize: "12px", fontWeight: "bold" },
};

const HEADING_MARGIN_BOTTOM = "0.5em";

declare module "@tiptap/core" {
	interface Commands<ReturnType> {
		headingStyle: {};
	}
}

export const HeadingStyle = Extension.create({
	name: "headingStyle",

	addOptions() {
		return {
			types: ["heading"],
		};
	},
	//@ts-ignore
	addGlobalAttributes() {
		return [
			{
				types: this.options.types,
				attributes: {
					level: {
						default: 1,
						parseHTML: (element: HTMLElement) => parseInt(element.tagName.charAt(1), 10) || 1,
						renderHTML: (attributes: { level: number }) => {
							const style = HEADING_STYLES[attributes.level];
							if (!style) return {};
							return { style: `font-size: ${style.fontSize}; font-weight: ${style.fontWeight}; margin-bottom: ${HEADING_MARGIN_BOTTOM}` };
						},
					},
				},
			},
		];
	},
});

export default HeadingStyle;
