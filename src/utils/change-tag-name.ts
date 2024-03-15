import type { Nodes } from '../models/nodes';
import { NativeElement } from '../types/native';
import { query } from './query';
import { safeTemplate } from './safe-template';

export function changeTagName(element: Nodes, newTagName: string): Nodes {
  const nativeElement = element.get(0) as NativeElement;
  const newElement = query(safeTemplate`<${newTagName} />`);
  for (const attr of nativeElement.attributes) {
    newElement.attr(attr.name, attr.value);
  }
  let child = element.first();
  while(child.length > 0) {
    const nextNode = child.next();
    newElement.append(child);
    child = nextNode;
  }
  element.replaceWith(newElement);
  return newElement;
}
