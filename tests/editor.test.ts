import { debug, query } from '../src/utils';
import { Nodes } from '../src/models/nodes';
import { Box } from '../src/models/box';
import { Editor } from '../src/editor';
import { click } from './utils';

function insertText(editor: Editor, data: string) {
  const event = new InputEvent('input', {
    data,
    inputType: 'insertText',
    isComposing: false,
  });
  editor.container.emit('beforeinput', event);
  const nativeRange = editor.selection.range.get();
  nativeRange.insertNode(document.createTextNode(data));
  nativeRange.collapse(false);
  editor.container.emit('input', event);
}

function insertCompositionText(editor: Editor, data: string) {
  editor.container.emit('compositionstart');
  const event = new InputEvent('input', {
    data,
    inputType: 'insertCompositionText',
    isComposing: true,
  });
  editor.container.emit('beforeinput', event);
  const nativeRange = editor.selection.range.get();
  nativeRange.insertNode(document.createTextNode(data));
  nativeRange.collapse(false);
  editor.container.emit('input', event);
  editor.container.emit('compositionend');
}

function deleteContentBackward(editor: Editor) {
  const event = new InputEvent('input', {
    inputType: 'deleteContentBackward',
    isComposing: false,
  });
  editor.container.emit('beforeinput', event);
  const nativeRange = editor.selection.range.get();
  nativeRange.setStart(nativeRange.startContainer, nativeRange.startOffset - 1);
  // debug('start node:', nativeRange.startContainer, ', offset:', nativeRange.startOffset);
  // debug('end node:', nativeRange.endContainer, ', offset:', nativeRange.endOffset);
  nativeRange.deleteContents();
  editor.container.emit('input', event);
}

