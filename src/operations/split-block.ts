import { query, splitNodes, appendDeepest } from '../utils';
import { Nodes } from '../models/nodes';
import { Range } from '../models/range';
import { deleteContents } from './delete-contents';

// Removes the contents of the specified range and then splits the block node at the point of the collapsed range.
// <p>one<anchor />two<focus />three</p>
// to
// <p>one</p>
// <p><focus />three</p>
export function splitBlock(range: Range): { left: Nodes | null, right: Nodes | null } {
  if (!range.commonAncestor.isContentEditable) {
    return {
      left: null,
      right: null,
    };
  }
  if (!range.isCollapsed) {
    deleteContents(range);
  }
  const node = range.startNode;
  const closestBlock = node.closestBlock();
  let limitBlock = closestBlock.parent();
  if (!limitBlock.isContentEditable) {
    limitBlock = node.closestContainer();
  }
  const parts = splitNodes(node, range.startOffset, limitBlock);
  let left = null;
  let right = null;
  if (parts) {
    left = parts.left;
    right = parts.right;
  }
  if (!parts && node.isBlock) {
    if (range.startOffset > 0) {
      left = node.children()[range.startOffset - 1];
    }
    right = node.children()[range.startOffset];
    if (right && !right.isBlock) {
      right = null;
    }
  }
  if (left) {
    if (left.hasEmptyText) {
      const br = query('<br />');
      appendDeepest(left, br);
    }
  }
  if (right) {
    if (right.hasEmptyText) {
      const br = query('<br />');
      appendDeepest(right, br);
    }
    range.selectNodeContents(right);
    range.reduce();
    range.collapseToStart();
  }
  return {
    left,
    right,
  };
}