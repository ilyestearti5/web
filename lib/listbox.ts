import { KeyboardShortcut } from "./keyboard-shortcuts.js";
import {
  Direction,
  submitListener,
  submitTypePress,
  ConfigListBox,
  shortcutConfigurationsList,
} from "./types.js";

import { defaultObject, isLooked, scrollToElement } from "./utils.js";

export class ListBox<T extends HTMLElement> {
  #title: string = "";
  #selection_direction: Direction = "forword";
  #dragging: boolean = false;
  static #all: ListBox<HTMLElement>[] = [];

  #shortcutsConfig: shortcutConfigurationsList;

  protected rowString = "row";

  #configurations: ConfigListBox = {
    movable: true,
    scrolling: true,
    selection: true,
    redirect: true,
  };

  #on_submit_fn: submitListener[] = [];
  #on_change_fn: Function[] = [];

  #pointer_down_function = (e: MouseEvent) => {
    var effective = this.EFFECTIVE_ELEMENTS;

    var mainElement = effective.find((element) =>
      element.contains(e.target as HTMLElement)
    );

    if (!mainElement) return;

    if (e.altKey) this.setSelect(mainElement, !this.getSelect(mainElement));
    else this.select(mainElement);
  };

  #click_function = (e: MouseEvent) => {
    if (e.altKey) return;
    var focusElement = this.ITEMS.find((ele) =>
      ele.contains(e.target as HTMLElement)
    );
    focusElement && this.#submit("click", focusElement);
  };

  #drag_function = (e: DragEvent) => {
    var { x, y, target } = e;
    var element = document.elementFromPoint(x, y);

    if (!element) return;

    var row = element.closest(
      `[role="${this.rowString}"]`
    ) as HTMLElement | null;

    if (!row) return;

    row.after(target as HTMLElement);
  };

  constructor(public root: T, title: string = `${root.ariaLabel}`) {
    if (ListBox.#all.find(({ title: tlt }) => tlt == title))
      throw Error("cannot be used same label in tow difrent listbox.");

    this.#title = title;

    this.root.ariaLabel = title;

    this.setClick(true);

    this.root.setAttribute("role", "listbox");

    this.#shortcutsConfig = {
      selection: {
        forword: KeyboardShortcut.create(
          `${this.#title} - forword selection`,
          `Shift${KeyboardShortcut.separatorShortcuts}ArrowDown`,
          [this.root]
        ).ondown(() => {
          this.forwordSelection(1);
        }),
        backword: KeyboardShortcut.create(
          `${this.#title} - backword selection`,
          `Shift${KeyboardShortcut.separatorShortcuts}ArrowUp`,
          [this.root]
        ).ondown(() => {
          this.backwordSelection(1);
        }),
      },
      move: {
        forword: KeyboardShortcut.create(
          `${this.#title} - forword`,
          `ArrowDown`,
          [this.root]
        ).ondown((combinition, event) => {
          event && event.preventDefault();
          this.forword(1);
        }),
        backword: KeyboardShortcut.create(
          `${this.#title} - backword`,
          `ArrowUp`,
          [this.root]
        ).ondown((combinition, event) => {
          event && event.preventDefault();
          this.backword(1);
        }),
      },
      status: {
        submit: KeyboardShortcut.create(`${this.#title} - submit`, `Enter`, [
          this.root,
        ]).ondown(() => {
          this.#submit("keypress");
        }),
        cancel: KeyboardShortcut.create(`${this.#title} - cancel`, "Escape", [
          this.root,
        ]).ondown(() => this.select()),
      },
      // has value in table & tree constructor
      clipboard: null,
      // has value in tree constructor
      inner: null,
    };
  }

  get dragging() {
    return this.#dragging;
  }
  set dragging(v: boolean) {
    v = Boolean(v);
    this.#dragging = v;

    this.root.ondragend = v ? this.#drag_function : null;

    this.ITEMS.forEach((ele) => (ele.draggable = v));
  }

  get shortcuts() {
    return this.#shortcutsConfig;
  }

  get title() {
    return this.#title;
  }
  get selectionDirection() {
    return this.#selection_direction;
  }
  get ITEMS() {
    return Array.from(this.root.children) as HTMLElement[];
  }
  get EFFECTIVE_ELEMENTS() {
    return this.ITEMS.filter((ele) => this.getEffective(ele));
  }
  get SELECT_ELEMENTS() {
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
  get click() {
    return this.getClick();
  }
  get mouse() {
    return this.getMouse();
  }

  set click(v) {
    this.setClick(v);
  }
  set mouse(v) {
    this.setMouse(v);
  }

  #setConfigurations(config: ConfigListBox) {
    this.#configurations = defaultObject(config, this.#configurations);
  }
  setConfigurations(config: ConfigListBox) {
    this.#setConfigurations(config);
  }

  #getConfigurations(): ConfigListBox {
    return this.#configurations;
  }
  getConfigurations() {
    return this.#getConfigurations();
  }

  #setClick(flag: boolean) {
    this.root.onclick = flag ? this.#click_function : null;
    this.root.onpointerdown = flag ? this.#pointer_down_function : null;
  }
  setClick(flag: boolean = true) {
    this.#setClick(flag);
  }

  #getClick() {
    return !!this.root.onclick;
  }
  getClick() {
    return this.#getClick();
  }

  #setMouse(flag: boolean) {
    this.root.onmouseover = flag ? this.#click_function : null;
  }
  setMouse(flag: boolean) {
    this.#setMouse(flag);
  }

  #getMouse() {
    return Boolean(this.root.onmouseover);
  }
  getMouse() {
    return this.#getMouse();
  }

  addTarget(...elements: HTMLElement[]) {
    this.#shortcutsConfig.move.forword.targets?.push(...elements);
    this.#shortcutsConfig.move.backword.targets?.push(...elements);
    this.#shortcutsConfig.selection.forword.targets?.push(...elements);
    this.#shortcutsConfig.selection.backword.targets?.push(...elements);
    this.#shortcutsConfig.status.cancel.targets?.push(...elements);
    this.#shortcutsConfig.status.submit.targets?.push(...elements);
  }

  getEffective(element: HTMLElement) {
    return this.#getEffective(element);
  }
  #getEffective(element: HTMLElement) {
    return element.ariaDisabled !== "true";
  }

  setEffective(element: HTMLElement, flag: boolean = true) {
    this.#setEffective(element, flag);
  }
  #setEffective(element: HTMLElement, flag: boolean) {
    element.ariaDisabled = `${!flag}`;
    if (!flag) element.ariaSelected = "false";
  }

  getSelect(element: HTMLElement) {
    return this.#getSelect(element);
  }
  #getSelect(element: HTMLElement) {
    return this.getEffective(element) && element.ariaSelected == "true";
  }

  setSelect(element: HTMLElement, flag: boolean = true): boolean {
    return this.#setSelect(element, flag);
  }
  #setSelect(element: HTMLElement, flag: boolean): boolean {
    var b = this.getEffective(element);
    if (!b) {
      return false;
    }
    element.ariaSelected = `${flag}`;
    return true;
  }

  #effective(...elements: HTMLElement[]) {
    this.ITEMS.forEach((ele) => this.setEffective(ele, elements.includes(ele)));
  }
  effective(...elements: HTMLElement[]) {
    this.#effective(...elements);
  }

  select(...elements: HTMLElement[]) {
    this.#select(...elements);
  }
  #select(...elements: HTMLElement[]) {
    this.ITEMS.forEach((ele) => this.setSelect(ele, elements.includes(ele)));
  }

  #forword(count: number) {
    if (!this.#configurations.movable) return;
    var { LAST_ELEMENT_SELECT, MIN_ELEMENT_EFFECTIVE } = this;
    var ele = LAST_ELEMENT_SELECT;
    if (!ele) {
      ele = MIN_ELEMENT_EFFECTIVE;
      count--;
    }
    while (ele && count) {
      ele = ele.nextElementSibling
        ? (ele.nextElementSibling as HTMLElement)
        : this.#configurations.redirect
        ? MIN_ELEMENT_EFFECTIVE
        : null;
      ele && this.getEffective(ele) && count--;
    }
    if (ele) {
      this.select(ele);
      if (this.#configurations.scrolling && !isLooked(ele))
        scrollToElement(ele, -1);
    }
  }
  forword(count: number = 1) {
    this.#forword(count);
  }

  #backword(count: number) {
    if (!this.#configurations.movable) return;
    var { FIRST_ELEMENT_SELECT, MAX_ELEMENT_EFFCTIVE } = this;
    var ele = FIRST_ELEMENT_SELECT;
    if (!ele) {
      ele = MAX_ELEMENT_EFFCTIVE;
      count--;
    }
    while (ele && count) {
      ele = ele.previousElementSibling
        ? (ele.previousElementSibling as HTMLElement)
        : this.#configurations.redirect
        ? MAX_ELEMENT_EFFCTIVE
        : null;
      ele && this.getEffective(ele) && count--;
    }
    if (ele) {
      this.select(ele);
      if (this.#configurations.scrolling && !isLooked(ele))
        scrollToElement(ele, 0);
    }
  }
  backword(count: number = 1) {
    this.#backword(count);
  }

  go(dir: Direction = "forword", count: number = 1) {
    this[dir](count);
  }

  #forwordSelection(count: number) {
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
        !this.#getEffective(nextElementSibling as HTMLElement)
      )
        nextElementSibling = nextElementSibling.nextElementSibling;

      nextElementSibling &&
        this.#setSelect(nextElementSibling as HTMLElement, true);
    } else this.#setSelect(element, false);

    this.#forwordSelection(count - 1);
  }
  forwordSelection(count: number = 1) {
    this.#forwordSelection(count);
  }

  #backwordSelection(count: number) {
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
        !this.#getEffective(previousElementSibling as HTMLElement)
      )
        previousElementSibling = previousElementSibling.previousElementSibling;

      previousElementSibling &&
        this.#setSelect(previousElementSibling as HTMLElement, true);
    } else this.#setSelect(element, false);

    this.#backwordSelection(count - 1);
  }
  backwordSelection(count: number = 1) {
    this.#backwordSelection(count);
  }

  selection(dir: Direction = "forword", count: number = 1) {
    dir == "forword"
      ? this.forwordSelection(count)
      : this.backwordSelection(count);
  }
  // evenets
  // ----------------------------------------------------------------------
  #onsubmit(listener: submitListener) {
    typeof listener == "function" && this.#on_submit_fn.push(listener);
    return this;
  }
  onsubmit(listener: submitListener) {
    return this.#onsubmit(listener);
  }

  #offsubmit(listener: submitListener) {
    var index = this.#on_submit_fn.indexOf(listener);
    if (index < 0) return false;
    this.#on_submit_fn.splice(index, 1);
    return true;
  }
  offsubmit(listener: submitListener) {
    return this.#offsubmit(listener);
  }

  #onchange(listener: Function) {
    typeof listener == "function" && this.#on_change_fn.push(listener);
    return this;
  }
  onchange(listener: Function) {
    return this.#onchange(listener);
  }

  offchange(listener: Function) {
    return this.#offchange(listener);
  }
  #offchange(listener: Function) {
    var index = this.#on_change_fn.indexOf(listener);
    if (index < 0) return false;
    this.#on_change_fn.splice(index, 1);
    return true;
  }
  // ----------------------------------------------------------------------

  #submit(type: submitTypePress = "click", element = this.ELEMENT_DIRECTION) {
    if (this.SELECT_ELEMENTS.length)
      this.#on_submit_fn.forEach((fn) => fn(type, element!));
  }
  submit() {
    this.#submit("call");
  }

  scroll(dir: Direction) {
    this.#scroll(dir == "forword");
  }
  #scroll(flag: boolean) {
    var { ELEMENT_DIRECTION: element } = this;
    if (element && this.#configurations.scrolling && !isLooked(element))
      scrollToElement(element, flag ? -1 : 0);
  }

  static get all() {
    return this.#all;
  }
}
