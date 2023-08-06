import { getDocument } from './get-document';

export function getWindow(node: any): Window {
  if (!node || node === window) {
    return window;
  }
  const doc = getDocument(node);
  return doc.defaultView || window;
}
