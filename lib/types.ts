import { KeyboardShortcut } from "./keyboard-shortcuts";
import { ListBox } from "./listbox";
import { Table } from "./table";

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
export interface WhenShortcutOn {
  down: boolean;
  up: boolean;
}
export interface ConfigListBox {
  movable: boolean;
  scrolling: boolean;
  selection: boolean;
  redirect: boolean;
}
export interface Row {
  row: HTMLElement;
}
export interface ConvertionQueryData {
  element: HTMLElement;
  query: string;
}
export interface ConfigurationToolBar<T> {
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

export interface Struct<T> {
  listbox: ListBox<HTMLElement>;
  table: Table<HTMLElement, T>;
}

export interface shortcutConfigurationsList {
  clipboard: null | {
    copy: KeyboardShortcut;
    paste: KeyboardShortcut;
    cut: KeyboardShortcut;
  };
  selection: {
    forword: KeyboardShortcut;
    backword: KeyboardShortcut;
  };
  move: {
    forword: KeyboardShortcut;
    backword: KeyboardShortcut;
  };
  inner: null | {
    open: KeyboardShortcut;
    close: KeyboardShortcut;
  };
}

export interface tree<T> {
  body: T;
  innerTree: tree<T>[];
}

export interface MethodTreeLinear<T> {
  after: T;
  before: T;
  append: T;
  insert: tree<T>;
}
/**
 *
 */

export type mainKeys = "Ctrl" | "Shift" | "Alt";
export type listenerKeyboardShortcut = (
  input: propertyShortcut,
  event: KeyboardEvent | null,
  type: "key" | "call"
) => void;
export type Direction = "forword" | "backword";
export type submitListener = (type: submitTypePress) => void;
export type submitTypePress = "call" | "keypress" | "click";
export type SortedBy = "down" | "up";
export type CallBackQuery<T> = (data: T, index: number) => string;
