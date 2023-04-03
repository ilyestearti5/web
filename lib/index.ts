import {
  forEachAsync,
  createElement,
  defaultObject,
  isLooked,
  scrollToElement,
} from "./utils.js";
// the interfaces
interface propertyShortcut {
  Ctrl?: boolean;
  Shift?: boolean;
  Alt?: boolean;
  Keys?: number[];
}
interface convertionPropertyShortcut {
  object: propertyShortcut;
  string: string;
}
interface whenShortcutOn {
  down: boolean;
  up: boolean;
  press: boolean;
}
interface configListBox {
  movable: boolean;
  scrolling: boolean;
  selection: boolean;
  redirect: boolean;
  clipboard: boolean;
}
interface row {
  row: HTMLElement;
}
interface configurationToolBar<T> {
  label: T;
  iconElement: HTMLElement;
  click: ((e: MouseEvent) => void) | null;
  element: HTMLAnchorElement;
}
interface allKeyboardKeys {
  Backspace: number;
  Tab: number;
  Enter: number;
  ShiftLeft: number;
  ShiftRight: number;
  ControlLeft: number;
  ControlRight: number;
  AltLeft: number;
  AltRight: number;
  Pause: number;
  CapsLock: number;
  Escape: number;
  Space: number;
  PageUp: number;
  PageDown: number;
  End: number;
  Home: number;
  ArrowLeft: number;
  ArrowUp: number;
  ArrowRight: number;
  ArrowDown: number;
  PrintScreen: number;
  Insert: number;
  Delete: number;
  Digit0: number;
  Digit1: number;
  Digit2: number;
  Digit3: number;
  Digit4: number;
  Digit5: number;
  Digit6: number;
  Digit7: number;
  Digit8: number;
  Digit9: number;
  A: number;
  B: number;
  C: number;
  D: number;
  E: number;
  F: number;
  G: number;
  H: number;
  I: number;
  J: number;
  K: number;
  L: number;
  M: number;
  N: number;
  O: number;
  P: number;
  Q: number;
  R: number;
  S: number;
  T: number;
  U: number;
  V: number;
  W: number;
  X: number;
  Y: number;
  Z: number;
  MetaLeft: number;
  MetaRight: number;
  ContextMenu: number;
  Numpad0: number;
  Numpad1: number;
  Numpad2: number;
  Numpad3: number;
  Numpad4: number;
  Numpad5: number;
  Numpad6: number;
  Numpad7: number;
  Numpad8: number;
  Numpad9: number;
  NumpadMultiply: number;
  NumpadAdd: number;
  NumpadSubtract: number;
  NumpadDecimal: number;
  NumpadDivide: number;
  F1: number;
  F2: number;
  F3: number;
  F4: number;
  F5: number;
  F6: number;
  F7: number;
  F8: number;
  F9: number;
  F10: number;
  F11: number;
  F12: number;
  NumLock: number;
  ScrollLock: number;
  Semicolon: number;
  Equal: number;
  Comma: number;
  Minus: number;
  Period: number;
  Slash: number;
  Backquote: number;
  BracketLeft: number;
  Backslash: number;
  BracketRight: number;
  Quote: number;
  // Add more keyboard event codes here as needed
}
interface directionShortcut {
  forword: KeyboardShortcut;
  backword: KeyboardShortcut;
}
interface shortcutConfigurationsList {
  clipboard: null | {
    copy: KeyboardShortcut;
    paste: KeyboardShortcut;
    cut: KeyboardShortcut;
  };
  selection: directionShortcut;
  move: directionShortcut;
  status: {
    submit: KeyboardShortcut;
    cancel: KeyboardShortcut;
  };
  find: null | directionShortcut;
  inner: null | {
    open: KeyboardShortcut;
    close: KeyboardShortcut;
  };
}
interface tree<T> {
  body: T;
  innerTree: tree<T>[];
}
interface convertionDataTree {
  query: string;
  element: HTMLElement;
}
interface methodesTableMap<T> {
  append: T[];
  prepend: T[];
  after: T[];
  before: T[];
  sort: {
    by: keyof T;
    direction: SortedBy;
  };
}
interface methodesTreeMap<T> {
  after: T[];
  before: T[];
  append: T[];
  prepend: T[];
  delete: undefined;
  insert: tree<T>[];
  sort: {
    by: keyof T;
    direction: SortedBy;
    deep: boolean;
  };
}
// data types
type mainKeys = "Ctrl" | "Shift" | "Alt";
type listenerKeyboardShortcut = (
  combinition: propertyShortcut,
  event: KeyboardEvent | null,
  type: "key" | "call"
) => void;
type direction = "forword" | "backword";
type submitListener = (type: submitTypePress, element: HTMLElement) => void;
type submitTypePress = "call" | "keypress" | "click";
type SortedBy = "down" | "up";
type callBackQuery<T> = (data: T, index: number) => string;
// classes projects
export class Delay {
  #counter: NodeJS.Timeout | number = 0;
  #is_loading: boolean = false;
  constructor(public timeout: number) {}
  get isLoading(): boolean {
    return this.#is_loading;
  }
  on(): Promise<void> {
    this.off();
    this.#is_loading = true;
    return new Promise((rs) => {
      this.#counter = setTimeout(() => {
        rs();
        this.off();
      }, this.timeout);
    });
  }
  off() {
    if (this.#is_loading) {
      clearTimeout(this.#counter);
      this.#is_loading = false;
    }
  }
}
export class KeyboardShortcut {
  // private options
  // ----------------------------------------------------------------------
  static separatorShortcuts: string = "+";
  static separatorKeys: string = "|";
  static #main_keys: mainKeys[] = ["Ctrl", "Shift", "Alt"];
  static #all: Set<KeyboardShortcut> = new Set();
  static #keyboardKeys: allKeyboardKeys = {
    Backspace: 8,
    Tab: 9,
    Enter: 13,
    ShiftLeft: 16,
    ShiftRight: 16,
    ControlLeft: 17,
    ControlRight: 17,
    AltLeft: 18,
    AltRight: 18,
    Pause: 19,
    CapsLock: 20,
    Escape: 27,
    Space: 32,
    PageUp: 33,
    PageDown: 34,
    End: 35,
    Home: 36,
    ArrowLeft: 37,
    ArrowUp: 38,
    ArrowRight: 39,
    ArrowDown: 40,
    PrintScreen: 44,
    Insert: 45,
    Delete: 46,
    Digit0: 48,
    Digit1: 49,
    Digit2: 50,
    Digit3: 51,
    Digit4: 52,
    Digit5: 53,
    Digit6: 54,
    Digit7: 55,
    Digit8: 56,
    Digit9: 57,
    A: 65,
    B: 66,
    C: 67,
    D: 68,
    E: 69,
    F: 70,
    G: 71,
    H: 72,
    I: 73,
    J: 74,
    K: 75,
    L: 76,
    M: 77,
    N: 78,
    O: 79,
    P: 80,
    Q: 81,
    R: 82,
    S: 83,
    T: 84,
    U: 85,
    V: 86,
    W: 87,
    X: 88,
    Y: 89,
    Z: 90,
    MetaLeft: 91,
    MetaRight: 92,
    ContextMenu: 93,
    Numpad0: 96,
    Numpad1: 97,
    Numpad2: 98,
    Numpad3: 99,
    Numpad4: 100,
    Numpad5: 101,
    Numpad6: 102,
    Numpad7: 103,
    Numpad8: 104,
    Numpad9: 105,
    NumpadMultiply: 106,
    NumpadAdd: 107,
    NumpadSubtract: 109,
    NumpadDecimal: 110,
    NumpadDivide: 111,
    F1: 112,
    F2: 113,
    F3: 114,
    F4: 115,
    F5: 116,
    F6: 117,
    F7: 118,
    F8: 119,
    F9: 120,
    F10: 121,
    F11: 122,
    F12: 123,
    NumLock: 144,
    ScrollLock: 145,
    Semicolon: 186,
    Equal: 187,
    Comma: 188,
    Minus: 189,
    Period: 190,
    Slash: 191,
    Backquote: 192,
    BracketLeft: 219,
    Backslash: 220,
    BracketRight: 221,
    Quote: 222,
  };
  static get keyboardKeys() {
    return this.#keyboardKeys;
  }
  #on_down_fn: listenerKeyboardShortcut[] = [];
  #on_up_fn: listenerKeyboardShortcut[] = [];
  #on_press_fn: listenerKeyboardShortcut[] = [];
  #main_fn = (event: KeyboardEvent) => {
    var {
      ctrlKey: Ctrl,
      altKey: Alt,
      shiftKey: Shift,
      key: k,
      type,
      keyCode,
    } = event;
    k = KeyboardShortcut.#main_keys.includes(k as mainKeys)
      ? ""
      : k == " "
      ? "Space"
      : k;
    var o: propertyShortcut = {
      Ctrl,
      Alt,
      Shift,
      Keys: k == "" ? [] : [keyCode],
    };
    if (!this.#activate || !this.isValide(o)) return;
    switch (type) {
      case "keydown": {
        this.#on_down_fn.forEach((fn) => fn(o, event, "key"));
        break;
      }
      case "keyup": {
        this.#on_up_fn.forEach((fn) => fn(o, event, "key"));
        break;
      }
      case "press": {
        this.#on_press_fn.forEach((fn) => fn(o, event, "key"));
      }
    }
  };
  #down: boolean = false;
  #up: boolean = false;
  #press: boolean = false;
  #activate: boolean = true;
  #propertys: propertyShortcut = {
    Ctrl: false,
    Shift: false,
    Alt: false,
    Keys: [],
  };
  // ----------------------------------------------------------------------
  targets: HTMLElement[] | null = null;
  #label: string = "";
  constructor(label: string, propertys: propertyShortcut) {
    if (Array.from(KeyboardShortcut.#all).some((s) => s.label == label))
      throw Error("Cannot be Used to Shortcut Has The Same Label");
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
      if (v.down) document.addEventListener("keydown", this.#main_fn);
      else document.removeEventListener("keydown", this.#main_fn);
      this.#down = v.down;
    }
    if (v.up != this.#up) {
      if (v.up) document.addEventListener("keyup", this.#main_fn);
      else document.removeEventListener("keyup", this.#main_fn);
      this.#up = v.up;
    }
    if (v.press != this.#press) {
      if (v.press) document.addEventListener("keypress", this.#main_fn);
      else document.removeEventListener("keypress", this.#main_fn);
      this.#press = v.press;
    }
  }
  get text(): string {
    return KeyboardShortcut.#toString(this.#propertys);
  }
  get status(): "global" | "local" {
    return this.targets ? "local" : "global";
  }
  #change(content: string | propertyShortcut) {
    this.#propertys = KeyboardShortcut.convertto(content, "object");
  }
  change(content: string | propertyShortcut) {
    this.#change(content);
  }
  #isValide(short: string | propertyShortcut) {
    var shortcut = KeyboardShortcut.convertto(short, "object");
    if (
      KeyboardShortcut.#main_keys.some(
        (k) =>
          typeof this.#propertys[k] == "boolean" &&
          this.#propertys[k] != shortcut[k]
      ) ||
      (Array.isArray(this.#propertys.Keys) &&
        this.#propertys.Keys.every(
          (value) => !shortcut.Keys?.includes(value)
        )) ||
      (Array.isArray(this.targets) &&
        !this.targets.includes(document.activeElement as HTMLElement))
    )
      return false;
    return true;
  }
  isValide(short: string | propertyShortcut) {
    return this.#isValide(short);
  }
  ondown(listener: listenerKeyboardShortcut): KeyboardShortcut {
    typeof listener == "function" && this.#on_down_fn.push(listener);
    return this;
  }
  onup(listener: listenerKeyboardShortcut): KeyboardShortcut {
    typeof listener == "function" && this.#on_up_fn.push(listener);
    return this;
  }
  offdown(listener: listenerKeyboardShortcut): boolean {
    var index = this.#on_down_fn.indexOf(listener);
    if (index < 0) return false;
    this.#on_down_fn.splice(index, 1);
    return true;
  }
  offup(listener: listenerKeyboardShortcut): boolean {
    var index = this.#on_up_fn.indexOf(listener);
    if (index < 0) return false;
    this.#on_up_fn.splice(index, 1);
    return true;
  }
  on(
    event: "down" | "up",
    listener: listenerKeyboardShortcut
  ): KeyboardShortcut {
    return event == "down"
      ? this.ondown(listener)
      : event == "up"
      ? this.onup(listener)
      : this;
  }
  off(event: "down" | "up", listener: listenerKeyboardShortcut): boolean {
    return event == "down"
      ? this.offdown(listener)
      : event == "up"
      ? this.offup(listener)
      : false;
  }
  static #toProp(keystring: string = ""): propertyShortcut {
    var o: propertyShortcut = {
      Ctrl: false,
      Shift: false,
      Alt: false,
      Keys: [],
    };
    var array = keystring.split(this.separatorShortcuts);
    this.#main_keys.forEach((key) => {
      var fd = array.find((k) => k.startsWith(key));
      if (fd) {
        o[key] = fd.endsWith("?") ? undefined : true;
      }
    });
    var mainKeys = [...this.#main_keys, ...this.#main_keys.map((s) => s + "?")];
    var finded = array.find((k) => !mainKeys.includes(k));
    o.Keys =
      finded == "All"
        ? undefined
        : finded
        ? finded
            .split(this.separatorKeys)
            .map((s) => s.trim())
            .filter((k) => k !== "")
            .map((str) => this.#keyboardKeys[str as keyof allKeyboardKeys])
        : [];
    return o;
  }
  static #toString(keyproperty: propertyShortcut): string {
    var string: string[] = [];
    this.#main_keys.forEach((mn_key) => {
      if (keyproperty[mn_key] || typeof keyproperty[mn_key] == "undefined")
        string.push(mn_key + (keyproperty[mn_key] ? "" : "?"));
    });
    if (Array.isArray(keyproperty.Keys)) {
      if (keyproperty.Keys.length)
        string.push(
          keyproperty.Keys.map((k) => this.keyOf(k)).join(this.separatorKeys)
        );
    } else string.push("All");
    return string.join(this.separatorShortcuts);
  }
  static convertto<T extends keyof convertionPropertyShortcut>(
    property: propertyShortcut | string,
    to: T
  ): convertionPropertyShortcut[T] {
    return (
      to == "object"
        ? typeof property === "string"
          ? this.#toProp(property)
          : property
        : typeof property === "string"
        ? property
        : this.#toString(property)
    ) as convertionPropertyShortcut[T];
  }
  static #create(
    label: string = "",
    combinition: propertyShortcut | string = "",
    targets: null | HTMLElement[] = null
  ): KeyboardShortcut {
    var result = new this(label, this.convertto(combinition, "object"));
    result.targets = targets;
    return result;
  }
  static create(
    label: string = "",
    combinition: propertyShortcut | string = "",
    targets: null | HTMLElement[] = null
  ) {
    return this.#create(label, combinition, targets);
  }
  static #exec(
    combinition: string | propertyShortcut,
    press: ("down" | "up")[]
  ): Set<KeyboardShortcut> {
    var shortcut = this.convertto(combinition, "object");
    var ready = new Set(
      Array.from(this.#all).filter((shrt) => shrt.isValide(shortcut))
    );
    press.forEach((pressType) => {
      switch (pressType) {
        case "down": {
          ready.forEach((s) =>
            s.#on_down_fn.forEach((fn) => fn(shortcut, null, "call"))
          );
          break;
        }
        case "up": {
          ready.forEach((s) =>
            s.#on_up_fn.forEach((fn) => fn(shortcut, null, "call"))
          );
          break;
        }
        default: {
        }
      }
    });
    return ready;
  }
  static exec(
    combinition: string | propertyShortcut,
    ...press: ("down" | "up")[]
  ) {
    return this.#exec(combinition, press);
  }
  static #execCommand(
    label: string,
    press: ("down" | "up")[] = ["down"]
  ): KeyboardShortcut | null {
    var fd = Array.from(this.#all).find(({ label: lab }) => lab == label);
    if (!fd) return null;
    for (let pressType of press) {
      switch (pressType) {
        case "down": {
          fd.#on_down_fn.forEach((fn) => fn(fd!.#propertys, null, "call"));
          break;
        }
        case "up": {
          fd.#on_up_fn.forEach((fn) => fn(fd!.#propertys, null, "call"));
          break;
        }
        default: {
        }
      }
    }
    return fd;
  }
  static execCommand(label: string, press: ("down" | "up")[] = ["down"]) {
    return this.#execCommand(label, press);
  }
  static #watch(...elements: HTMLElement[]) {
    var short = this.create(
      `watch:${elements.map(({ ariaLabel }) => `${ariaLabel}`).join(" - ")}`,
      "Ctrl?+Shift?+Alt?+All",
      elements
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
  static label(labelName: string = ""): KeyboardShortcut | null {
    var fd = Array.from(this.#all).find((sh) => sh.#label == labelName);
    return fd ? fd : null;
  }
  static #keyOf(v: number): keyof allKeyboardKeys | null {
    var fd = Object.keys(this.#keyboardKeys as object).find(
      (key) => this.#keyboardKeys[key as keyof allKeyboardKeys] == v
    ) as keyof allKeyboardKeys;
    return fd ? fd : null;
  }
  static keyOf(keycode: number) {
    return this.#keyOf(keycode);
  }
  static get all(): KeyboardShortcut[] {
    return Array.from(this.#all);
  }
}
export abstract class ListBox {
  // title of listbox is unique
  // direction of listbox (forword|backword)
  #selection_direction: direction = "forword";
  // array represnt all listbox declared before
  static #all: ListBox[] = [];
  // shortcut of on listbox
  public shortcuts: shortcutConfigurationsList;
  // the name of row iterable
  public rowname: string = "";
  public configurations: configListBox = {
    movable: true,
    scrolling: true,
    selection: true,
    redirect: true,
    clipboard: true,
  };
  // on submit functions
  protected onSubmitFunctions: submitListener[] = [];
  // on change content functions
  /**
   *
   * @param e MouseEvent for when click down in element change this element to selected element
   * @returns {void}
   */
  #pointer_down_function = (e: MouseEvent): void => {
    var effective = this.EFFECTIVE_ELEMENTS;
    var mainElement = effective.find((element) =>
      element.contains(e.target as HTMLElement)
    );
    if (!mainElement) {
      this.select();
      return;
    }
    if (e.altKey)
      this.configurations.scrolling &&
        this.setSelect(mainElement, !this.getSelect(mainElement));
    else this.select(mainElement);
  };
  /**
   *
   * @param e MouseEvent for when click in element change this element to selected element
   * @returns {void}
   */
  #click_function = (e: MouseEvent): void => {
    if (e.altKey) return;
    var focusElement = this.ITEMS.find((ele) =>
      ele.contains(e.target as HTMLElement)
    );
    focusElement && this.submit("click", focusElement);
  };
  /**
   *
   * @param e DragEvent for when drag element to other place
   * @returns
   */
  #drag_function = (e: DragEvent): void => {
    var { x, y, target } = e;
    var element = document.elementFromPoint(x, y);
    if (!element) return;
    var row = element.closest(`[role="${this.rowname}"]`) as HTMLElement | null;
    if (!row) return;
    row.after(target as HTMLElement);
  };
  //
  constructor(public root: HTMLElement, title: string = `${root.ariaLabel}`) {
    if (ListBox.#all.find(({ title: tlt }) => tlt == title))
      throw Error("cannot be used same label in tow difrent listbox.");
    this.root.ariaLabel = title;
    this.click = true;
    this.root.setAttribute("role", "listbox");
    this.shortcuts = {
      selection: {
        forword: KeyboardShortcut.create(
          `${this.title} - forword selection`,
          `Shift${KeyboardShortcut.separatorShortcuts}ArrowDown`,
          [this.root]
        ).ondown(() => {
          this.forwordSelection(1);
        }),
        backword: KeyboardShortcut.create(
          `${this.title} - backword selection`,
          `Shift${KeyboardShortcut.separatorShortcuts}ArrowUp`,
          [this.root]
        ).ondown(() => {
          this.backwordSelection(1);
        }),
      },
      find: null,
      move: {
        forword: KeyboardShortcut.create(
          `${this.title} - forword`,
          `ArrowDown`,
          [this.root]
        ).ondown((combinition, event) => {
          event && event.preventDefault();
          this.forword(1);
        }),
        backword: KeyboardShortcut.create(
          `${this.title} - backword`,
          `ArrowUp`,
          [this.root]
        ).ondown((combinition, event) => {
          event && event.preventDefault();
          this.backword(1);
        }),
      },
      status: {
        submit: KeyboardShortcut.create(`${this.title} - submit`, `Enter`, [
          this.root,
        ]).ondown(() => {
          this.submit("keypress");
        }),
        cancel: KeyboardShortcut.create(`${this.title} - cancel`, "Escape", [
          this.root,
        ]).ondown(() => this.select()),
      },
      // has value in table & tree constructor
      clipboard: null,
      // has value in tree constructor
      inner: null,
    };
  }
  // getters
  get drag() {
    return Boolean(this.root.ondragend);
  }
  get click() {
    return this.root.onclick === this.#click_function;
  }
  get mouse() {
    return this.root.onmouseover == this.#pointer_down_function;
  }
  get title() {
    return `${this.root.ariaLabel}`;
  }
  get selectiondirection() {
    return this.#selection_direction;
  }
  get ITEMS() {
    return Array.from(this.root.children) as HTMLElement[];
  }
  get EFFECTIVE_ELEMENTS() {
    return this.ITEMS.filter((ele) => this.getEffective(ele));
  }
  get SELECTD_ELEMENTS() {
    return this.ITEMS.filter((ele) => this.getSelect(ele));
  }
  get FIRST_ELEMENT_SELECT() {
    var ele = this.ITEMS.find((ele) => this.getSelect(ele));
    return ele ? ele : null;
  }
  get LAST_ELEMENT_SELECT() {
    var ele = this.ITEMS.reverse().find((ele) => this.getSelect(ele));
    return ele ? ele : null;
  }
  get MIN_ELEMENT_EFFECTIVE() {
    var ele = this.ITEMS.find((ele) => this.getEffective(ele));
    return ele ? ele : null;
  }
  get MAX_ELEMENT_EFFCTIVE() {
    var ele = this.ITEMS.reverse().find((ele) => this.getEffective(ele));
    return ele ? ele : null;
  }
  get ELEMENT_DIRECTION() {
    return this.#selection_direction == "forword"
      ? this.LAST_ELEMENT_SELECT
      : this.FIRST_ELEMENT_SELECT;
  }
  // setters
  set drag(v: boolean) {
    v = Boolean(v);
    this.root.ondragend = v ? this.#drag_function : null;
    this.ITEMS.forEach((ele) => (ele.draggable = v));
  }
  set click(flag) {
    this.root.onclick = flag ? this.#click_function : null;
    this.root.onpointerdown = flag ? this.#pointer_down_function : null;
  }
  set mouse(flag) {
    this.root.onmouseover = flag ? this.#pointer_down_function : null;
    this.root.onmouseleave = flag ? () => this.select() : null;
  }
  // methods
  /**
   * true if element is effective and can be focus
   * @param element
   * @returns
   */
  getEffective(element: HTMLElement) {
    return element.ariaDisabled !== "true";
  }
  /**
   * change no effective element to effective element and also (reverse)
   * @param element
   * @returns
   */
  setEffective(element: HTMLElement, flag: boolean) {
    element.ariaDisabled = `${!flag}`;
    if (!flag) element.ariaSelected = "false";
  }
  getSelect(element: HTMLElement) {
    return this.getEffective(element) && element.ariaSelected == "true";
  }
  setSelect(element: HTMLElement, flag: boolean): boolean {
    var b = this.getEffective(element);
    if (!b) {
      return false;
    }
    element.ariaSelected = `${flag}`;
    return true;
  }
  effective(...elements: HTMLElement[]) {
    this.ITEMS.forEach((ele) => this.setEffective(ele, elements.includes(ele)));
  }
  select(...elements: HTMLElement[]) {
    this.ITEMS.forEach((ele) => this.setSelect(ele, elements.includes(ele)));
  }
  forword(count: number) {
    if (!this.configurations.movable) return;
    var { LAST_ELEMENT_SELECT, MIN_ELEMENT_EFFECTIVE } = this;
    var ele = LAST_ELEMENT_SELECT;
    if (!ele) {
      ele = MIN_ELEMENT_EFFECTIVE;
      count--;
    }
    while (ele && count) {
      ele = ele.nextElementSibling
        ? (ele.nextElementSibling as HTMLElement)
        : this.configurations.redirect
        ? MIN_ELEMENT_EFFECTIVE
        : null;
      ele && this.getEffective(ele) && count--;
    }
    if (ele) {
      this.select(ele);
      if (this.configurations.scrolling && !isLooked(ele))
        scrollToElement(ele, -1);
    }
  }
  backword(count: number) {
    if (!this.configurations.movable) return;
    var { FIRST_ELEMENT_SELECT, MAX_ELEMENT_EFFCTIVE } = this;
    var ele = FIRST_ELEMENT_SELECT;
    if (!ele) {
      ele = MAX_ELEMENT_EFFCTIVE;
      count--;
    }
    while (ele && count) {
      ele = ele.previousElementSibling
        ? (ele.previousElementSibling as HTMLElement)
        : this.configurations.redirect
        ? MAX_ELEMENT_EFFCTIVE
        : null;
      ele && this.getEffective(ele) && count--;
    }
    if (ele) {
      this.select(ele);
      if (this.configurations.scrolling && !isLooked(ele))
        scrollToElement(ele, 0);
    }
  }
  forwordSelection(count: number) {
    if (!count) {
      this.scroll("forword");
      return;
    }
    var { FIRST_ELEMENT_SELECT: first, LAST_ELEMENT_SELECT: last } = this;
    if (first == last) this.#selection_direction = "forword";
    var element = this.#selection_direction == "forword" ? last : first;
    if (!element) return;
    if (this.#selection_direction == "forword") {
      var nextElementSibling = element.nextElementSibling;
      while (
        nextElementSibling &&
        !this.getEffective(nextElementSibling as HTMLElement)
      )
        nextElementSibling = nextElementSibling.nextElementSibling;
      nextElementSibling &&
        this.setSelect(nextElementSibling as HTMLElement, true);
    } else this.setSelect(element, false);
    this.forwordSelection(count - 1);
  }
  backwordSelection(count: number) {
    if (!count) {
      this.scroll("backword");
      return;
    }
    var { FIRST_ELEMENT_SELECT: first, LAST_ELEMENT_SELECT: last } = this;
    if (first == last) this.#selection_direction = "backword";
    var element = this.#selection_direction == "forword" ? last : first;
    if (!element) return;
    if (this.#selection_direction == "backword") {
      var previousElementSibling = element.previousElementSibling;
      while (
        previousElementSibling &&
        !this.getEffective(previousElementSibling as HTMLElement)
      )
        previousElementSibling = previousElementSibling.previousElementSibling;
      previousElementSibling &&
        this.setSelect(previousElementSibling as HTMLElement, true);
    } else this.setSelect(element, false);
    this.backwordSelection(count - 1);
  }
  onsubmit(listener: submitListener) {
    typeof listener == "function" && this.onSubmitFunctions.push(listener);
    return this;
  }
  offsubmit(listener: submitListener) {
    var index = this.onSubmitFunctions.indexOf(listener);
    if (index < 0) return false;
    this.onSubmitFunctions.splice(index, 1);
    return true;
  }
  submit(type: submitTypePress = "call", element = this.ELEMENT_DIRECTION) {
    if (!this.SELECTD_ELEMENTS.length || this.rowname === "treeitem") return;
    this.onSubmitFunctions.forEach((fn) => fn(type, element!));
  }
  scroll(flag: direction = "forword") {
    var { ELEMENT_DIRECTION: element } = this;
    if (element && this.configurations.scrolling && !isLooked(element))
      scrollToElement(element, flag == "forword" ? -1 : 0);
  }
  go(dir: direction = "forword", count: number = 1) {
    this[dir](count);
  }
  selection(dir: direction = "forword", count: number = 1) {
    dir == "forword"
      ? this.forwordSelection(count)
      : this.backwordSelection(count);
  }
  static get all() {
    return this.#all;
  }
}
export class Iterations<T> extends ListBox {
  public isloading: boolean = false;
  #hiddenPropertys: (keyof T)[] = [];
  public searcherKey: keyof T;
  protected histroy: [] = [];
  constructor(
    root: HTMLElement,
    title: string,
    public propertys: (keyof T)[] = [],
    public defaultValues: T
  ) {
    super(root, title);
    this.root.tabIndex = 1;
    this.searcherKey = this.propertys[0];
    this.shortcuts.clipboard = {
      copy: KeyboardShortcut.create(
        `${this.title} copy`,
        `Ctrl${KeyboardShortcut.separatorShortcuts}C`,
        [this.root]
      ).ondown(async () => {
        this.configurations.clipboard && (await this.copy());
      }),
      paste: KeyboardShortcut.create(
        `${this.title} paste`,
        `Ctrl${KeyboardShortcut.separatorShortcuts}V`,
        [this.root]
      ).ondown(async () => {
        this.configurations.clipboard && (await this.paste());
      }),
      cut: KeyboardShortcut.create(
        `${this.title} cut`,
        `Ctrl${KeyboardShortcut.separatorShortcuts}X`,
        [this.root]
      ).ondown(async () => {
        this.configurations.clipboard && (await this.cut());
      }),
    };
    this.shortcuts.find = {
      forword: KeyboardShortcut.create(
        `${this.title} find - forword -`,
        `All`,
        [this.root]
      ).ondown(({ Keys }) => {
        if (!Keys) return;
        var ky = KeyboardShortcut.keyOf(Keys[0]);
        var selecteddirection =
          this.ELEMENT_DIRECTION || this.MIN_ELEMENT_EFFECTIVE;
        if (!selecteddirection) return;
        var next = selecteddirection.nextElementSibling;
        while (next) {
          if (
            this.getEffective(next as HTMLElement) &&
            `${
              this.readrow(next as HTMLElement)[this.searcherKey]
            }`[0].toUpperCase() === ky
          )
            break;
          next = next.nextElementSibling;
        }
        next && this.select(next as HTMLElement);
      }),
      backword: KeyboardShortcut.create(
        `${this.title} find - backword - `,
        `Shift${KeyboardShortcut.separatorShortcuts}All`,
        [this.root]
      ).ondown(({ Keys }) => {
        if (!Keys) return;
        var ky = KeyboardShortcut.keyOf(Keys[0]);
        var selecteddirection =
          this.ELEMENT_DIRECTION || this.MIN_ELEMENT_EFFECTIVE;
        if (!selecteddirection) return;
        var prev = selecteddirection.previousElementSibling;
        while (prev) {
          if (
            this.getEffective(prev as HTMLElement) &&
            `${
              this.readrow(prev as HTMLElement)[this.searcherKey]
            }`[0].toUpperCase() === ky
          )
            break;
          prev = prev.previousElementSibling;
        }
        prev && this.select(prev as HTMLElement);
      }),
    };
  }
  columns(element: HTMLElement) {
    return Array.from(
      element.querySelectorAll(`[role="content"] > [role="column"]`)
    ) as HTMLElement[];
  }
  column(element: HTMLElement, column: keyof T) {
    const cols = this.columns(element);
    var index = this.propertys.indexOf(column);
    return cols[index];
  }
  createrow(input: T): HTMLElement {
    input = defaultObject(input, this.defaultValues);
    const result = createElement("div", "", { role: this.rowname });
    const levelElement = createElement("div", "", { role: "level" });
    result.appendChild(levelElement);
    var contentElement = createElement("div", "", { role: "content" });
    this.propertys.forEach((prop, index) => {
      var columnElement = createElement("div", `${input[prop]}`, {
        role: "column",
      });
      columnElement.style.display = this.#hiddenPropertys.includes(prop)
        ? "none"
        : "";
      contentElement.appendChild(columnElement);
    });
    result.appendChild(contentElement);
    return result;
  }
  readrow(element: HTMLElement): T & row {
    const result: T & row = Object.create(null);
    result.row = element;
    const cols = this.columns(element);
    this.propertys.forEach((prop, index) => {
      Object.defineProperty(result, prop, {
        get() {
          var string = cols[index].innerHTML;
          return isNaN(+string) ? string : +string;
        },
        set(v) {
          cols[index].innerHTML = v;
        },
        enumerable: false,
        configurable: true,
      });
    });
    return result;
  }
  setHiddenPropertys(...props: (keyof T)[]) {
    this.#hiddenPropertys = props;
    this.ITEMS.forEach((element) => {
      var cols = this.columns(element);
      const indexs = this.#hiddenPropertys.map((prop) =>
        this.propertys.indexOf(prop)
      );
      cols.forEach(
        (col, index) =>
          (col.style.display = indexs.includes(index) ? "none" : "")
      );
    });
  }
  async copy() {}
  async cut() {}
  async paste() {}
  json(element: HTMLElement): T {
    var o: T = Object.create(null);
    var columns = this.columns(element);
    this.propertys.forEach((prop, index) => {
      var innerHTML = columns[index].innerHTML;
      o[prop] = (isNaN(+innerHTML) ? innerHTML : +innerHTML) as T[keyof T];
    });
    return o;
  }
  static create<R>(title: string, defaultValue: R) {
    const root = createElement("div", "", { role: "iterations" });
    const iterable = new this(
      root,
      title,
      Object.keys(defaultValue as object) as (keyof R)[],
      defaultValue
    );
    return iterable;
  }
  throwLoading() {
    if (this.isloading)
      throw Error("cannot be update the content is stay loading...");
  }
}
export class Table<T> extends Iterations<T> {
  constructor(
    root: HTMLElement,
    title: string,
    propertys: (keyof T)[] = [],
    defaultValue: T
  ) {
    super(root, title, propertys, defaultValue);
    this.root.setAttribute("role", "table");
    this.rowname = "row";
  }
  get DATA(): (T & row)[] {
    return this.ITEMS.map((element) => this.readrow(element));
  }
  get EFFECTIVE_DATA(): (T & row)[] {
    return this.EFFECTIVE_ELEMENTS.map((element) => this.readrow(element));
  }
  get SELECTED_DATA(): (T & row)[] {
    return this.SELECTD_ELEMENTS.map((element) => this.readrow(element));
  }
  protected appendSync(data: T[]) {
    data.forEach((input) => this.root.appendChild(this.createrow(input)));
  }
  protected async append(
    data: T[],
    timeout: number | ((value: T, index: number) => number),
    limit: number
  ) {
    await forEachAsync(
      data,
      (input) => this.root.appendChild(this.createrow(input)),
      timeout,
      limit
    );
  }
  protected prependSync(data: T[]) {
    data.forEach((input) => this.root.prepend(this.createrow(input)));
  }
  protected async prepend(
    data: T[],
    timeout: number | ((value: T, index: number) => number),
    limit: number
  ) {
    await forEachAsync(
      data,
      (input) => this.root.prepend(this.createrow(input)),
      timeout,
      limit
    );
  }
  protected afterSync(element: HTMLElement, data: T[]) {
    data.reverse().forEach((input) => element.after(this.createrow(input)));
  }
  protected async after(
    element: HTMLElement,
    data: T[],
    timeout: number | ((value: T, index: number) => number),
    limit: number
  ) {
    await forEachAsync(
      data.reverse(),
      (input) => element.after(this.createrow(input)),
      timeout,
      limit
    );
  }
  protected beforeSync(element: HTMLElement, data: T[]) {
    data.forEach((input) => element.before(this.createrow(input)));
  }
  protected async before(
    element: HTMLElement,
    data: T[],
    timeout: number | ((value: T, index: number) => number),
    limit: number
  ) {
    await forEachAsync(
      data,
      (input) => element.before(this.createrow(input)),
      timeout,
      limit
    );
  }
  override async copy() {
    if (!this.configurations.clipboard) return;
    const selectedData = this.SELECTD_ELEMENTS.map((element) =>
      this.json(element)
    );
    await navigator.clipboard.writeText(
      JSON.stringify(selectedData, undefined, 1)
    );
  }
  override async cut() {
    if (!this.configurations.clipboard) return;
    const selectedData = this.SELECTD_ELEMENTS.map((element) => {
      element.remove();
      this.json(element);
    });
    await navigator.clipboard.writeText(JSON.stringify(selectedData));
  }
  override async paste() {
    var array = Array.from(
      JSON.parse(await navigator.clipboard.readText())
    ) as T[];
    const {
      SELECTD_ELEMENTS: selectedElement,
      LAST_ELEMENT_SELECT: lastSelectedElement,
    } = this;
    var modulo = array.length % selectedElement.length;
    if (modulo)
      selectedElement.forEach((element, index) => {
        this.after(
          element,
          array.slice(index * modulo, (index + 1) * modulo),
          100,
          1
        );
      });
    else if (selectedElement.length)
      selectedElement.forEach((element) => {
        this.after(element, array, 100, 1);
      });
    else this.append(array, 100, 1);
  }
  protected sortSync(by: keyof T, to = "down") {
    var allData = this.DATA;
    for (let i = 0; i < allData.length; i++) {
      var body = allData[i];
      var j = i - 1;
      var prev = body.row.previousElementSibling;
      while (
        prev &&
        (to == "down"
          ? this.readrow(prev as HTMLElement)[by] > body[by]
          : this.readrow(prev as HTMLElement)[by] < body[by])
      ) {
        prev = prev.previousElementSibling;
        allData[j + 1] = allData[j];
        j--;
      }
      !prev ? this.root.prepend(body.row) : prev.after(body.row);
      allData[j + 1] = body;
    }
  }
  protected async sort(
    by: keyof T,
    to = "down",
    timeout: number,
    limit: number
  ) {
    var allData = this.DATA;
    var dl = new Delay(timeout);
    for (let i = 0; i < allData.length; i++) {
      if (!(i % limit)) await dl.on();
      var body = allData[i];
      var j = i - 1;
      var prev = body.row.previousElementSibling;
      while (
        prev &&
        (to == "down"
          ? this.readrow(prev as HTMLElement)[by] > body[by]
          : this.readrow(prev as HTMLElement)[by] < body[by])
      ) {
        prev = prev.previousElementSibling;
        allData[j + 1] = allData[j];
        j--;
      }
      !prev ? this.root.prepend(body.row) : prev.after(body.row);
      allData[j + 1] = body;
    }
  }
  async methode<R extends keyof methodesTableMap<T>>(
    methode: R,
    input: methodesTableMap<T>[R],
    element: HTMLElement,
    timeout: number,
    limit: number
  ) {
    this.throwLoading();
    this.isloading = true;
    switch (methode) {
      case "after": {
      }
      case "before": {
        await this[methode as "after" | "before"](
          element,
          input as methodesTableMap<T>["after"],
          timeout,
          limit
        );
        break;
      }
      case "prepend": {
      }
      case "append": {
        await this[methode as "prepend" | "append"](
          input as methodesTableMap<T>["append"],
          timeout,
          limit
        );
        break;
      }
      case "sort": {
        var { by, direction } = input as methodesTableMap<T>["sort"];
        await this.sort(by, direction, timeout, limit);
      }
    }
    this.isloading = false;
  }
  async methodeSync<R extends keyof methodesTableMap<T>>(
    methode: R,
    input: methodesTableMap<T>[R],
    element: HTMLElement
  ) {
    this.throwLoading();
    this.isloading = true;
    switch (methode) {
      case "after": {
      }
      case "before": {
        this[`${methode as "after" | "before"}Sync`](
          element,
          input as methodesTableMap<T>["after"]
        );
        break;
      }
      case "prepend": {
      }
      case "append": {
        this[`${methode as "prepend" | "append"}Sync`](
          input as methodesTableMap<T>["append"]
        );
        break;
      }
      case "sort": {
        var { by, direction } = input as methodesTableMap<T>["sort"];
        this.sortSync(by, direction);
      }
    }
    this.isloading = false;
  }
}
export class TreeLinear<T> extends Iterations<T> {
  // the main element has childs only
  #mainTreeElement = createElement("span", "", {
    "aria-level": -1,
    "aria-disabled": "true",
  });
  // the callback when need to get query
  #callbackquery: callBackQuery<T & row> = (d, i) => `${i}`;
  // separator between querys
  public separator = "/";
  // what the subtree element has
  #subtree_propertys: { value: string; property: keyof T }[] = [];
  constructor(
    root: HTMLElement,
    title: string,
    propertys: (keyof T)[],
    defaultValues: T
  ) {
    super(root, title, propertys, defaultValues);
    this.root.setAttribute("role", "treelinear");
    this.rowname = "treeitem";
    this.root.prepend(this.#mainTreeElement);
    this.shortcuts.inner = {
      open: KeyboardShortcut.create(`${this.title} - open`, "ArrowRight", [
        this.root,
      ]).ondown(() => {
        const selectedElement = this.SELECTD_ELEMENTS;
        selectedElement.forEach((element) => {
          if (this.#isclosed(element)) this.#open(element);
          else {
            const firstElement = this.firstchildof(element);
            if (firstElement) {
              this.setSelect(element, false);
              this.setSelect(firstElement, true);
            }
          }
        });
      }),
      close: KeyboardShortcut.create(`${this.title} - close`, "ArrowLeft", [
        this.root,
      ]).ondown(() => {
        const selectedElement = this.SELECTD_ELEMENTS;
        selectedElement.forEach((element) => {
          if (this.#isclosed(element)) {
            var outer = this.#outer(element);
            if (outer && outer != this.#mainTreeElement) {
              this.setSelect(element, false);
              this.setSelect(outer, true);
            }
          } else {
            this.#close(element);
          }
        });
      }),
    };
  }
  override get ITEMS() {
    return super.ITEMS.slice(1);
  }
  getlevel(element: HTMLElement): number {
    return Number(element.ariaLevel);
  }
  #inner(element: HTMLElement) {
    var initLvl = this.getlevel(element);
    var { nextElementSibling } = element;
    var result: HTMLElement[] = [];
    while (
      nextElementSibling &&
      initLvl < this.getlevel(nextElementSibling as HTMLElement)
    ) {
      this.getlevel(nextElementSibling as HTMLElement) == initLvl + 1 &&
        result.push(nextElementSibling as HTMLElement);
      nextElementSibling = nextElementSibling.nextElementSibling;
    }
    return result;
  }
  #outer(element: HTMLElement) {
    var initLvl = this.getlevel(element);
    var { previousElementSibling } = element;
    while (
      previousElementSibling &&
      initLvl <= this.getlevel(previousElementSibling as HTMLElement)
    )
      previousElementSibling = previousElementSibling.previousElementSibling;
    return previousElementSibling as HTMLElement | null;
  }
  #to_query(element: HTMLElement): string {
    var outer = this.#outer(element);
    const data = this.readrow(element);
    if (!outer) return `${this.#callbackquery(data, 0)}`;
    else {
      var index = this.#inner(outer).indexOf(element);
      return `${this.#to_query(outer)}${this.separator}${this.#callbackquery(
        data,
        index
      )}`;
    }
  }
  #to_element(query: string): HTMLElement | null {
    var result = this.#mainTreeElement as HTMLElement | null;
    var spliting = query
      .split(this.separator)
      .map((content) => content.trim())
      .filter((s) => s !== "");
    for (let i = 0; i < spliting.length; i++) {
      if (!result) return null;
      var fd = this.#inner(result).find((element, index) => {
        const data = this.readrow(element);
        return this.#callbackquery(data, index) == spliting[i];
      });
      result = fd ? fd : null;
    }
    return result;
  }
  #getLevelElement(element: HTMLElement): HTMLElement {
    return element.querySelector(`[role="level"]`)!;
  }
  #getIconElement(element: HTMLElement): HTMLElement | null {
    return element.querySelector(`[role="level"] > [role="icon"]`);
  }
  #isopend(element: HTMLElement) {
    if (element == this.#mainTreeElement) return true;
    if (!this.issubtree(element)) return false;
    var showMoreIcon = this.#getIconElement(element);
    return !showMoreIcon || showMoreIcon.ariaExpanded === "true";
  }
  #isclosed(element: HTMLElement) {
    if (element == this.#mainTreeElement) return false;
    if (!this.issubtree(element)) return true;
    var showMoreIcon = this.#getIconElement(element);
    return !showMoreIcon || showMoreIcon.ariaExpanded === "false";
  }
  #open(element: HTMLElement) {
    var showMoreIcon = this.#getIconElement(element);
    if (showMoreIcon)
      showMoreIcon.innerHTML = `<i class="material-icons">expand_more</i>`;
    this.#inner(element).forEach((ele) => {
      this.setshow(ele, true);
      if (ele.ariaAutoComplete == "true") {
        ele.ariaAutoComplete = "false";
        this.#open(ele);
      }
    });
  }
  #close(element: HTMLElement) {
    var showMoreIcon = this.#getIconElement(element);
    if (showMoreIcon)
      showMoreIcon.innerHTML = `<i class="material-icons">chevron_right</i>`;
    this.#inner(element).forEach((ele) => {
      this.setshow(ele, false);
      if (this.#isopend(ele)) {
        ele.ariaAutoComplete = "true";
        this.#close(ele);
      } else ele.ariaAutoComplete = "false";
    });
  }
  #toggle(element: HTMLElement) {
    this.#isclosed(element) ? this.#open(element) : this.#close(element);
  }
  inner(element: HTMLElement | string) {
    element = this.convertto(element, "element");
    return element ? this.#inner(element) : [];
  }
  outer(element: HTMLElement | string) {
    element = this.convertto(element, "element");
    return element ? this.#outer(element) : null;
  }
  convertto<R extends keyof convertionDataTree>(
    any: HTMLElement | string,
    to: R
  ): convertionDataTree[R] {
    return (
      to == "element"
        ? typeof any == "string"
          ? this.#to_element(any)
          : any
        : typeof any == "string"
        ? any
        : this.#to_query(any)
    ) as convertionDataTree[R];
  }
  childsOf(any: HTMLElement | string) {
    any = this.convertto(any, "element");
    const inner = this.#inner(any);
    var result: HTMLElement[] = [];
    inner.forEach((itemElement) =>
      result.push(itemElement, ...this.childsOf(itemElement))
    );
    return result;
  }
  lastchildof(any: HTMLElement | string) {
    any = this.convertto(any, "element");
    var inner = this.#inner(any);
    var result = inner[inner.length - 1];
    if (!result) return null;
    inner = this.#inner(result);
    while (inner.length) {
      result = inner[inner.length - 1];
      inner = this.#inner(result);
    }
    return result;
  }
  firstchildof(any: string | HTMLElement) {
    any = this.convertto(any, "element");
    const inner = this.#inner(any);
    return inner.length ? inner[0] : null;
  }
  issubtree(element: HTMLElement) {
    if (this.#mainTreeElement == element) return true;
    const columns = this.columns(element);
    return this.#subtree_propertys.every(
      ({ property, value }) =>
        columns[this.propertys.indexOf(property)].innerHTML == value
    );
  }
  override createrow(
    input: T,
    lvl: number = 0,
    closed: boolean = false,
    visible: boolean = true
  ): HTMLElement {
    const result = super.createrow(input);
    result.ariaLevel = `${lvl}`;
    this.setshow(result, visible);
    if (this.issubtree(result)) {
      result.ariaExpanded = "true";
      const showMoreIcon = createElement(
        "span",
        `<i class="material-icons">${
          closed ? "chevron_right" : "expand_more"
        }</i>`,
        {
          role: "icon",
          "aria-expanded": !closed,
        }
      );
      showMoreIcon.onclick = () => this.#toggle(result);
      result.querySelector('[role="level"]')?.prepend(showMoreIcon);
    } else result.ariaExpanded = "false";
    return result;
  }
  read(element: HTMLElement = this.#mainTreeElement): tree<T & row> {
    var body = this.readrow(element);
    return {
      body,
      innerTree: this.#inner(element).map((ele) => this.read(ele)),
    };
  }
  setsubtreepropertys(...propertys: { value: string; property: keyof T }[]) {
    this.#subtree_propertys = propertys;
    this.ITEMS.forEach((element) => {
      const issubtree = this.issubtree(element);
      var iconShowMore = element.querySelector(
        `[role="level"] > [role="icon"]`
      );
      element.ariaExpanded = `${issubtree}`;
      if (issubtree) {
        if (!iconShowMore) {
          const showMoreIcon = createElement(
            "span",
            `<i class="material-icons">chevron_right</i>`,
            {
              role: "icon",
            }
          );
          showMoreIcon.onclick = () => this.#toggle(element);
          element.querySelector('[role="level"]')?.prepend(showMoreIcon);
        }
      } else iconShowMore?.remove();
    });
  }
  setshow(rowElement: HTMLElement, flag: boolean) {
    // set element visible or not
    rowElement.style.display = flag ? "" : "none";
    // set effectivity true if the flag visible or that is gonna be false
    this.setEffective(rowElement, flag);
  }
  protected async append(
    element: HTMLElement | string,
    data: T[],
    timeout: number,
    limit: number
  ) {
    // the same steps in the methode `appendSync`
    element = this.convertto(element, "element");
    if (!this.issubtree(element)) throw Error("Cannot Be add in this item");
    const isopend = this.#isopend(element);
    const initLevel = this.getlevel(element) + 1;
    element = this.lastchildof(element) || element;
    data = data.reverse();
    // create delay for make sure the append is not directly append all element
    var dl = new Delay(timeout);
    for (let i = 0; i < data.length; i++) {
      if (!(i % limit)) await dl.on();
      element.after(this.createrow(data[i], initLevel, true, isopend));
    }
  }
  protected async prepend(
    element: HTMLElement | string,
    data: T[],
    timeout: number,
    limit: number
  ) {
    // the same steps of appendSync method just remove step number 5
    element = this.convertto(element, "element");
    if (!this.issubtree(element)) throw Error("Cannot Be add in this item");
    const isopend = this.#isopend(element);
    const initLevel = this.getlevel(element) + 1;
    data = data.reverse();
    var dl = new Delay(timeout);
    for (let i = 0; i < data.length; i++) {
      if (!(i % limit)) dl.on();
      element.after(this.createrow(data[i], initLevel, true, isopend));
    }
  }
  protected async after(
    element: HTMLElement,
    data: T[],
    timeout: number,
    limit: number
  ) {
    this.throwLoading();
    var lvl = this.getlevel(element);
    var inner = this.childsOf(element);
    var isclosed = element.style.display == "none";
    element = inner.length ? inner[inner.length - 1] : element;
    await forEachAsync(
      data.reverse(),
      (d) => element.after(this.createrow(d, lvl, false, isclosed)),
      timeout,
      limit
    );
  }
  protected async before(
    element: HTMLElement,
    data: T[],
    timeout: number,
    limit: number
  ) {
    var lvl = this.getlevel(element);
    var isclosed = element.style.display == "none";
    await forEachAsync(
      data,
      (d) => element.before(this.createrow(d, lvl, true, isclosed)),
      timeout,
      limit
    );
  }
  protected async delete(element: HTMLElement, timeout: number, limit: number) {
    await forEachAsync(
      this.#inner(element),
      async (ele) => await this.delete(ele, timeout, limit),
      timeout,
      limit
    );
    element.remove();
  }
  protected async insert(
    element: HTMLElement,
    tree: tree<T>[],
    timeout: number,
    limit: number
  ) {
    var level = this.getlevel(element) + 1;
    var isopend = this.#isopend(element);
    await forEachAsync(
      tree,
      async ({ body, innerTree }) => {
        var ele = this.createrow(body, level, true, isopend);
        var mainElement = this.lastchildof(element) || element;
        mainElement.after(ele);
        Array.isArray(innerTree) &&
          innerTree.length &&
          (await this.insert(ele, innerTree, timeout, limit));
      },
      timeout,
      limit
    );
  }
  protected appendSync(element: HTMLElement | string, data: T[]) {
    // convert element (element|query) to HTMLElement
    element = this.convertto(element, "element");
    // throw error if the element gona append as not subtree element
    if (!this.issubtree(element)) throw Error("Cannot Be add in this item");
    // isopend true if the element is opend and thes inner items is visible else false
    const isopend = this.#isopend(element);
    // the initial level of element expl: element level => 10 the new items element level => 11
    const initLevel = this.getlevel(element) + 1;
    // test if this element has a last element child reccur or not => if has the element gona change
    element = this.lastchildof(element) || element;
    // reverse data for when append to element the order stay fix
    data = data.reverse();
    // creation of items
    for (let i = 0; i < data.length; i++) {
      // set the row element if as visible and effective or not
      element.after(this.createrow(data[i], initLevel, true, isopend));
    }
  }
  protected prependSync(element: HTMLElement | string, data: T[]) {
    this.throwLoading();
    // the same steps of appendSync method just remove step number 5
    element = this.convertto(element, "element");
    if (!this.issubtree(element)) throw Error("Cannot Be add in this item");
    const isopend = this.#isopend(element);
    const initLevel = this.getlevel(element) + 1;
    data = data.reverse();
    for (let i = 0; i < data.length; i++)
      element.after(this.createrow(data[i], initLevel, true, isopend));
  }
  protected afterSync(element: HTMLElement, data: T[]) {
    this.throwLoading();
    var lvl = this.getlevel(element);
    var inner = this.#inner(element);
    var isclosed = element.style.display == "none";
    while (inner.length) {
      element = inner[inner.length - 1];
      inner = this.#inner(element);
    }
    data
      .reverse()
      .forEach((d) => element.after(this.createrow(d, lvl, false, !isclosed)));
  }
  protected beforeSync(element: HTMLElement, data: T[]) {
    var lvl = this.getlevel(element);
    var isclosed = element.style.display == "none";
    data.forEach((d) => element.before(this.createrow(d, lvl, true, isclosed)));
  }
  protected deleteSync(element: HTMLElement) {
    this.#inner(element).forEach((ele) => this.deleteSync(ele));
    element.remove();
  }
  protected insertSync(element: HTMLElement, tree: tree<T>[]) {
    var level = this.getlevel(element) + 1;
    var isopend = this.#isopend(element);
    tree.forEach(({ body, innerTree }) => {
      var ele = this.createrow(body, level, true, isopend);
      var mainElement = this.lastchildof(element) || element;
      mainElement.after(ele);
      Array.isArray(innerTree) &&
        innerTree.length &&
        this.insertSync(ele, innerTree);
    });
  }
  protected sortSync(
    element: HTMLElement = this.#mainTreeElement,
    sortBy: keyof T,
    direction: SortedBy,
    deep: boolean = true
  ) {
    var tree = this.read(element).innerTree;
    for (let i = 0; i < tree.length; i++) {
      var { body } = tree[i];
      var { row } = body;
      deep && this.sortSync(row, sortBy, direction);
      var j = i - 1;
      var prec = tree[j];
      while (
        prec &&
        (direction == "down"
          ? prec.body[sortBy] < body[sortBy]
          : prec.body[sortBy] > body[sortBy])
      ) {
        j--;
        prec = tree[j];
      }
      var childs = this.childsOf(row);
      if (prec) prec.body.row.before(...childs);
      else element.after(...childs);
    }
  }
  protected async sort(
    element: HTMLElement,
    key: keyof T,
    direction: SortedBy,
    deep: boolean = true,
    timeout: number,
    limit: number
  ) {
    var dl = new Delay(timeout);
    var tree = this.read(element).innerTree;
    function childs(tree: tree<T & row>) {
      var result = [tree.body.row];
      tree.innerTree.forEach((tree) => result.push(...childs(tree)));
      return result;
    }
    for (let i = 0; i < tree.length; i++) {
      if (!(i % limit)) await dl.on();
      var o = tree[i];
      var { body } = o;
      var { row } = body;
      var j = i - 1;
      var prec = tree[j];
      while (
        prec &&
        (direction == "down"
          ? prec.body[key] < body[key]
          : prec.body[key] > body[key])
      ) {
        j--;
        prec = tree[j];
      }
      var c = childs(o);
      if (prec) prec.body.row.before(...c);
      else element.after(...c);
      deep && (await this.sort(row, key, direction, true, timeout, limit));
      tree = this.read(element).innerTree;
    }
  }
  async methode<R extends keyof methodesTreeMap<T>>(
    methode: R,
    element: HTMLElement | string,
    input: methodesTreeMap<T>[R],
    timeout: number,
    limit: number
  ) {
    this.throwLoading();
    this.isloading = true;
    element = this.convertto(element, "element");
    switch (methode) {
      case "before": {
      }
      case "append": {
      }
      case "prepend": {
      }
      case "after": {
        await this[methode as "after" | "before" | "append"](
          element,
          input as methodesTreeMap<T>["after"],
          timeout,
          limit
        );
        break;
      }
      case "insert": {
        await this.insert(
          element,
          input as methodesTreeMap<T>["insert"],
          timeout,
          limit
        );
        break;
      }
      case "delete": {
        await this.delete(element, timeout, limit);
        break;
      }
      case "sort": {
        var { by, direction, deep } = input as methodesTreeMap<T>["sort"];
        await this.sort(element, by, direction, deep, timeout, limit);
      }
    }
    this.isloading = false;
  }
  methodeSync<R extends keyof methodesTreeMap<T>>(
    methode: R,
    element: HTMLElement | string,
    input: methodesTreeMap<T>[R]
  ) {
    this.throwLoading();
    element = this.convertto(element, "element");
    switch (methode) {
      case "before": {
      }
      case "append": {
      }
      case "prepend": {
      }
      case "after": {
        this[`${methode as "after" | "before" | "append"}Sync`](
          element,
          input as methodesTreeMap<T>["after"]
        );
        break;
      }
      case "insert": {
        this.insertSync(element, input as methodesTreeMap<T>["insert"]);
        break;
      }
      case "delete": {
        this.deleteSync(element);
        break;
      }
      case "sort": {
        var { by, direction, deep } = input as methodesTreeMap<T>["sort"];
        this.sortSync(element, by, direction, deep);
      }
    }
  }
  setcallbackquery(callback: callBackQuery<T>) {
    this.#callbackquery = callback;
  }
  isopend(element: HTMLElement | string) {
    element = this.convertto(element, "element");
    return this.#isopend(element);
  }
  isclosed(element: HTMLElement | string) {
    element = this.convertto(element, "element");
    return this.#isclosed(element);
  }
  open(element: HTMLElement | string = this.#mainTreeElement) {
    element = this.convertto(element, "element");
    if (this.issubtree(element))
      throw Error("Cannot Be open element not subtree element");
    else this.#open(element);
  }
  close(element: HTMLElement | string = this.#mainTreeElement) {
    element = this.convertto(element, "element");
    if (this.issubtree(element))
      throw Error("Cannot Be open element not subtree element");
    else this.#close(element);
  }
  toggle(element: HTMLElement | string = this.#mainTreeElement) {
    element = this.convertto(element, "element");
    if (this.issubtree(element))
      throw Error("Cannot Be open element not subtree element");
    else this.#close(element);
  }
  override submit(
    type: submitTypePress = "call",
    element = this.ELEMENT_DIRECTION
  ) {
    if (!this.SELECTD_ELEMENTS.length || this.issubtree(element!)) return;
    this.onSubmitFunctions.forEach((fn) => fn(type, element!));
  }
  jsontree(element: HTMLElement): tree<T> {
    return {
      body: super.json(element),
      innerTree: this.issubtree(element)
        ? this.#inner(element).map((ele) => this.jsontree(ele))
        : [],
    };
  }
  override async copy() {
    const selectedElement = this.SELECTD_ELEMENTS;
    await navigator.clipboard.writeText(
      JSON.stringify(
        selectedElement.map((ele) => this.jsontree(ele)),
        undefined,
        1
      )
    );
  }
  override async cut(timeout: number = 20, limit: number = 1) {
    const selectedElement = this.SELECTD_ELEMENTS;
    await navigator.clipboard.writeText(
      JSON.stringify(
        selectedElement.map((ele) => this.jsontree(ele)),
        undefined,
        1
      )
    );
    selectedElement.forEach((element) => this.delete(element, timeout, limit));
  }
  override async paste(timeout: number = 20, limit: number = 1) {
    this.throwLoading();
    var data = JSON.parse(await navigator.clipboard.readText());
    if (!Array.isArray(data)) throw Error("paste ignore");
    const selected = this.SELECTD_ELEMENTS.filter((ele) => this.issubtree(ele));
    if (selected.length == data.length) {
      await forEachAsync(
        selected,
        async (element, index) =>
          await this.insert(element, data[index], timeout, limit),
        timeout,
        limit
      );
    }
  }
  static override create<T>(title: string, defaultValue: T): TreeLinear<T> {
    const tree = super.create(title, defaultValue);
    return tree as TreeLinear<T>;
  }
}
export class Graphe {
  static #all: Set<Graphe> = new Set();
  static origin: Graphe = Graphe.create(0, 0, "origin", null);
  #points: Set<Graphe> = new Set();
  public relations: { graphe: Graphe; color: string }[] = [];
  #origin: Graphe | null = null;
  #indexCopyed: number = 0;
  constructor(
    public label: string,
    public x: number,
    public y: number,
    public r: number,
    public width: number,
    public height: number,
    public form: "circle" | "rect",
    public color: string,
    origin: Graphe | null = Graphe.origin
  ) {
    if (Graphe.all.find(({ label: lbl }) => lbl === label))
      throw Error("cannot be used the same label in diffrente Graphe");
    this.origin = origin;
    Graphe.#all.add(this);
  }
  get origin() {
    return this.#origin;
  }
  get origins(): Graphe[] {
    return !this.#origin ? [] : [...this.#origin.origins, this.#origin];
  }
  set origin(v) {
    this.#origin && this.#origin.#points.delete(this);
    this.#origin = v;
    this.#origin && this.#origin.#points.add(this);
  }
  get relative(): [number, number, number] {
    var { origin, x, y, r } = this;
    while (origin) {
      x += origin.x;
      y += origin.y;
      r += origin.r;
      origin = origin.origin;
    }
    var diff = (x ** 2 + y ** 2) ** (1 / 2);
    var R = Math.atan(x / y);
    x = diff * Math.cos(R + r);
    y = diff * Math.sin(R + r);
    return [x, y, r];
  }
  get points() {
    return Array.from(this.#points);
  }
  draw(context: CanvasRenderingContext2D, showOrigins: boolean = false) {
    context.save();
    const { origins } = this;
    [...origins, this].forEach((graphe) => {
      var { x, y, r } = graphe;
      context.translate(x, y);
      context.rotate(r);
      if (showOrigins || graphe == this) {
        context.beginPath();
        if (graphe.form == "circle")
          context.ellipse(
            0,
            0,
            graphe.width / 2,
            graphe.height / 2,
            0,
            0,
            Math.PI * 2
          );
        else
          context.rect(
            -graphe.width / 2,
            -graphe.height / 2,
            graphe.width,
            graphe.height
          );
        context.strokeStyle = graphe.color;
        context.stroke();
        context.closePath();
        context.beginPath();
        graphe.relations.forEach(({ color, graphe: grp }) => {
          var { diffX, diffY } = Graphe.info(grp, graphe);
          context.lineTo(0, 0);
          context.lineTo(diffX, diffY);
          context.setLineDash([5, 5]);
          context.strokeStyle = color;
          context.stroke();
        });
        context.closePath();
        context.setLineDash([]);
      }
    });
    context.restore();
  }
  static info(g1: Graphe, g2: Graphe = this.origin) {
    const [x1, y1] = g1.relative;
    const [x2, y2] = g2.relative;
    const diffX: number = x1 - x2;
    const diffY: number = y1 - y2;
    return {
      diffX,
      diffY,
      diff: (diffX ** 2 + diffY ** 2) ** (1 / 2),
      rotation: Math.atan(diffY / diffX),
    };
  }
  static create(
    x: number,
    y: number,
    label: string = `point - ${this.#all.size}`,
    origin: Graphe | null = this.origin
  ) {
    return new this(
      label,
      x,
      y,
      0,
      10,
      10,
      "circle",
      label.includes("origin") ? "#F33" : "white",
      origin
    );
  }
  copy() {
    var { x, y, r, width, height, form, color, origin } = this;
    this.#indexCopyed++;
    var result = new Graphe(
      `${this.label} - version(${this.#indexCopyed})`,
      x,
      y,
      r,
      width,
      height,
      form,
      color,
      origin
    );
    var points: Set<Graphe> = new Set();
    this.points.forEach((point) => {
      var graphe = point.copy();
      graphe.origin = result;
      points.add(graphe);
    });
    result.#points = points;
    return result;
  }
  static get noOrigin() {
    return Array.from(this.#all).filter((graphe) => !graphe.#points.size);
  }
  static draw(context: CanvasRenderingContext2D) {
    this.noOrigin.forEach((graphe) => graphe.draw(context, true));
  }
  get from(): null | Graphe {
    return Graphe.from(this);
  }
  get components() {
    return Graphe.components(this);
  }
  static label(label: string): Graphe | null {
    var fd = this.all.find(({ label: lbl }) => lbl == label);
    return fd || null;
  }
  static clear() {
    this.#all = new Set([this.origin]);
  }
  static from(graphe: Graphe) {
    return Graphe.label(graphe.label.replace(/ - version\([1-9]+\)/gi, ""));
  }
  static components(graphe: Graphe) {
    var result = [graphe];
    graphe.points.forEach((g) => result.push(...this.components(g)));
    return result;
  }
  static get all() {
    return Array.from(this.#all);
  }
}
export class ToolBar<T> extends ListBox {
  #types: (keyof T)[] = [];
  constructor(title: string, ...types: (keyof T)[]) {
    var root = createElement("ul", "", {});
    super(root, title);
    this.#types = types;
    this.root.setAttribute("role", "toolbar");
  }
  get types() {
    return this.#types;
  }
  findTip<S extends keyof T>(label: S): configurationToolBar<S> | null {
    var element = this.ITEMS.find((content) => content.ariaLabel == label);
    return element
      ? {
          label,
          click: element.onclick,
          element: element as HTMLAnchorElement,
          iconElement: element.querySelector("i")! as HTMLElement,
        }
      : null;
  }
  addTip(label: keyof T, iconName: string, click: (e: MouseEvent) => void) {
    var fdTip = this.findTip(label);
    if (fdTip) throw Error(`The Label ${label.toString()} is defined`);
    var element = createElement(
      "li",
      `<i class="material-icons material-icons-outlined icon">${iconName}</i>`,
      {
        "aria-label": label,
      }
    );
    this.root.appendChild(element);
    element.onclick = click;
  }
  removeTip(label: keyof T) {
    this.findTip(label)?.element.remove();
  }
  exec(label: keyof T) {
    var find = this.findTip(label);
    if (!find) return;
    find.element.click();
  }
}
