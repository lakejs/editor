import { Range } from '../../src/models/range';
import { query } from '../../src/utils/query';
import { template } from '../../src/utils/template';
import { visibleInfo } from '../../src/utils/visible-info';

describe('utils / visible-info', () => {

  it('the node is visible', () => {
    const rootNode = query(template`
    <div class="lake-root" style="height: 100px; overflow: auto;">
      <div class="lake-container-wrapper">
        <div class="lake-container" contenteditable="true">
          <p>0</p>
          <p>1</p>
          <p>2</p>
          <p>3</p>
          <p>4</p>
        </div>
      </div>
    </div>
    `);
    query(document.body).append(rootNode);
    const visible = visibleInfo(rootNode.find('p').eq(0));
    expect(visible.left).to.equal(0);
    expect(visible.right).to.equal(0);
    expect(visible.top).to.equal(0);
    expect(visible.bottom).to.equal(0);
    rootNode.remove();
  });

  it('the range is visible', () => {
    const rootNode = query(template`
    <div class="lake-root" style="height: 100px; overflow: auto;">
      <div class="lake-container-wrapper">
        <div class="lake-container" contenteditable="true">
          <p>0</p>
          <p>1</p>
          <p>2</p>
          <p>3</p>
          <p>4</p>
        </div>
      </div>
    </div>
    `);
    query(document.body).append(rootNode);
    const range = new Range();
    range.selectNodeContents(rootNode.find('p').eq(0));
    const visible = visibleInfo(range);
    expect(visible.left).to.equal(0);
    expect(visible.right).to.equal(0);
    expect(visible.top).to.equal(0);
    expect(visible.bottom).to.equal(0);
    rootNode.remove();
  });

  it('the top of the node is not visible', () => {
    const rootNode = query(template`
    <div class="lake-root" style="height: 100px; overflow: auto;">
      <div class="lake-container-wrapper">
        <div class="lake-container" contenteditable="true">
          <p>0</p>
          <p>1</p>
          <p>2</p>
          <p>3</p>
          <p>4</p>
        </div>
      </div>
    </div>
    `);
    query(document.body).append(rootNode);
    (rootNode.get(0) as Element).scrollTo(0, 50);
    const visible = visibleInfo(rootNode.find('p').eq(0));
    expect(visible.left).to.equal(0);
    expect(visible.right).to.equal(0);
    expect(visible.top).to.equal(-1);
    expect(visible.bottom).to.equal(-1);
    rootNode.remove();
  });

  it('the top of the range is not visible', () => {
    const rootNode = query(template`
    <div class="lake-root" style="height: 100px; overflow: auto;">
      <div class="lake-container-wrapper">
        <div class="lake-container" contenteditable="true">
          <p>0</p>
          <p>1</p>
          <p>2</p>
          <p>3</p>
          <p>4</p>
        </div>
      </div>
    </div>
    `);
    query(document.body).append(rootNode);
    (rootNode.get(0) as Element).scrollTo(0, 50);
    const range = new Range();
    range.selectNodeContents(rootNode.find('p').eq(0));
    const visible = visibleInfo(range);
    expect(visible.left).to.equal(0);
    expect(visible.right).to.equal(0);
    expect(visible.top).to.equal(-1);
    expect(visible.bottom).to.equal(-1);
    rootNode.remove();
  });

  it('the bottom of the node is not visible', () => {
    const rootNode = query(template`
    <div class="lake-root" style="height: 100px; overflow: auto;">
      <div class="lake-container-wrapper">
        <div class="lake-container" contenteditable="true">
          <p>0</p>
          <p>1</p>
          <p>2</p>
          <p>3</p>
          <p>4</p>
        </div>
      </div>
    </div>
    `);
    query(document.body).append(rootNode);
    const visible = visibleInfo(rootNode.find('p').eq(4));
    expect(visible.left).to.equal(0);
    expect(visible.right).to.equal(0);
    expect(visible.top).to.equal(1);
    expect(visible.bottom).to.equal(1);
    rootNode.remove();
  });

  it('the bottom of the range is not visible', () => {
    const rootNode = query(template`
    <div class="lake-root" style="height: 100px; overflow: auto;">
      <div class="lake-container-wrapper">
        <div class="lake-container" contenteditable="true">
          <p>0</p>
          <p>1</p>
          <p>2</p>
          <p>3</p>
          <p>4</p>
        </div>
      </div>
    </div>
    `);
    query(document.body).append(rootNode);
    const range = new Range();
    range.selectNodeContents(rootNode.find('p').eq(4));
    const visible = visibleInfo(range);
    expect(visible.left).to.equal(0);
    expect(visible.right).to.equal(0);
    expect(visible.top).to.equal(1);
    expect(visible.bottom).to.equal(1);
    rootNode.remove();
  });

  it('the left of the node is not visible', () => {
    const rootNode = query(template`
    <div class="lake-root" style="width: 200px; height: 100px; overflow: auto;">
      <div class="lake-container-wrapper">
        <div class="lake-container" contenteditable="true">
          <div style="width: 500px;">0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000</div>
          <p>1</p>
          <p>2</p>
          <p>3</p>
          <p>4</p>
        </div>
      </div>
    </div>
    `);
    query(document.body).append(rootNode);
    (rootNode.get(0) as Element).scrollTo(100, 0);
    const visible = visibleInfo(rootNode.find('.lake-container > div').eq(0));
    expect(visible.left).to.equal(-1);
    expect(visible.right).to.equal(1);
    expect(visible.top).to.equal(0);
    expect(visible.bottom).to.equal(0);
    rootNode.remove();
  });

  it('the left of the range is not visible', () => {
    const rootNode = query(template`
    <div class="lake-root" style="width: 200px; height: 100px; overflow: auto;">
      <div class="lake-container-wrapper">
        <div class="lake-container" contenteditable="true">
          <div style="width: 500px;">0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000</div>
          <p>1</p>
          <p>2</p>
          <p>3</p>
          <p>4</p>
        </div>
      </div>
    </div>
    `);
    query(document.body).append(rootNode);
    (rootNode.get(0) as Element).scrollTo(100, 0);
    const range = new Range();
    range.selectNodeContents(rootNode.find('.lake-container > div').eq(0));
    const visible = visibleInfo(range);
    expect(visible.left).to.equal(-1);
    expect(visible.right).to.equal(1);
    expect(visible.top).to.equal(0);
    expect(visible.bottom).to.equal(0);
    rootNode.remove();
  });

  it('the right of the node is not visible', () => {
    const rootNode = query(template`
    <div class="lake-root" style="width: 200px; height: 100px; overflow: auto;">
      <div class="lake-container-wrapper">
        <div class="lake-container" contenteditable="true">
          <div style="width: 500px;">0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000</div>
          <p>1</p>
          <p>2</p>
          <p>3</p>
          <p>4</p>
        </div>
      </div>
    </div>
    `);
    query(document.body).append(rootNode);
    const visible = visibleInfo(rootNode.find('.lake-container > div').eq(0));
    expect(visible.left).to.equal(0);
    expect(visible.right).to.equal(1);
    expect(visible.top).to.equal(0);
    expect(visible.bottom).to.equal(0);
    rootNode.remove();
  });

  it('the right of the range is not visible', () => {
    const rootNode = query(template`
    <div class="lake-root" style="width: 200px; height: 100px; overflow: auto;">
      <div class="lake-container-wrapper">
        <div class="lake-container" contenteditable="true">
          <div style="width: 500px;">0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000</div>
          <p>1</p>
          <p>2</p>
          <p>3</p>
          <p>4</p>
        </div>
      </div>
    </div>
    `);
    query(document.body).append(rootNode);
    const range = new Range();
    range.selectNodeContents(rootNode.find('.lake-container > div').eq(0));
    const visible = visibleInfo(range);
    expect(visible.left).to.equal(0);
    expect(visible.right).to.equal(1);
    expect(visible.top).to.equal(0);
    expect(visible.bottom).to.equal(0);
    rootNode.remove();
  });

});
