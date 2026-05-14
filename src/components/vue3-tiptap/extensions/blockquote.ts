import { Blockquote } from "@tiptap/extension-blockquote";
import { Extension } from "@tiptap/core";

// 生成浅色调颜色
function getLightColor(color: string) {
    // 设置 50% 透明度
    const rgbMatch = color.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
    if (rgbMatch) {
        const r = parseInt(rgbMatch[1]);
        const g = parseInt(rgbMatch[2]);
        const b = parseInt(rgbMatch[3]);
        return `rgba(${r}, ${g}, ${b}, 0.3)`;
    }
    return "rgba(255, 249, 230, 0.3)";
}

const CustomBlockquote = Blockquote.extend({
    //@ts-ignore
    addGlobalAttributes() {
        return [
            {
                types: ["blockquote"],
                attributes: {
                    dir: {
                        default: null,
                        parseHTML: (element: any) => element.dir || null,
                        renderHTML: (attributes: any) => {
                            const dir = attributes.dir;
                            const color = attributes.color || "rgb(140, 140, 140)"; // 默认灰色
                            const lightColor = getLightColor(color);

                            if (dir === "rtl") {
                                return {
                                    dir: "rtl",
                                    style: `background-color: ${lightColor}; border-left: none; border-right: 3px solid ${color}; padding: 15px; line-height: 1.8; border-radius: 0 4px 4px 0;`
                                };
                            }
                            return {
                                style: `background-color: ${lightColor}; border-left: 3px solid ${color}; padding: 15px; line-height: 1.8; border-radius: 4px 0 0 4px;`
                            };
                        }
                    },
                    color: {
                        default: "rgb(140, 140, 140)", // 默认灰色
                        parseHTML: (element: any) => {
                            // 从 style 中提取颜色
                            const style = element.style.cssText;
                            const borderMatch = style.match(/border-(left|right): 3px solid (rgb\([^)]+\))/);
                            return borderMatch ? borderMatch[2] : "rgb(140, 140, 140)";
                        },
                        renderHTML: (attributes: any) => {
                            return {};
                        }
                    }
                }
            }
        ];
    },
    parseHTML() {
        return [
            {
                tag: "blockquote"
            },
            {
                tag: "section"
            }
        ];
    },
    renderHTML({ HTMLAttributes }) {
        return ["section", HTMLAttributes, 0];
    },

    addCommands() {
        return {
            ...this.parent?.(),
            setBlockquoteColor: (color: string) => ({
                commands
            }: { commands: any }) => {
                return commands.updateAttributes("blockquote", { color });
            }
        };
    }
});

export default CustomBlockquote;
