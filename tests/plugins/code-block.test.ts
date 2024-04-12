import { Box } from '../../src';
import { testPlugin } from '../utils';

describe('plugins / code-block', () => {

  it('should insert into the end of the paragraph', () => {
    const content = `
    <p>foo<focus /></p>
    `;
    const output = `
    <p>foo</p>
    <lake-box type="block" name="codeBlock" focus="end"></lake-box>
    `;
    testPlugin(
      content,
      output,
      editor => {
        editor.command.execute('codeBlock');
      },
    );
  });

  it('should insert a code block with default value', () => {
    const content = `
    <p>foo<focus /></p>
    `;
    const output = `
    <p>foo</p>
    <lake-box type="block" name="codeBlock" focus="end"></lake-box>
    `;
    testPlugin(
      content,
      output,
      editor => {
        const defaultValue = {
          lang: 'css',
          code: '.hello { }',
        };
        editor.command.execute('codeBlock', defaultValue);
        const boxNode = editor.container.find('lake-box');
        const box = new Box(boxNode);
        expect(box.value).to.deep.equal(defaultValue);
      },
      true,
    );
  });

});
