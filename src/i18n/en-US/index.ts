import type { BaseTranslation } from '../types';

export default {
  toolbar: {
    undo: 'Undo (Ctrl+Z)',
    redo: 'Redo (Ctrl+Y)',
    selectAll: 'Select all (Ctrl+A)',
    paragraph: 'Paragraph',
    blockQuote: 'Block quotation',
    numberedList: 'Numbered list',
    bulletedList: 'Bulleted list',
    checklist: 'Checklist',
    alignLeft: 'Align left',
    alignCenter: 'Align center',
    alignRight: 'Align right',
    alignJustify: 'Align justify',
    increaseIndent: 'Increase indent',
    decreaseIndent: 'Decrease indent',
    bold: 'Bold (Ctrl+B)',
    italic: 'Italic (Ctrl+I)',
    underline: 'Underline (Ctrl+U)',
    strikethrough: 'Strikethrough',
    superscript: 'Superscript',
    subscript: 'Subscript',
    code: 'Inline code',
    removeFormat: 'Remove format',
    formatPainter: 'Format painter',
    link: 'Link',
    hr: 'Horizontal line',
    codeBlock: 'Code block',
    heading: 'Heading',
    heading1: 'Heading 1',
    heading2: 'Heading 2',
    heading3: 'Heading 3',
    heading4: 'Heading 4',
    heading5: 'Heading 5',
    heading6: 'Heading 6',
    list: 'List',
    align: 'Alignment',
    indent: 'Indent',
    fontFamily: 'Font family',
    fontSize: 'Font size',
    moreStyle: 'More style',
    fontColor: 'Font color',
    highlight: 'Highlight',
    image: 'Image',
    removeColor: 'Remove color',
  },
  link: {
    newLink: 'New link',
    url: 'URL',
    title: 'Link title',
    copy: 'Copy link to clipboard',
    open: 'Open link in new tab',
    save: 'Save',
    unlink: 'Remove link',
  },
  image: {
    view: 'Full screen',
    remove: 'Delete',
    previous: 'Previous',
    next: 'Next',
    close: 'Close (Esc)',
    loadingError: 'The image cannot be loaded',
    zoomOut: 'Zoom out',
    zoomIn: 'Zoom in',
  },
} satisfies BaseTranslation;
