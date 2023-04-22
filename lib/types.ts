import { KeyboardShortcut as Sh } from './keyboardshortcuts.js';
// the interfaces
export interface propertyShortcut {
  ctrl?: boolean;
  shift?: boolean;
  alt?: boolean;
  keys?: string[];
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
export interface directionShortcutWithFull {
  forword: Sh;
  backword: Sh;
  fullforword: Sh;
  fullbackword: Sh;
}
export interface directionShortcutWithoutFull {
  forword: Sh;
  backword: Sh;
}
export interface shortcutConfigurationsList {
  clipboard: null | {
    copy: Sh;
    paste: Sh;
    cut: Sh;
  };
  selection: directionShortcutWithFull & { all: Sh };
  move: directionShortcutWithFull;
  status: {
    submit: Sh;
    cancel: Sh;
  };
  find: null | directionShortcutWithoutFull;
  inner: null | {
    open: Sh;
    close: Sh;
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
    direction: orderBy;
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
    orderby: orderBy;
    deep: boolean;
  };
}
export interface subtreePropertys<T> {
  property: keyof T;
  value: string;
}
export interface Menu {
  label: string;
  shortcut: string;
  inner: 1 | 0;
}
export interface creationDirection {
  input: [keyof HTMLElementTagNameMap, string, object] | HTMLElement;
  inner: creationDirection[];
  fn: (element: HTMLElement) => Promise<void>;
}
// data types
export interface Os {
  windows: 'ctrl';
  mac: 'cmd';
  luix: 'ctrl';
}
export type modifiersKeys<os extends keyof Os = 'windows'> = Os[os] | 'shift' | 'alt';
export type listenerKeyboardShortcut = (combinition: propertyShortcut, event: KeyboardEvent | null, type: 'key' | 'call') => void;
export type direction = 'forword' | 'backword';
export type submitListener = (type: submitTypePress, element: HTMLElement) => void;
export type submitTypePress = 'call' | 'keypress' | 'click';
export type orderBy = 'ASC' | 'DESC';
export type shortcutActivation = 'down' | 'up' | 'press';
export type callBackQuery<T> = (data: T, index: number) => string;
export type timer<T> = number | ((value: T, index: number) => number);
