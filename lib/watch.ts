import { createElement as crt } from './utils.js';
export class Watch {
  #value: string = '';
  private nodes: Set<HTMLSpanElement> = new Set();
  static #all: Watch[] = [];
  #name: string;
  constructor(name: string) {
    name = name.replaceAll(/ +/gi, '-');
    var finded = Watch.get(name);
    if (finded) throw Error(`Cannot be use same data watch "${finded.name}"`);
    this.#name = name;
    Watch.#all.push(this);
  }
  get name() {
    return this.#name;
  }
  get value() {
    return this.#value;
  }
  set value(v: string) {
    this.nodes.forEach(node => {
      node.innerHTML = v;
      node.setAttribute(`data-${this.#name}`, v);
    });
    this.#value = v;
  }
  enables(...elements: HTMLElement[]) {
    return elements.map(ele => this.enable(ele));
  }
  enable(element: HTMLElement) {
    const node = crt('span', this.#value, {});
    node.setAttribute(`data-${this.#name}`, this.#value);
    element.appendChild(node);
    this.nodes.add(node);
    return node;
  }
  disable(element: HTMLElement) {
    var node = Array.from(element.children).find(ele => ele.hasAttribute(`data-${this.#name}`));
    if (node) {
      this.nodes.delete(node as HTMLSpanElement);
      node.remove();
    }
    return node as HTMLElement;
  }
  disables(...elements: HTMLElement[]) {
    return elements.map(ele => this.disable(ele));
  }
  static get all() {
    return [...this.#all];
  }
  static get(name: string) {
    return Watch.all.find(({ name: n }) => n == name) || null;
  }
  static get settings() {
    var o: object = Object.create(null);
    this.#all.forEach(a => {
      Object.defineProperty(o, a.#name, {
        get() {
          return a.#value;
        },
        set(v: string) {
          a.value = v;
        },
        configurable: false,
        enumerable: true,
      });
    });
    return o;
  }
}
