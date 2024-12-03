import { getTableMap } from 'lakelib/plugins/table/utils';
import { testOperation } from '../../utils';

describe('plugins / table / utils', () => {

  it('getTableMap: should return correct map', () => {
    const content = `
    <table>
      <tr>
        <td>a1</td>
        <td>b1</td>
        <td>c1</td>
        <td rowspan="3">d1</td>
      </tr>
      <tr>
        <td colspan="2" rowspan="3">a2</td>
        <td>c2</td>
      </tr>
      <tr>
        <td><focus />c3</td>
      </tr>
      <tr>
        <td>c4</td>
        <td>d4</td>
      </tr>
      <tr>
        <td>a5</td>
        <td>b5</td>
        <td>c5</td>
        <td>d5</td>
      </tr>
    </table>
    `;
    const output = content;
    testOperation(
      content,
      output,
      range => {
        const tableNode = range.startNode.closest('table');
        const table = tableNode.get(0) as HTMLTableElement;
        const tableMap = getTableMap(table);
        expect(tableMap[0][0].innerText).to.equal('a1');
        expect(tableMap[0][1].innerText).to.equal('b1');
        expect(tableMap[0][2].innerText).to.equal('c1');
        expect(tableMap[0][3].innerText).to.equal('d1');
        expect(tableMap[1][0].innerText).to.equal('a2');
        expect(tableMap[1][1].innerText).to.equal('a2');
        expect(tableMap[1][2].innerText).to.equal('c2');
        expect(tableMap[1][3].innerText).to.equal('d1');
        expect(tableMap[2][0].innerText).to.equal('a2');
        expect(tableMap[2][1].innerText).to.equal('a2');
        expect(tableMap[2][2].innerText).to.equal('c3');
        expect(tableMap[2][3].innerText).to.equal('d1');
        expect(tableMap[3][0].innerText).to.equal('a2');
        expect(tableMap[3][1].innerText).to.equal('a2');
        expect(tableMap[3][2].innerText).to.equal('c4');
        expect(tableMap[3][3].innerText).to.equal('d4');
        expect(tableMap[4][0].innerText).to.equal('a5');
        expect(tableMap[4][1].innerText).to.equal('b5');
        expect(tableMap[4][2].innerText).to.equal('c5');
        expect(tableMap[4][3].innerText).to.equal('d5');
      },
    );
  });

});