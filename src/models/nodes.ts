import { NativeHTMLElement, NativeElement, NativeNode } from '../types/native';
import { forEach } from '../utils/for-each';
import { inString } from '../utils/in-string';
import { camelCase } from '../utils/camel-case';
import { getCss } from '../utils/get-css';
import { getNodeList } from '../utils/get-node-list';
import { debug } from '../utils/debug';

const blockTagNames = 'h1,h2,h3,h4,h5,h6,div,p,blockquote,ul,ol';
const markTagNames = 'strong,em,span,sub,sup,code,a';

type EachCallback = (element: NativeNode, index: number) => boolean | void;
type EachElementCallback = (element: NativeElement, index: number) => boolean | void;

type EventItem = {
  type: string,
  listener: EventListener,
};

// eventData is a key-value object for storing all events.
// value is an array which include types and listeners.
const eventData: { [key: number]: EventItem[] } = {};

let lastNodeId = 0;

export class Nodes {
  private nodeList: NativeNode[];

  public length: number;

  constructor(node?: NativeNode | NativeNode[] | null) {
    node = node || [];
    this.nodeList = Array.isArray(node) ? node : [node];
    for (let i = 0; i < this.nodeList.length; i++) {
      // lakeId is an expando for preserving node ID.
      // https://developer.mozilla.org/en-US/docs/Glossary/Expando
      if (!this.nodeList[i].lakeId) {
        this.nodeList[i].lakeId = ++lastNodeId;
      }
    }
    this.length = this.nodeList.length;
  }

  // Gets node ID at the first index.
  public get id(): number {
    const node = this.get(0);
    return node.lakeId;
  }

  // Gets node name at the first index.
  public get name(): string {
    const node = this.get(0);
    return node.nodeName.toLowerCase();
  }

  public get isElement(): boolean {
    const node = this.get(0);
    return node.nodeType === NativeNode.ELEMENT_NODE;
  }

  public get isText(): boolean {
    const node = this.get(0);
    return node.nodeType === NativeNode.TEXT_NODE;
  }

  public get isBlock(): boolean {
    return inString(blockTagNames, this.name);
  }

  public get isMark(): boolean {
    return inString(markTagNames, this.name);
  }

  public get isEditable(): boolean {
    const node = this.get(0) as NativeHTMLElement;
    return node.isContentEditable;
  }

  // Gets a native node at the specified index.
  public get(index: number = 0): NativeNode {
    return this.nodeList[index];
  }

  // Gets all native nodes
  public getAll(): NativeNode[] {
    return this.nodeList;
  }

  // Reduces the nodes of a Nodes object to the one at the specified index.
  public eq(index: number): Nodes {
    const node = this.get(index);
    return new Nodes(node);
  }

  // Iterates over a Nodes object, executing a function for each node.
  public each(callback: EachCallback): this {
    const nodes = this.getAll();
    for (let i = 0; i < nodes.length; i++) {
      if (callback(nodes[i], i) === false) {
        return this;
      }
    }
    return this;
  }

  // Iterates over a Nodes object, executing a function for each element.
  public eachElement(callback: EachElementCallback): this {
    const nodes = this.getAll();
    for (let i = 0; i < nodes.length; i++) {
      if (nodes[i].nodeType === NativeNode.ELEMENT_NODE) {
        if (callback(nodes[i] as NativeElement, i) === false) {
          return this;
        }
      }
    }
    return this;
  }

  // Reverses the nodes of a Nodes object.
  public reverse(): Nodes {
    const nodes = this.getAll().reverse();
    return new Nodes(nodes);
  }

  // Gets the descendants of the first element filtered by a selector.
  public find(selector: string): Nodes {
    const element = this.get(0) as NativeElement;
    const nodeList = element.querySelectorAll(selector);
    return new Nodes(Array.from(nodeList));
  }

  // Traverses the first element and its parents (heading toward the document root)
  // until it finds a element that matches the specified CSS selector.
  public closest(selector: string): Nodes {
    const element = this.get(0) as NativeElement;
    return new Nodes(element.closest(selector));
  }

