import { NativeNode } from '../types/native';
import { BoxType, BoxValue } from '../types/box';
import { boxes } from '../storage/boxes';
import { encode } from '../utils/encode';
import { query } from '../utils/query';
import { Nodes } from './nodes';

const bodyTemplate = `
  <span class="lake-box-strip"><br /></span>
    <div class="lake-box-container" contenteditable="false"></div>
  <span class="lake-box-strip"><br /></span>
`.replace(/^\s+/gm, '').replace(/\n/g, '');

export class Box {
  // <lake-box> element
  public node: Nodes;

  constructor(node: string | Nodes | NativeNode) {
    if (typeof node === 'string') {
      const def = boxes.get(node);
      if (def === undefined) {
        throw new Error(`Box '${node}' has not been defined yet.`);
      }
      const type = encode(def.type);
      const name = encode(def.name);
      this.node = query(`<lake-box type="${type}" name="${name}"></lake-box>`);
      if (def.value) {
        this.value = def.value;
      }
    } else {
      this.node = query(node);
    }
  }

  public get type(): BoxType {
    return this.node.attr('type') as BoxType;
  }

  public set type(type: BoxType) {
    this.node.attr('type', type);
  }

  public get name(): string {
    return this.node.attr('name');
  }

  public get value(): BoxValue {
    const value = this.node.attr('value');
    if (value === '') {
      return {};
    }
    return JSON.parse(atob(value));
  }

  public set value(value: BoxValue) {
    this.node.attr('value', btoa(JSON.stringify(value)));
  }

  public get container(): Nodes {
    return this.node.find('.lake-box-container');
  }

  public render(): void {
    const def = boxes.get(this.name);
    if (def === undefined) {
      return;
    }
    if (this.container.length === 0) {
      this.node.html(bodyTemplate);
    }
    const content = def.render(this.value);
    this.container.html(content);
  }
}