describe('editor', () => {

  let rootNode: Nodes;

  beforeEach(() => {
    Editor.box.add({
      type: 'inline',
      name: 'inlineBox',
      render: () => '<img />',
    });
    Editor.box.add({
      type: 'block',
      name: 'blockBox',
      render: () => '<hr />',
    });
    rootNode = query('<div class="lake-root" />');
    query(document.body).append(rootNode);
  });

  afterEach(() => {
    Editor.box.remove('inlineBox');
    Editor.box.remove('blockBox');
    rootNode.remove();
  });

  it('config: spellcheck is true', () => {
    const editor = new Editor({
      root: rootNode,
      spellcheck: true,
    });
    editor.render();
    expect(editor.container.attr('spellcheck')).to.equal('true');
    editor.unmount();
  });

  it('config: readonly is true', () => {
    const input = '<p>foo<focus /></p>';
    const output = '<p>foo<focus /></p>';
    const contentView = new Editor({
      root: rootNode,
      readonly: true,
      value: input,
    });
    contentView.render();
    const readonly = contentView.readonly;
    const value = contentView.getValue();
    debug(`output: ${value}`);
    contentView.unmount();
    expect(readonly).to.equal(true);
    expect(value).to.equal(output);
  });

  it('config: tabIndex is -1', () => {
    const editor = new Editor({
      root: rootNode,
      tabIndex: -1,
    });
    editor.render();
    expect(editor.container.attr('tabindex')).to.equal('-1');
    editor.unmount();
  });

  it('config: indentWithTab is false', () => {
    const editor = new Editor({
      root: rootNode,
      indentWithTab: false,
    });
    editor.render();
    expect(editor.config.indentWithTab).to.equal(false);
    editor.unmount();
  });

  it('config: should return Chinese', () => {
    const editor = new Editor({
      root: rootNode,
      lang: 'zh-CN',
    });
    editor.render();
    expect(editor.locale.toolbar.code()).to.equal('行内代码');
    editor.unmount();
  });

  it('config: minChangeSize is false', () => {
    const editor = new Editor({
      root: rootNode,
      minChangeSize: 10,
    });
    editor.render();
    expect(editor.config.minChangeSize).to.equal(10);
    editor.unmount();
  });

  it('config: empty default value', () => {
    const input = '';
    const output = '';
    const editor = new Editor({
      root: rootNode,
      value: input,
    });
    editor.render();
    const value = editor.getValue();
    debug(`output: ${value}`);
    editor.unmount();
    expect(value).to.equal(output);
  });

  it('rectifyContent method: no content', () => {
    const input = '';
    const output = '<p><br /><focus /></p>';
    const editor = new Editor({
      root: rootNode,
    });
    editor.render();
    editor.container.html(input);
    editor.history.save();
    const value = editor.getValue();
    debug(`output: ${value}`);
    editor.unmount();
    expect(value).to.equal(output);
  });

  it('rectifyContent method: br', () => {
    const input = '<br />';
    const output = '<p><br /><focus /></p>';
    const editor = new Editor({
      root: rootNode,
    });
    editor.render();
    editor.container.html(input);
    editor.history.save();
    const value = editor.getValue();
    debug(`output: ${value}`);
    editor.unmount();
    expect(value).to.equal(output);
  });

  it('rectifyContent method: br and empty mark', () => {
    const input = '<br /><span></span>';
    const output = '<p><br /><focus /></p>';
    const editor = new Editor({
      root: rootNode,
    });
    editor.render();
    editor.container.html(input);
    editor.history.save();
    const value = editor.getValue();
    debug(`output: ${value}`);
    editor.unmount();
    expect(value).to.equal(output);
  });

  it('rectifyContent method: br and empty block', () => {
    const input = '<br /><p></p>';
    const output = '<p><br /><focus /></p>';
    const editor = new Editor({
      root: rootNode,
    });
    editor.render();
    editor.container.html(input);
    editor.history.save();
    const value = editor.getValue();
    debug(`output: ${value}`);
    editor.unmount();
    expect(value).to.equal(output);
  });

  it('setPluginConfig method: plugin config is not set', () => {
    const editor = new Editor({
      root: rootNode,
    });
    editor.render();
    editor.setPluginConfig('testPlugin', {
      key2: 'bb',
      key3: 'cc',
    });
    expect(editor.config.testPlugin.key1).to.equal(undefined);
    expect(editor.config.testPlugin.key2).to.equal('bb');
    expect(editor.config.testPlugin.key3).to.equal('cc');
    editor.unmount();
  });

  it('setPluginConfig method: plugin config is set', () => {
    const editor = new Editor({
      root: rootNode,
      testPlugin: {
        key1: 'aa',
        key2: 'bb',
      },
    });
    editor.render();
    editor.setPluginConfig('testPlugin', {
      key2: 'b',
      key3: 'c',
    });
    expect(editor.config.testPlugin.key1).to.equal('aa');
    expect(editor.config.testPlugin.key2).to.equal('bb');
    expect(editor.config.testPlugin.key3).to.equal('c');
    editor.unmount();
  });

  it('method: getValue', () => {
    const input = '<p><strong>\u200B# <focus />foo</strong></p>';
    const output = '<p><strong># <focus />foo</strong></p>';
    const editor = new Editor({
      root: rootNode,
      value: input,
    });
    editor.render();
    const value = editor.getValue();
    debug(`output: ${value}`);
    editor.unmount();
    expect(value).to.equal(output);
  });

  it('method: setValue', () => {
    const input = '<p><strong>\u200B# <focus />foo</strong></p>';
    const output = '<p><strong># <focus />foo</strong></p>';
    const editor = new Editor({
      root: rootNode,
    });
    editor.render();
    editor.setValue(input);
    const value = editor.getValue();
    debug(`output: ${value}`);
    editor.unmount();
    expect(value).to.equal(output);
  });

  it('method: hasFocus / focus / blur', () => {
    const editor = new Editor({
      root: rootNode,
    });
    editor.container.on('focusin', ()=> {
      editor.root.addClass('lake-root-focused');
    });
    editor.container.on('focusout', ()=> {
      editor.root.removeClass('lake-root-focused');
    });
    editor.render();
    editor.focus();
    expect(editor.hasFocus).to.equal(true);
    expect(rootNode.hasClass('lake-root-focused')).to.equal(true);
    editor.blur();
    expect(editor.hasFocus).to.equal(false);
    expect(rootNode.hasClass('lake-root-focused')).to.equal(false);
    editor.unmount();
  });

  it('method: insertBox', () => {
    const output = '<p><lake-box type="inline" name="inlineBox" focus="end"></lake-box></p>';
    const editor = new Editor({
      root: rootNode,
      value: '<p><br /><focus /></p>',
    });
    editor.render();
    expect(editor.box.getInstances(editor).size).to.equal(0);
    editor.insertBox('inlineBox');
    expect(editor.box.getInstances(editor).size).to.equal(1);
    const value = editor.getValue();
    debug(`output: ${value}`);
    editor.unmount();
    expect(value).to.equal(output);
  });

  it('method: removeBox', () => {
    const input = '<p>foo<lake-box type="inline" name="inlineBox" focus="start"></lake-box>bar</p>';
    const output = '<p>foo<focus />bar</p>';
    const editor = new Editor({
      root: rootNode,
    });
    editor.render();
    editor.setValue(input);
    expect(editor.box.getInstances(editor).size).to.equal(1);
    editor.removeBox();
    expect(editor.box.getInstances(editor).size).to.equal(0);
    const value = editor.getValue();
    debug(`output: ${value}`);
    editor.unmount();
    expect(value).to.equal(output);
  });

  it('box class: should not have any class', () => {
    const input = '<p>foo<lake-box type="inline" name="inlineBox" focus="start"></lake-box>bar</p>';
    const editor = new Editor({
      root: rootNode,
    });
    editor.render();
    editor.setValue(input);
    const boxNode = editor.container.find('lake-box');
    const box = new Box(boxNode);
    const boxContainer = box.getContainer();
    const isActivated = boxContainer.hasClass('lake-box-activated');
    const isFocused = boxContainer.hasClass('lake-box-focused');
    const isSelected = boxContainer.hasClass('lake-box-selected');
    const isHovered = boxContainer.hasClass('lake-box-hovered');
    editor.unmount();
    expect(isActivated).to.equal(false);
    expect(isFocused).to.equal(false);
    expect(isSelected).to.equal(false);
    expect(isHovered).to.equal(false);
  });

  it('box class: should have activated class', done => {
    const input = '<p>foo<lake-box type="inline" name="inlineBox" focus="start"></lake-box>bar</p>';
    const editor = new Editor({
      root: rootNode,
    });
    editor.render();
    editor.setValue(input);
    const range = editor.selection.range;
    const boxNode = editor.container.find('lake-box');
    const box = new Box(boxNode);
    const boxContainer = box.getContainer();
    boxContainer.emit('mouseenter');
    editor.event.once('boxselectionstylechange', () => {
      const isActivated = boxContainer.hasClass('lake-box-activated');
      const isFocused = boxContainer.hasClass('lake-box-focused');
      const isSelected = boxContainer.hasClass('lake-box-selected');
      const isHovered = boxContainer.hasClass('lake-box-hovered');
      editor.unmount();
      expect(isActivated).to.equal(true);
      expect(isFocused).to.equal(false);
      expect(isSelected).to.equal(false);
      expect(isHovered).to.equal(false);
      done();
    });
    range.selectNodeContents(boxContainer);
  });

  it('box class: should have focused class', done => {
    const input = '<p>foo<lake-box type="inline" name="inlineBox" focus="start"></lake-box>bar</p>';
    const editor = new Editor({
      root: rootNode,
    });
    editor.render();
    editor.setValue(input);
    const range = editor.selection.range;
    const boxNode = editor.container.find('lake-box');
    const box = new Box(boxNode);
    const boxContainer = box.getContainer();
    boxContainer.emit('mouseenter');
    editor.event.once('boxselectionstylechange', () => {
      const isActivated = boxContainer.hasClass('lake-box-activated');
      const isFocused = boxContainer.hasClass('lake-box-focused');
      const isSelected = boxContainer.hasClass('lake-box-selected');
      const isHovered = boxContainer.hasClass('lake-box-hovered');
      editor.unmount();
      expect(isActivated).to.equal(false);
      expect(isFocused).to.equal(true);
      expect(isSelected).to.equal(false);
      expect(isHovered).to.equal(false);
      done();
    });
    range.selectBox(boxNode);
  });

  it('box class: should have selected class', done => {
    const input = '<p>foo<lake-box type="inline" name="inlineBox" focus="start"></lake-box>bar</p>';
    const editor = new Editor({
      root: rootNode,
    });
    editor.render();
    editor.setValue(input);
    const range = editor.selection.range;
    const boxNode = editor.container.find('lake-box');
    const box = new Box(boxNode);
    const boxContainer = box.getContainer();
    editor.event.once('boxselectionstylechange', () => {
      const isActivated = boxContainer.hasClass('lake-box-activated');
      const isFocused = boxContainer.hasClass('lake-box-focused');
      const isSelected = boxContainer.hasClass('lake-box-selected');
      const isHovered = boxContainer.hasClass('lake-box-hovered');
      editor.unmount();
      expect(isActivated).to.equal(false);
      expect(isFocused).to.equal(false);
      expect(isSelected).to.equal(true);
      expect(isHovered).to.equal(false);
      done();
    });
    range.selectNodeContents(editor.container);
  });

  it('box class: should have hovered class', () => {
    const input = '<p>foo<lake-box type="inline" name="inlineBox" focus="start"></lake-box>bar</p>';
    const editor = new Editor({
      root: rootNode,
    });
    editor.render();
    editor.setValue(input);
    const boxNode = editor.container.find('lake-box');
    const box = new Box(boxNode);
    const boxContainer = box.getContainer();
    boxContainer.emit('mouseenter');
    const isActivated = boxContainer.hasClass('lake-box-activated');
    const isFocused = boxContainer.hasClass('lake-box-focused');
    const isSelected = boxContainer.hasClass('lake-box-selected');
    const isHovered = boxContainer.hasClass('lake-box-hovered');
    editor.unmount();
    expect(isActivated).to.equal(false);
    expect(isFocused).to.equal(false);
    expect(isSelected).to.equal(false);
    expect(isHovered).to.equal(true);
  });

  it('input event: input text in the start strip of inline box', done => {
    const input = '<p>foo<lake-box type="inline" name="inlineBox" focus="start"></lake-box>bar</p>';
    const output = '<p>fooa<focus /><lake-box type="inline" name="inlineBox"></lake-box>bar</p>';
    const editor = new Editor({
      root: rootNode,
    });
    editor.render();
    editor.setValue(input);
    editor.event.once('input', () => {
      const value = editor.getValue();
      debug(`output: ${value}`);
      editor.unmount();
      expect(value).to.equal(output);
      done();
    });
    insertText(editor, 'a');
  });

  it('input event: input text in the end strip of inline box', done => {
    const input = '<p>foo<lake-box type="inline" name="inlineBox" focus="end"></lake-box>bar</p>';
    const output = '<p>foo<lake-box type="inline" name="inlineBox"></lake-box>a<focus />bar</p>';
    const editor = new Editor({
      root: rootNode,
    });
    editor.render();
    editor.setValue(input);
    editor.event.once('input', () => {
      const value = editor.getValue();
      debug(`output: ${value}`);
      editor.unmount();
      expect(value).to.equal(output);
      done();
    });
    insertText(editor, 'a');
  });

  it('input event: input composition text in the start strip of inline box', done => {
    const input = '<p>foo<lake-box type="inline" name="inlineBox" focus="start"></lake-box>bar</p>';
    const output = '<p>foo你好<focus /><lake-box type="inline" name="inlineBox"></lake-box>bar</p>';
    const editor = new Editor({
      root: rootNode,
    });
    editor.render();
    editor.setValue(input);
    editor.event.once('input', () => {
      const value = editor.getValue();
      debug(`output: ${value}`);
      editor.unmount();
      expect(value).to.equal(output);
      done();
    });
    insertCompositionText(editor, '你好');
  });

  it('statechange event', done => {
    const editor = new Editor({
      root: rootNode,
      value: '<p><br /><focus /></p>',
    });
    editor.render();
    editor.event.once('statechange', stateData => {
      expect(stateData.appliedItems[0].name).to.equal('h1');
      editor.unmount();
      done();
    });
    editor.command.execute('heading', 'h1');
  });

  it('change event: execute command', done => {
    const editor = new Editor({
      root: rootNode,
      value: '<p><br /><focus /></p>',
    });
    editor.render();
    editor.event.once('change', (value: string) => {
      expect(value).to.equal('<h1><br /><focus /></h1>');
      editor.unmount();
      done();
    });
    editor.command.execute('heading', 'h1');
  });

  it('change event: input data', done => {
    const editor = new Editor({
      root: rootNode,
      value: '<p>foo<focus /></p>',
    });
    editor.render();
    editor.event.once('change', (value: string) => {
      expect(value).to.equal('<p>fooa<focus /></p>');
      editor.unmount();
      done();
    });
    insertText(editor, 'a');
  });

  it('change event: input and delete data', done => {
    const editor = new Editor({
      root: rootNode,
      value: '<p>foo<focus /></p>',
    });
    editor.render();
    let calledCount = 0;
    editor.event.on('change', (value: string) => {
      calledCount++;
      if (calledCount === 1) {
        expect(value).to.equal('<p>fooa<focus /></p>');
        deleteContentBackward(editor);
      }
      if (calledCount === 2) {
        expect(value).to.equal('<p>foo<focus /></p>');
        editor.unmount();
        done();
      }
    });
    insertText(editor, 'a');
  });

  it('single editor: click event', () => {
    const editor = new Editor({
      root: rootNode,
    });
    editor.render();
    let clickCount = 0;
    editor.event.on('click', () => {
      clickCount++;
    });
    click(rootNode);
    expect(clickCount).to.equal(1);
    click(query(editor.popupContainer));
    expect(clickCount).to.equal(1);
    editor.unmount();
  });

  it('multi-editor: click event', () => {
    const rootNode2 = query('<div class="lake-root" />');
    query(document.body).append(rootNode2);
    const editor = new Editor({
      root: rootNode,
    });
    editor.render();
    let clickCount = 0;
    editor.event.on('click', () => {
      clickCount++;
    });
    const editor2 = new Editor({
      root: rootNode2,
    });
    editor2.render();
    let clickCount2 = 0;
    editor2.event.on('click', () => {
      clickCount2++;
    });
    click(rootNode2);
    expect(clickCount).to.equal(1);
    expect(clickCount2).to.equal(1);
    click(query(editor.popupContainer));
    expect(clickCount).to.equal(1);
    expect(clickCount2).to.equal(1);
    editor.unmount();
    editor2.unmount();
    rootNode2.remove();
  });

});