  // Returns the parent of the first node.
  public parent(): Nodes {
    const node = this.get(0);
    return new Nodes(node.parentNode);
  }

  // Returns the immediately preceding sibling of the first node.
  public prev(): Nodes {
    const node = this.get(0);
    return new Nodes(node.previousSibling);
  }

  // Returns the immediately following sibling of the first node.
  public next(): Nodes {
    const node = this.get(0);
    return new Nodes(node.nextSibling);
  }

  // Returns the first child of the first element.
  public first(): Nodes {
    const element = this.get(0);
    return new Nodes(element.firstChild);
  }

  // Returns the last child of the first element.
  public last(): Nodes {
    const element = this.get(0) as NativeElement;
    return new Nodes(element.lastChild);
  }

  // Returns all child nodes of the first element.
  public allChildNodes(): Nodes[] {
    const nodeList: Nodes[] = [];
    const iterate = (node: Nodes) => {
      let child = node.first();
      while (child.length > 0) {
        const nextNode = child.next();
        nodeList.push(child);
        iterate(child);
        child = nextNode;
      }
    };
    iterate(this.eq(0));
    return nodeList;
  }

  // Attaches an event listener for the elements.
  public on(type: string, listener: EventListener): this {
    return this.eachElement(element => {
      element.addEventListener(type, listener, false);
      const elementId = element.lakeId;
      if (!eventData[elementId]) {
        eventData[elementId] = [];
      }
      eventData[elementId].push({
        type,
        listener,
      });
    });
  }

  // Removes event handlers that were attached with .on() method.
  public off(type?: string, listener?: EventListener): this {
    return this.eachElement(element => {
      const elementId = element.lakeId;
      const eventItems = eventData[elementId] || [];
      eventItems.forEach((item: EventItem, index: number) => {
        if (!type || type === item.type && (!listener || listener === item.listener)) {
          element.removeEventListener(item.type, item.listener, false);
          eventItems[index] = {
            type: '',
            listener: () => {},
          };
        }
      });
      eventData[elementId] = eventItems.filter((item: EventItem) => item.type !== '');
    });
  }

  // Executes all event listeners attached to the Nodes object for the given event type.
  public emit(type: string): this {
    return this.eachElement(element => {
      const elementId = element.lakeId;
      const eventItems = eventData[elementId];
      eventItems.forEach((item: EventItem) => {
        if (type === item.type) {
          item.listener(new Event(type));
        }
      });
    });
  }

  // Gets all event listeners attached to the Nodes object.
  public getEventListeners(index: number): EventItem[] {
    const elementId = this.get(index).lakeId;
    return eventData[elementId];
  }

  public hasAttr(attributeName: string): boolean {
    const element = this.get(0) as NativeElement;
    return element.hasAttribute(attributeName);
  }

  public attr(attributeName: string): string;

  public attr(attributeName: string, value: string): this;

  public attr(attributeName: { [key: string]: string }): this;

  public attr(attributeName: any, value?: any): any {
    if (typeof attributeName === 'object') {
      forEach(attributeName, (name, val) => {
        this.attr(name, val);
      });
      return this;
    }
    if (value === undefined) {
      const element = this.get(0) as NativeElement;
      return element.getAttribute(attributeName) || '';
    }
    return this.eachElement(element => {
      element.setAttribute(attributeName, value);
    });
  }

  public removeAttr(attributeName: string): this {
    return this.eachElement(element => {
      element.removeAttribute(attributeName);
    });
  }

  public hasClass(className: string): boolean {
    const element = this.get(0) as NativeElement;
    return inString(element.className, className, ' ');
  }

  public addClass(className: string | string[]): this {
    if (Array.isArray(className)) {
      className.forEach(name => {
        this.addClass(name);
      });
      return this;
    }
    return this.eachElement(element => {
      element.classList.add(className);
    });
  }

  public removeClass(className: string | string[]): this {
    if (Array.isArray(className)) {
      className.forEach(name => {
        this.removeClass(name);
      });
      return this;
    }
    return this.eachElement(element => {
      element.classList.remove(className);
      if (element.className === '') {
        element.removeAttribute('class');
      }
    });
    return this;
  }

