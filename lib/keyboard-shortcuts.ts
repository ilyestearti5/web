import {
  propertyShortcut,
  convertionPropertyShortcut,
  WhenShortcutOn,
  mainKeys,
  listenerKeyboardShortcut,
  allKeyboardKeys,
} from "./types.js";

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
  get when(): WhenShortcutOn {
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
  set when(v: WhenShortcutOn) {
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
    this.#propertys = KeyboardShortcut.convertTo(content, "object");
  }
  change(content: string | propertyShortcut) {
    this.#change(content);
  }
  #isValide(short: string | propertyShortcut) {
    var shortcut = KeyboardShortcut.convertTo(short, "object");

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
  static convertTo<T extends keyof convertionPropertyShortcut>(
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
    var result = new this(label, this.convertTo(combinition, "object"));
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
    var shortcut = this.convertTo(combinition, "object");
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
