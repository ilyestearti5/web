import { convertionPropertyShortcut, listenerKeyboardShortcut, modifiersKeys, propertyShortcut, shortcutActivation, whenShortcutOn } from './types.js';
export class KeyboardShortcut {
  static separatorShortcuts: string = '+';
  static separatorKeys: string = '|';
  static #main_keys: modifiersKeys[] = ['ctrl', 'shift', 'alt'];
  static #all: Set<KeyboardShortcut> = new Set();
  private onfunctionsdown: listenerKeyboardShortcut[] = [];
  private onfunctionsup: listenerKeyboardShortcut[] = [];
  private onfunctionspress: listenerKeyboardShortcut[] = [];
  #main_fn = (event: KeyboardEvent) => {
    var { ctrlKey: ctrl, altKey: alt, shiftKey: shift, type } = event;
    var k = event[this.from].toLowerCase();
    k = KeyboardShortcut.#main_keys.includes(k as modifiersKeys) ? '' : k == ' ' ? 'space' : k;
    k = ['control', 'shift', 'alt'].includes(k) ? '' : k;
    if (k == '') return;
    var o: propertyShortcut = {
      ctrl,
      alt,
      shift,
      keys: k == '' ? [] : [k],
    };
    if (!this.#activate || !this.isvalide(o)) return;
    switch (type) {
      case 'keydown': {
        this.onfunctionsdown.forEach(fn => fn(o, event, 'key'));
        break;
      }
      case 'keyup': {
        this.onfunctionsup.forEach(fn => fn(o, event, 'key'));
        break;
      }
      case 'press': {
        this.onfunctionspress.forEach(fn => fn(o, event, 'key'));
      }
    }
  };
  #down: boolean = false;
  #up: boolean = false;
  #press: boolean = false;
  #activate: boolean = true;
  #propertys: propertyShortcut = {
    ctrl: false,
    shift: false,
    alt: false,
    keys: [],
  };
  targets: HTMLElement[] | null = null;
  #label: string = '';
  constructor(label: string, propertys: propertyShortcut, private from: 'key' | 'code' = 'key') {
    if (Array.from(KeyboardShortcut.#all).some(s => s.label == label)) throw Error('Cannot be Used to Shortcut Has The Same Label');
    this.#label = label;
    this.#propertys = propertys;
    this.when.down = true;
    KeyboardShortcut.#all.add(this);
  }
  get activate(): boolean {
    return this.#activate;
  }
  set activate(v: boolean) {
    this.#activate = Boolean(v);
  }
  get label(): string {
    return this.#label;
  }
  get propertys(): propertyShortcut {
    return this.#propertys;
  }
  get when(): whenShortcutOn {
    var a = this;
    return {
      get down() {
        return a.#down;
      },
      set down(v: boolean) {
        a.when = {
          down: v,
          up: a.#up,
          press: a.#press,
        };
      },
      get up() {
        return a.#up;
      },
      set up(v: boolean) {
        a.when = {
          down: a.#down,
          up: v,
          press: a.#press,
        };
      },
      get press() {
        return a.#press;
      },
      set press(v: boolean) {
        a.when = {
          down: a.#down,
          up: a.#up,
          press: v,
        };
      },
    };
  }
  set when(v: whenShortcutOn) {
    v.down = Boolean(v.down);
    v.up = Boolean(v.up);
    if (v.down != this.#down) {
      if (v.down) document.addEventListener('keydown', this.#main_fn);
      else document.removeEventListener('keydown', this.#main_fn);
      this.#down = v.down;
    }
    if (v.up != this.#up) {
      if (v.up) document.addEventListener('keyup', this.#main_fn);
      else document.removeEventListener('keyup', this.#main_fn);
      this.#up = v.up;
    }
    if (v.press != this.#press) {
      if (v.press) document.addEventListener('keypress', this.#main_fn);
      else document.removeEventListener('keypress', this.#main_fn);
      this.#press = v.press;
    }
  }
  get text(): string {
    return KeyboardShortcut.#toString(this.#propertys);
  }
  get status(): 'global' | 'local' {
    return this.targets ? 'local' : 'global';
  }
  #change(content: string | propertyShortcut) {
    this.#propertys = KeyboardShortcut.convertto(content, 'object');
  }
  change(content: string | propertyShortcut) {
    this.#change(content);
    return this;
  }
  #isvalide(short: string | propertyShortcut) {
    var shortcut = KeyboardShortcut.convertto(short, 'object');
    if (KeyboardShortcut.#main_keys.some(k => typeof this.#propertys[k] == 'boolean' && this.#propertys[k] != shortcut[k]) || (Array.isArray(this.#propertys.keys) && this.#propertys.keys.every(value => (shortcut.keys ? !shortcut.keys.includes(value) : false))) || (Array.isArray(this.targets) && !this.targets.includes(document.activeElement as HTMLElement))) return false;
    return true;
  }
  isvalide(short: string | propertyShortcut) {
    return this.#isvalide(short);
  }
  ondown(listener: listenerKeyboardShortcut): KeyboardShortcut {
    typeof listener == 'function' && this.onfunctionsdown.push(listener);
    return this;
  }
  onup(listener: listenerKeyboardShortcut): KeyboardShortcut {
    typeof listener == 'function' && this.onfunctionsup.push(listener);
    return this;
  }
  onpress(listener: listenerKeyboardShortcut): KeyboardShortcut {
    typeof listener == 'function' && this.onfunctionspress.push(listener);
    return this;
  }
  offdown(listener: listenerKeyboardShortcut): boolean {
    var index = this.onfunctionsdown.indexOf(listener);
    if (index < 0) return false;
    this.onfunctionsdown.splice(index, 1);
    return true;
  }
  offup(listener: listenerKeyboardShortcut): boolean {
    var index = this.onfunctionsup.indexOf(listener);
    if (index < 0) return false;
    this.onfunctionsup.splice(index, 1);
    return true;
  }
  offpress(listener: listenerKeyboardShortcut): boolean {
    var index = this.onfunctionspress.indexOf(listener);
    if (index < 0) return false;
    this.onfunctionspress.splice(index, 1);
    return true;
  }
  on(event: shortcutActivation, listener: listenerKeyboardShortcut): KeyboardShortcut {
    return this[`on${event}`](listener);
  }
  off(event: shortcutActivation, listener: listenerKeyboardShortcut): boolean {
    return this[`off${event}`](listener);
  }
  clear(when: shortcutActivation) {
    if (when == 'down') this.onfunctionsdown = [];
    else if (when == 'up') this.onfunctionsup = [];
    else if (when == 'press') this.onfunctionspress = [];
    this.when[when] = false;
  }
  changeFrom(value: 'key' | 'code') {
    this.from = value == 'key' ? 'key' : 'code';
    return this;
  }
  getFrom() {
    return this.from;
  }
  static #toProp(keystring: string = ''): propertyShortcut {
    var o: propertyShortcut = {
      ctrl: false,
      shift: false,
      alt: false,
      keys: [],
    };
    var array = keystring.split(this.separatorShortcuts);
    this.#main_keys.forEach(key => {
      var fd = array.find(k => k.startsWith(key));
      if (fd) {
        o[key] = fd.endsWith('?') ? undefined : true;
      }
    });
    var modifiersKeys = [...this.#main_keys, ...this.#main_keys.map(s => s + '?')];
    var finded = array.find(k => !modifiersKeys.includes(k));
    o.keys =
      finded == 'all'
        ? undefined
        : finded
        ? finded
            .split(this.separatorKeys)
            .map(s => s.trim())
            .filter(k => k !== '')
        : [];
    return o;
  }
  static #toString(keyproperty: propertyShortcut): string {
    var string: string[] = [];
    this.#main_keys.forEach(mn_key => {
      if (keyproperty[mn_key] || typeof keyproperty[mn_key] == 'undefined') string.push(mn_key + (keyproperty[mn_key] ? '' : '?'));
    });
    if (Array.isArray(keyproperty.keys)) {
      if (keyproperty.keys.length) string.push(keyproperty.keys.join(this.separatorKeys));
    } else string.push('all');
    return string.join(this.separatorShortcuts);
  }
  static convertto<T extends keyof convertionPropertyShortcut>(property: propertyShortcut | string, to: T): convertionPropertyShortcut[T] {
    return (to == 'object' ? (typeof property === 'string' ? this.#toProp(property) : property) : typeof property === 'string' ? property : this.#toString(property)) as convertionPropertyShortcut[T];
  }
  static #create(label: string = '', combinition: propertyShortcut | string = '', targets: null | HTMLElement[] = null, from: 'key' | 'code'): KeyboardShortcut {
    var result = new this(label, this.convertto(combinition, 'object'), from);
    result.targets = targets;
    return result;
  }
  static create(label: string = '', combinition: propertyShortcut | string = '', targets: null | HTMLElement[] = null, from: 'key' | 'code' = 'key') {
    return this.#create(label, combinition, targets, from);
  }
  static #exec(combinition: string | propertyShortcut, press: shortcutActivation[]): Set<KeyboardShortcut> {
    var shortcut = this.convertto(combinition, 'object');
    var ready = new Set(Array.from(this.#all).filter(shrt => shrt.isvalide(shortcut)));
    press.forEach(pressType => {
      switch (pressType) {
        case 'down': {
          ready.forEach(s => s.onfunctionsdown.forEach(fn => fn(shortcut, null, 'call')));
          break;
        }
        case 'up': {
          ready.forEach(s => s.onfunctionsup.forEach(fn => fn(shortcut, null, 'call')));
          break;
        }
        case 'press': {
          ready.forEach(s => s.onfunctionspress.forEach(fn => fn(shortcut, null, 'call')));
        }
        default: {
        }
      }
    });
    return ready;
  }
  static exec(combinition: string | propertyShortcut, ...press: shortcutActivation[]) {
    return this.#exec(combinition, press);
  }
  static #execcommand(label: string, press: shortcutActivation[] = ['down']): KeyboardShortcut | null {
    var s = Array.from(this.#all).find(({ label: lab }) => lab == label);
    if (!s) return null;
    for (let pressType of press) {
      switch (pressType) {
        case 'down': {
          s.onfunctionsdown.forEach(fn => fn(s!.#propertys, null, 'call'));
          break;
        }
        case 'up': {
          s.onfunctionsup.forEach(fn => fn(s!.#propertys, null, 'call'));
          break;
        }
        case 'press': {
          s.onfunctionspress.forEach(fn => fn(s!.#propertys, null, 'call'));
        }
      }
    }
    return s;
  }
  static execcommand(label: string, press: shortcutActivation[] = ['down']) {
    return this.#execcommand(label, press);
  }
  static #watch(...elements: HTMLElement[]) {
    var short = this.create(
      `watch:${elements
        .filter(ele => ele.ariaLabel)
        .map(({ ariaLabel }) => `${ariaLabel}`)
        .join(' - ')}`,
      'ctrl?+shift?+alt?+all',
      elements,
    );
    short.when = {
      down: true,
      up: true,
      press: false,
    };
    return short;
  }
  static watch(...elements: HTMLElement[]) {
    return this.#watch(...elements);
  }
  static label(labelName: string = ''): KeyboardShortcut | null {
    var fd = Array.from(this.#all).find(sh => sh.#label == labelName);
    return fd ? fd : null;
  }
  static get all(): KeyboardShortcut[] {
    return Array.from(this.#all);
  }
}
KeyboardShortcut.create('Reload Page', 'ctrl+r', null, 'key').ondown((cmb, keyboard) => {
  keyboard && keyboard.preventDefault();
  window.location.reload();
});
KeyboardShortcut.create('Close Window', 'ctrl+w', null, 'key').ondown((cmb, keyboard) => {
  keyboard && keyboard.preventDefault();
  window.close();
});
