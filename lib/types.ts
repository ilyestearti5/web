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
export interface visiblityFunctionResult {
  readonly visible: boolean;
  open(): void;
  close(): void;
  toggle(): void;
}
export interface whenShortcutOn {
  down: boolean;
  up: boolean;
  press: boolean;
}
export interface _ResultMap {
  all: HTMLElement[];
  one: HTMLElement | null;
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
  readonly forword: Sh;
  readonly backword: Sh;
  readonly fullforword: Sh;
  readonly fullbackword: Sh;
}
export interface directionShortcutWithoutFull {
  readonly forword: Sh;
  readonly backword: Sh;
}
export interface shortcutConfigurationsList {
  clipboard: null | {
    readonly copy: Sh;
    readonly paste: Sh;
    readonly cut: Sh;
  };
  selection: directionShortcutWithFull & { readonly all: Sh };
  move: directionShortcutWithFull;
  status: {
    readonly submit: Sh;
    readonly cancel: Sh;
  };
  find: null | directionShortcutWithoutFull;
  inner: null | {
    readonly open: Sh;
    readonly close: Sh;
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
  body: HTMLElement | [keyof HTMLElementTagNameMap, string, object];
  inner: creationDirection[];
  fn: (element: HTMLElement) => Promise<void>;
}
export interface Os {
  windows: 'ctrl';
  mac: 'cmd';
  luix: 'ctrl';
}
export interface pathOfSwitch {
  element: HTMLElement;
  path: string;
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
export type creationFunction<T> = (input: T, create: (value: keyof T) => HTMLSpanElement, rowElement: HTMLElement, contentElement: HTMLElement) => HTMLElement[];
