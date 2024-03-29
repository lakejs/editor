import { testPlugin } from '../utils';

describe('plugins / hr', () => {

  it('inserts into the end of the paragraph', () => {
    const content = `
    <p>foo<focus /></p>
    `;
    const output = `
    <p>foo</p>
    <lake-box type="block" name="hr" focus="right"></lake-box>
    `;
    testPlugin(
      content,
      output,
      editor => {
        editor.command.execute('hr');
      },
    );
  });

});
