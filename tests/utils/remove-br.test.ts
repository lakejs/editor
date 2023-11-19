import { expect } from 'chai';
import { removeBr, query } from '../../src/utils';

describe('utils.removeBr()', () => {

  it('should remove br', () => {
    const element = query('<div><p><br /></p></div>');
    removeBr(element.find('p'));
    expect(element.html()).to.equal('<p></p>');
  });

  it('should not remove br', () => {
    const element = query('<div><p>foo<br />bar</p></div>');
    removeBr(element.find('p'));
    expect(element.html()).to.equal('<p>foo<br>bar</p>');
  });

  it('with empty text', () => {
    const element = query('<div><p><br /></p></div>');
    element.find('p').prepend(document.createTextNode(''));
    removeBr(element.find('p'));
    expect(element.html()).to.equal('<p></p>');
  });

  it('with bookmark before br', () => {
    const element = query('<div><p><bookmark type="focus"></bookmark><br /></p></div>');
    removeBr(element.find('p'));
    expect(element.html()).to.equal('<p><bookmark type="focus"></bookmark></p>');
  });

  it('with bookmark after br', () => {
    const element = query('<div><p><br /><bookmark type="focus"></bookmark></p></div>');
    removeBr(element.find('p'));
    expect(element.html()).to.equal('<p><bookmark type="focus"></bookmark></p>');
  });

});