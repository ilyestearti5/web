import { KeyboardShortcut } from "./keyboardshortcuts";

// the interfaces
export interface propertyShortcut {
    Ctrl?: boolean;
    Shift?: boolean;
    Alt?: boolean;
    Keys?: number[];
  }
  export interface convertionPropertyShortcut {
    object: propertyShortcut;
    string: string;
  }
  export interface whenShortcutOn {
    down: boolean;
    up: boolean;
    press: boolean;
  }
  export interface configListBox {
    movable: boolean;
    scrolling: boolean;
    selection: boolean;
    redirect: boolean;
    clipboard: boolean;
  }
  export interface row {
    row: HTMLElement;
  }
  export interface configurationToolBar<T> {
    label: T;
    iconElement: HTMLElement;
    click: ((e: MouseEvent) => void) | null;
    element: HTMLAnchorElement;
  }
  export interface allKeyboardKeys {
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
    0: number;
    1: number;
    2: number;
    3: number;
    4: number;
    5: number;
    6: number;
    7: number;
    8: number;
    9: number;
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
  export interface directionShortcut {
    forword: KeyboardShortcut;
    backword: KeyboardShortcut;
  }
  export interface shortcutConfigurationsList {
    clipboard: null | {
      copy: KeyboardShortcut;
      paste: KeyboardShortcut;
      cut: KeyboardShortcut;
    };
    selection: directionShortcut & { all: KeyboardShortcut };
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
  export interface tree<T> {
    body: T;
    innerTree: tree<T>[];
  }
  export interface convertionDataTree {
    query: string;
    element: HTMLElement;
  }
  export interface methodesTableMap<T> {
    append: T[];
    prepend: T[];
    after: T[];
    before: T[];
    sort: {
      by: keyof T;
      direction: SortedBy;
    };
  }
  export interface methodesTreeMap<T> {
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
  export interface subtreePropertys<T> {
    property: keyof T;
    value: string;
  }
  // data types
  export type mainKeys = "Ctrl" | "Shift" | "Alt";
  export type listenerKeyboardShortcut = (
    combinition: propertyShortcut,
    event: KeyboardEvent | null,
    type: "key" | "call"
  ) => void;
  export type direction = "forword" | "backword";
  export type submitListener = (
    type: submitTypePress,
    element: HTMLElement
  ) => void;
  export type submitTypePress = "call" | "keypress" | "click";
  export type SortedBy = "down" | "up";
  export type shortcutActivation = "down" | "up" | "press";
  export type callBackQuery<T> = (data: T, index: number) => string;