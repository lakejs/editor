import type LakeCore from '../main';

export default (editor: LakeCore) => {
  editor.commands.add('indent', (type: 'increase' | 'decrease') => {
    editor.focus();
    const blocks = editor.selection.getBlocks();
    for (const block of blocks) {
      let value = window.parseInt(block.css('margin-left'), 10) || 0;
      if (type === 'increase') {
        value += 40;
      } else {
        value -= 40;
      }
      if (value <= 0) {
        value = 0;
      }
      if (value === 0) {
        block.css('margin-left', '');
      } else {
        block.css('margin-left', `${value}px`);
      }
      if (block.attr('style') === '') {
        block.removeAttr('style');
      }
    }
    editor.history.save();
    editor.select();
  });
};