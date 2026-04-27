import { Extension } from "@tiptap/core";

export interface MarginOptions {
    types: string[];
    margins: string[];
    defaultMargin: string;
}

declare module "@tiptap/core" {
    interface Commands<ReturnType> {
        margin: {
            setMarginTop: (data: string) => ReturnType;
            setMarginBottom: (data: string) => ReturnType;
            unsetMarginTop: () => ReturnType;
            unsetMarginBottom: () => ReturnType;
        };

    }
}

export const Margin = Extension.create({
    name: "margin",

    addOptions() {
        return {
            types: ["heading", "paragraph", "blockquote"],
            margins: ["0", "4", "8", "12", "16", "20", "24"],
            defaultMargin: "0"
        };
    },

    addGlobalAttributes() {
        return [
            {
                types: this.options.types,
                attributes: {
                    marginTop: {
                        default: this.options.defaultMargin,
                        parseHTML: (element: HTMLElement) => {
                            const marginTop = element.style.marginTop;
                            return marginTop ? marginTop.replace("px", "") : this.options.defaultMargin;
                        },
                        renderHTML: (attributes: { marginTop: string }) => {
                            if (attributes.marginTop === this.options.defaultMargin) {
                                return {};
                            }

                            return { style: `margin-top: ${attributes.marginTop}px` };
                        }
                    },
                    marginBottom: {
                        default: this.options.defaultMargin,
                        parseHTML: (element: HTMLElement) => {
                            const marginBottom = element.style.marginBottom;
                            return marginBottom ? marginBottom.replace("px", "") : this.options.defaultMargin;
                        },
                        renderHTML: (attributes: { marginBottom: string }) => {
                            if (attributes.marginBottom === this.options.defaultMargin) {
                                return {};
                            }

                            return { style: `margin-bottom: ${attributes.marginBottom}px` };
                        }
                    }
                }
            }
        ];
    },

    addCommands() {
        return {
            setMarginTop:
                (margin: string) =>
                    ({ commands }) => {
                        if (!this.options.margins.includes(margin)) {
                            return false;
                        }

                        return this.options.types.every((type: string) =>
                            commands.updateAttributes(type, { marginTop: margin })
                        );
                    },

            setMarginBottom:
                (margin: string) =>
                    ({ commands }) => {
                        if (!this.options.margins.includes(margin)) {
                            return false;
                        }

                        return this.options.types.every((type: string) =>
                            commands.updateAttributes(type, { marginBottom: margin })
                        );
                    },

            unsetMarginTop:
                () =>
                    ({ commands }) => {
                        return this.options.types.every((type: string) => commands.resetAttributes(type, "marginTop"));
                    },

            unsetMarginBottom:
                () =>
                    ({ commands }) => {
                        return this.options.types.every((type: string) => commands.resetAttributes(type, "marginBottom"));
                    }
        };
    }
});

export default Margin;