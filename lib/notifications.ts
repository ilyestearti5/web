import { ListBox as List } from './listbox.js';
import { ToolBar as Tool } from './toolbar.js';
import { submitListener } from './types.js';
import { createElement as crt } from './utils.js';
export class Notifications<T> {
  static mainNotificationElement = crt('div', '', {
    role: 'notifications',
  });
  #inputs: (keyof T)[] = [];
  #title: string = '';
  #buttons: List;
  #titleElement = crt('div', '', { role: 'title-notification' });
  #contentElement = crt('div', '', { role: 'content-notification' });
  #notifictionElement = crt('div', '', {
    role: 'notification',
    tabindex: -1,
  });
  #tools: Tool<any> = new Tool<any>(`notification ${this.title} toolbar`);
  static #all: Set<Notifications<any>> = new Set();
  constructor(title: string, ...inputs: (keyof T)[]) {
    this.title = title;
    this.#buttons = new List(crt('div', '', {}), `notification - ${this.title}`);
    this.#inputs = inputs;
    this.#notifictionElement.append(this.#titleElement, this.#contentElement, this.#buttons.root);
    this.#buttons.configurations.selection = false;
    this.#buttons.configurations.clipboard = false;
    this.#buttons.configurations.scrolling = false;
    this.#buttons.setTargetShortcut([this.#notifictionElement]);
    this.#buttons.flipShortcut('left-right');
    this.#buttons.mouse = true;
    Notifications.#all.add(this);
  }
  get toolbar() {
    return this.#tools;
  }
  get inputs() {
    return this.#inputs;
  }
  get title() {
    return this.#title;
  }
  set title(v) {
    this.#title = v;
    this.#titleElement.innerHTML = `${v}`;
  }
  set content(v: string) {
    this.#contentElement.innerHTML = v;
  }
  get content() {
    return this.#contentElement.innerHTML;
  }
  static start(element: HTMLElement = document.body) {
    element.appendChild(this.mainNotificationElement);
  }
  close() {
    this.#notifictionElement.remove();
    this.#buttons.root.innerHTML = '';
  }
  open(init: keyof T | undefined = this.#inputs.at(-1)): Promise<keyof T> {
    this.#buttons.root.innerHTML = this.#inputs.map(input => `<span aria-selected="${init === input}">${input.toString()}</span>`).join('\n');
    return new Promise(resolve => {
      var fn: submitListener = (type, element) => {
        resolve(element.innerHTML as keyof T);
        this.#buttons.offsubmit(fn);
      };
      Notifications.mainNotificationElement.appendChild(this.#notifictionElement);
      this.#buttons.onsubmit(fn);
      this.#notifictionElement.focus();
    });
  }
  delete() {
    Notifications.#all.delete(this);
  }
  static get all() {
    return Array.from(this.#all);
  }
}
