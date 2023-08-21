import { NativeSelection } from '../types/native';
import { Range } from './range';

export class Selection {
  private get(): NativeSelection {
    const selection = window.getSelection();
    // When called on an <iframe> that is not displayed (e.g., where display: none is set) Firefox will return null,
    // whereas other browsers will return a Selection object with Selection.type set to None.
    if (!selection) {
      throw new Error('Selection object is null.');
    }
    return selection;
  }

  public getRange(): Range {
    const selection = this.get();
    if (selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      return new Range(range);
    }
    return new Range();
  }

  public addRange(range: Range): void {
    const selection = this.get();
    selection.removeAllRanges();
    selection?.addRange(range.get());
  }
}