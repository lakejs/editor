import { BoxComponent } from '../types/box';
import { query } from '../utils/query';
import { safeTemplate } from '../utils/safe-template';
import { Button } from '../ui/button';

const defaultExpression = String.raw`\sqrt{x}`;

export const equationBox: BoxComponent = {
  type: 'inline',
  name: 'equation',
  render: box => {
    const editor = box.getEditor();
    if (!editor) {
      return;
    }
    const rootNode = query('<div class="lake-equation" />');
    const boxContainer = box.getContainer();
    boxContainer.empty();
    boxContainer.append(rootNode);
    const katex = window.katex;
    if (!katex) {
      if (editor.readonly) {
        box.node.hide();
        return;
      }
      rootNode.addClass('lake-equation-error');
      rootNode.text(`
        The equation cannot be displayed because window.katex is not found.
        Please check if the "katex" library is added to this page.
      `.trim());
      rootNode.on('click', () => {
        editor.selection.selectBox(box);
      });
      return;
    }
    const defaultCode = box.value.code || '';
    const viewNode = query('<div class="lake-equation-view" />');
    rootNode.append(viewNode);
    viewNode.html(window.katex.renderToString(defaultCode || defaultExpression, {
      throwOnError: false,
    }));
    viewNode.on('click', () => {
      editor.selection.selectBox(box);
    });
    const formNode = query(safeTemplate`
      <div class="lake-equation-form">
        <div class="lake-row">
          <textarea name="code" placeholder="${editor.locale.equation.placeholder()}"></textarea>
        </div>
        <div class="lake-row lake-button-row"></div>
      </div>
    `);
    rootNode.append(formNode);
    const textareaNode = formNode.find('textarea');
    const textareaNativeNode = (textareaNode.get(0) as HTMLTextAreaElement);
    textareaNativeNode.value = defaultCode;
    textareaNode.on('input', () => {
      viewNode.html(window.katex.renderToString(textareaNativeNode.value || defaultExpression, {
        throwOnError: false,
      }));
      box.updateValue('code', textareaNativeNode.value);
    });
    const button = new Button({
      root: formNode.find('.lake-button-row'),
      name: 'save',
      type: 'primary',
      text: editor.locale.equation.save(),
      onClick: () => {
        editor.selection.range.selectBoxEnd(box.node);
        editor.selection.sync();
        editor.history.save();
      },
    });
    button.render();
  },
};
