import { showBox } from '../utils';

const htmlCode = `
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>Lake example - Immediately invoked function expressions</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link rel="stylesheet" href="../dist/lake.css" />
    <!-- If you do not need the code block feature, there is no need to add the following CodeMirror script. -->
    <script src="../node_modules/lake-codemirror/dist/codemirror.min.js"></script>
    <script src="../dist/lake.min.js"></script>
    <style>
      .lake-editor {
        box-sizing: border-box;
        padding: 0 8px;
        margin: 0 auto;
      }
    </style>
  </head>
  <body>
    <div class="lake-editor">
      <div class="lake-toolbar-root"></div>
      <div class="lake-root"></div>
    </div>
    <script>
      const editor = new Lake.Editor({
        root: '.lake-root',
        value: '<p><br /><focus /></p>',
      });
      editor.render();
    </script>
  </body>
</html>
`.trim();

const cssCode = `
.lake-container {
  font-family: var(--font-family);
  font-size: 16px;
  color: var(--text-color);
  padding: 16px 24px;
}
.lake-container:focus {
  outline: none;
}
`.trim();

const javascriptCode = `
class name {
  // class body
}
class name extends otherName {
  // class body
}

const number = 42;

try {
  number = 99;
} catch (err) {
  console.log(err);
  // Expected output: TypeError: invalid assignment to const 'number'
  // (Note: the exact output may be browser-dependent)
}

console.log(number);
// Expected output: 42
`.trim();

const javaCode = `
import com.demo.util.MyType;
import com.demo.util.MyInterface;

public enum Enum {
  VAL1, VAL2, VAL3
}

public class Class<T, V> implements MyInterface {
  public static final MyType<T, V> member;

  private class InnerClass {
    public int zero() {
      return 0;
    }
  }

  @Override
  public MyType method() {
    return member;
  }

  public void method2(MyType<T, V> value) {
    method();
    value.method3();
    member = value;
  }
}
`.trim();

describe('boxes / code-block-ui', () => {

  it('codeBlock: HTML', () => {
    showBox('codeBlock', {
      lang: 'html',
      code: htmlCode,
    }, box => {
      expect(box.value.lang).to.equal('html');
    });
  });

  it('codeBlock: HTML (read-only)', () => {
    showBox('codeBlock', {
      lang: 'html',
      code: htmlCode,
    }, box => {
      expect(box.value.lang).to.equal('html');
    }, true);
  });

  it('codeBlock: CSS', () => {
    showBox('codeBlock', {
      lang: 'css',
      code: cssCode,
    }, box => {
      expect(box.value.lang).to.equal('css');
    });
  });

  it('codeBlock: JavaScript', () => {
    showBox('codeBlock', {
      lang: 'javascript',
      code: javascriptCode,
    }, box => {
      expect(box.value.lang).to.equal('javascript');
    });
  });

  it('codeBlock: Java', () => {
    showBox('codeBlock', {
      lang: 'java',
      code: javaCode,
    }, box => {
      expect(box.value.lang).to.equal('java');
    });
  });

  it('codeBlock: error status', () => {
    const CodeMirror = window.LakeCodeMirror;
    window.LakeCodeMirror = undefined;
    showBox('codeBlock', {
      lang: 'javascript',
      code: javascriptCode,
    }, box => {
      expect(box.getContainer().find('.lake-code-block-error').length).to.equal(1);
      window.LakeCodeMirror = CodeMirror;
    });
  });

});
