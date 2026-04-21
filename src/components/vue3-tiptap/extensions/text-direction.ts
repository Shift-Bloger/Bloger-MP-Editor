import { Extension } from '@tiptap/core'

export interface TextDirectionOptions {
  types: string[]
  directions: string[]
  defaultDirection: string | null
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    textDirection: {
      /**
       * Set the text direction attribute
       */
      setTextDirection: (direction: string) => ReturnType
      /**
       * Unset the text direction attribute
       */
      unsetTextDirection: () => ReturnType
    }
  }
}

export const TextDirection = Extension.create<TextDirectionOptions>({
  name: 'textDirection',

  addOptions() {
    return {
      types: ['heading', 'paragraph'],
      directions: ['ltr', 'rtl', 'auto'],
      defaultDirection: null,
    }
  },

  addGlobalAttributes() {
    return [
      {
        types: this.options.types,
        attributes: {
          dir: {
            default: this.options.defaultDirection,
            parseHTML: element => element.dir || element.style.direction || null,
            renderHTML: attributes => {
              if (attributes.dir === this.options.defaultDirection) {
                return null
              }
              return { dir: attributes.dir }
            },
          },
        },
      },
    ]
  },

  addCommands() {
    return {
      setTextDirection:
        (direction: string) =>
        ({ commands }) => {
          if (!this.options.directions.includes(direction)) {
            return false
          }
          return this.options.types.every(type =>
            commands.updateAttributes(type, { dir: direction }),
          )
        },
      unsetTextDirection:
        () =>
        ({ commands }) => {
          return this.options.types.every(type =>
            commands.resetAttributes(type, 'dir'),
          )
        },
    }
  },

  addKeyboardShortcuts() {
    return {
      'Mod-Alt-l': () => this.editor.commands.setTextDirection('ltr'),
      'Mod-Alt-r': () => this.editor.commands.setTextDirection('rtl'),
    }
  },
})

export default TextDirection