  public css(propertyName: string): string;

  public css(propertyName: { [key: string]: string }): this;

  public css(propertyName: string, value: string): this;

  public css(propertyName: any, value?: any): any {
    if (typeof propertyName === 'object') {
      forEach(propertyName, (name, val) => {
        this.css(name, val);
      });
      return this;
    }
    if (value === undefined) {
      const element = this.get(0) as NativeElement;
      return getCss(element, propertyName);
    }
    return this.eachElement(element => {
      element.style[camelCase(propertyName)] = value;
    });
  }

  public show(displayType: string = 'block'): this {
    this.css('display', displayType);
    return this;
  }

  public hide(): this {
    this.css('display', 'none');
    return this;
  }

  public html(): string;

  public html(value: string): this;

  public html(value?: any): any {
    if (value === undefined) {
      const element = this.get(0) as NativeElement;
      return element.innerHTML;
    }
    return this.eachElement(element => {
      element.innerHTML = value;
    });
  }

  // Removes all child nodes of each element.
  public empty(): this {
    this.html('');
    return this;
  }

  // Inserts the specified content as the first child of each element.
  public prepend(content: string | NativeNode | Nodes): this {
    return this.eachElement(element => {
      let list: NativeNode[] = [];
      if (content instanceof Nodes) {
        list = content.getAll();
      } else {
        list = getNodeList(content);
      }
      list = list.reverse();
      list.forEach((node: NativeNode) => {
        if (element.firstChild) {
          element.insertBefore(node, element.firstChild);
        } else {
          element.appendChild(node);
        }
      });
    });
  }

  // Inserts the specified content as the last child of each element.
  public append(content: string | NativeNode | Nodes): this {
    return this.eachElement(element => {
      let list: NativeNode[] = [];
      if (content instanceof Nodes) {
        list = content.getAll();
      } else {
        list = getNodeList(content);
      }
      list.forEach((node: NativeNode) => {
        element.appendChild(node);
      });
    });
  }

  // Inserts each element as the last child of the target.
  public appendTo(target: string | NativeElement | Nodes): this {
    return this.each(node => {
      let targetNodes: Nodes;
      if (target instanceof Nodes) {
        targetNodes = target;
      } else {
        const list = getNodeList(target);
        targetNodes = new Nodes(list);
      }
      targetNodes.append(node);
    });
  }

  // Inserts the specified content after each element.
  public after(content: string | NativeNode | Nodes): this {
    return this.eachElement(element => {
      let list: NativeNode[] = [];
      if (content instanceof Nodes) {
        list = content.getAll();
      } else {
        list = getNodeList(content);
      }
      list = list.reverse();
      list.forEach((node: NativeNode) => {
        if (!element.parentNode) {
          return;
        }
        if (element.nextSibling) {
          element.parentNode.insertBefore(node, element.nextSibling);
        } else {
          element.parentNode.appendChild(node);
        }
      });
    });
  }

  // Replaces each element with the provided new content.
  public replaceWith(newContent: string | NativeNode | Nodes): this {
    return this.eachElement(element => {
      let node: NativeNode;
      if (newContent instanceof Nodes) {
        node = newContent.get(0);
      } else {
        node = getNodeList(newContent)[0];
      }
      element.replaceWith(node);
    });
  }

  // Removes each element from the DOM.
  // keepChildren parameter:
  // A boolean value; true only removes each element and keeps all child nodes; false removes all nodes; if omitted, it defaults to false.
  public remove(keepChildren: boolean = false): this {
    this.each(node => {
      if (!node.parentNode) {
        return;
      }
      if (keepChildren) {
        let child = node.firstChild;
        while (child) {
          const next = child.nextSibling;
          node.parentNode.insertBefore(child, node);
          child = next;
        }
      }
      node.parentNode.removeChild(node);
    });
    return this;
  }

  public debug(): void {
    this.each(node => {
      debug(`node (${node.lakeId}): `, node);
    });
  }
}
