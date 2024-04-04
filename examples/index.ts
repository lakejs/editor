import './index.css';
import { Editor, Utils, Dropdown } from '../src';
import defaultEditor from './default-editor';
import fullEditor from './full-editor';
import documentEditor from './document-editor';
import miniatureEditor from './miniature-editor';
import headlessEditor from './headless-editor';

const { query, safeTemplate } = Utils;

declare global {
  interface Window {
    Editor: typeof Editor;
    editor: Editor;
    defaultValue: string;
    miniatureValue: string;
    headlessValue: string;
    hugeValue: string;
  }
}

window.Editor = Editor;

const menuItems = [
  {
    url: './',
    text: 'Default configuration',
    source: 'https://github.com/lakejs/lake/blob/master/examples/default-editor.ts',
    editorValue: window.defaultValue,
    editor: defaultEditor,
  },
  {
    url: './full-featured',
    text: 'Full-featured editor',
    source: 'https://github.com/lakejs/lake/blob/master/examples/full-editor.ts',
    editorValue: window.defaultValue,
    editor: fullEditor,
  },
  {
    url: './document',
    text: 'Document editor',
    source: 'https://github.com/lakejs/lake/blob/master/examples/default-editor.ts',
    editorValue: window.defaultValue,
    editor: documentEditor,
  },
  {
    url: './miniature',
    text: 'Miniature toolbar',
    source: 'https://github.com/lakejs/lake/blob/master/examples/miniature-editor.ts',
    editorValue: window.miniatureValue,
    editor: miniatureEditor,
  },
  {
    url: './headless',
    text: 'Headless editor',
    source: 'https://github.com/lakejs/lake/blob/master/examples/headless-editor.ts',
    editorValue: window.headlessValue,
    editor: headlessEditor,
  },
  {
    url: './huge-content',
    text: 'Huge Content',
    source: 'https://github.com/lakejs/lake/blob/master/examples/default-editor.ts',
    editorValue: window.hugeValue,
    editor: defaultEditor,
  },
];

const languageMenuItems = [
  {
    value: 'en-US',
    text: 'English',
  },
  {
    value: 'zh-CN',
    text: '简体中文',
  },
  {
    value: 'ja',
    text: '日本語',
  },
  {
    value: 'ko',
    text: '한국어',
  },
];

const menuItemMap: Map<string, typeof menuItems[0]> = new Map();
for (const item of menuItems) {
  const type = item.url.substring(2) || 'default';
  menuItemMap.set(type, item);
}

function renderHeader(pageType: string): void {
  const currentItem = menuItemMap.get(pageType);
  if (!currentItem) {
    return;
  }
  const titleNode = query('.header .title');
  titleNode.text(currentItem.text);
  const sourceNode = query('.header .source');
  sourceNode.append(`<a href="${currentItem.source}" target="_blank" title="View Source"><img src="../assets/icons/code.svg" /></a>`);
  const localStorageKey = 'lake-example-language';
  const languageDropdown = new Dropdown({
    root: query('.header .language'),
    name: 'language',
    icon: '<img src="../assets/icons/globe.svg" />',
    defaultValue: localStorage.getItem(localStorageKey) ?? 'en-US',
    tooltip: 'Select language',
    width: 'auto',
    menuType: 'list',
    menuItems: languageMenuItems,
    hasDocumentClick: true,
    onSelect: value => {
      localStorage.setItem(localStorageKey, value);
      window.location.reload();
    },
  });
  languageDropdown.render();
  const menuNode = query('.header .menu');
  menuNode.append('<button type="button" name="list"><img src="../assets/icons/list.svg" /></button>');
  const ul = query('<ul />');
  menuNode.append(ul);
  for (const item of menuItems) {
    ul.append(safeTemplate`<li><a href="${item.url}">${item.text}</a></li>`);
  }
  let timeoutId: number | null = null;
  menuNode.on('mouseenter', () => {
    if (timeoutId) {
      window.clearTimeout(timeoutId);
      timeoutId = null;
    }
    menuNode.find('button').addClass('hovered');
    menuNode.find('ul').show();
  });
  menuNode.on('mouseleave', () => {
    timeoutId = window.setTimeout(() => {
      menuNode.find('button').removeClass('hovered');
      menuNode.find('ul').hide();
    }, 300);
  });
}

function renderEditor(pageType: string): void {
  const currentItem = menuItemMap.get(pageType);
  if (!currentItem) {
    return;
  }
  if (pageType === 'document') {
    query(document.body).addClass('document');
  }
  const localStorageKey = `lake-example-${pageType}`;
  const editorValue = localStorage.getItem(localStorageKey) ?? currentItem.editorValue;
  const editor = currentItem.editor(editorValue);
  editor.event.on('change', value => {
    localStorage.setItem(localStorageKey, value);
  });
  window.editor = editor;
}

function renderPage(): void {
  const url = window.location.href;
  const pageType = url.split('/').pop() || 'default';
  renderHeader(pageType);
  renderEditor(pageType);
}

renderPage();
