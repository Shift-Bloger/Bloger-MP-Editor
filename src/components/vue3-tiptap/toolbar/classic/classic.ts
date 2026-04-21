import type { Editor } from "@tiptap/core";

export interface OptionProps {
	name: string;
	component?: any;
	icon?: string;
	tip: string;
	click: () => void;
	dblclick?: () => void;
	active?: boolean;
	isActive?: (editor: Editor) => boolean;
}
