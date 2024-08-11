import { click } from '../utils';
import { query } from '../../src/utils';
import { Editor, Nodes } from '../../src';

const defaultItems: string[] = [
  'heading1',
  'heading2',
  'heading3',
  'heading4',
  'heading5',
  'heading6',
  'paragraph',
  'blockQuote',
  'numberedList',
  'bulletedList',
  'checklist',
  'hr',
  'codeBlock',
  'video',
  'equation',
];

describe('plugins / slash', () => {

  let rootNode: Nodes;
  let editor: Editor;

  beforeEach(()=> {
    rootNode = query('<div class="lake-editor"><div class="lake-root"></div></div>');
    query(document.body).append(rootNode);
    editor = new Editor({
      root: rootNode.find('.lake-root'),
      value: '<p><br /><focus /></p>',
      slash: {
        items: defaultItems,
      },
    });
    editor.render();
  });

  afterEach(() => {
    editor.unmount();
    rootNode.remove();
  });

  it('should return correct config', () => {
    expect(editor.config.slash.items).to.deep.equal(defaultItems);
  });

  it('should show a popup box', () => {
    editor.setValue('<p>/<focus /></p>');
    editor.container.emit('keyup', new KeyboardEvent('keyup', {
      key: '/',
    }));
    expect(editor.popupContainer.find('.lake-slash-popup').computedCSS('display')).to.equal('block');
  });

  it('should not show a popup box when there is no block', () => {
    editor.setValue('/<focus />');
    editor.container.emit('keyup', new KeyboardEvent('keyup', {
      key: '/',
    }));
    expect(editor.popupContainer.find('.lake-slash-popup').length).to.equal(0);
  });

  it('should not show a popup box when the block contains a box', () => {
    editor.setValue('<p>/<focus /><lake-box type="inline" name="equation"></lake-box></p>');
    editor.container.emit('keyup', new KeyboardEvent('keyup', {
      key: '/',
    }));
    expect(editor.popupContainer.find('.lake-slash-popup').length).to.equal(0);
  });

  it('should not show a popup box when there is no slash', () => {
    editor.setValue('<p>code<focus /></p>');
    editor.container.emit('keyup', new KeyboardEvent('keyup', {
      key: 'e',
    }));
    expect(editor.popupContainer.find('.lake-slash-popup').length).to.equal(0);
  });

  it('should not show a popup box when the search result is empty', () => {
    editor.setValue('<p>//<focus /></p>');
    editor.container.emit('keyup', new KeyboardEvent('keyup', {
      key: '/',
    }));
    expect(editor.popupContainer.find('.lake-slash-popup').computedCSS('display')).to.equal('none');
  });

  it('should set current block to heading 1', () => {
    editor.setValue('<p>/heading<focus /></p>');
    const event = new KeyboardEvent('keyup', {
      key: '/',
    });
    editor.container.emit('keyup', event);
    click(editor.popupContainer.find('.lake-slash-item').eq(0));
    expect(editor.popupContainer.find('.lake-slash-popup').computedCSS('display')).to.equal('none');
    const value = editor.getValue();
    expect(value).to.equal('<h1><focus /><br /></h1>');
  });

  it('should set current block to heading 6', () => {
    editor.setValue('<p>/heading 6<focus /></p>');
    editor.container.emit('keyup', new KeyboardEvent('keyup', {
      key: '/',
    }));
    click(editor.popupContainer.find('.lake-slash-item').eq(0));
    expect(editor.popupContainer.find('.lake-slash-popup').computedCSS('display')).to.equal('none');
    const value = editor.getValue();
    expect(value).to.equal('<h6><focus /><br /></h6>');
  });

  it('should insert an equation', () => {
    editor.setValue('<p>/equation<focus /></p>');
    editor.container.emit('keyup', new KeyboardEvent('keyup', {
      key: '/',
    }));
    click(editor.popupContainer.find('.lake-slash-item').eq(0));
    expect(editor.popupContainer.find('.lake-slash-popup').computedCSS('display')).to.equal('none');
    const value = editor.getValue();
    expect(value).to.equal('<p><lake-box type="inline" name="equation" focus="end"></lake-box></p>');
  });

  it('should remove marks', () => {
    editor.setValue('<p><strong>/heading 6<focus /></strong></p>');
    editor.container.emit('keyup', new KeyboardEvent('keyup', {
      key: '/',
    }));
    click(editor.popupContainer.find('.lake-slash-item').eq(0));
    expect(editor.popupContainer.find('.lake-slash-popup').computedCSS('display')).to.equal('none');
    const value = editor.getValue();
    expect(value).to.equal('<h6><focus /><br /></h6>');
  });

  it('should update items when backspace key is entered', () => {
    editor.setValue('<p>/heading 6<focus /></p>');
    editor.container.emit('keyup', new KeyboardEvent('keyup', {
      key: '/',
    }));
    expect(editor.popupContainer.find('.lake-slash-popup').computedCSS('display')).to.equal('block');
    expect(editor.popupContainer.find('.lake-slash-item').length).to.equal(1);
    editor.setValue('<p>/heading <focus /></p>');
    editor.container.emit('keyup', new KeyboardEvent('keyup', {
      key: 'Backspace',
    }));
    expect(editor.popupContainer.find('.lake-slash-popup').computedCSS('display')).to.equal('block');
    expect(editor.popupContainer.find('.lake-slash-item').length).to.equal(6);
  });

  it('should hide popup when the search result is empty', () => {
    editor.setValue('<p>/heading 6<focus /></p>');
    editor.container.emit('keyup', new KeyboardEvent('keyup', {
      key: '/',
    }));
    expect(editor.popupContainer.find('.lake-slash-popup').computedCSS('display')).to.equal('block');
    expect(editor.popupContainer.find('.lake-slash-item').length).to.equal(1);
    editor.setValue('<p>/heading 61<focus /></p>');
    editor.container.emit('keyup', new KeyboardEvent('keyup', {
      key: '1',
    }));
    expect(editor.popupContainer.find('.lake-slash-popup').computedCSS('display')).to.equal('none');
  });

  it('should show popup when backspace key is entered', () => {
    editor.setValue('<p>/heading 6<focus /></p>');
    editor.container.emit('keyup', new KeyboardEvent('keyup', {
      key: '/',
    }));
    expect(editor.popupContainer.find('.lake-slash-popup').computedCSS('display')).to.equal('block');
    expect(editor.popupContainer.find('.lake-slash-item').length).to.equal(1);
    editor.setValue('<p>/heading 61<focus /></p>');
    editor.container.emit('keyup', new KeyboardEvent('keyup', {
      key: '1',
    }));
    expect(editor.popupContainer.find('.lake-slash-popup').computedCSS('display')).to.equal('none');
    editor.setValue('<p>/heading 6<focus /></p>');
    editor.container.emit('keyup', new KeyboardEvent('keyup', {
      key: 'Backspace',
    }));
    expect(editor.popupContainer.find('.lake-slash-popup').computedCSS('display')).to.equal('block');
    expect(editor.popupContainer.find('.lake-slash-item').length).to.equal(1);
  });

});